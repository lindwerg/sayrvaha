import { sanityFetch } from "@/sanity/client";
import { PRODUCTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { Product, SiteSettings } from "@/sanity/lib/types";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import ScrollReveal from "@/components/ScrollReveal";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    sanityFetch<Product[]>(PRODUCTS_QUERY, undefined, ["products"]),
    sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, undefined, ["settings"]),
  ]);

  return (
    <>
      <Hero heroImage={settings?.heroImage} heroTitle={settings?.heroTitle} />

      {/* Brand philosophy section */}
      {settings?.heroQuote && (
        <ScrollReveal>
          <section className="bg-cream py-20 md:py-28">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <p className="text-lg md:text-xl font-serif text-foreground/80 leading-relaxed italic">
                &laquo;{settings.heroQuote}&raquo;
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Catalog section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif">
              Каталог
            </h2>
          </div>
        </ScrollReveal>
        <ProductGrid products={products || []} />
      </section>
    </>
  );
}
