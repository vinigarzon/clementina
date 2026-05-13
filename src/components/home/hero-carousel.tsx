"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroCarouselImage {
  src: string;
  alt: string;
}

interface HeroCarouselProps {
  images: HeroCarouselImage[];
  /** Tiempo entre slides en milisegundos. Default 5 segundos. */
  interval?: number;
}

export function HeroCarousel({ images, interval = 5000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => window.clearInterval(t);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((img, i) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-8 bg-cream-50"
                  : "w-1.5 bg-cream-50/50 hover:bg-cream-50/80"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
