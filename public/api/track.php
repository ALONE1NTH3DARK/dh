<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/analytics.php';

header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  analytics_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

// Боты и превью-краулеры в статистику не попадают
if (analytics_is_bot()) {
  http_response_code(204);
  exit;
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || $raw === '' || strlen($raw) > ANALYTICS_MAX_BODY_BYTES) {
  http_response_code(204);
  exit;
}

$body = json_decode($raw, true);
if (!is_array($body) || !is_array($body['events'] ?? null)) {
  http_response_code(204);
  exit;
}

$sanitizeText = static function (mixed $value, int $limit): string {
  $text = is_string($value) ? $value : '';
  $text = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $text) ?? '';

  return analytics_cut(trim($text), $limit);
};

try {
  $db = analytics_db();

  // Предохранитель от разрастания базы при спаме запросами
  $maxMb = (int)(analytics_config()['max_db_mb'] ?? 256);
  $dbPath = analytics_db_path();
  if ($maxMb > 0 && is_file($dbPath) && filesize($dbPath) > $maxMb * 1024 * 1024) {
    http_response_code(204);
    exit;
  }

  $visitor = analytics_visitor_id();
  $session = $sanitizeText($body['session'] ?? '', 40);
  if ($session === '') {
    $session = $visitor;
  }

  $referrer = $sanitizeText($body['referrer'] ?? '', 300);
  $source = analytics_source($referrer, $sanitizeText($body['utmSource'] ?? '', 40));
  $device = analytics_device();
  $country = analytics_country($db, $visitor);

  $now = time();
  $local = (new DateTimeImmutable('@' . $now))->setTimezone(analytics_timezone());
  $day = $local->format('Y-m-d');
  $hour = $local->format('H');

  $insert = $db->prepare(
    'INSERT INTO events
      (ts, day, hour, type, visitor, session, path, label, value, source, referrer, device, country)
     VALUES
      (:ts, :day, :hour, :type, :visitor, :session, :path, :label, :value, :source, :referrer, :device, :country)'
  );

  $events = array_slice($body['events'], 0, ANALYTICS_MAX_EVENTS_PER_REQUEST);
  $db->beginTransaction();

  foreach ($events as $event) {
    if (!is_array($event)) {
      continue;
    }

    $type = $sanitizeText($event['type'] ?? '', 20);
    if (!in_array($type, ANALYTICS_EVENT_TYPES, true)) {
      continue;
    }

    $path = analytics_normalize_path((string)($event['path'] ?? '/'));
    if (str_starts_with($path, '/admin')) {
      continue;
    }

    $value = null;
    if (isset($event['value']) && is_numeric($event['value'])) {
      $value = (int)round((float)$event['value']);
      $value = match ($type) {
        'duration' => max(0, min(3600, $value)),
        'scroll' => max(0, min(100, $value)),
        default => max(0, min(1000000, $value)),
      };
    }

    if (($type === 'duration' || $type === 'scroll') && ($value === null || $value <= 0)) {
      continue;
    }

    $insert->execute([
      ':ts' => $now,
      ':day' => $day,
      ':hour' => $hour,
      ':type' => $type,
      ':visitor' => $visitor,
      ':session' => $session,
      ':path' => $path,
      ':label' => $sanitizeText($event['label'] ?? '', 80) ?: null,
      ':value' => $value,
      ':source' => $source,
      ':referrer' => $referrer ?: null,
      ':device' => $device,
      ':country' => $country ?: null,
    ]);
  }

  $db->commit();
} catch (Throwable) {
  // Аналитика не должна ломать сайт — молча выходим
  if (isset($db) && $db instanceof PDO && $db->inTransaction()) {
    $db->rollBack();
  }
  http_response_code(204);
  exit;
}

http_response_code(204);
