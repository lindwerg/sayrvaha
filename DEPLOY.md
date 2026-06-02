# Деплой BLISS brand

Сайт полностью自-hosted: **Next.js + SQLite + локальные картинки**. Никаких внешних
сервисов и подписок. Все данные (база `app.db` и загруженные фото) лежат в одной
папке — на сервере это **постоянный диск (том) `/data`**.

## Переменные окружения

| Переменная | Назначение | Пример |
|---|---|---|
| `DATABASE_URL` | Путь к файлу базы | `file:/data/app.db` |
| `DATA_DIR` | Папка для базы и картинок (`/uploads`) | `/data` |
| `ADMIN_PASSWORD` | Пароль входа в `/admin` | надёжный пароль |
| `ADMIN_SECRET` | Секрет подписи сессии админки | длинная случайная строка |

## Вариант A — VPS (Docker)

```bash
git clone <repo> && cd sayrvaha
docker build -t bliss .
docker run -d --name bliss -p 80:3000 \
  -v /srv/bliss-data:/data \
  -e ADMIN_PASSWORD='ваш-пароль' \
  -e ADMIN_SECRET='длинная-случайная-строка' \
  bliss
```

Том `-v /srv/bliss-data:/data` хранит базу и фото — они переживают перезапуск и
обновление контейнера. Миграции и наполнение применяются автоматически при старте.

## Вариант B — VPS без Docker

```bash
npm ci
cp .env.example .env   # заполнить ADMIN_PASSWORD, ADMIN_SECRET, пути
npm run build
npm run start          # применит миграции, наполнит дефолтами, запустит сервер
```

Поставьте процесс под PM2/systemd и nginx-реверс-прокси на порт 3000.

## Вариант C — Railway

1. Подключить репозиторий к сервису.
2. Создать **Volume**, смонтировать в `/data`.
3. Задать переменные: `DATABASE_URL=file:/data/app.db`, `DATA_DIR=/data`,
   `ADMIN_PASSWORD`, `ADMIN_SECRET`.
4. Build: `npm run build` · Start: `npm run start` (заданы в package.json).

> Важно: миграции запускаются при **старте** (`npm run start`), потому что
> постоянный диск монтируется в рантайме, а не во время сборки.

## Картинки

Загруженные через `/admin` фото сохраняются в `DATA_DIR/uploads` и отдаются по
пути `/uploads/<файл>`. Оптимизацией размеров занимается встроенный `next/image`.

## Резервная копия

Достаточно скопировать папку `/data` — там и база, и все картинки.
