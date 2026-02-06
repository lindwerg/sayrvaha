import Link from "next/link";
import Image from "next/image";
import { writeClient } from "@/lib/sanity-admin";
import { urlFor } from "@/sanity/image";
import type { Product } from "@/sanity/lib/types";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

const ALL_PRODUCTS = `*[_type == "product"] | order(order asc, _createdAt desc) {
  _id, name, price, images, sizes, isNew, isAvailable, category
}`;

export default async function AdminProductsPage() {
  const products = await writeClient.fetch<Product[]>(ALL_PRODUCTS);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif">Товары</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors"
        >
          + Добавить
        </Link>
      </div>

      {!products?.length ? (
        <div className="bg-white p-12 text-center text-muted">
          <p>Товаров пока нет</p>
          <Link
            href="/admin/products/new"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Добавить первый товар
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-warm-gray/50 transition-colors"
            >
              {product.images?.[0] ? (
                <Image
                  src={urlFor(product.images[0]).width(120).height(120).url()}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded shrink-0"
                />
              ) : (
                <div className="w-12 h-12 bg-warm-gray rounded shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted">
                  {product.price?.toLocaleString("ru-RU")} ₽
                  {product.sizes?.length
                    ? ` · ${product.sizes.join(", ")}`
                    : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {product.isNew && (
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded">
                    New
                  </span>
                )}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded ${
                    product.isAvailable !== false
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {product.isAvailable !== false ? "Виден" : "Скрыт"}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/products/${product._id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Изменить
                </Link>
                <DeleteButton id={product._id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
