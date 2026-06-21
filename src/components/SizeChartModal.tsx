"use client";

import { useEffect } from "react";
import type { SizeChartRow } from "@/lib/types";

export default function SizeChartModal({
  rows,
  onClose,
}: {
  rows: SizeChartRow[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Размерная сетка"
    >
      <div
        className="bg-white w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 text-muted hover:text-foreground text-xl leading-none"
        >
          ×
        </button>

        <h2 className="text-lg font-serif mb-4">Размерная сетка</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-2 font-medium">Размер</th>
              <th className="py-2 font-medium">Грудь</th>
              <th className="py-2 font-medium">Талия</th>
              <th className="py-2 font-medium">Бёдра</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.size} className="border-b border-border/60">
                <td className="py-2 font-medium">{row.size}</td>
                <td className="py-2">{row.bust ?? "—"}</td>
                <td className="py-2">{row.waist ?? "—"}</td>
                <td className="py-2">{row.hips ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-muted mt-4">Все замеры в сантиметрах.</p>
      </div>
    </div>
  );
}
