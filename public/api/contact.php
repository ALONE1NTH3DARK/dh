<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$configPath = __DIR__ . '/telegram-config.php';
if (!is_file($configPath)) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Server is not configured']);
  exit;
}

$config = require $configPath;
$token = trim((string)($config['token'] ?? ''));
$chatId = trim((string)($config['chat_id'] ?? ''));
$turnstileSecret = trim((string)($config['turnstile_secret'] ?? ''));

if ($token === '' || $chatId === '' || str_contains($token, 'YOUR_')) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Server is not configured']);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
  exit;
}

$name = trim((string)($data['name'] ?? ''));
$contact = trim((string)($data['contact'] ?? ''));
$project = trim((string)($data['project'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$turnstileToken = trim((string)($data['turnstileToken'] ?? $data['cf-turnstile-response'] ?? ''));

if ($name === '' || $contact === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Name and contact are required']);
  exit;
}

if ($turnstileSecret === '' || str_contains($turnstileSecret, 'YOUR_')) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Server is not configured']);
  exit;
}

if ($turnstileToken === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Turnstile token missing']);
  exit;
}

$verifyPayload = http_build_query([
  'secret' => $turnstileSecret,
  'response' => $turnstileToken,
  'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);

$verifyCh = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
curl_setopt_array($verifyCh, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
  CURLOPT_POSTFIELDS => $verifyPayload,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 15,
]);

$verifyResponse = curl_exec($verifyCh);
$verifyStatus = (int)curl_getinfo($verifyCh, CURLINFO_HTTP_CODE);
curl_close($verifyCh);

$verifyData = is_string($verifyResponse) ? json_decode($verifyResponse, true) : null;
if (
  $verifyResponse === false
  || $verifyStatus < 200
  || $verifyStatus >= 300
  || !is_array($verifyData)
  || empty($verifyData['success'])
) {
  http_response_code(403);
  echo json_encode(['ok' => false, 'error' => 'Turnstile verification failed']);
  exit;
}

$text = implode("\n", [
  '🆕 Новая заявка с сайта',
  'Имя: ' . $name,
  'Телефон / Telegram: ' . $contact,
  'Ответить: ' . ($project !== '' ? $project : '—'),
  'О задаче: ' . ($message !== '' ? $message : '—'),
]);

$payload = json_encode([
  'chat_id' => $chatId,
  'text' => $text,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.telegram.org/bot' . $token . '/sendMessage');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
  CURLOPT_POSTFIELDS => $payload,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 15,
]);

$response = curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $status < 200 || $status >= 300) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Failed to deliver message']);
  exit;
}

$tg = json_decode($response, true);
if (!is_array($tg) || empty($tg['ok'])) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'Failed to deliver message']);
  exit;
}

echo json_encode(['ok' => true]);
