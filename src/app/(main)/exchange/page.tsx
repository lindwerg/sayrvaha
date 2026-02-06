import { sanityFetch } from "@/sanity/client";
import { PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import type { Page } from "@/sanity/lib/types";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обмен и возврат — BLISS brand",
  description: "Условия обмена и возврата товаров BLISS brand",
};

export default async function ExchangePage() {
  const page = await sanityFetch<Page>(PAGE_BY_SLUG_QUERY, { slug: "exchange" });

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">
        {page?.title || "Обмен и возврат"}
      </h1>

      {page?.content ? (
        <div className="prose prose-lg max-w-none [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-muted [&_p]:leading-relaxed">
          <PortableText value={page.content} />
        </div>
      ) : (
        <div className="text-muted space-y-6 leading-relaxed">
          <p>
            Мы хотим, чтобы вы остались довольны покупкой. Если вещь не подошла, вы можете
            обменять или вернуть её в течение 14 дней с момента получения.
          </p>
          <h2 className="text-xl font-serif text-foreground mt-8">Условия возврата</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Товар не был в употреблении</li>
            <li>Сохранены все бирки и ярлыки</li>
            <li>Сохранена оригинальная упаковка</li>
            <li>Товар не имеет следов носки, запахов парфюма</li>
          </ul>
          <h2 className="text-xl font-serif text-foreground mt-8">Как вернуть</h2>
          <p>
            Напишите нам в{" "}
            <a
              href="https://t.me/bliss_brand_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Telegram
            </a>{" "}
            — мы поможем оформить возврат или обмен.
          </p>
        </div>
      )}
    </section>
  );
}
