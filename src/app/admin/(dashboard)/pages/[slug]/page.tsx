import { notFound } from "next/navigation";
import Link from "next/link";
import { getPage } from "@/lib/data";
import { getEditablePage } from "@/lib/pages";
import PageForm from "./PageForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminEditPage({ params }: Props) {
  const { slug } = await params;
  const meta = getEditablePage(slug);
  if (!meta) notFound();

  const page = await getPage(slug);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/pages" className="text-sm text-muted hover:text-foreground">
          ← Все страницы
        </Link>
      </div>
      <h1 className="text-2xl font-serif mb-1">{meta.label}</h1>
      <p className="text-sm text-muted mb-6">
        Публичный адрес: <span className="text-foreground">{meta.path}</span>
      </p>

      <PageForm slug={slug} content={page?.content || ""} />
    </div>
  );
}
