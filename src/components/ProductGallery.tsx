"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductGallery({ images }: { images: SanityImageSource[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-warm-gray flex items-center justify-center text-muted">
        Фото отсутствует
      </div>
    );
  }

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        onSwiper={setSwiperRef}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="aspect-[3/4] bg-warm-gray"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={urlFor(image).width(1600).height(2133).quality(90).auto("format").url()}
                alt={`Фото ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => swiperRef?.slideTo(index)}
              className={`relative w-16 h-20 shrink-0 overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === index
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={urlFor(image).width(128).height(160).url()}
                alt={`Миниатюра ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
