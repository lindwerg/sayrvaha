"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateSettingsAction } from "../../actions";

interface SettingsData {
  heroTitle?: string;
  telegramBotUrl?: string;
  instagramUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  heroImage?: { asset?: { _id: string; url: string } };
}

export default function SettingsForm({
  settings,
}: {
  settings: SettingsData | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const fd = new FormData(formRef.current!);
    const result = await updateSettingsAction(fd);

    if (result && "error" in result && result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors bg-white";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
      )}
      {saved && (
        <div className="bg-green-50 text-green-700 px-4 py-3 text-sm">
          Сохранено
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium uppercase tracking-wider text-muted mb-2">
          Главный баннер
        </legend>

        <div>
          <label className="block text-sm mb-1.5">Заголовок</label>
          <input
            name="heroTitle"
            defaultValue={settings?.heroTitle}
            placeholder="BLISS brand"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Фото баннера</label>
          {settings?.heroImage?.asset?.url && (
            <img
              src={settings.heroImage.asset.url}
              alt="Hero"
              className="w-48 h-28 object-cover rounded border border-border mb-2"
            />
          )}
          <input
            type="file"
            name="heroImage"
            accept="image/*"
            className="text-sm text-muted file:mr-3 file:py-2 file:px-4 file:border file:border-border file:bg-white file:text-sm file:text-foreground file:cursor-pointer hover:file:bg-warm-gray"
          />
          <p className="text-xs text-muted mt-1">
            Рекомендуемый размер: 1920×1080
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium uppercase tracking-wider text-muted mb-2">
          Контакты
        </legend>

        <div>
          <label className="block text-sm mb-1.5">Telegram</label>
          <input
            name="telegramBotUrl"
            defaultValue={settings?.telegramBotUrl}
            placeholder="https://t.me/bliss_ling"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Instagram</label>
          <input
            name="instagramUrl"
            defaultValue={settings?.instagramUrl}
            placeholder="https://instagram.com/bliss_brand.ru"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Телефон</label>
          <input
            name="phone"
            defaultValue={settings?.phone}
            placeholder="+7 (999) 123-45-67"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={settings?.email}
            placeholder="hello@bliss-brand.ru"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm mb-1.5">Адрес</label>
          <input
            name="address"
            defaultValue={settings?.address}
            placeholder="Москва, ул. Примерная, д. 1"
            className={inputClass}
          />
        </div>
      </fieldset>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
