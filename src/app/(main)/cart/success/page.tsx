import Link from "next/link";
import { confirmOrderPayment } from "@/app/actions/orders";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Оплата заказа — BLISS brand",
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  const paymentStatus = order
    ? (await confirmOrderPayment(order)).paymentStatus
    : "none";

  const isPaid = paymentStatus === "paid";

  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      {isPaid ? (
        <>
          <h1 className="text-2xl font-serif mb-3">Оплата прошла 🎉</h1>
          <p className="text-muted mb-8">
            Спасибо за заказ! Мы свяжемся с вами для подтверждения деталей доставки.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-serif mb-3">Платёж обрабатывается</h1>
          <p className="text-muted mb-8">
            Заказ принят. Как только банк подтвердит оплату, мы свяжемся с вами.
            Если средства списались, статус обновится автоматически.
          </p>
        </>
      )}
      <Link
        href="/catalog"
        className="inline-block px-8 py-3 bg-foreground text-white text-sm uppercase tracking-wider hover:bg-foreground/85 transition-colors"
      >
        Продолжить покупки
      </Link>
    </section>
  );
}
