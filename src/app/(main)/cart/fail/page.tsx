import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Оплата не прошла — BLISS brand",
};

export default function PaymentFailPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-serif mb-3">Оплата не прошла</h1>
      <p className="text-muted mb-8">
        Платёж был отклонён или отменён. Деньги не списаны — попробуйте оформить
        заказ ещё раз или свяжитесь с нами.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/cart"
          className="inline-block px-8 py-3 bg-foreground text-white text-sm uppercase tracking-wider hover:bg-foreground/85 transition-colors"
        >
          Повторить оплату
        </Link>
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 border border-border text-sm uppercase tracking-wider hover:bg-warm-gray transition-colors"
        >
          В каталог
        </Link>
      </div>
    </section>
  );
}
