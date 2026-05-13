"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { Lightbox } from "@/components/site/lightbox";
import { useLocale } from "@/i18n/locale-context";
import type { GalleryAsset } from "@/lib/data/gallery";

const FILTER_LABELS: Record<string, { es: string; en: string }> = {
  all: { es: "Todos", en: "All" },
  Bodas: { es: "Bodas", en: "Weddings" },
  Quinces: { es: "Quinces", en: "Sweet 15" },
  Graduaciones: { es: "Graduaciones", en: "Graduations" },
  Corporativos: { es: "Corporativos", en: "Corporate" },
  Sociales: { es: "Sociales", en: "Social" },
  "La Finca": { es: "La Finca", en: "The Venue" },
  Bautizos: { es: "Bautizos", en: "Baptisms" },
  "Baby Shower": { es: "Baby Shower", en: "Baby Shower" },
  Aniversarios: { es: "Aniversarios", en: "Anniversaries" },
  Despedidas: { es: "Despedidas", en: "Farewells" },
};

interface GaleriaContentProps {
  assets: GalleryAsset[];
}

export function GaleriaContent({ assets }: GaleriaContentProps) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => set.add(a.tag));
    return ["all", ...Array.from(set)];
  }, [assets]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? assets
        : assets.filter((img) => img.tag === filter),
    [filter, assets],
  );

  const lightboxImages = useMemo(
    () =>
      visible.map((a) => ({
        src: a.image_url,
        alt: locale === "es" ? a.alt_es : a.alt_en,
        caption: null,
      })),
    [visible, locale],
  );

  /**
   * Patrón de tamaños para grid dinámico:
   * cada 7ª imagen es grande (2x2), el resto normal.
   * Esto hace que el grid se sienta natural sin ser caótico.
   */
  function spanClass(i: number): string {
    const cycle = i % 7;
    if (cycle === 0) {
      return "sm:col-span-2 sm:row-span-2 aspect-square";
    }
    if (cycle === 3) {
      return "aspect-[3/4]"; // vertical
    }
    if (cycle === 5) {
      return "aspect-[4/3]"; // horizontal suave
    }
    return "aspect-square";
  }

  return (
    <>
      <PageHero
        eyebrow={locale === "es" ? "Galería" : "Gallery"}
        title={
          locale === "es"
            ? "Momentos que ya son recuerdo"
            : "Moments that are already memories"
        }
        description={
          locale === "es"
            ? "Una selección visual de las celebraciones que la finca ha acogido. Toca cualquier imagen para verla en grande."
            : "A visual selection of the celebrations the venue has hosted. Tap any image to see it full size."
        }
        image={{
          src: "/real/banner-finca.jpg",
          alt:
            locale === "es"
              ? "Galería de Finca La Clementina"
              : "Finca La Clementina gallery",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          {assets.length === 0 ? (
            <p className="text-center font-sans text-clementina-900/60 italic py-16">
              {locale === "es"
                ? "Todavía no hay imágenes publicadas en la galería."
                : "No images published in the gallery yet."}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
                {availableTags.map((f) => {
                  const labels = FILTER_LABELS[f] ?? { es: f, en: f };
                  const label = labels[locale];
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`px-5 py-2 rounded-full font-sans text-sm transition-colors border ${
                        active
                          ? "bg-clementina-800 text-cream-50 border-clementina-800"
                          : "bg-cream-50 text-clementina-800 border-clementina-200 hover:border-clementina-400"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Grid dinámico (masonry-style) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[260px]">
                {visible.map((image, i) => {
                  const labels = FILTER_LABELS[image.tag] ?? {
                    es: image.tag,
                    en: image.tag,
                  };
                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className={`relative group overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-clementina-600 ${spanClass(
                        i,
                      )}`}
                    >
                      <Image
                        src={image.image_url}
                        alt={locale === "es" ? image.alt_es : image.alt_en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/80 via-clementina-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                        <span className="block font-sans text-[10px] uppercase tracking-widest text-cream-100/90 mb-1">
                          {labels[locale]}
                        </span>
                        <span className="block font-display text-base text-cream-50 leading-tight line-clamp-2">
                          {locale === "es" ? image.alt_es : image.alt_en}
                        </span>
                      </div>
                      {/* Icono lupa al hover */}
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-clementina-900/60 backdrop-blur text-cream-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>

              {visible.length === 0 && (
                <p className="text-center font-sans text-clementina-900/60 py-16">
                  {locale === "es"
                    ? "Sin imágenes en esta categoría."
                    : "No images in this category."}
                </p>
              )}

              <p className="text-center font-sans text-xs text-clementina-900/50 mt-12">
                {locale === "es"
                  ? "Mostrando "
                  : "Showing "}
                {visible.length}
                {locale === "es" ? " imágenes" : " images"}
              </p>
            </>
          )}
        </Container>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
