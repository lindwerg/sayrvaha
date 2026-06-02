// Отдаёт загруженные картинки из DATA_DIR/uploads.
// Файлы лежат вне публичной папки (на постоянном диске), поэтому
// статически их не раздать — стримим через этот маршрут.

import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { uploadsDir } from "@/lib/uploads";
import type { ReadStream } from "fs";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await ctx.params;

  // Защита от path traversal: разрешаем только простые имена файлов.
  const name = segments.join("/");
  if (name.includes("..") || name.includes("/") || name.includes("\\")) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(uploadsDir(), name);
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const stream = createReadStream(filePath) as unknown as ReadStream;

    return new Response(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
