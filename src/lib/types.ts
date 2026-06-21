// Типы данных сайта. Формы максимально совпадают с прежними (Sanity),
// чтобы не переписывать компоненты: slug остаётся { current }, есть _id.
// Отличия: images — массив путей-строк, content страницы — HTML-строка.

export interface SizeChartRow {
  size: string;
  bust?: string;
  waist?: string;
  hips?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: string[];
  sizes: string[];
  description?: string;
  composition?: string;
  care?: string;
  sizeChart?: SizeChartRow[];
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
  cartEnabled?: boolean;
  telegramOrderEnabled?: boolean;
  telegramButtonText?: string;
}

// Позиция в корзине (живёт в localStorage на клиенте).
export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  size?: string | null;
  price: number;
  qty: number;
}

// Позиция оформленного заказа (хранится в Order.items как JSON).
export interface OrderItem {
  productId: string;
  name: string;
  size?: string | null;
  qty: number;
  price: number;
}

export interface Order {
  _id: string;
  createdAt: string;
  name: string;
  phone: string;
  address?: string;
  comment?: string;
  items: OrderItem[];
  total: number;
  status: string;
}
