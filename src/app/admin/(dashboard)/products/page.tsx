import Link from "next/link";
import { getAllProducts } from "@/lib/data";
import SortableProducts from "./SortableProducts";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

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
        <SortableProducts products={products} />
      )}
    </div>
  );
}
