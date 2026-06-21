// Сжатие изображений в браузере перед загрузкой.
// Фото с телефона весят 3–8 МБ; несколько штук превышают лимит Server Action и
// раздувают хранилище/сайт. Уменьшаем до разумного размера и пережимаем в JPEG —
// получаем ~200–500 КБ без заметной потери качества для витрины.

// 2000px по большей стороне покрывает даже retina-экраны (фото на сайте
// рендерятся максимум ~800–1067px CSS, ×2 = ~2000px). Качество 0.86 —
// визуально неотличимо от оригинала для веба.
const MAX_DIMENSION = 2000; // px по большей стороне
const JPEG_QUALITY = 0.86;

export async function compressImage(file: File): Promise<File> {
  // SVG/GIF не трогаем (анимация/векторы), не-изображения пропускаем как есть.
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) return file;

    // Если сжатие не дало выигрыша — оставляем оригинал.
    if (blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file; // при любой ошибке грузим оригинал
  }
}
