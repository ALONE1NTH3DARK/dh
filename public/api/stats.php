<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/admin-auth.php';
require_once __DIR__ . '/lib/reports.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  analytics_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

admin_require_login();

$days = (int)($_GET['days'] ?? 7);
if (!in_array($days, [1, 7, 30], true)) {
  $days = 7;
}

try {
  analytics_json(reports_build(analytics_db(), $days));
} catch (Throwable) {
  analytics_json(['ok' => false, 'error' => 'stats_failed'], 500);
}
