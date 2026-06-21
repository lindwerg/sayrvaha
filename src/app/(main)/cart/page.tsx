import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import CartView from "./CartView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Корзина — BLISS brand",
};

export default async function CartPage() {
  const settings = await getSiteSettings();

  if (!settings?.cartEnabled) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif mb-4">Корзина недоступна</h1>
        <p className="text-muted mb-8">
          Оформление заказа через корзину сейчас отключено.
        </p>
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 bg-foreground text-white text-sm uppercase tracking-wider hover:bg-foreground/85 transition-colors"
        >
          В каталог
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-serif mb-8">Корзина</h1>
      <CartView />
    </section>
  );
}
