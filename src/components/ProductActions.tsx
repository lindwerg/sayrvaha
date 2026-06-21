"use client";

// Клиентский блок действий на странице товара: выбор размера, размерная сетка,
// кнопка «В корзину» (если корзина включена) и кнопка заказа пошива через Telegram
// (если включена). Видимость корзины — из контекста, Telegram — проп telegramOrderEnabled.

import { useState } from "react";
import AddToCartButton from "./cart/AddToCartButton";
import TelegramOrderButton from "./TelegramOrderButton";
import SizeChartModal from "./SizeChartModal";
import type { Product } from "@/lib/types";

interface ProductActionsProps {
  product: Product;
  telegramOrderEnabled: boolean;
  telegramBotUrl?: string;
  telegramButtonText?: string;
}

export default function ProductActions({
  product,
  telegramOrderEnabled,
  telegramBotUrl,
  telegramButtonText,
}: ProductActionsProps) {
  const sizes = product.sizes ?? [];
  const hasSizes = sizes.length > 0;
  const chart = product.sizeChart ?? [];
  const hasChart = chart.length > 0;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const needsSize = hasSizes && !selectedSize;

  return (
    <div className="flex flex-col gap-5">
      {hasSizes && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium uppercase tracking-wider">Размер</p>
            {hasChart && (
              <button
                type="button"
                onClick={() => setShowChart(true)}
                className="text-xs text-muted underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Размерная сетка
              </button>
            )}
          </div>
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

      {/* Сетка без выбора размеров — отдельная ссылка */}
      {!hasSizes && hasChart && (
        <button
          type="button"
          onClick={() => setShowChart(true)}
          className="self-start text-xs text-muted underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Размерная сетка
        </button>
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
          label={telegramButtonText}
        />
      )}

      {showChart && hasChart && (
        <SizeChartModal rows={chart} onClose={() => setShowChart(false)} />
      )}
    </div>
  );
}
