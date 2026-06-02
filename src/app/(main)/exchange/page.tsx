import { getPage } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Возврат — BLISS brand",
  description: "Условия возврата товаров BLISS brand",
};

export default async function ExchangePage() {
  const page = await getPage("exchange");

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-serif text-center mb-10">
        {page?.title || "Возврат"}
      </h1>

      {page?.content ? (
        <div className="prose prose-lg max-w-none [&_h2]:font-serif [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-muted [&_p]:leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      ) : (
        <div className="text-muted space-y-6 leading-relaxed">
          <h2 className="text-xl font-serif text-foreground">Как оформить возврат или обмен?</h2>
          <p>
            Если вам не подошли один или несколько товаров, вы можете их обменять или вернуть
            в течение 7 дней с момента получения заказа, при условии, что товар не использовался,
            сохранена пломба и товарный вид. Это очень просто:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Напишите нам в{" "}
              <a
                href="https://t.me/bliss_ling"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                телеграм @bliss_ling
              </a>{" "}
              и сообщите, что хотите вернуть или обменять и по какой причине — мы обсудим детали.
            </li>
            <li>Оплата доставки происходит за счёт покупателя.</li>
            <li>Тщательно упакуйте товар, используя фирменную упаковку.</li>
            <li>
              После того, как товары приедут к нам, мы проверим их состояние и вернём деньги
              за покупку / обменяем.
            </li>
          </ol>
          <p>
            Если в процессе возврата или обмена у вас появятся вопросы, будем рады ответить
            на них в{" "}
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

          <h2 className="text-xl font-serif text-foreground mt-8">Товар ненадлежащего качества</h2>
          <p>
            В маловероятном случае, если вы получили товар ненадлежащего качества, свяжитесь
            с нами в{" "}
            <a
              href="https://t.me/bliss_ling"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              телеграм @bliss_ling
            </a>
            , чтобы мы могли как можно скорее исправить эту проблему. Под товаром ненадлежащего
            качества подразумевается товар, который неисправен или имеет дефект, исключающий
            обеспечение функциональных качеств и потребительских свойств.
          </p>
        </div>
      )}
    </section>
  );
}
