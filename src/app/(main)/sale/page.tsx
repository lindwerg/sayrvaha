import { sanityFetch } from "@/sanity/client";
import { SALE_PRODUCTS_QUERY } from "@/sanity/lib/queries";
import type { Product } from "@/sanity/lib/types";
import ProductGrid from "@/components/ProductGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sale — BLISS brand",
  description: "Товары со скидкой BLISS brand",
};

export default async function SalePage() {
  const products = await sanityFetch<Product[]>(SALE_PRODUCTS_QUERY, undefined, ["products"]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">Sale</h1>
      {products?.length ? (
        <ProductGrid products={products} />
      ) : (
        <p className="text-center text-muted py-12">Сейчас акций нет</p>
      )}
    </section>
  );
}
