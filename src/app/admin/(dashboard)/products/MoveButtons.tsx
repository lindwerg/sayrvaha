"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { moveProductAction } from "../../actions";

export default function MoveButtons({
  id,
  isFirst,
  isLast,
}: {
  id: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const move = async (direction: "up" | "down") => {
    setLoading(true);
    await moveProductAction(id, direction);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-0.5 shrink-0">
      <button
        type="button"
        disabled={isFirst || loading}
        onClick={() => move("up")}
        className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        title="Переместить выше"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        disabled={isLast || loading}
        onClick={() => move("down")}
        className="w-7 h-7 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 rounded transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        title="Переместить ниже"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
