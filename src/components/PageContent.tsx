import type { ReactNode } from "react";

// Рендер текстового контента редактируемых страниц.
// Контент — обычный текст (не HTML): переносы строк сохраняются через
// whitespace-pre-line. Если текст пуст — показываем fallback (встроенный текст).
export default function PageContent({
  text,
  fallback,
}: {
  text?: string;
  fallback: ReactNode;
}) {
  const trimmed = text?.trim();
  if (!trimmed) return <>{fallback}</>;
  return (
    <div className="text-muted whitespace-pre-line leading-relaxed">{trimmed}</div>
  );
}
