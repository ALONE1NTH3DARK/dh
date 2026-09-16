<?php
declare(strict_types=1);

if (!defined('DH_API')) {
  http_response_code(403);
  exit;
}

/**
 * Copy this file to telegram-config.php and fill in your secrets.
 * telegram-config.php is gitignored and must exist on the server.
 */
return [
  'token' => 'YOUR_TELEGRAM_BOT_TOKEN',
  'chat_id' => 'YOUR_TELEGRAM_CHAT_ID',
  'turnstile_secret' => 'YOUR_TURNSTILE_SECRET_KEY',
];
