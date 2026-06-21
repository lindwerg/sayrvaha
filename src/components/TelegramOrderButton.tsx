"use client";

const DEFAULT_LABEL = "Заказать пошив в Telegram";

interface TelegramOrderButtonProps {
  productName: string;
  selectedSize: string | null;
  telegramBotUrl?: string;
  label?: string;
}

export default function TelegramOrderButton({
  productName,
  selectedSize,
  label,
}: TelegramOrderButtonProps) {
  const handleOrder = () => {
    const base = `Здравствуйте! Хочу заказать индивидуальный пошив: ${productName}`;
    const text = selectedSize ? `${base}, размер: ${selectedSize}` : base;
    const url = `https://t.me/bliss_ling?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleOrder}
      className="w-full py-4 bg-primary text-white font-medium uppercase tracking-wider hover:bg-primary-dark transition-colors"
    >
      {label?.trim() || DEFAULT_LABEL}
    </button>
  );
}
