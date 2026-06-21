"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatusAction } from "@/app/actions/orders";

const STATUSES: { value: string; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "processing", label: "В работе" },
  { value: "done", label: "Выполнен" },
  { value: "cancelled", label: "Отменён" },
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setValue(next);
    startTransition(async () => {
      await updateOrderStatusAction(orderId, next);
      router.refresh();
    });
  };

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={pending}
      className="border border-border px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-primary disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
