import { getPage, getSiteSettings } from "@/lib/data";
import PageContent from "@/components/PageContent";
import type { Metadata } from "next";

// Динамический рендер: страница всегда читает актуальный текст из БД (правки админки).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Индивидуальный пошив — BLISS brand",
  description: "Индивидуальный пошив одежды от BLISS brand",
};

export default async function CustomPage() {
  const [page, settings] = await Promise.all([
    getPage("custom"),
    getSiteSettings(),
  ]);

  const telegramUrl = settings?.telegramBotUrl || "https://t.me/bliss_ling";

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">
        {page?.title || "Индивидуальный пошив"}
      </h1>

      <PageContent
        text={page?.content}
        fallback={
          <div className="text-muted space-y-6 leading-relaxed">
            <p>
              Мы создаём одежду, которая идеально сидит именно на вас.
              Индивидуальный пошив — это возможность получить вещь мечты,
              сшитую по вашим меркам.
            </p>
            <h2 className="text-xl font-serif text-foreground mt-8">Как это работает</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Вы пишете нам и описываете желаемую вещь</li>
              <li>Мы обсуждаем детали: ткань, фасон, цвет</li>
              <li>Снимаем мерки (онлайн или в шоуруме)</li>
              <li>Создаём вашу уникальную вещь</li>
            </ol>
          </div>
        }
      />

      <div className="mt-12 text-center">
        <a
          href={`${telegramUrl}?text=${encodeURIComponent("Здравствуйте! Интересует индивидуальный пошив")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-10 py-4 uppercase tracking-widest text-sm hover:bg-primary-dark transition-colors"
        >
          Написать нам
        </a>
      </div>
    </section>
  );
}
