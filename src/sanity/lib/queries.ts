import { defineQuery } from "next-sanity";

export const PRODUCTS_QUERY = defineQuery(
  `*[_type == "product" && isAvailable == true] | order(order asc, _createdAt desc) {
    _id,
    name,
    slug,
    price,
    images,
    sizes,
    category,
    isNew,
    isAvailable
  }`
);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    price,
    images,
    sizes,
    description,
    category,
    isNew,
    isAvailable
  }`
);

export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "product" && isAvailable == true && category == $category] | order(order asc) {
    _id,
    name,
    slug,
    price,
    images,
    sizes,
    category,
    isNew,
    isAvailable
  }`
);

export const PAGE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content
  }`
);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0] {
    logo,
    heroImage,
    heroTitle,
    heroQuote,
    telegramBotUrl,
    instagramUrl,
    phone,
    email,
    address
  }`
);
