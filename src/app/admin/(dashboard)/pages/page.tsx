import Link from "next/link";
import { getPagesBySlugs } from "@/lib/data";
import { EDITABLE_PAGES } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const pages = await getPagesBySlugs(EDITABLE_PAGES.map((p) => p.slug));

  return (
    <div>
      <h1 className="text-2xl font-serif mb-2">Страницы</h1>
      <p className="text-sm text-muted mb-8">
        Тексты информационных страниц. Пустая страница показывает встроенный текст по умолчанию.
      </p>

      <div className="bg-white shadow-sm">
        {EDITABLE_PAGES.map((page) => {
          const filled = !!pages[page.slug]?.content?.trim();
          return (
            <div
              key={page.slug}
              className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-warm-gray/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{page.label}</p>
                <p className="text-xs text-muted">{page.path}</p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded ${
                  filled ? "bg-green-50 text-green-700" : "bg-warm-gray text-muted"
                }`}
              >
                {filled ? "Заполнено" : "По умолчанию"}
              </span>
              <Link
                href={`/admin/pages/${page.slug}`}
                className="text-sm text-primary hover:underline shrink-0"
              >
                Редактировать
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
