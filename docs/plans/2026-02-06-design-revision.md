# Дизайн-ревизия BLISS brand — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Убрать избыточные декоративные элементы (сердечки, BrandDivider, лишний BrandLogo), упростить футер, сделать Sanity Studio удобным для администратора, проверить цветовую палитру (белый + бордовый).

**Architecture:** Точечные правки существующих компонентов без создания новых файлов. Удаление BrandDivider из Hero, главной страницы и Footer. Удаление BrandLogo из Footer (остаётся только в Header). Настройка Sanity Structure Builder для удобной CMS-панели с русскоязычным интерфейсом.

**Tech Stack:** Next.js 16, React 19, Sanity v5, Tailwind 4, TypeScript

---

## Карта изменений

### Где сейчас используются сердечки/BrandDivider/BrandLogo:

| Место | Компонент | Что убрать |
|-------|-----------|------------|
| Header (лого слева) | `BrandLogo` | **Оставить** — единственный логотип |
| Hero баннер | `BrandDivider` (линия—сердце—линия над заголовком) | **Убрать** |
| Главная: секция «философия» | 2× `BrandDivider` (сверху и снизу цитаты) | **Убрать оба** |
| Главная: секция «каталог» | `BrandDivider` (под заголовком) | **Убрать** |
| Footer: верх | `BrandLogo` + `BrandDivider` | **Убрать оба** |

---

### Task 1: Убрать BrandDivider из Hero

**Files:**
- Modify: `src/components/Hero.tsx:1-5` (убрать import)
- Modify: `src/components/Hero.tsx:32-35` (убрать JSX блок с BrandDivider)

**Step 1: Удалить import BrandDivider**

В `src/components/Hero.tsx` удалить строку:
```typescript
import BrandDivider from "./BrandDivider";
```

**Step 2: Удалить JSX блок BrandDivider**

В `src/components/Hero.tsx` удалить блок:
```tsx
{/* Decorative divider above title */}
<div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
  <BrandDivider color="rgba(255,255,255,0.7)" className="mb-6" />
</div>
```

**Step 3: Проверить визуально**

Run: `npm run dev` (если не запущен)
Открыть `http://localhost:3000`, убедиться что Hero-баннер отображает заголовок и CTA без сердечка-разделителя сверху.

**Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "fix: remove BrandDivider from Hero section"
```

---

### Task 2: Убрать BrandDivider из главной страницы (философия + каталог)

**Files:**
- Modify: `src/app/(main)/page.tsx:6` (убрать import BrandDivider)
- Modify: `src/app/(main)/page.tsx:23-29` (секция философии — убрать 2 BrandDivider)
- Modify: `src/app/(main)/page.tsx:40` (секция каталог — убрать BrandDivider)

**Step 1: Удалить import BrandDivider**

В `src/app/(main)/page.tsx` удалить строку:
```typescript
import BrandDivider from "@/components/BrandDivider";
```

**Step 2: Убрать BrandDivider из секции философии**

Заменить:
```tsx
<BrandDivider className="mb-8" />
<p className="text-lg md:text-xl font-serif text-foreground/80 leading-relaxed italic">
  &laquo;Мы создаём одежду для женщин, которые ценят качество,
  комфорт и элегантность в каждой детали&raquo;
</p>
<BrandDivider className="mt-8" />
```

На:
```tsx
<p className="text-lg md:text-xl font-serif text-foreground/80 leading-relaxed italic">
  &laquo;Мы создаём одежду для женщин, которые ценят качество,
  комфорт и элегантность в каждой детали&raquo;
</p>
```

**Step 3: Убрать BrandDivider из секции каталога**

Заменить:
```tsx
<div className="text-center mb-12">
  <h2 className="text-2xl md:text-3xl font-serif mb-4">
    Каталог
  </h2>
  <BrandDivider />
</div>
```

На:
```tsx
<div className="text-center mb-12">
  <h2 className="text-2xl md:text-3xl font-serif">
    Каталог
  </h2>
</div>
```

**Step 4: Проверить визуально**

Открыть `http://localhost:3000`, убедиться:
- Секция «философия» содержит только цитату без линий с сердечком
- Секция «каталог» содержит только заголовок без разделителя

**Step 5: Commit**

```bash
git add src/app/\(main\)/page.tsx
git commit -m "fix: remove BrandDivider from home page philosophy and catalog sections"
```

---

### Task 3: Убрать BrandLogo и BrandDivider из Footer

**Files:**
- Modify: `src/components/Footer.tsx:2-3` (убрать imports)
- Modify: `src/components/Footer.tsx:9-15` (убрать блок с Logo + Divider)

**Step 1: Удалить imports BrandLogo и BrandDivider**

В `src/components/Footer.tsx` удалить:
```typescript
import BrandLogo from "./BrandLogo";
import BrandDivider from "./BrandDivider";
```

**Step 2: Удалить блок «Top: Logo + divider»**

Удалить весь блок:
```tsx
{/* Top: Logo + divider */}
<div className="text-center mb-10">
  <div className="flex justify-center mb-4">
    <BrandLogo size="sm" color="rgba(255,255,255,0.9)" />
  </div>
  <BrandDivider color="rgba(255,255,255,0.25)" />
</div>
```

**Step 3: Проверить визуально**

Прокрутить до футера на `http://localhost:3000`, убедиться что логотип и разделитель удалены, остались только 3 колонки (слоган, навигация, контакты) + копирайт.

**Step 4: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "fix: remove BrandLogo and BrandDivider from Footer"
```

---

### Task 4: Ревизия цветовой палитры — белый + бордовый

**Files:**
- Review: `src/app/globals.css` (CSS variables)
- Potentially modify: `src/app/globals.css` (если найдутся лишние цвета)

Текущая палитра:
```css
--color-background: #ffffff       /* белый — ОК */
--color-foreground: #1A1A1A       /* почти чёрный для текста — ОК */
--color-primary: #722F37          /* бордовый — ОК */
--color-primary-light: #8B3A42    /* светлый бордовый — ОК */
--color-primary-dark: #5C262D     /* тёмный бордовый — ОК */
--color-muted: #6B7280            /* серый для вторичного текста — ОК */
--color-border: #E5E7EB           /* серый для границ — ОК */
--color-cream: #FAF7F5            /* кремовый для секции философии — ОК */
--color-warm-gray: #F5F0ED        /* тёплый серый для placeholder — ОК */
```

**Step 1: Проверить палитру**

Визуально проверить, что на сайте используются только белый, бордовый и нейтральные серые тона. Никаких ярких/посторонних цветов быть не должно.

Основной бордовый `#722F37` — классический тёмный бордовый, соответствует бренд-палитре BLISS. Фоновые цвета `cream` и `warm-gray` — нейтральные тёплые оттенки, гармонируют с бордовым.

**Step 2: Проверить Footer bg-color**

Footer использует `bg-foreground` (#1A1A1A) — тёмный фон, контраст с белым текстом. Это стандартный паттерн, оставить.

**Step 3: Зафиксировать результат — палитра корректна**

Если палитра соответствует ожиданиям — никаких изменений не требуется.
Если нужно скорректировать конкретный оттенок бордового — изменить `--color-primary` в `globals.css`.

**Step 4: Commit (только если были изменения)**

```bash
git add src/app/globals.css
git commit -m "style: adjust color palette to match brand requirements"
```

---

### Task 5: Настроить Sanity Studio для удобства администратора

**Files:**
- Modify: `sanity.config.ts` (добавить Structure Builder с русскоязычным меню)
- Modify: `src/sanity/schemas/product.ts` (улучшить fieldGroup + description для полей)
- Modify: `src/sanity/schemas/siteSettings.ts` (добавить fieldGroups + descriptions)

**Step 1: Добавить Structure Builder в sanity.config.ts**

Заменить содержимое `sanity.config.ts`:
```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const singletonTypes = new Set(["siteSettings"]);

export default defineConfig({
  name: "bliss-brand",
  title: "BLISS brand",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Панель управления")
          .items([
            S.listItem()
              .title("Товары")
              .schemaType("product")
              .child(S.documentTypeList("product").title("Все товары")),
            S.divider(),
            S.listItem()
              .title("Страницы")
              .schemaType("page")
              .child(S.documentTypeList("page").title("Все страницы")),
            S.divider(),
            S.listItem()
              .title("Настройки сайта")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Настройки сайта")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : input,
  },
});
```

Что это даёт администратору:
- Чёткое меню: «Товары», «Страницы», «Настройки сайта»
- Настройки сайта — singleton (нельзя создать второй, нельзя удалить)
- Русские названия в боковом меню

**Step 2: Проверить Sanity Studio**

Открыть `http://localhost:3000/studio`, убедиться:
- Боковое меню показывает: Товары | Страницы | Настройки сайта
- Клик по «Товары» открывает список товаров
- Клик по «Настройки сайта» открывает одну карточку настроек (не список)

**Step 3: Добавить description к полям product.ts**

В `src/sanity/schemas/product.ts` добавить `description` к полям, чтобы администратору было понятно что заполнять:

Для поля `slug`:
```typescript
defineField({
  name: "slug",
  title: "URL",
  type: "slug",
  options: { source: "name", maxLength: 96 },
  validation: (rule) => rule.required(),
  description: "Нажмите Generate — создастся автоматически из названия",
}),
```

Для поля `images`:
```typescript
defineField({
  name: "images",
  title: "Фото",
  type: "array",
  of: [{ type: "image", options: { hotspot: true } }],
  validation: (rule) => rule.required().min(1),
  description: "Первое фото — главное в каталоге. Рекомендуем 3:4 формат",
}),
```

Для поля `sizes`:
```typescript
defineField({
  name: "sizes",
  title: "Размеры",
  type: "array",
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
  description: "Выберите размеры, которые есть в наличии",
}),
```

Для поля `order`:
```typescript
defineField({
  name: "order",
  title: "Порядок сортировки",
  type: "number",
  initialValue: 0,
  description: "Чем меньше число — тем выше в каталоге. 0 = по умолчанию",
}),
```

Для поля `isNew`:
```typescript
defineField({
  name: "isNew",
  title: "Новинка",
  type: "boolean",
  initialValue: false,
  description: "Показывает бейдж «New» на карточке товара",
}),
```

Для поля `isAvailable`:
```typescript
defineField({
  name: "isAvailable",
  title: "В наличии",
  type: "boolean",
  initialValue: true,
  description: "Выключите, чтобы скрыть товар из каталога",
}),
```

**Step 4: Добавить description к полям siteSettings.ts**

В `src/sanity/schemas/siteSettings.ts` добавить description:

Для `heroImage`:
```typescript
description: "Фото для главного баннера. Рекомендуемый размер: 1920×1080",
```

Для `heroTitle`:
```typescript
description: "Текст поверх главного баннера. Например: BLISS brand",
```

Для `telegramBotUrl`:
```typescript
description: "Ссылка на бота для заказов. Например: https://t.me/bliss_brand_bot",
```

**Step 5: Проверить Sanity Studio**

Открыть `http://localhost:3000/studio`, перейти в «Товары» → создать новый:
- Убедиться что под каждым полем есть подсказка
- Убедиться что URL генерируется кнопкой «Generate»
- Убедиться что фото загружаются drag-n-drop

**Step 6: Commit**

```bash
git add sanity.config.ts src/sanity/schemas/product.ts src/sanity/schemas/siteSettings.ts
git commit -m "feat: configure Sanity Studio with Russian UI and field descriptions"
```

---

### Task 6: Проверить что BrandDivider.tsx и BrandLogo.tsx больше не orphaned

**Files:**
- Check: `src/components/BrandDivider.tsx` — используется ли где-то ещё?
- Check: `src/components/BrandLogo.tsx` — используется в Header.tsx (оставить)

**Step 1: Проверить импорты BrandDivider**

Run: `grep -r "BrandDivider" src/ --include="*.tsx" --include="*.ts"`

Если BrandDivider нигде не импортируется (после задач 1-3), удалить файл:
```bash
rm src/components/BrandDivider.tsx
```

**Step 2: Проверить импорты BrandLogo**

Run: `grep -r "BrandLogo" src/ --include="*.tsx" --include="*.ts"`

BrandLogo должен использоваться только в `Header.tsx` — оставить.

**Step 3: Commit**

```bash
git rm src/components/BrandDivider.tsx
git commit -m "chore: remove unused BrandDivider component"
```

---

### Task 7: Финальная визуальная проверка

**Step 1: Проверить все страницы**

Пройти по всем роутам:
- `/` — главная: Hero без сердечка, философия без разделителей, каталог без разделителя
- `/catalog` — каталог: без сердечек
- `/catalog/[slug]` — товар: галерея + размеры + кнопка заказа
- `/contacts` — контакты
- `/custom` — индивидуальный пошив
- `/exchange` — обмен и возврат
- Footer на каждой странице: без логотипа и разделителя

**Step 2: Проверить Sanity Studio**

- `/studio` — боковое меню: Товары, Страницы, Настройки сайта
- Создание товара — подсказки под полями
- Настройки сайта — singleton документ

**Step 3: Проверить мобильную версию**

Открыть DevTools → мобильный вид, пройтись по страницам:
- Header: логотип + бургер-меню
- Footer: 1 колонка без логотипа
- Каталог: 2 колонки

**Step 4: Финальный commit**

Если нашлись мелкие правки — закоммитить.

---

## Резюме задач

| # | Задача | Файлы | Время |
|---|--------|-------|-------|
| 1 | Убрать BrandDivider из Hero | `Hero.tsx` | 2 мин |
| 2 | Убрать BrandDivider из главной (философия + каталог) | `page.tsx` | 3 мин |
| 3 | Убрать BrandLogo + BrandDivider из Footer | `Footer.tsx` | 2 мин |
| 4 | Ревизия цветов (белый + бордовый) | `globals.css` | 2 мин |
| 5 | Настроить Sanity Studio для администратора | `sanity.config.ts`, `product.ts`, `siteSettings.ts` | 5 мин |
| 6 | Удалить неиспользуемый BrandDivider.tsx | `BrandDivider.tsx` | 1 мин |
| 7 | Финальная визуальная проверка | все страницы | 3 мин |
