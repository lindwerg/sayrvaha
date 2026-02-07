import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Доставка — BLISS brand",
  description: "Условия доставки товаров BLISS brand",
};

export default function DeliveryPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">
        Доставка
      </h1>

      <div className="text-muted space-y-6 leading-relaxed">
        <p>
          Доставка осуществляется по всей России. Доставка товаров происходит
          за счёт покупателя и её стоимость рассчитывается службой СДЭК.
        </p>
        <p>
          На любые вопросы, касающиеся доставки, мы с удовольствием ответим в{" "}
          <a
            href="https://t.me/bliss_ling"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            телеграм @bliss_ling
          </a>
          .
        </p>
      </div>
    </section>
  );
}
