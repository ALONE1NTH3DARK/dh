# Форма → Telegram

Прод-путь: `POST /api/contact.php` (хостинг Apache) или `POST /api/contact` (Vercel Edge).

Клиент: `src/features/home/Contact.tsx` → `src/lib/submitContact.ts`.

Сервер проверяет Cloudflare Turnstile, длину полей и частоту запросов, затем шлёт сообщение боту. Секреты только в `public/api/telegram-config.php` (gitignored) или env `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` / `TURNSTILE_SECRET_KEY`.

Не используйте `parse_mode: HTML` для пользовательского текста и не копируйте токен в React.
