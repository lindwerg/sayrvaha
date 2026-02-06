import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Товар",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Название",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      description: "Нажмите Generate — создастся автоматически из названия",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Цена (₽)",
      type: "number",
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: "images",
      title: "Фото",
      type: "array",
      description: "Первое фото — главное в каталоге. Рекомендуем 3:4 формат",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "sizes",
      title: "Размеры",
      type: "array",
      description: "Выберите размеры, которые есть в наличии",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "XS", value: "XS" },
          { title: "S", value: "S" },
          { title: "M", value: "M" },
          { title: "L", value: "L" },
          { title: "XL", value: "XL" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "category",
      title: "Категория",
      type: "string",
      options: {
        list: [
          { title: "Платья", value: "dresses" },
          { title: "Топы", value: "tops" },
          { title: "Юбки", value: "skirts" },
          { title: "Брюки", value: "pants" },
          { title: "Костюмы", value: "suits" },
          { title: "Верхняя одежда", value: "outerwear" },
          { title: "Аксессуары", value: "accessories" },
        ],
      },
    }),
    defineField({
      name: "isNew",
      title: "Новинка",
      type: "boolean",
      description: "Показывает бейдж «New» на карточке товара",
      initialValue: false,
    }),
    defineField({
      name: "isAvailable",
      title: "В наличии",
      type: "boolean",
      description: "Выключите, чтобы скрыть товар из каталога",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Порядок сортировки",
      type: "number",
      description: "Чем меньше число — тем выше в каталоге. 0 = по умолчанию",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "price",
      media: "images.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} ₽` : "",
        media,
      };
    },
  },
});
