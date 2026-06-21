"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { urlFor } from "@/lib/image";
import { createOrderAction } from "@/app/actions/orders";

export default function CartView({ paymentEnabled = false }: { paymentEnabled?: boolean }) {
  const { items, total, updateQty, removeItem, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const result = await createOrderAction({
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
      comment: String(fd.get("comment") || ""),
      company: String(fd.get("company") || ""), // honeypot
      items: items.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty })),
    });

    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    clear();
    if (result.paymentUrl) {
      // Переход на платёжную форму Т-Банка (loading оставляем включённым до ухода со страницы).
      window.location.href = result.paymentUrl;
      return;
    }
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-serif mb-3">Заказ принят 🎉</h2>
        <p className="text-muted mb-8">
          Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 bg-foreground text-white text-sm uppercase tracking-wider hover:bg-foreground/85 transition-colors"
        >
          Продолжить покупки
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-8">Корзина пуста</p>
        <Link
          href="/catalog"
          className="inline-block px-8 py-3 bg-foreground text-white text-sm uppercase tracking-wider hover:bg-foreground/85 transition-colors"
        >
          В каталог
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-white";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
      {/* Список позиций */}
      <ul className="divide-y divide-border">
        {items.map((item) => {
          const img = item.image
            ? urlFor(item.image).width(160).height(213).quality(80).auto("format").url()
            : null;
          return (
            <li key={`${item.productId}-${item.size ?? ""}`} className="flex gap-4 py-4">
              <Link
                href={`/catalog/${item.slug}`}
                className="relative w-20 h-[107px] shrink-0 bg-warm-gray overflow-hidden"
              >
                {img && (
                  <Image src={img} alt={item.name} fill className="object-cover" sizes="80px" />
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/catalog/${item.slug}`} className="text-sm font-medium hover:text-primary">
                  {item.name}
                </Link>
                {item.size && <p className="text-xs text-muted mt-1">Размер: {item.size}</p>}
                <p className="text-sm mt-1">{item.price.toLocaleString("ru-RU")} ₽</p>

                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                      className="px-3 py-1 text-lg leading-none hover:bg-warm-gray disabled:opacity-30"
                      disabled={item.qty <= 1}
                      aria-label="Уменьшить"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm tabular-nums">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                      className="px-3 py-1 text-lg leading-none hover:bg-warm-gray"
                      aria-label="Увеличить"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-xs text-muted hover:text-red-500 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              <div className="text-sm font-medium whitespace-nowrap">
                {(item.price * item.qty).toLocaleString("ru-RU")} ₽
              </div>
            </li>
          );
        })}
      </ul>

      {/* Оформление */}
      <div className="lg:sticky lg:top-24 h-fit border border-border p-6 bg-white">
        <div className="flex justify-between text-base font-medium mb-6">
          <span>Итого</span>
          <span>{total.toLocaleString("ru-RU")} ₽</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 text-sm">{error}</div>}

          <input name="name" placeholder="Имя*" required className={inputClass} />
          <input name="phone" placeholder="Телефон*" required className={inputClass} />
          <input name="address" placeholder="Адрес доставки" className={inputClass} />
          <textarea name="comment" placeholder="Комментарий к заказу" rows={3} className={inputClass} />

          {/* honeypot — скрыт от людей, заполняется ботами */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-white text-sm uppercase tracking-wider hover:bg-foreground/85 transition-colors disabled:opacity-50"
          >
            {loading
              ? paymentEnabled
                ? "Переход к оплате..."
                : "Отправка..."
              : paymentEnabled
                ? "Перейти к оплате"
                : "Оформить заказ"}
          </button>
          <p className="text-xs text-muted text-center">
            {paymentEnabled
              ? "Оплата картой онлайн через Т-Банк. Нажимая кнопку, вы соглашаетесь на обработку данных"
              : "Нажимая «Оформить заказ», вы соглашаетесь на обработку данных"}
          </p>
        </form>
      </div>
    </div>
  );
}
