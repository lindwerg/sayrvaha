import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "../actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/" className="text-lg font-serif text-primary">
            BLISS brand
          </Link>
          <p className="text-xs text-muted mt-1">Администрирование</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/products"
            className="block px-4 py-2.5 text-sm rounded hover:bg-warm-gray transition-colors"
          >
            Товары
          </Link>
          <Link
            href="/admin/settings"
            className="block px-4 py-2.5 text-sm rounded hover:bg-warm-gray transition-colors"
          >
            Настройки сайта
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            target="_blank"
            className="block text-xs text-muted hover:text-foreground transition-colors"
          >
            Открыть сайт →
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-muted hover:text-red-500 transition-colors"
            >
              Выйти
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 bg-warm-gray min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
