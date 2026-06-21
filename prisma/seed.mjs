// Идемпотентное наполнение базы стартовыми данными.
// Безопасно запускать повторно: настройки обновляются (upsert),
// товары добавляются только если база пустая.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Настройки сайта (singleton) — значения по умолчанию для BLISS brand.
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroTitle: "BLISS brand",
      heroSubtitle: "Wear what makes you feel truly you.",
      heroQuote:
        "Мы создаём одежду для женщин, которые ценят качество, комфорт и элегантность в каждой детали",
      telegramBotUrl: "https://t.me/bliss_ling",
      instagramUrl: "https://instagram.com/bliss_brand.ru",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Редактируемые страницы. Пустой content => на сайте показывается
  // встроенный текст по умолчанию. update:{} — не затираем заполненный текст.
  const pages = [
    { slug: "exchange", title: "Возврат" },
    { slug: "delivery", title: "Доставка" },
    { slug: "custom", title: "Индивидуальный пошив" },
    { slug: "offer", title: "Публичная оферта" },
    { slug: "privacy", title: "Политика конфиденциальности" },
  ];
  for (const { slug, title } of pages) {
    await prisma.page.upsert({
      where: { slug },
      update: {},
      create: { slug, title, content: "" },
    });
  }

  const productCount = await prisma.product.count();
  console.log(
    `Готово. Настройки и страницы на месте. Товаров в базе: ${productCount}.`,
  );
  if (productCount === 0) {
    console.log("Добавьте товары через админку /admin (или мигрируйте из Sanity).");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
