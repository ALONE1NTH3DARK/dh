<?php
declare(strict_types=1);

if (!defined('DH_API')) {
  http_response_code(403);
  exit;
}

/**
 * Скопируйте этот файл в admin-config.php на сервере и заполните значения.
 * admin-config.php в git не попадает и напрямую по URL не отдаётся.
 *
 * Порядок настройки на хостинге:
 *  1. Загрузите содержимое dist/ в корень сайта.
 *  2. Скопируйте api/admin-config.example.php → api/admin-config.php.
 *  3. Задайте admin_password и hash_salt (любая длинная случайная строка).
 *  4. Проверьте, что каталог api/data/ доступен для записи (права 775).
 *  5. Откройте /admin и войдите по паролю.
 *
 * Надёжнее вынести базу за пределы webroot, например:
 *   'db_path' => '../../analytics-data/analytics.sqlite',
 * тогда файл не будет затираться при следующей выгрузке сайта.
 */
return [
  // Пароль для входа в /admin
  'admin_password' => 'YOUR_ADMIN_PASSWORD',

  // Соль для хэша посетителя. IP в базу не пишется, только необратимый хэш.
  'hash_salt' => 'YOUR_LONG_RANDOM_STRING',

  // Часовой пояс, в котором считаются сутки в отчётах
  'timezone' => 'Asia/Almaty',

  // Путь к файлу SQLite: относительный считается от каталога api/
  'db_path' => 'data/analytics.sqlite',

  // Определять страну через ipwho.is, если хостинг не отдаёт её заголовком
  'geo_lookup' => true,

  // Предохранитель: перестать писать события, если база выросла больше N МБ
  'max_db_mb' => 256,
];
