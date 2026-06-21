import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/data";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Товар не найден — BLISS brand" };
  return {
    title: `${product.name} — BLISS brand`,
    description: product.description || `${product.name} — купить в BLISS brand`,
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return (products || []).map((p) => ({ slug: p.slug.current }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) notFound();

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <ProductDetails
        product={product}
        telegramBotUrl={settings?.telegramBotUrl}
        telegramOrderEnabled={settings?.telegramOrderEnabled ?? true}
      />
    </section>
  );
}
