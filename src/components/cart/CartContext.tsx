"use client";

// Корзина целиком на клиенте: состояние в React Context, персист в localStorage.
// Без внешних библиотек состояния. `enabled` приходит из настроек сайта (тумблер
// в админке) и пробрасывается провайдером, чтобы кнопки/иконку показывать
// без прокидывания пропа через все страницы.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "bliss-cart";
const MAX_QTY = 99;

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  enabled: boolean;
  addItem: (item: CartItem) => void;
  updateQty: (productId: string, size: string | null | undefined, qty: number) => void;
  removeItem: (productId: string, size: string | null | undefined) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// Позиции с одинаковым товаром и размером считаем одной строкой.
function sameLine(a: CartItem, productId: string, size: string | null | undefined): boolean {
  return a.productId === productId && (a.size ?? null) === (size ?? null);
}

function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
}

export function CartProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Загрузка из localStorage один раз на маунте.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      // битый JSON — игнорируем, начинаем с пустой корзины
    }
    setHydrated(true);
  }, []);

  // Сохранение при каждом изменении (после гидрации, чтобы не затереть пустым).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // переполнение/недоступность хранилища — молча пропускаем
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => sameLine(p, item.productId, item.size));
      if (idx === -1) {
        return [...prev, { ...item, qty: clampQty(item.qty || 1) }];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + (item.qty || 1)) };
      return next;
    });
  }, []);

  const updateQty = useCallback(
    (productId: string, size: string | null | undefined, qty: number) => {
      setItems((prev) =>
        prev.map((p) =>
          sameLine(p, productId, size) ? { ...p, qty: clampQty(qty) } : p,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, size: string | null | undefined) => {
      setItems((prev) => prev.filter((p) => !sameLine(p, productId, size)));
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, count, total, enabled, addItem, updateQty, removeItem, clear }),
    [items, count, total, enabled, addItem, updateQty, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
