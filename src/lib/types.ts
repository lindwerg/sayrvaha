// Типы данных сайта. Формы максимально совпадают с прежними (Sanity),
// чтобы не переписывать компоненты: slug остаётся { current }, есть _id.
// Отличия: images — массив путей-строк, content страницы — HTML-строка.

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: string[];
  sizes: string[];
  description?: string;
  category?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  oldPrice?: number;
  isAvailable?: boolean;
  order?: number;
}

export interface Page {
  _id: string;
  title: string;
  slug: { current: string };
  content: string;
}

export interface SiteSettings {
  logo?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroQuote?: string;
  telegramBotUrl?: string;
  instagramUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
}
