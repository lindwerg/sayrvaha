import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";
import type { Product } from "@/lib/types";

export default function ProductDetails({
  product,
  telegramBotUrl,
  telegramOrderEnabled = true,
  telegramButtonText,
}: {
  product: Product;
  telegramBotUrl?: string;
  telegramOrderEnabled?: boolean;
  telegramButtonText?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <ProductGallery images={product.images} />

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif mb-2">{product.name}</h1>
          {product.isOnSale && product.oldPrice ? (
            <p className="text-xl font-medium">
              <span className="line-through text-muted text-base mr-2">{product.oldPrice.toLocaleString("ru-RU")} ₽</span>
              <span className="text-red-600">{product.price.toLocaleString("ru-RU")} ₽</span>
            </p>
          ) : (
            <p className="text-xl text-primary font-medium">
              {product.price.toLocaleString("ru-RU")} ₽
            </p>
          )}
        </div>

        <ProductActions
          product={product}
          telegramOrderEnabled={telegramOrderEnabled}
          telegramBotUrl={telegramBotUrl}
          telegramButtonText={telegramButtonText}
        />

        {product.description && (
          <Section title="Описание">{product.description}</Section>
        )}
        {product.composition && (
          <Section title="Состав">{product.composition}</Section>
        )}
        {product.care && <Section title="Уход">{product.care}</Section>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h2 className="text-sm font-medium uppercase tracking-wider mb-3">{title}</h2>
      <p className="text-sm text-muted whitespace-pre-line leading-relaxed">
        {children}
      </p>
    </div>
  );
}
