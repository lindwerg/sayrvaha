"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { createProductAction, updateProductAction } from "../../actions";

interface ProductImage {
  _type: string;
  _key: string;
  asset: { _type: string; _ref: string };
}

interface ProductData {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  sizes?: string[];
  isNew?: boolean;
  isOnSale?: boolean;
  oldPrice?: number;
  isAvailable?: boolean;
  order?: number;
  images?: ProductImage[];
}

const CATEGORIES = [
  { value: "", label: "Без категории" },
  { value: "dresses", label: "Платья" },
  { value: "tops", label: "Топы" },
  { value: "skirts", label: "Юбки" },
  { value: "pants", label: "Брюки" },
  { value: "suits", label: "Костюмы" },
  { value: "outerwear", label: "Верхняя одежда" },
  { value: "accessories", label: "Аксессуары" },
  { value: "lingerie", label: "Нижнее белье" },
  { value: "homewear", label: "Одежда для дома" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductForm({ product }: { product?: ProductData }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [keptImages, setKeptImages] = useState<ProductImage[]>(
    product?.images || [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showOldPrice, setShowOldPrice] = useState(product?.isOnSale ?? false);

  const removeExisting = (key: string) => {
    setKeptImages((imgs) => imgs.filter((img) => img._key !== key));
  };

  const removeNew = (index: number) => {
    setNewFiles((f) => f.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles((f) => [...f, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setPreviews((p) => [...p, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(formRef.current!);

    keptImages.forEach((img) => fd.append("existingImages", JSON.stringify(img)));
    newFiles.forEach((file) => fd.append("newImages", file));

    const result = product
      ? await updateProductAction(product._id, fd)
      : await createProductAction(fd);

    if (result && "error" in result && result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  };

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-white";

  return (
    <form key={product?._id || 'new'} ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Название *</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Цена (₽) *</label>
        <input
          name="price"
          type="number"
          min="0"
          defaultValue={product?.price}
          required
          className={inputClass}
        />
      </div>
      <input type="hidden" name="order" value={product?.order || 0} />

      <div>
        <label className="block text-sm font-medium mb-1.5">Категория</label>
        <select
          name="category"
          defaultValue={product?.category || ""}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Размеры</label>
        <div className="flex gap-3">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                defaultChecked={product?.sizes?.includes(size)}
                className="accent-primary"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Описание</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={product?.description}
          className={inputClass}
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={product?.isAvailable ?? true}
            className="accent-primary"
          />
          В наличии (виден в каталоге)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isNew"
            defaultChecked={product?.isNew}
            className="accent-primary"
          />
          Новинка
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isOnSale"
            defaultChecked={product?.isOnSale}
            className="accent-primary"
            onChange={(e) => setShowOldPrice(e.target.checked)}
          />
          Акция (Sale)
        </label>
      </div>

      {showOldPrice && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Старая цена (₽)</label>
          <input
            name="oldPrice"
            type="number"
            min="0"
            defaultValue={product?.oldPrice}
            className={inputClass}
          />
          <p className="text-xs text-muted mt-1">Цена до скидки. Текущая цена станет ценой со скидкой</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Фото *</label>

        <div className="flex gap-3 flex-wrap mb-3">
          {keptImages.map((img) => (
            <div key={img._key} className="relative group">
              <Image
                src={urlFor(img).width(200).height(260).url()}
                alt=""
                width={100}
                height={130}
                className="w-[100px] h-[130px] object-cover rounded border border-border"
              />
              <button
                type="button"
                onClick={() => removeExisting(img._key)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full"
              >
                ×
              </button>
            </div>
          ))}

          {previews.map((src, i) => (
            <div key={`new-${i}`} className="relative group">
              <img
                src={src}
                alt=""
                className="w-[100px] h-[130px] object-cover rounded border border-primary border-dashed"
              />
              <button
                type="button"
                onClick={() => removeNew(i)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:border file:border-border file:bg-white file:text-sm file:text-foreground file:cursor-pointer hover:file:bg-warm-gray"
        />
        <p className="text-xs text-muted mt-1">
          Первое фото — главное в каталоге. Формат 3:4
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading
            ? "Сохранение..."
            : product
              ? "Сохранить"
              : "Создать товар"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 text-sm text-muted border border-border hover:bg-white transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
