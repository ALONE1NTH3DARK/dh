<?php
declare(strict_types=1);

require_once __DIR__ . '/analytics.php';

const ADMIN_MAX_ATTEMPTS = 8;
const ADMIN_ATTEMPT_WINDOW = 900;

function admin_session_start(): void
{
  if (session_status() === PHP_SESSION_ACTIVE) {
    return;
  }

  $https = ($_SERVER['HTTPS'] ?? '') !== ''
    || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

  session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => $https,
  ]);
  session_name('dh_admin');
  session_start();
}

function admin_is_logged_in(): bool
{
  admin_session_start();

  return ($_SESSION['admin'] ?? false) === true;
}

function admin_require_login(): void
{
  if (!admin_is_logged_in()) {
    analytics_json(['ok' => false, 'error' => 'unauthorized'], 401);
  }
}

function admin_password(): string
{
  return trim((string)(analytics_config()['admin_password'] ?? ''));
}

function admin_is_configured(): bool
{
  $password = admin_password();

  return $password !== '' && !str_contains($password, 'YOUR_');
}

function admin_attempts_table(PDO $db): void
{
  $db->exec(
    'CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor TEXT NOT NULL,
      ts INTEGER NOT NULL
    )'
  );
}

function admin_is_throttled(PDO $db, string $visitor): bool
{
  admin_attempts_table($db);

  $stmt = $db->prepare(
    'SELECT COUNT(*) FROM login_attempts WHERE visitor = :visitor AND ts > :since'
  );
  $stmt->execute([':visitor' => $visitor, ':since' => time() - ADMIN_ATTEMPT_WINDOW]);

  return (int)$stmt->fetchColumn() >= ADMIN_MAX_ATTEMPTS;
}

function admin_record_failure(PDO $db, string $visitor): void
{
  admin_attempts_table($db);

  $db->prepare('INSERT INTO login_attempts (visitor, ts) VALUES (:visitor, :ts)')
    ->execute([':visitor' => $visitor, ':ts' => time()]);
  $db->prepare('DELETE FROM login_attempts WHERE ts < :since')
    ->execute([':since' => time() - ADMIN_ATTEMPT_WINDOW * 4]);
}

function admin_clear_failures(PDO $db, string $visitor): void
{
  admin_attempts_table($db);

  $db->prepare('DELETE FROM login_attempts WHERE visitor = :visitor')
    ->execute([':visitor' => $visitor]);
}

function admin_log_in(): void
{
  admin_session_start();
  session_regenerate_id(true);
  $_SESSION['admin'] = true;
}

function admin_log_out(): void
{
  admin_session_start();
  $_SESSION = [];
  session_destroy();
}
