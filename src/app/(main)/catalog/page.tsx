import { sanityFetch } from "@/sanity/client";
import { PRODUCTS_QUERY } from "@/sanity/lib/queries";
import type { Product } from "@/sanity/lib/types";
import CategoryTabs from "@/components/CategoryTabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог — BLISS brand",
  description: "Каталог женской одежды BLISS brand",
};

export default async function CatalogPage() {
  const products = await sanityFetch<Product[]>(PRODUCTS_QUERY, undefined, ["products"]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">Каталог</h1>
      <CategoryTabs products={products || []} />
    </section>
  );
}
