// Одноразовый перенос контента из облака Sanity в локальную базу + скачивание
// всех фото в DATA_DIR/uploads. Секреты передаются через переменные окружения,
// в файл/коммит не попадают:
//   SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION, SANITY_TOKEN
//
// Запуск:
//   SANITY_PROJECT_ID=... SANITY_DATASET=production SANITY_API_VERSION=2024-01-01 \
//   SANITY_TOKEN=... node prisma/import-from-sanity.mjs

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

const PROJECT = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || "production";
const API_VERSION = process.env.SANITY_API_VERSION || "2024-01-01";
const TOKEN = process.env.SANITY_TOKEN;
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const UPLOADS = path.join(DATA_DIR, "uploads");

if (!PROJECT || !TOKEN) {
  console.error("Нужны SANITY_PROJECT_ID и SANITY_TOKEN в переменных окружения.");
  process.exit(1);
}

async function groq(query) {
  const url = `https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

// Скачивает картинку по URL и возвращает локальный путь /uploads/<id>.<ext>
const imageCache = new Map();
async function downloadImage(srcUrl) {
  if (!srcUrl) return null;
  if (imageCache.has(srcUrl)) return imageCache.get(srcUrl);
  const res = await fetch(srcUrl);
  if (!res.ok) {
    console.warn(`  ! не удалось скачать ${srcUrl} (${res.status})`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = (srcUrl.split(".").pop() || "jpg").split("?")[0].toLowerCase();
  const name = `${randomUUID()}.${/^[a-z0-9]+$/.test(ext) ? ext : "jpg"}`;
  await writeFile(path.join(UPLOADS, name), buf);
  const local = `/uploads/${name}`;
  imageCache.set(srcUrl, local);
  return local;
}

function ptToHtml(blocks) {
  if (!Array.isArray(blocks)) return "";
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let html = "";
  let listType = null;
  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };
  for (const b of blocks) {
    if (!b || b._type !== "block") continue;
    const text = (b.children || [])
      .map((c) => {
        let t = esc(c.text || "");
        const marks = c.marks || [];
        if (marks.includes("strong")) t = `<strong>${t}</strong>`;
        if (marks.includes("em")) t = `<em>${t}</em>`;
        return t;
      })
      .join("");
    if (b.listItem) {
      const lt = b.listItem === "number" ? "ol" : "ul";
      if (listType !== lt) {
        closeList();
        html += `<${lt}>`;
        listType = lt;
      }
      html += `<li>${text}</li>`;
      continue;
    }
    closeList();
    const style = b.style || "normal";
    if (style === "h2") html += `<h2>${text}</h2>`;
    else if (style === "h3") html += `<h3>${text}</h3>`;
    else html += `<p>${text}</p>`;
  }
  closeList();
  return html;
}

async function main() {
  await mkdir(UPLOADS, { recursive: true });

  // ── Products ──
  const products = await groq(
    `*[_type=="product"]|order(order asc,_createdAt desc){
      name,"slug":slug.current,price,description,category,sizes,
      isNew,isOnSale,oldPrice,isAvailable,order,"images":images[].asset->url
    }`,
  );
  console.log(`Найдено товаров: ${products.length}`);

  await prisma.product.deleteMany({});
  const usedSlugs = new Set();
  for (const p of products) {
    const localImages = [];
    for (const url of p.images || []) {
      const local = await downloadImage(url);
      if (local) localImages.push(local);
    }
    let slug = p.slug || `tovar-${randomUUID().slice(0, 6)}`;
    while (usedSlugs.has(slug)) slug = `${slug}-2`;
    usedSlugs.add(slug);

    await prisma.product.create({
      data: {
        name: p.name || "Без названия",
        slug,
        price: p.price ?? 0,
        description: p.description ?? null,
        category: p.category ?? null,
        sizes: JSON.stringify(p.sizes || []),
        images: JSON.stringify(localImages),
        isNew: !!p.isNew,
        isOnSale: !!p.isOnSale,
        oldPrice: p.oldPrice ?? null,
        isAvailable: p.isAvailable !== false,
        order: p.order ?? 0,
      },
    });
    console.log(`  ✓ ${p.name} (${localImages.length} фото)`);
  }

  // ── Pages ──
  const pages = await groq(`*[_type=="page"]{"slug":slug.current,title,content}`);
  console.log(`Найдено страниц: ${pages.length}`);
  for (const pg of pages) {
    if (!pg.slug) continue;
    await prisma.page.upsert({
      where: { slug: pg.slug },
      update: { title: pg.title || pg.slug, content: ptToHtml(pg.content) },
      create: { slug: pg.slug, title: pg.title || pg.slug, content: ptToHtml(pg.content) },
    });
    console.log(`  ✓ страница ${pg.slug}`);
  }

  // ── Site settings ──
  const s = await groq(
    `*[_type=="siteSettings"][0]{
      heroTitle,heroSubtitle,heroQuote,telegramBotUrl,instagramUrl,phone,email,address,
      "heroImage":heroImage.asset->url,"logo":logo.asset->url
    }`,
  );
  if (s) {
    const heroImage = await downloadImage(s.heroImage);
    const logo = await downloadImage(s.logo);
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        heroTitle: s.heroTitle ?? null,
        heroSubtitle: s.heroSubtitle ?? null,
        heroQuote: s.heroQuote ?? null,
        telegramBotUrl: s.telegramBotUrl ?? null,
        instagramUrl: s.instagramUrl ?? null,
        phone: s.phone ?? null,
        email: s.email ?? null,
        address: s.address ?? null,
        heroImage,
        logo,
      },
      create: {
        id: "singleton",
        heroTitle: s.heroTitle ?? null,
        heroSubtitle: s.heroSubtitle ?? null,
        heroQuote: s.heroQuote ?? null,
        telegramBotUrl: s.telegramBotUrl ?? null,
        instagramUrl: s.instagramUrl ?? null,
        phone: s.phone ?? null,
        email: s.email ?? null,
        address: s.address ?? null,
        heroImage,
        logo,
      },
    });
    console.log("  ✓ настройки сайта перенесены");
  }

  console.log("Импорт завершён.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
