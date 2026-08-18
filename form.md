# Как подключить форму обратной связи к Telegram

Сейчас форма в `src/components/Contact.tsx` открывает почтовый клиент через `mailto:`. Ниже — как вместо этого (или дополнительно) отправлять заявки в Telegram.

Поля формы на сайте:

- `name` — имя
- `contact` — телефон / Telegram
- `project` — тип проекта
- `message` — описание задачи

---

## 1. Создать бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram.
2. Отправьте `/newbot`.
3. Укажите имя и username бота (username должен заканчиваться на `bot`).
4. Сохраните **токен** вида:

   ```text
   7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

Токен — секрет. Не коммитьте его в Git и не вставляйте в клиентский React-код на продакшене.

---

## 2. Узнать `chat_id` (куда слать сообщения)

Сообщения нужно отправлять в личку или в группу/канал.

### Вариант A — личные сообщения себе

1. Напишите своему боту любое сообщение (например, `hi`).
2. Откройте в браузере:

   ```text
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```

3. В ответе найдите `"chat":{"id": 123456789}` — это ваш `chat_id` (число, может быть отрицательным для групп).

### Вариант B — группа

1. Добавьте бота в группу.
2. Дайте боту право писать сообщения.
3. Напишите в группе что угодно.
4. Снова вызовите `getUpdates` и возьмите `chat.id` группы (обычно отрицательный, например `-1001234567890`).

---

## 3. Как устроена отправка в Telegram

Бот API принимает POST (или GET) на:

```text
https://api.telegram.org/bot<TOKEN>/sendMessage
```

Параметры:

| Параметр   | Значение                                      |
|------------|-----------------------------------------------|
| `chat_id`  | ваш chat id                                   |
| `text`     | текст заявки                                  |
| `parse_mode` | опционально: `HTML` или `MarkdownV2`        |

Пример тела запроса:

```json
{
  "chat_id": "123456789",
  "text": "🆕 Новая заявка\nИмя: Иван\nКонтакт: @ivan\nПроект: Лендинг\nЗадача: Нужен сайт",
  "parse_mode": "HTML"
}
```

---

## 4. Важно: не вызывайте Bot API напрямую из браузера

Если положить токен в фронтенд (`VITE_…` переменные, которые попадают в бандл), любой сможет его украсть и слать спам от имени бота.

Правильно:

1. Форма на сайте → ваш бэкенд / serverless-функция.
2. Бэкенд с токеном на сервере → Telegram API.

Ниже — рабочие схемы.

---

## 5. Рекомендуемый способ: Cloudflare Worker / Vercel / Netlify Function

### 5.1. Логика эндпоинта

Эндпоинт принимает JSON от формы, собирает текст и дергает Telegram.

Псевдокод:

```js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, contact, project, message } = req.body;

  const text = [
    "🆕 Новая заявка с сайта",
    `Имя: ${name || "—"}`,
    `Телефон / Telegram: ${contact || "—"}`,
    `Тип проекта: ${project || "—"}`,
    `О задаче: ${message || "—"}`,
  ].join("\n");

  const tg = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
      }),
    }
  );

  if (!tg.ok) {
    return res.status(500).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}
```

Переменные окружения на сервере:

```env
TELEGRAM_BOT_TOKEN=7123456789:AAH...
TELEGRAM_CHAT_ID=123456789
```

### 5.2. Изменить форму в `Contact.tsx`

Вместо `mailto:` отправляйте `fetch` на свой эндпоинт:

```ts
const submit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);

  const payload = {
    name: String(data.get("name") || ""),
    contact: String(data.get("contact") || ""),
    project: String(data.get("project") || ""),
    message: String(data.get("message") || ""),
  };

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // показать ошибку пользователю
    return;
  }

  setSubmitted(true);
};
```

URL `/api/contact` замените на адрес вашего Worker / serverless-функции.

---

## 6. Быстрый способ без своего сервера (сервисы)

Если не хотите поднимать бэкенд:

1. **Formspree / Getform / Basin** + интеграция с Telegram (если есть в сервисе).
2. **[Telegram Form](https://telegram.org)**-подобные SaaS или n8n / Make (Integromat):
   - webhook формы → сценарий → Telegram.
3. **Google Apps Script** как прокси:
   - форма шлёт на Apps Script URL;
   - скрипт вызывает `sendMessage` с токеном, хранящимся в Script Properties.

Минус сервисов: зависимость от третьей стороны и лимиты бесплатного тарифа.

---

## 7. Чеклист перед продом

- [ ] Бот создан, токен сохранён только в env на сервере
- [ ] `chat_id` проверен тестовым `sendMessage`
- [ ] Форма шлёт POST на бэкенд, а не напрямую в `api.telegram.org`
- [ ] Есть обработка ошибок (сеть, 500 от Telegram)
- [ ] Есть базовая защита от спама (honeypot, rate limit, Cloudflare Turnstile / hCaptcha)
- [ ] Токен не попал в Git / клиентский бандл

---

## 8. Проверка вручную

Перед подключением формы можно проверить бота curl:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id":"<CHAT_ID>","text":"Тест заявки с сайта"}'
```

Если сообщение пришло в Telegram — токен и `chat_id` верные, остаётся только связать форму с эндпоинтом.

---

## Кратко

1. Создать бота у `@BotFather` → получить `TOKEN`.
2. Написать боту / добавить в группу → получить `chat_id` через `getUpdates`.
3. Сделать серверный эндпоинт, который вызывает `sendMessage`.
4. В `Contact.tsx` заменить `mailto:` на `fetch` к этому эндпоинту.
5. Токен держать только на сервере.
