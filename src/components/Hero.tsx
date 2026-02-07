import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

interface HeroProps {
  heroImage?: SanityImageSource;
  heroTitle?: string;
}

export default function Hero({ heroImage, heroTitle }: HeroProps) {
  return (
    <section className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-gray-100">
      {heroImage ? (
        <Image
          src={urlFor(heroImage).width(1920).quality(85).auto("format").url()}
          alt="BLISS brand"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cream to-primary/5" />
      )}

      {/* Gradient overlay — soft vignette for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-black/5" />

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-wide mb-3 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {heroTitle || "BLISS brand"}
        </h1>

        <p
          className="text-base sm:text-lg md:text-xl mb-10 tracking-widest font-light italic opacity-90 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          Wear what makes you feel truly you.
        </p>

        <Link
          href="/catalog"
          className="group relative border border-white/80 px-10 py-4 text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-foreground transition-all duration-500 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <span className="relative z-10">Смотреть каталог</span>
        </Link>
      </div>

    </section>
  );
}
