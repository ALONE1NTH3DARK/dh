<?php
declare(strict_types=1);

require_once __DIR__ . '/analytics.php';

/**
 * Отчёты для админки. Диапазон — 1, 7 или 30 дней, считая сегодняшний день.
 */

function reports_range(int $days): array
{
  $days = max(1, min(90, $days));
  $tz = analytics_timezone();

  $to = new DateTimeImmutable('now', $tz);
  $from = $to->modify('-' . ($days - 1) . ' days');

  return [
    'days' => $days,
    'from' => $from->format('Y-m-d'),
    'to' => $to->format('Y-m-d'),
  ];
}

function reports_rows(PDO $db, string $sql, array $range): array
{
  $stmt = $db->prepare($sql);
  $stmt->execute([':from' => $range['from'], ':to' => $range['to']]);

  return $stmt->fetchAll() ?: [];
}

function reports_totals(PDO $db, array $range): array
{
  $base = reports_rows(
    $db,
    "SELECT
       COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS pageviews,
       COUNT(DISTINCT visitor) AS visitors,
       COUNT(DISTINCT session) AS sessions,
       COUNT(CASE WHEN type = 'form' AND label = 'submit' THEN 1 END) AS leads,
       COUNT(CASE WHEN type = 'click' THEN 1 END) AS clicks
     FROM events
     WHERE day BETWEEN :from AND :to",
    $range
  )[0] ?? [];

  $time = reports_rows(
    $db,
    "SELECT
       COALESCE(SUM(value), 0) AS total_seconds,
       COUNT(DISTINCT session) AS timed_sessions
     FROM events
     WHERE type = 'duration' AND day BETWEEN :from AND :to",
    $range
  )[0] ?? [];

  // Отказы: сессии, в которых был ровно один просмотр страницы
  $bounce = reports_rows(
    $db,
    "SELECT
       COUNT(*) AS sessions,
       COUNT(CASE WHEN views = 1 THEN 1 END) AS single_view
     FROM (
       SELECT session, COUNT(*) AS views
       FROM events
       WHERE type = 'pageview' AND day BETWEEN :from AND :to
       GROUP BY session
     )",
    $range
  )[0] ?? [];

  $sessions = (int)($base['sessions'] ?? 0);
  $timedSessions = (int)($time['timed_sessions'] ?? 0);
  $bounceSessions = (int)($bounce['sessions'] ?? 0);
  $leads = (int)($base['leads'] ?? 0);

  return [
    'pageviews' => (int)($base['pageviews'] ?? 0),
    'visitors' => (int)($base['visitors'] ?? 0),
    'sessions' => $sessions,
    'clicks' => (int)($base['clicks'] ?? 0),
    'leads' => $leads,
    'avgSessionSeconds' => $timedSessions > 0
      ? (int)round((int)($time['total_seconds'] ?? 0) / $timedSessions)
      : 0,
    'bounceRate' => $bounceSessions > 0
      ? round(((int)($bounce['single_view'] ?? 0) / $bounceSessions) * 100, 1)
      : 0.0,
    'conversionRate' => $sessions > 0 ? round(($leads / $sessions) * 100, 1) : 0.0,
  ];
}

function reports_pages(PDO $db, array $range): array
{
  $views = reports_rows(
    $db,
    "SELECT path, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
     FROM events
     WHERE type = 'pageview' AND day BETWEEN :from AND :to
     GROUP BY path
     ORDER BY views DESC
     LIMIT 40",
    $range
  );

  // Время приходит отрезками, поэтому складываем их и делим на число сессий
  $durations = [];
  foreach (
    reports_rows(
      $db,
      "SELECT path, SUM(value) AS total, COUNT(DISTINCT session) AS sessions
       FROM events
       WHERE type = 'duration' AND day BETWEEN :from AND :to
       GROUP BY path",
      $range
    ) as $row
  ) {
    $sessions = (int)$row['sessions'];
    $durations[(string)$row['path']] = $sessions > 0
      ? (int)round((int)$row['total'] / $sessions)
      : 0;
  }

  // Глубина скролла: сначала максимум за сессию, затем среднее по сессиям
  $scrolls = [];
  foreach (
    reports_rows(
      $db,
      "SELECT path, AVG(best) AS avg_scroll FROM (
         SELECT path, session, MAX(value) AS best
         FROM events
         WHERE type = 'scroll' AND day BETWEEN :from AND :to
         GROUP BY path, session
       ) GROUP BY path",
      $range
    ) as $row
  ) {
    $scrolls[(string)$row['path']] = (int)round((float)$row['avg_scroll']);
  }

  return array_map(static function (array $row) use ($durations, $scrolls): array {
    $path = (string)$row['path'];

    return [
      'path' => $path,
      'views' => (int)$row['views'],
      'visitors' => (int)$row['visitors'],
      'avgSeconds' => $durations[$path] ?? 0,
      'avgScroll' => $scrolls[$path] ?? 0,
    ];
  }, $views);
}

function reports_clicks(PDO $db, array $range): array
{
  $rows = reports_rows(
    $db,
    "SELECT
       label,
       path,
       COUNT(*) AS clicks,
       COUNT(DISTINCT visitor) AS visitors
     FROM events
     WHERE type = 'click' AND label IS NOT NULL AND label != '' AND day BETWEEN :from AND :to
     GROUP BY label, path
     ORDER BY clicks DESC
     LIMIT 40",
    $range
  );

  return array_map(static fn(array $row): array => [
    'label' => (string)$row['label'],
    'path' => (string)$row['path'],
    'clicks' => (int)$row['clicks'],
    'visitors' => (int)$row['visitors'],
  ], $rows);
}

function reports_breakdown(PDO $db, array $range, string $column): array
{
  if (!in_array($column, ['source', 'device', 'country'], true)) {
    return [];
  }

  $rows = reports_rows(
    $db,
    "SELECT
       COALESCE(NULLIF($column, ''), '—') AS name,
       COUNT(*) AS views,
       COUNT(DISTINCT visitor) AS visitors
     FROM events
     WHERE type = 'pageview' AND day BETWEEN :from AND :to
     GROUP BY name
     ORDER BY views DESC
     LIMIT 20",
    $range
  );

  return array_map(static fn(array $row): array => [
    'name' => (string)$row['name'],
    'views' => (int)$row['views'],
    'visitors' => (int)$row['visitors'],
  ], $rows);
}

/**
 * За сутки — по часам, за 7/30 дней — по дням. Пустые интервалы заполняются нулями,
 * чтобы график не рвался.
 */
function reports_timeline(PDO $db, array $range): array
{
  $hourly = $range['days'] === 1;

  $rows = reports_rows(
    $db,
    $hourly
      ? "SELECT hour AS bucket,
                COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS views,
                COUNT(DISTINCT visitor) AS visitors
         FROM events
         WHERE day BETWEEN :from AND :to
         GROUP BY hour"
      : "SELECT day AS bucket,
                COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS views,
                COUNT(DISTINCT visitor) AS visitors
         FROM events
         WHERE day BETWEEN :from AND :to
         GROUP BY day",
    $range
  );

  $byBucket = [];
  foreach ($rows as $row) {
    $byBucket[(string)$row['bucket']] = [
      'views' => (int)$row['views'],
      'visitors' => (int)$row['visitors'],
    ];
  }

  $timeline = [];

  if ($hourly) {
    for ($hour = 0; $hour < 24; $hour++) {
      $key = str_pad((string)$hour, 2, '0', STR_PAD_LEFT);
      $timeline[] = [
        'bucket' => $key,
        'label' => $key . ':00',
        'views' => $byBucket[$key]['views'] ?? 0,
        'visitors' => $byBucket[$key]['visitors'] ?? 0,
      ];
    }

    return $timeline;
  }

  $tz = analytics_timezone();
  $cursor = new DateTimeImmutable($range['from'], $tz);
  $end = new DateTimeImmutable($range['to'], $tz);

  while ($cursor <= $end) {
    $key = $cursor->format('Y-m-d');
    $timeline[] = [
      'bucket' => $key,
      'label' => $cursor->format('d.m'),
      'views' => $byBucket[$key]['views'] ?? 0,
      'visitors' => $byBucket[$key]['visitors'] ?? 0,
    ];
    $cursor = $cursor->modify('+1 day');
  }

  return $timeline;
}

function reports_build(PDO $db, int $days): array
{
  $range = reports_range($days);

  return [
    'ok' => true,
    'range' => $range,
    'totals' => reports_totals($db, $range),
    'timeline' => reports_timeline($db, $range),
    'pages' => reports_pages($db, $range),
    'clicks' => reports_clicks($db, $range),
    'sources' => reports_breakdown($db, $range, 'source'),
    'devices' => reports_breakdown($db, $range, 'device'),
    'countries' => reports_breakdown($db, $range, 'country'),
  ];
}
