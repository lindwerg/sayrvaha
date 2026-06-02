"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  isAuthenticated,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/uploads";

// ─── Auth ───

export async function loginAction(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const password = formData.get("password") as string;
  if (!verifyPassword(password)) {
    return { error: "Неверный пароль" };
  }
  await setSessionCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

// ─── Helpers ───

const translitMap: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((c) => translitMap[c] || c)
    .join("")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Гарантирует уникальность slug (в базе он уникален).
async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = base || "tovar";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === ignoreId) return candidate;
    candidate = `${root}-${++n}`;
  }
}

// Сохраняет новые файлы из поля newImages и возвращает массив путей.
async function uploadImages(formData: FormData): Promise<string[]> {
  const files = formData
    .getAll("newImages")
    .filter((v): v is File => v instanceof File && v.size > 0);
  return Promise.all(files.map((file) => saveUpload(file)));
}

// Уже прикреплённые картинки приходят строками-путями в поле existingImages.
function parseExistingImages(formData: FormData): string[] {
  return formData.getAll("existingImages").map((v) => String(v));
}

function revalidateProductPages() {
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/sale");
  revalidatePath("/");
}

// ─── Products ───

export async function createProductAction(formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const description = (formData.get("description") as string) || "";
  const category = (formData.get("category") as string) || "";
  const sizes = formData.getAll("sizes") as string[];
  const isNew = formData.get("isNew") === "on";
  const isOnSale = formData.get("isOnSale") === "on";
  const oldPrice = formData.get("oldPrice") ? Number(formData.get("oldPrice")) : null;
  const isAvailable = formData.get("isAvailable") === "on";
  const order = Number(formData.get("order")) || 0;

  const images = await uploadImages(formData);
  if (images.length === 0) return { error: "Добавьте хотя бы одно фото" };

  await prisma.product.create({
    data: {
      name,
      slug: await uniqueSlug(slugify(name)),
      price,
      description,
      category: category || null,
      sizes: JSON.stringify(sizes),
      images: JSON.stringify(images),
      isNew,
      isOnSale,
      oldPrice: isOnSale ? oldPrice : null,
      isAvailable,
      order,
    },
  });

  revalidateProductPages();
  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const description = (formData.get("description") as string) || "";
  const category = (formData.get("category") as string) || "";
  const sizes = formData.getAll("sizes") as string[];
  const isNew = formData.get("isNew") === "on";
  const isOnSale = formData.get("isOnSale") === "on";
  const oldPrice = formData.get("oldPrice") ? Number(formData.get("oldPrice")) : null;
  const isAvailable = formData.get("isAvailable") === "on";
  const order = Number(formData.get("order")) || 0;

  const existing = parseExistingImages(formData);
  const uploaded = await uploadImages(formData);
  const images = [...existing, ...uploaded];
  if (images.length === 0) return { error: "Нужно хотя бы одно фото" };

  const slug = await uniqueSlug(slugify(name), id);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      price,
      description,
      category: category || null,
      sizes: JSON.stringify(sizes),
      images: JSON.stringify(images),
      isNew,
      isOnSale,
      oldPrice: isOnSale ? oldPrice : null,
      isAvailable,
      order,
    },
  });

  revalidateProductPages();
  revalidatePath(`/catalog/${slug}`);
  return { success: true };
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidateProductPages();
  return { success: true };
}

export async function moveProductAction(id: string, direction: "up" | "down") {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };

  const products = await prisma.product.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: { id: true, order: true },
  });

  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return { error: "Товар не найден" };

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= products.length) return { error: "Некуда двигать" };

  const current = products[idx];
  const neighbor = products[swapIdx];

  const currentOrder = current.order ?? 0;
  let neighborOrder = neighbor.order ?? 0;
  if (currentOrder === neighborOrder) {
    neighborOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
  }

  await prisma.product.update({ where: { id: current.id }, data: { order: neighborOrder } });
  await prisma.product.update({ where: { id: neighbor.id }, data: { order: currentOrder } });

  revalidateProductPages();
  return { success: true };
}

// ─── Settings ───

export async function updateSettingsAction(formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };

  const data: Record<string, string> = {
    heroTitle: (formData.get("heroTitle") as string) || "",
    heroSubtitle: (formData.get("heroSubtitle") as string) || "",
    heroQuote: (formData.get("heroQuote") as string) || "",
    telegramBotUrl: (formData.get("telegramBotUrl") as string) || "",
    instagramUrl: (formData.get("instagramUrl") as string) || "",
    phone: (formData.get("phone") as string) || "",
    email: (formData.get("email") as string) || "",
    address: (formData.get("address") as string) || "",
  };

  const heroFile = formData.get("heroImage") as File | null;
  const heroImage = heroFile && heroFile.size > 0 ? await saveUpload(heroFile) : undefined;

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data, ...(heroImage ? { heroImage } : {}) },
    update: { ...data, ...(heroImage ? { heroImage } : {}) },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contacts");
  return { success: true };
}
