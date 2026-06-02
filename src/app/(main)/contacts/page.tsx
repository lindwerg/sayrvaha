import { sanityFetch } from "@/sanity/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты — BLISS brand",
  description: "Свяжитесь с BLISS brand",
};

export default async function ContactsPage() {
  const settings = await sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, undefined, ["settings"]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">Контакты</h1>

      <div className="space-y-6">
        {settings?.phone && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted mb-1">
              Телефон
            </h2>
            <a href={`tel:${settings.phone}`} className="text-lg hover:text-primary transition-colors">
              {settings.phone}
            </a>
          </div>
        )}

        {settings?.email && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted mb-1">
              Email
            </h2>
            <a href={`mailto:${settings.email}`} className="text-lg hover:text-primary transition-colors">
              {settings.email}
            </a>
          </div>
        )}

        {settings?.telegramBotUrl && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted mb-1">
              Telegram
            </h2>
            <a
              href={settings.telegramBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-primary transition-colors"
            >
              Наша страница в Telegram
            </a>
          </div>
        )}

        {settings?.instagramUrl && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted mb-1">
              Instagram
            </h2>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:text-primary transition-colors"
            >
              @bliss_brand.ru
            </a>
          </div>
        )}

        {settings?.address && (
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted mb-1">
              Адрес
            </h2>
            <p className="text-lg">{settings.address}</p>
          </div>
        )}

        {!settings && (
          <div className="text-center text-muted py-8">
            <p>
              <a
                href="https://instagram.com/bliss_brand.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Instagram: @bliss_brand.ru
              </a>
            </p>
            <p className="mt-2">
              <a
                href="https://t.me/bliss_ling"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Наша страница в Telegram
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
