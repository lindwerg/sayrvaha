import { sanityFetch } from "@/sanity/client";
import { PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Page, SiteSettings } from "@/sanity/lib/types";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Индивидуальный пошив — BLISS brand",
  description: "Индивидуальный пошив одежды от BLISS brand",
};

export default async function CustomPage() {
  const [page, settings] = await Promise.all([
    sanityFetch<Page>(PAGE_BY_SLUG_QUERY, { slug: "custom" }),
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY),
  ]);

  const telegramUrl = settings?.telegramBotUrl || "https://t.me/bliss_ling";

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">
        {page?.title || "Индивидуальный пошив"}
      </h1>

      {page?.content ? (
        <div className="prose prose-lg max-w-none [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-muted [&_p]:leading-relaxed">
          <PortableText value={page.content} />
        </div>
      ) : (
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
      )}

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
