// Список редактируемых из админки страниц (фиксированный набор).
// slug — ключ в БД (модель Page), label — человекочитаемое название,
// path — публичный маршрут для revalidate после сохранения.
export interface EditablePage {
  slug: string;
  label: string;
  path: string;
}

export const EDITABLE_PAGES: EditablePage[] = [
  { slug: "delivery", label: "Доставка", path: "/delivery" },
  { slug: "exchange", label: "Возврат", path: "/exchange" },
  { slug: "offer", label: "Публичная оферта", path: "/oferta-politika" },
  { slug: "privacy", label: "Политика конфиденциальности", path: "/oferta-politika" },
  { slug: "custom", label: "Индивидуальный пошив", path: "/custom" },
];

export function getEditablePage(slug: string): EditablePage | undefined {
  return EDITABLE_PAGES.find((p) => p.slug === slug);
}
