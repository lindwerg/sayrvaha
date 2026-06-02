// Хранение загруженных картинок на диске вместо облака Sanity.
// Файлы кладём в DATA_DIR/uploads (DATA_DIR указывает на постоянный диск
// на сервере; локально — папка ./data в проекте). Отдаются они маршрутом
// /uploads/[file] (см. src/app/uploads/[...path]/route.ts).

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export function dataDir(): string {
  return process.env.DATA_DIR || path.join(process.cwd(), "data");
}

export function uploadsDir(): string {
  return path.join(dataDir(), "uploads");
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

function safeExt(file: File): string {
  const fromType = EXT_BY_TYPE[file.type];
  if (fromType) return fromType;
  const fromName = file.name.split(".").pop()?.toLowerCase();
  return fromName && /^[a-z0-9]+$/.test(fromName) ? fromName : "bin";
}

/** Сохраняет один файл и возвращает публичный путь вида /uploads/<id>.<ext> */
export async function saveUpload(file: File): Promise<string> {
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${safeExt(file)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

/** Сохраняет уже готовый буфер (используется при миграции из Sanity). */
export async function saveBuffer(buffer: Buffer, ext: string): Promise<string> {
  const dir = uploadsDir();
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext.replace(/[^a-z0-9]/gi, "") || "jpg"}`;
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}
