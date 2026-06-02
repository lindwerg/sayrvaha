import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images: SanityImageSource[];
  sizes: string[];
  description?: string;
  category?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  oldPrice?: number;
  isAvailable?: boolean;
}

export interface Page {
  _id: string;
  title: string;
  slug: { current: string };
  content: PortableTextBlock[];
}

export interface SiteSettings {
  logo?: SanityImageSource;
  heroImage?: SanityImageSource;
  heroTitle?: string;
  heroSubtitle?: string;
  heroQuote?: string;
  telegramBotUrl?: string;
  instagramUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
}
