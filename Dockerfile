# Self-hosted сборка BLISS brand. Всё внутри: Next.js + SQLite + локальные картинки.
# Постоянные данные (база и /uploads) живут в томе /data.

FROM node:22-slim AS base
# OpenSSL нужен Prisma для движка запросов.
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ── Зависимости ──
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ── Сборка ──
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# npm run build пререндерит страницы, указывая БД на зашитый seed-data (19 товаров).
# В рантайме база берётся с тома /data (см. ENV в runner-стадии и scripts/start.sh).
RUN npm run build

# ── Рантайм ──
FROM base AS runner
ENV NODE_ENV=production
ENV DATA_DIR=/data
ENV DATABASE_URL=file:/data/app.db
ENV PORT=3000

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/seed-data ./seed-data
COPY --from=build /app/package.json ./package.json

# Том для базы и загруженных картинок (переживает передеплои).
VOLUME ["/data"]
EXPOSE 3000

# При старте: применяем миграции к базе на томе, наполняем дефолтами, запускаем сервер.
CMD ["npm", "run", "start"]
