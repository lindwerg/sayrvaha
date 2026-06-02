import { notFound } from "next/navigation";
import { writeClient } from "@/lib/sanity-admin";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

const PRODUCT_QUERY = `*[_type == "product" && _id == $id][0] {
  _id, name, price, description, category, sizes, isNew, isOnSale, oldPrice, isAvailable, order,
  images[] { _type, _key, asset }
}`;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await writeClient.fetch(PRODUCT_QUERY, { id });

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-serif mb-8">Редактирование</h1>
      <ProductForm product={product} />
    </div>
  );
}
