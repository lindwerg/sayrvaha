#!/bin/sh
# Запуск в проде. При первом старте (пустой постоянный диск) заливает базу и
# фото из бандла seed-data, затем применяет миграции, наполняет дефолтами и
# поднимает сервер. На последующих стартах диск уже наполнен — гидрация пропускается.
set -e

: "${DATA_DIR:=/data}"

if [ ! -f "$DATA_DIR/app.db" ]; then
  echo "[start] Первый запуск: переношу seed-data -> $DATA_DIR"
  mkdir -p "$DATA_DIR"
  cp -R ./seed-data/. "$DATA_DIR"/ 2>/dev/null || true
fi

echo "[start] Применяю миграции базы..."
npx prisma migrate deploy

echo "[start] Наполняю дефолтами (идемпотентно)..."
node prisma/seed.mjs || true

echo "[start] Запускаю Next.js на порту ${PORT:-3000}"
exec npx next start -p "${PORT:-3000}"
