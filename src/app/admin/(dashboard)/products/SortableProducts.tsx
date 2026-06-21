"use client";

// Список товаров с перетаскиванием мышью (dnd-kit). Порядок меняется оптимистично
// (локальный стейт) — без рефлоу и «скачков». На отпускании сохраняем весь порядок
// одним вызовом reorderProductsAction (сплошная перенумерация order=индекс).

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { urlFor } from "@/lib/image";
import { reorderProductsAction } from "../../actions";
import DeleteButton from "./DeleteButton";
import type { Product } from "@/lib/types";

function Row({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 bg-white ${
        isDragging ? "shadow-lg opacity-90" : "hover:bg-warm-gray/50"
      } transition-colors`}
    >
      {/* Ручка перетаскивания */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Перетащить"
        className="shrink-0 text-muted hover:text-foreground cursor-grab active:cursor-grabbing touch-none p-1"
        title="Перетащите, чтобы изменить порядок"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="9" cy="6" r="1.6" />
          <circle cx="15" cy="6" r="1.6" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <circle cx="9" cy="18" r="1.6" />
          <circle cx="15" cy="18" r="1.6" />
        </svg>
      </button>

      {product.images?.[0] ? (
        <Image
          src={urlFor(product.images[0]).width(120).height(120).url()}
          alt={product.name}
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded shrink-0"
        />
      ) : (
        <div className="w-12 h-12 bg-warm-gray rounded shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-muted">
          {product.price?.toLocaleString("ru-RU")} ₽
          {product.sizes?.length ? ` · ${product.sizes.join(", ")}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {product.isNew && (
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded">New</span>
        )}
        {product.isOnSale && (
          <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded">Sale</span>
        )}
        <span
          className={`text-[10px] px-2 py-0.5 rounded ${
            product.isAvailable !== false
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {product.isAvailable !== false ? "Виден" : "Скрыт"}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href={`/admin/products/${product._id}`}
          className="text-sm text-primary hover:underline"
        >
          Изменить
        </Link>
        <DeleteButton id={product._id} />
      </div>
    </div>
  );
}

export default function SortableProducts({ products }: { products: Product[] }) {
  const [items, setItems] = useState(products);
  const [saving, setSaving] = useState(false);

  // Синхронизация с сервером (после удаления/создания товара родитель обновится).
  useEffect(() => {
    setItems(products);
  }, [products]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p._id === active.id);
    const newIndex = items.findIndex((p) => p._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next); // оптимистично
    setSaving(true);
    await reorderProductsAction(next.map((p) => p._id));
    setSaving(false);
  };

  return (
    <>
      <p className="text-xs text-muted mb-3">
        Перетащите товары за значок слева, чтобы изменить порядок на сайте.
        {saving && <span className="ml-2 text-primary">Сохранение…</span>}
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-white shadow-sm">
            {items.map((product) => (
              <Row key={product._id} product={product} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
