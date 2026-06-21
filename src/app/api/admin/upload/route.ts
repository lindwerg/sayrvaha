// Загрузка одного фото товара отдельным запросом (для админки).
// Каждое фото грузится индивидуально сразу при выборе — это надёжнее, чем слать
// все файлы вместе с формой (большой запрос упирался в лимиты/таймауты, особенно
// на телефоне). Форма потом сохраняется только со ссылками на уже загруженные фото.

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 МБ на одно фото

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Это не изображение" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Файл слишком большой" }, { status: 413 });
  }

  try {
    const path = await saveUpload(file);
    return NextResponse.json({ path });
  } catch (error) {
    console.error("[upload] ошибка сохранения файла:", error);
    return NextResponse.json({ error: "Не удалось сохранить фото" }, { status: 500 });
  }
}
