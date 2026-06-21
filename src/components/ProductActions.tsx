"use client";

// Клиентский блок действий на странице товара: выбор размера, кнопка «В корзину»
// (если корзина включена) и кнопка «Заказать в Telegram» (если включена).
// Видимость корзины определяется контекстом, Telegram — пропом telegramOrderEnabled.

import { useState } from "react";
import AddToCartButton from "./cart/AddToCartButton";
import TelegramOrderButton from "./TelegramOrderButton";
import type { Product } from "@/lib/types";

interface ProductActionsProps {
  product: Product;
  telegramOrderEnabled: boolean;
  telegramBotUrl?: string;
}

export default function ProductActions({
  product,
  telegramOrderEnabled,
  telegramBotUrl,
}: ProductActionsProps) {
  const sizes = product.sizes ?? [];
  const hasSizes = sizes.length > 0;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const needsSize = hasSizes && !selectedSize;

  return (
    <div className="flex flex-col gap-5">
      {hasSizes && (
        <div>
          <p className="text-sm font-medium uppercase tracking-wider mb-2">Размер</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`min-w-[3rem] px-4 py-2 text-sm border transition-colors ${
                  selectedSize === size
                    ? "border-foreground bg-foreground text-white"
                    : "border-border hover:border-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <AddToCartButton
        product={product}
        size={selectedSize}
        disabled={needsSize}
        disabledLabel="Выберите размер"
      />

      {telegramOrderEnabled && (
        <TelegramOrderButton
          productName={product.name}
          selectedSize={selectedSize}
          telegramBotUrl={telegramBotUrl}
        />
      )}
    </div>
  );
}
