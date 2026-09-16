<?php
declare(strict_types=1);

if (!defined('DH_API')) {
  http_response_code(403);
  exit;
}

/**
 * Ядро аналитики: конфиг, SQLite-хранилище и разбор запроса посетителя.
 * Используется track.php (запись событий) и stats.php (отчёты для админки).
 */

const ANALYTICS_EVENT_TYPES = ['pageview', 'click', 'duration', 'scroll', 'form'];
const ANALYTICS_MAX_EVENTS_PER_REQUEST = 40;
const ANALYTICS_MAX_BODY_BYTES = 64 * 1024;

function analytics_config(): array
{
  static $config = null;
  if ($config !== null) {
    return $config;
  }

  $path = __DIR__ . '/../admin-config.php';
  $loaded = is_file($path) ? require $path : [];
  $config = is_array($loaded) ? $loaded : [];

  return $config;
}

function analytics_timezone(): DateTimeZone
{
  $tz = trim((string)(analytics_config()['timezone'] ?? ''));
  if ($tz === '') {
    $tz = 'Asia/Almaty';
  }

  try {
    return new DateTimeZone($tz);
  } catch (Exception) {
    return new DateTimeZone('UTC');
  }
}

function analytics_db_path(): string
{
  $custom = trim((string)(analytics_config()['db_path'] ?? ''));
  if ($custom === '') {
    return __DIR__ . '/../data/analytics.sqlite';
  }

  // Относительный путь считаем от каталога api/, чтобы базу можно было
  // вынести за пределы webroot: 'db_path' => '../../analytics-data/db.sqlite'
  return str_starts_with($custom, '/') ? $custom : __DIR__ . '/../' . $custom;
}

function analytics_db(): PDO
{
  static $db = null;
  if ($db instanceof PDO) {
    return $db;
  }

  $path = analytics_db_path();
  $dir = dirname($path);
  if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
    throw new RuntimeException('Cannot create analytics directory');
  }

  $db = new PDO('sqlite:' . $path, null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  $db->exec('PRAGMA journal_mode = WAL');
  $db->exec('PRAGMA synchronous = NORMAL');
  $db->exec('PRAGMA busy_timeout = 4000');

  analytics_migrate($db);

  return $db;
}

function analytics_migrate(PDO $db): void
{
  $db->exec(
    'CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      day TEXT NOT NULL,
      hour TEXT NOT NULL,
      type TEXT NOT NULL,
      visitor TEXT NOT NULL,
      session TEXT NOT NULL,
      path TEXT NOT NULL,
      label TEXT,
      value INTEGER,
      source TEXT,
      referrer TEXT,
      device TEXT,
      country TEXT
    )'
  );
  $db->exec('CREATE INDEX IF NOT EXISTS idx_events_day ON events(day)');
  $db->exec('CREATE INDEX IF NOT EXISTS idx_events_type_day ON events(type, day)');
  $db->exec(
    'CREATE TABLE IF NOT EXISTS geo_cache (
      visitor TEXT PRIMARY KEY,
      country TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )'
  );
}

function analytics_client_ip(): string
{
  foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR'] as $header) {
    $value = trim((string)($_SERVER[$header] ?? ''));
    if ($value === '') {
      continue;
    }
    $first = trim(explode(',', $value)[0]);
    if (filter_var($first, FILTER_VALIDATE_IP)) {
      return $first;
    }
  }

  return (string)($_SERVER['REMOTE_ADDR'] ?? '');
}

/** IP для lockout логина: только CF или прямой REMOTE_ADDR, без клиентского XFF. */
function analytics_auth_ip(): string
{
  $cf = trim((string)($_SERVER['HTTP_CF_CONNECTING_IP'] ?? ''));
  if ($cf !== '' && filter_var($cf, FILTER_VALIDATE_IP)) {
    return $cf;
  }

  return (string)($_SERVER['REMOTE_ADDR'] ?? '');
}

/**
 * Идентификатор посетителя: соль из конфига + IP + User-Agent.
 * IP в базу не пишется, восстановить его из хэша нельзя.
 */
function analytics_visitor_id(): string
{
  $salt = trim((string)(analytics_config()['hash_salt'] ?? ''));
  if ($salt === '') {
    $salt = 'darkhorse-analytics';
  }

  $ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');

  return substr(hash('sha256', $salt . '|' . analytics_client_ip() . '|' . $ua), 0, 16);
}

/** Мягкий лимит запросов на посетителя (трекинг). */
function analytics_burst_ok(string $visitor, int $max = 60, int $window = 60): bool
{
  $dir = dirname(analytics_db_path());
  if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
    return true;
  }

  $file = $dir . '/track-rate.json';
  $now = time();
  $data = [];
  if (is_file($file)) {
    $decoded = json_decode((string)file_get_contents($file), true);
    if (is_array($decoded)) {
      $data = $decoded;
    }
  }

  $times = [];
  foreach ($data[$visitor] ?? [] as $stamp) {
    if (is_int($stamp) && $stamp > $now - $window) {
      $times[] = $stamp;
    }
  }

  if (count($times) >= $max) {
    return false;
  }

  $times[] = $now;
  $data[$visitor] = $times;

  foreach ($data as $id => $stamps) {
    if (!is_array($stamps)) {
      unset($data[$id]);
      continue;
    }
    $fresh = [];
    foreach ($stamps as $stamp) {
      if (is_int($stamp) && $stamp > $now - $window) {
        $fresh[] = $stamp;
      }
    }
    if ($fresh === []) {
      unset($data[$id]);
    } else {
      $data[$id] = $fresh;
    }
  }

  @file_put_contents($file, json_encode($data), LOCK_EX);

  return true;
}

function analytics_is_bot(): bool
{
  $ua = strtolower((string)($_SERVER['HTTP_USER_AGENT'] ?? ''));
  if ($ua === '') {
    return true;
  }

  $markers = [
    'bot', 'crawl', 'spider', 'slurp', 'headless', 'phantom', 'lighthouse',
    'pagespeed', 'preview', 'monitor', 'curl', 'wget', 'python-requests',
    'facebookexternalhit', 'embedly', 'vkshare', 'telegrambot', 'whatsapp',
  ];

  foreach ($markers as $marker) {
    if (str_contains($ua, $marker)) {
      return true;
    }
  }

  return false;
}

function analytics_device(): string
{
  $ua = strtolower((string)($_SERVER['HTTP_USER_AGENT'] ?? ''));

  if (str_contains($ua, 'ipad') || str_contains($ua, 'tablet') || str_contains($ua, 'kindle')) {
    return 'tablet';
  }
  if (str_contains($ua, 'mobi') || str_contains($ua, 'iphone') || str_contains($ua, 'android')) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Источник трафика: сначала utm_source, иначе домен реферера.
 */
function analytics_source(string $referrer, string $utmSource): string
{
  $utm = strtolower(trim($utmSource));
  if ($utm !== '') {
    return substr(preg_replace('/[^a-z0-9._\- ]/', '', $utm) ?? '', 0, 40) ?: 'direct';
  }

  $referrer = trim($referrer);
  if ($referrer === '') {
    return 'direct';
  }

  $host = strtolower((string)(parse_url($referrer, PHP_URL_HOST) ?? ''));
  if ($host === '') {
    return 'direct';
  }

  $selfHost = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
  if ($host === $selfHost || $host === 'www.' . $selfHost) {
    return 'direct';
  }

  $known = [
    'google' => 'google',
    'yandex' => 'yandex',
    'bing' => 'bing',
    'duckduckgo' => 'duckduckgo',
    'instagram' => 'instagram',
    't.me' => 'telegram',
    'telegram' => 'telegram',
    'wa.me' => 'whatsapp',
    'whatsapp' => 'whatsapp',
    'facebook' => 'facebook',
    'youtube' => 'youtube',
    'tiktok' => 'tiktok',
    'vk.com' => 'vk',
    'linkedin' => 'linkedin',
    'mail.ru' => 'mail.ru',
    'pinterest' => 'pinterest',
    'threads' => 'threads',
    'x.com' => 'x',
    'twitter' => 'x',
  ];

  foreach ($known as $needle => $label) {
    if (str_contains($host, $needle)) {
      return $label;
    }
  }

  return preg_replace('/^www\./', '', $host) ?: 'direct';
}

/**
 * Страна: заголовок хостинга/Cloudflare, иначе один разовый запрос на ipwho.is
 * с кэшем по хэшу посетителя.
 */
function analytics_country(PDO $db, string $visitor): string
{
  foreach (['HTTP_CF_IPCOUNTRY', 'GEOIP_COUNTRY_CODE', 'HTTP_X_COUNTRY_CODE'] as $header) {
    $value = strtoupper(trim((string)($_SERVER[$header] ?? '')));
    if (preg_match('/^[A-Z]{2}$/', $value) && $value !== 'XX') {
      return $value;
    }
  }

  if ((analytics_config()['geo_lookup'] ?? true) !== true) {
    return '';
  }

  $cached = $db->prepare('SELECT country, updated_at FROM geo_cache WHERE visitor = :visitor');
  $cached->execute([':visitor' => $visitor]);
  $hit = $cached->fetch();

  if (is_array($hit)) {
    $known = (string)($hit['country'] ?? '');
    // Удачный ответ кэшируем навсегда, неудачный — переспрашиваем через час
    if ($known !== '' || (int)($hit['updated_at'] ?? 0) > time() - 3600) {
      return $known;
    }
  }

  $country = '';
  $ip = analytics_client_ip();

  if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
    $ch = curl_init('https://ipwho.is/' . urlencode($ip) . '?fields=success,country_code');
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 2,
      CURLOPT_CONNECTTIMEOUT => 2,
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    $data = is_string($response) ? json_decode($response, true) : null;
    if (is_array($data) && !empty($data['success'])) {
      $code = strtoupper(trim((string)($data['country_code'] ?? '')));
      if (preg_match('/^[A-Z]{2}$/', $code)) {
        $country = $code;
      }
    }
  }

  $save = $db->prepare(
    'INSERT INTO geo_cache (visitor, country, updated_at) VALUES (:visitor, :country, :now)
     ON CONFLICT(visitor) DO UPDATE SET country = excluded.country, updated_at = excluded.updated_at'
  );
  $save->execute([':visitor' => $visitor, ':country' => $country, ':now' => time()]);

  return $country;
}

function analytics_cut(string $text, int $limit): string
{
  return function_exists('mb_substr')
    ? mb_substr($text, 0, $limit)
    : substr($text, 0, $limit);
}

function analytics_normalize_path(string $path): string
{
  $path = trim($path);
  if ($path === '') {
    return '/';
  }

  // Отрезаем query и hash, оставляем только маршрут
  $path = (string)(parse_url($path, PHP_URL_PATH) ?? '/');
  if ($path === '' || $path[0] !== '/') {
    $path = '/' . $path;
  }
  if (strlen($path) > 1) {
    $path = rtrim($path, '/');
  }

  return substr($path === '' ? '/' : $path, 0, 180);
}

function analytics_json(array $payload, int $status = 200): void
{
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}
