import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Логотип",
      type: "image",
    }),
    defineField({
      name: "heroImage",
      title: "Hero баннер",
      type: "image",
      description: "Фото для главного баннера. Рекомендуемый размер: 1920×1080",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroTitle",
      title: "Заголовок Hero",
      type: "string",
      description: "Текст поверх главного баннера. Например: BLISS brand",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Подзаголовок Hero",
      type: "string",
      description: "Текст под заголовком баннера. Например: Wear what makes you feel truly you.",
    }),
    defineField({
      name: "heroQuote",
      title: "Цитата на главной",
      type: "text",
      rows: 3,
      description:
        "Текст цитаты под hero-баннером. Например: «Мы создаём одежду для женщин...»",
    }),
    defineField({
      name: "telegramBotUrl",
      title: "Telegram бот URL",
      type: "string",
      description: "Например: https://t.me/bliss_ling",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "string",
      description: "Ссылка на Instagram. Например: https://instagram.com/bliss_brand.ru",
    }),
    defineField({
      name: "phone",
      title: "Телефон",
      type: "string",
      description: "Телефон для связи. Например: +7 (999) 123-45-67",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Email для связи",
    }),
    defineField({
      name: "address",
      title: "Адрес",
      type: "string",
      description: "Физический адрес магазина или шоурума",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Настройки сайта" };
    },
  },
});
