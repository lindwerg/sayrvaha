// Слой чтения данных — замена sanityFetch + GROQ-запросов.
// Возвращает объекты в той же форме, что раньше отдавал Sanity.

import { prisma } from "@/lib/db";
import type { Product, Page, SiteSettings } from "@/lib/types";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  sizes: string;
  description: string | null;
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

function toProduct(row: ProductRow): Product {
  return {
    _id: row.id,
    name: row.name,
    slug: { current: row.slug },
    price: row.price,
    images: parseJsonArray(row.images),
    sizes: parseJsonArray(row.sizes),
    description: row.description ?? undefined,
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
  };
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
