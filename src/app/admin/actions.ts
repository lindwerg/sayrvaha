"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  verifyPassword,
  setSessionCookie,
  clearSessionCookie,
  isAuthenticated,
} from "@/lib/auth";
import { writeClient } from "@/lib/sanity-admin";

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

// ─── Products ───

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

async function uploadImages(formData: FormData) {
  const files = formData
    .getAll("newImages")
    .filter((v): v is File => v instanceof File && v.size > 0);

  const refs = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await writeClient.assets.upload("image", buffer, {
        filename: file.name,
        contentType: file.type,
      });
      return {
        _type: "image" as const,
        _key: asset._id.slice(-8),
        asset: { _type: "reference" as const, _ref: asset._id },
      };
    }),
  );
  return refs;
}

function parseExistingImages(formData: FormData) {
  return formData
    .getAll("existingImages")
    .map((v) => JSON.parse(v as string));
}

export async function createProductAction(formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const description = (formData.get("description") as string) || "";
  const category = (formData.get("category") as string) || "";
  const sizes = formData.getAll("sizes") as string[];
  const isNew = formData.get("isNew") === "on";
  const isAvailable = formData.get("isAvailable") === "on";
  const order = Number(formData.get("order")) || 0;

  const newImageRefs = await uploadImages(formData);
  if (newImageRefs.length === 0) return { error: "Добавьте хотя бы одно фото" };

  await writeClient.create({
    _type: "product",
    name,
    slug: { _type: "slug", current: slugify(name) },
    price,
    description,
    category: category || undefined,
    sizes,
    isNew,
    isAvailable,
    order,
    images: newImageRefs,
  });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
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
  const isAvailable = formData.get("isAvailable") === "on";
  const order = Number(formData.get("order")) || 0;

  const existing = parseExistingImages(formData);
  const newRefs = await uploadImages(formData);
  const allImages = [...existing, ...newRefs];

  if (allImages.length === 0) return { error: "Нужно хотя бы одно фото" };

  await writeClient
    .patch(id)
    .set({
      name,
      slug: { _type: "slug", current: slugify(name) },
      price,
      description,
      category: category || undefined,
      sizes,
      isNew,
      isAvailable,
      order,
      images: allImages,
    })
    .commit();

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  revalidatePath(`/catalog/${slugify(name)}`);
  return { success: true };
}

export async function deleteProductAction(formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };
  const id = formData.get("id") as string;
  await writeClient.delete(id);
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");
  return { success: true };
}

// ─── Settings ───

export async function updateSettingsAction(formData: FormData) {
  if (!(await isAuthenticated())) return { error: "Не авторизован" };

  const heroTitle = (formData.get("heroTitle") as string) || "";
  const telegramBotUrl = (formData.get("telegramBotUrl") as string) || "";
  const instagramUrl = (formData.get("instagramUrl") as string) || "";
  const phone = (formData.get("phone") as string) || "";
  const email = (formData.get("email") as string) || "";
  const address = (formData.get("address") as string) || "";

  // Upload hero image if provided
  const heroFile = formData.get("heroImage") as File;
  let heroImageField = undefined;
  if (heroFile && heroFile.size > 0) {
    const buffer = Buffer.from(await heroFile.arrayBuffer());
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: heroFile.name,
      contentType: heroFile.type,
    });
    heroImageField = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  }

  // Check if settings document exists
  const existing = await writeClient.fetch(
    `*[_type == "siteSettings"][0]._id`,
  );

  const data: Record<string, unknown> = {
    heroTitle,
    telegramBotUrl,
    instagramUrl,
    phone,
    email,
    address,
  };
  if (heroImageField) data.heroImage = heroImageField;

  if (existing) {
    await writeClient.patch(existing).set(data).commit();
  } else {
    await writeClient.create({
      _type: "siteSettings",
      _id: "siteSettings",
      ...data,
    });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contacts");
  return { success: true };
}
