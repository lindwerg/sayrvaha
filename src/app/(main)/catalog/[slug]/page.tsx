import { sanityFetch } from "@/sanity/client";
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type { Product, SiteSettings } from "@/sanity/lib/types";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await sanityFetch<Product>(PRODUCT_BY_SLUG_QUERY, { slug });
  if (!product) return { title: "Товар не найден — BLISS brand" };
  return {
    title: `${product.name} — BLISS brand`,
    description: product.description || `${product.name} — купить в BLISS brand`,
  };
}

export async function generateStaticParams() {
  const products = await sanityFetch<Product[]>(PRODUCTS_QUERY);
  return (products || []).map((p) => ({ slug: p.slug.current }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    sanityFetch<Product>(PRODUCT_BY_SLUG_QUERY, { slug }),
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
  ]);

  if (!product) notFound();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <ProductDetails product={product} telegramBotUrl={settings?.telegramBotUrl} />
    </section>
  );
}
