"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "@/components/ProductGrid";

const TABS = [
  { id: "all", label: "Все" },
  { id: "clothing", label: "Одежда" },
  { id: "lingerie", label: "Нижнее белье" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CategoryTabs({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const filtered = products.filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "lingerie") return p.category === "lingerie";
    return p.category !== "lingerie";
  });

  return (
    <div>
      <div className="flex justify-center gap-8 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-sm uppercase tracking-[0.15em] pb-1 transition-all duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-foreground text-foreground font-medium"
                : "text-muted hover:text-foreground border-b-2 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ProductGrid products={filtered} />
    </div>
  );
}
