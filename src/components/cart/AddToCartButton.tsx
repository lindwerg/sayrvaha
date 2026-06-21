"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  size?: string | null;
  variant?: "full" | "compact";
  className?: string;
  disabled?: boolean;
  disabledLabel?: string;
}

// Кнопка добавления в корзину. Рендерится только при включённой корзине
// (флаг из контекста). На карточках используется compact-вариант без размера.
export default function AddToCartButton({
  product,
  size = null,
  variant = "full",
  className = "",
  disabled = false,
  disabledLabel = "В корзину",
}: AddToCartButtonProps) {
  const { enabled, addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!enabled) return null;

  const handleAdd = (e: React.MouseEvent) => {
    // На карточке кнопка лежит внутри ссылки — гасим переход.
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug.current,
      image: product.images?.[0],
      size: size ?? null,
      price: product.price,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className={`w-full py-2.5 bg-white text-foreground border border-foreground/15 text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-foreground ${className}`}
      >
        {disabled ? disabledLabel : added ? "Добавлено ✓" : "В корзину"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className={`w-full py-4 bg-foreground text-white font-medium uppercase tracking-wider hover:bg-foreground/85 transition-colors disabled:opacity-40 disabled:hover:bg-foreground ${className}`}
    >
      {disabled ? disabledLabel : added ? "Добавлено в корзину ✓" : "В корзину"}
    </button>
  );
}
