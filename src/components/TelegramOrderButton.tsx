"use client";

interface TelegramOrderButtonProps {
  productName: string;
  selectedSize: string | null;
  telegramBotUrl?: string;
}

export default function TelegramOrderButton({
  productName,
  selectedSize,
  telegramBotUrl = "https://t.me/bliss_ling",
}: TelegramOrderButtonProps) {
  const handleOrder = () => {
    const text = selectedSize
      ? `Хочу заказать: ${productName}, размер: ${selectedSize}`
      : `Хочу заказать: ${productName}`;
    const url = `${telegramBotUrl}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleOrder}
      disabled={!selectedSize}
      className="w-full py-4 bg-primary text-white font-medium uppercase tracking-wider hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {selectedSize ? "Заказать в Telegram" : "Выберите размер"}
    </button>
  );
}
