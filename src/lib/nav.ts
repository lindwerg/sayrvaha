// Единый источник пунктов меню — используется в шапке (Header) и подвале (Footer),
// чтобы порядок и состав ссылок не расходились.
export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/oferta-politika", label: "Оферта и политика" },
  { href: "/delivery", label: "Доставка" },
  { href: "/exchange", label: "Возврат" },
  { href: "/contacts", label: "Контакты" },
  { href: "/sale", label: "Sale" },
];
