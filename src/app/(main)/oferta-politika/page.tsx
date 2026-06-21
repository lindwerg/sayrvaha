import { getPagesBySlugs, getSiteSettings } from "@/lib/data";
import PageContent from "@/components/PageContent";
import IpRequisites from "@/components/IpRequisites";
import type { Metadata } from "next";

// Динамический рендер: страница всегда читает актуальный текст из БД (правки админки).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Оферта и политика — BLISS brand",
  description: "Публичная оферта и политика конфиденциальности BLISS brand",
};

export default async function OfertaPolitikaPage() {
  const [pages, settings] = await Promise.all([
    getPagesBySlugs(["offer", "privacy"]),
    getSiteSettings(),
  ]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-12">
        Оферта и политика
      </h1>

      <div id="oferta" className="scroll-mt-24 mb-14">
        <h2 className="text-2xl font-serif mb-5">Публичная оферта</h2>
        <PageContent
          text={pages.offer?.content}
          fallback={
            <p className="text-muted leading-relaxed">
              Текст публичной оферты пока не заполнен.
            </p>
          }
        />
      </div>

      <div id="politika" className="scroll-mt-24 mb-14">
        <h2 className="text-2xl font-serif mb-5">Политика конфиденциальности</h2>
        <PageContent
          text={pages.privacy?.content}
          fallback={
            <p className="text-muted leading-relaxed">
              Текст политики конфиденциальности пока не заполнен.
            </p>
          }
        />
      </div>

      <IpRequisites
        settings={settings}
        variant="block"
        className="border-t border-border pt-8 space-y-1"
      />
    </section>
  );
}
