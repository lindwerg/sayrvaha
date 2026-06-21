// Слой чтения данных — замена sanityFetch + GROQ-запросов.
// Возвращает объекты в той же форме, что раньше отдавал Sanity.

import { prisma } from "@/lib/db";
import type { Product, Page, SiteSettings, Order, OrderItem, SizeChartRow } from "@/lib/types";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  sizes: string;
  description: string | null;
  composition: string | null;
  care: string | null;
  sizeChart: string;
  category: string | null;
  isNew: boolean;
  isOnSale: boolean;
  oldPrice: number | null;
  isAvailable: boolean;
  order: number;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseSizeChart(value: string): SizeChartRow[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((r): r is SizeChartRow => !!r && typeof r === "object" && typeof r.size === "string")
      .map((r) => ({
        size: r.size,
        bust: r.bust || undefined,
        waist: r.waist || undefined,
        hips: r.hips || undefined,
      }));
  } catch {
    return [];
  }
}

function toProduct(row: ProductRow): Product {
  return {
    _id: row.id,
    name: row.name,
    slug: { current: row.slug },
    price: row.price,
    images: parseJsonArray(row.images),
    sizes: parseJsonArray(row.sizes),
    description: row.description ?? undefined,
    composition: row.composition ?? undefined,
    care: row.care ?? undefined,
    sizeChart: parseSizeChart(row.sizeChart),
    category: row.category ?? undefined,
    isNew: row.isNew,
    isOnSale: row.isOnSale,
    oldPrice: row.oldPrice ?? undefined,
    isAvailable: row.isAvailable,
    order: row.order,
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toProduct);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isAvailable: true, category },
    orderBy: { order: "asc" },
  });
  return rows.map(toProduct);
}

export async function getSaleProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isAvailable: true, isOnSale: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toProduct(row) : null;
}

export async function getPage(slug: string): Promise<Page | null> {
  const row = await prisma.page.findUnique({ where: { slug } });
  if (!row) return null;
  return {
    _id: row.id,
    title: row.title,
    slug: { current: row.slug },
    content: row.content,
  };
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!row) return null;
  return {
    logo: row.logo ?? undefined,
    heroImage: row.heroImage ?? undefined,
    heroTitle: row.heroTitle ?? undefined,
    heroSubtitle: row.heroSubtitle ?? undefined,
    heroQuote: row.heroQuote ?? undefined,
    telegramBotUrl: row.telegramBotUrl ?? undefined,
    instagramUrl: row.instagramUrl ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    address: row.address ?? undefined,
    cartEnabled: row.cartEnabled,
    telegramOrderEnabled: row.telegramOrderEnabled,
    telegramButtonText: row.telegramButtonText ?? undefined,
    onlinePaymentEnabled: row.onlinePaymentEnabled,
  };
}

// ─── Заказы ───

interface OrderRow {
  id: string;
  createdAt: Date;
  name: string;
  phone: string;
  address: string | null;
  comment: string | null;
  items: string;
  total: number;
  status: string;
  paymentId: string | null;
  paymentStatus: string;
  paidAt: Date | null;
}

function toOrder(row: OrderRow): Order {
  let items: OrderItem[] = [];
  try {
    const parsed = JSON.parse(row.items);
    if (Array.isArray(parsed)) items = parsed as OrderItem[];
  } catch {
    items = [];
  }
  return {
    _id: row.id,
    createdAt: row.createdAt.toISOString(),
    name: row.name,
    phone: row.phone,
    address: row.address ?? undefined,
    comment: row.comment ?? undefined,
    items,
    total: row.total,
    status: row.status,
    paymentId: row.paymentId ?? undefined,
    paymentStatus: row.paymentStatus,
    paidAt: row.paidAt ? row.paidAt.toISOString() : undefined,
  };
}

export async function getOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({ where: { id } });
  return row ? toOrder(row) : null;
}

// ─── Админские функции (показывают все товары, включая скрытые) ───

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}
