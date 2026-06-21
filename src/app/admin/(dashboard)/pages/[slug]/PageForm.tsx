"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updatePageAction } from "../../../actions";

export default function PageForm({
  slug,
  content,
}: {
  slug: string;
  content: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const fd = new FormData(formRef.current!);
    const result = await updatePageAction(slug, fd);

    if (result && "error" in result && result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}
      {saved && (
        <div className="bg-green-50 text-green-700 px-4 py-3 text-sm">Сохранено</div>
      )}

      <div>
        <label className="block text-sm mb-1.5">Текст страницы</label>
        <textarea
          name="content"
          defaultValue={content}
          rows={18}
          placeholder="Введите текст. Переносы строк и абзацы сохранятся как есть."
          className="w-full border border-border px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-primary transition-colors bg-white font-sans"
        />
        <p className="text-xs text-muted mt-1">
          Обычный текст без разметки. Пустое поле — на сайте показывается стандартный текст.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}
