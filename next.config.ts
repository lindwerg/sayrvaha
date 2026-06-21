import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Картинки лежат локально и отдаются с того же домена (/uploads/...),
    // их оптимизирует встроенный загрузчик next/image. Внешние источники
    // больше не нужны.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      // Фото сжимаются в браузере перед загрузкой; лимит с запасом на пачку фото.
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
