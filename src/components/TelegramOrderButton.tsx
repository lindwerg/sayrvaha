"use client";

interface TelegramOrderButtonProps {
  productName: string;
  selectedSize: string | null;
  telegramBotUrl?: string;
}

export default function TelegramOrderButton({
  productName,
  selectedSize,
}: TelegramOrderButtonProps) {
  const handleOrder = () => {
    const text = selectedSize
      ? `Хочу заказать: ${productName}, размер: ${selectedSize}`
      : `Хочу заказать: ${productName}`;
    const url = `https://t.me/bliss_ling?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleOrder}
      className="w-full py-4 bg-primary text-white font-medium uppercase tracking-wider hover:bg-primary-dark transition-colors"
    >
      Заказать в Telegram
    </button>
  );
}
