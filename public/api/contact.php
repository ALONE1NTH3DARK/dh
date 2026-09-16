<?php
declare(strict_types=1);

if (!defined('DH_API')) {
  define('DH_API', true);
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const CONTACT_MAX_BODY = 16384;
const CONTACT_MAX_NAME = 100;
const CONTACT_MAX_CONTACT = 100;
const CONTACT_MAX_PROJECT = 80;
const CONTACT_MAX_MESSAGE = 2000;
const CONTACT_RATE_MAX = 5;
const CONTACT_RATE_WINDOW = 3600;
const CONTACT_TURNSTILE_HOSTS = ['darkhorse.kz', 'www.darkhorse.kz', 'localhost', '127.0.0.1'];

function contact_json(array $data, int $status = 200): never
{
  http_response_code($status);
  echo json_encode($data);
  exit;
}

function contact_len(string $value): int
{
  return function_exists('mb_strlen') ? (int)mb_strlen($value, 'UTF-8') : strlen($value);
}

function contact_client_ip(): string
{
  $cf = trim((string)($_SERVER['HTTP_CF_CONNECTING_IP'] ?? ''));
  if ($cf !== '' && filter_var($cf, FILTER_VALIDATE_IP)) {
    return $cf;
  }

  return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function contact_rate_allow(string $ip): bool
{
  $dir = __DIR__ . '/data';
  if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
    return true;
  }

  $file = $dir . '/contact-rate.json';
  $now = time();
  $data = [];
  if (is_file($file)) {
    $decoded = json_decode((string)file_get_contents($file), true);
    if (is_array($decoded)) {
      $data = $decoded;
    }
  }

  $key = hash('sha256', $ip);
  $times = [];
  foreach ($data[$key] ?? [] as $stamp) {
    if (is_int($stamp) && $stamp > $now - CONTACT_RATE_WINDOW) {
      $times[] = $stamp;
    }
  }

  if (count($times) >= CONTACT_RATE_MAX) {
    return false;
  }

  $times[] = $now;
  $data[$key] = $times;

  foreach ($data as $visitor => $stamps) {
    if (!is_array($stamps)) {
      unset($data[$visitor]);
      continue;
    }
    $fresh = [];
    foreach ($stamps as $stamp) {
      if (is_int($stamp) && $stamp > $now - CONTACT_RATE_WINDOW) {
        $fresh[] = $stamp;
      }
    }
    if ($fresh === []) {
      unset($data[$visitor]);
    } else {
      $data[$visitor] = $fresh;
    }
  }

  @file_put_contents($file, json_encode($data), LOCK_EX);

  return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  contact_json(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$configPath = __DIR__ . '/telegram-config.php';
if (!is_file($configPath)) {
  contact_json(['ok' => false, 'error' => 'Server is not configured'], 500);
}

$config = require $configPath;
$token = trim((string)($config['token'] ?? ''));
$chatId = trim((string)($config['chat_id'] ?? ''));
$turnstileSecret = trim((string)($config['turnstile_secret'] ?? ''));

if ($token === '' || $chatId === '' || str_contains($token, 'YOUR_')) {
  contact_json(['ok' => false, 'error' => 'Server is not configured'], 500);
}

$raw = file_get_contents('php://input');
if (!is_string($raw) || $raw === '' || strlen($raw) > CONTACT_MAX_BODY) {
  contact_json(['ok' => false, 'error' => 'Payload too large'], 413);
}

$data = json_decode($raw, true);

if (!is_array($data)) {
  contact_json(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$name = trim((string)($data['name'] ?? ''));
$contact = trim((string)($data['contact'] ?? ''));
$project = trim((string)($data['project'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$turnstileToken = trim((string)($data['turnstileToken'] ?? $data['cf-turnstile-response'] ?? ''));

if ($name === '' || $contact === '') {
  contact_json(['ok' => false, 'error' => 'Name and contact are required'], 400);
}

if (
  contact_len($name) > CONTACT_MAX_NAME
  || contact_len($contact) > CONTACT_MAX_CONTACT
  || contact_len($project) > CONTACT_MAX_PROJECT
  || contact_len($message) > CONTACT_MAX_MESSAGE
) {
  contact_json(['ok' => false, 'error' => 'Fields too long'], 400);
}

if ($turnstileSecret === '' || str_contains($turnstileSecret, 'YOUR_')) {
  contact_json(['ok' => false, 'error' => 'Server is not configured'], 500);
}

if ($turnstileToken === '') {
  contact_json(['ok' => false, 'error' => 'Turnstile token missing'], 400);
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
$hostname = strtolower((string)($verifyData['hostname'] ?? ''));
if (
  $verifyResponse === false
  || $verifyStatus < 200
  || $verifyStatus >= 300
  || !is_array($verifyData)
  || empty($verifyData['success'])
  || !in_array($hostname, CONTACT_TURNSTILE_HOSTS, true)
) {
  contact_json(['ok' => false, 'error' => 'Turnstile verification failed'], 403);
}

if (!contact_rate_allow(contact_client_ip())) {
  contact_json(['ok' => false, 'error' => 'Too many requests'], 429);
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
  contact_json(['ok' => false, 'error' => 'Failed to deliver message'], 502);
}

$tg = json_decode($response, true);
if (!is_array($tg) || empty($tg['ok'])) {
  contact_json(['ok' => false, 'error' => 'Failed to deliver message'], 502);
}

echo json_encode(['ok' => true]);
