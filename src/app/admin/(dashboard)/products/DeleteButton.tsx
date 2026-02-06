"use client";

import { useRouter } from "next/navigation";
import { deleteProductAction } from "../../actions";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Удалить этот товар?")) return;
    const fd = new FormData();
    fd.set("id", id);
    await deleteProductAction(fd);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-400 hover:text-red-600 transition-colors"
    >
      Удалить
    </button>
  );
}
