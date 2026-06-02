// Замена sanity `urlFor`. Раньше Sanity отдавал CDN-ссылку с ресайзом
// (.width().height().quality()...). Теперь картинки лежат локально, а ресайзом
// занимается встроенный оптимизатор next/image. Поэтому здесь — лёгкий шим:
// он сохраняет тот же chainable-API, но просто возвращает путь к файлу.
// Благодаря этому вёрстку компонентов менять не нужно — только импорт.

interface ImageBuilder {
  width(n: number): ImageBuilder;
  height(n: number): ImageBuilder;
  quality(n: number): ImageBuilder;
  auto(mode: string): ImageBuilder;
  fit(mode: string): ImageBuilder;
  url(): string;
}

export function urlFor(source: unknown): ImageBuilder {
  const path =
    typeof source === "string"
      ? source
      : source && typeof source === "object" && "url" in source
        ? String((source as { url?: unknown }).url ?? "")
        : "";

  const builder: ImageBuilder = {
    width: () => builder,
    height: () => builder,
    quality: () => builder,
    auto: () => builder,
    fit: () => builder,
    url: () => path || "/placeholder.svg",
  };
  return builder;
}
