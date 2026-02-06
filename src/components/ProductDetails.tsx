"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import SizeSelector from "./SizeSelector";
import TelegramOrderButton from "./TelegramOrderButton";
import type { Product } from "@/sanity/lib/types";

export default function ProductDetails({
  product,
  telegramBotUrl,
}: {
  product: Product;
  telegramBotUrl?: string;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <ProductGallery images={product.images} />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">{product.name}</h1>
          <p className="text-xl text-primary font-medium">
            {product.price.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        <SizeSelector
          sizes={product.sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />

        <TelegramOrderButton
          productName={product.name}
          selectedSize={selectedSize}
          telegramBotUrl={telegramBotUrl}
        />

        {product.description && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-3">
              Описание
            </h2>
            <p className="text-sm text-muted whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
