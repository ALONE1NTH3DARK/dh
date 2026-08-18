<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/admin-auth.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($method === 'GET') {
  analytics_json([
    'ok' => true,
    'authenticated' => admin_is_logged_in(),
    'configured' => admin_is_configured(),
  ]);
}

if ($method !== 'POST') {
  analytics_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$body = json_decode((string)file_get_contents('php://input'), true);
$action = is_array($body) ? (string)($body['action'] ?? 'login') : 'login';

if ($action === 'logout') {
  admin_log_out();
  analytics_json(['ok' => true, 'authenticated' => false]);
}

if (!admin_is_configured()) {
  analytics_json(['ok' => false, 'error' => 'not_configured'], 500);
}

try {
  $db = analytics_db();
} catch (Throwable) {
  analytics_json(['ok' => false, 'error' => 'storage_failed'], 500);
}

$visitor = analytics_visitor_id();

if (admin_is_throttled($db, $visitor)) {
  analytics_json(['ok' => false, 'error' => 'too_many_attempts'], 429);
}

$password = is_array($body) ? (string)($body['password'] ?? '') : '';

if ($password === '' || !hash_equals(admin_password(), $password)) {
  admin_record_failure($db, $visitor);
  // Небольшая задержка против перебора
  usleep(400000);
  analytics_json(['ok' => false, 'error' => 'invalid_password'], 401);
}

admin_clear_failures($db, $visitor);
admin_log_in();

analytics_json(['ok' => true, 'authenticated' => true]);
