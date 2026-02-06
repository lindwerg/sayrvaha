import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Product } from "@/sanity/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0]
    ? urlFor(product.images[0]).width(600).height(800).url()
    : null;

  return (
    <Link
      href={`/catalog/${product.slug.current}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-warm-gray mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            Фото
          </div>
        )}

        {/* Hover overlay */}
        <div className="product-card-overlay absolute inset-0 bg-black/10 flex items-end justify-center pb-6">
          <span className="bg-white text-foreground text-xs uppercase tracking-[0.15em] px-6 py-2.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
            Подробнее
          </span>
        </div>

        {/* New badge */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] px-3 py-1.5 uppercase tracking-[0.15em] font-medium">
            New
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors duration-300">
        {product.name}
      </h3>
      <p className="text-sm text-muted tracking-wide">
        {product.price.toLocaleString("ru-RU")} ₽
      </p>
    </Link>
  );
}
