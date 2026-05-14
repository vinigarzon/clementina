"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Lightbox } from "@/components/site/lightbox";
import { useSiteSettings } from "@/components/site/site-settings-provider";
import { useLocale, useT } from "@/i18n/locale-context";

interface OtherEvent {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  image_url: string | null;
}

interface GalleryImage {
  src: string;
  alt_es: string;
  alt_en: string;
}

interface EventTypeContentProps {
  event: {
    slug: string;
    title_es: string;
    title_en: string;
    short_es: string;
    short_en: string;
    description_es: string;
    description_en: string;
    highlights_es: string[];
    highlights_en: string[];
    image_url: string | null;
    whatsappMessageEs?: string | null;
    whatsappMessageEn?: string | null;
    bodyHtmlEs: string | null;
    bodyHtmlEn: string | null;
  };
  others: OtherEvent[];
  gallery: GalleryImage[];
}

export function EventTypeContent({
  event,
  others,
  gallery,
}: EventTypeContentProps) {
  const t = useT();
  const { locale } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { whatsapp_number } = useSiteSettings();

  // Selecciona el campo según locale, con fallback al español.
  const isEn = locale === "en";
  const title = isEn ? event.title_en : event.title_es;
  const short = isEn ? event.short_en : event.short_es;
  const description = isEn ? event.description_en : event.description_es;
  const highlights = isEn ? event.highlights_en : event.highlights_es;
  const bodyHtml = isEn ? event.bodyHtmlEn ?? event.bodyHtmlEs : event.bodyHtmlEs;
  const customWhatsapp = isEn
    ? event.whatsappMessageEn
    : event.whatsappMessageEs;

  const whatsappText =
    customWhatsapp ||
    t("event.whatsappDefault").replace("{event}", title.toLowerCase());
  const whatsappHref = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(
    whatsappText,
  )}`;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        {event.image_url && (
          <Image
            src={event.image_url}
            alt={title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/40 via-clementina-900/20 to-clementina-900/85" />

        <Container className="relative z-10 pb-16 sm:pb-24 pt-40">
          <nav className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-6">
            <Link
              href="/tipos-de-eventos"
              className="hover:text-cream-50 transition-colors"
            >
              {t("event.breadcrumb")}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-cream-50">{title}</span>
          </nav>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-[1.05] max-w-4xl drop-shadow-lg">
            {title}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-cream-100/95 leading-relaxed max-w-2xl mt-8 drop-shadow">
            {short}
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/contacto"
              className="inline-flex items-center px-7 py-3 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("event.cta.quote")}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-clementina-900/40 backdrop-blur-sm border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-900/60 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.43 0 .07 5.36.07 11.99a11.94 11.94 0 0 0 1.62 6.01L0 24l6.18-1.62a11.97 11.97 0 0 0 5.88 1.5h.01c6.62 0 11.99-5.37 11.99-11.99 0-3.2-1.25-6.21-3.54-8.41Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </Container>
      </section>

      {/* DESCRIPCIÓN */}
      {description && (
        <section className="py-24 sm:py-32">
          <Container>
            <div className="max-w-3xl mx-auto">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6 text-center">
                {t("event.experience.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight text-center mb-12">
                {t("event.experience.title")}
              </h2>
              <p className="font-display text-2xl md:text-3xl text-clementina-800/90 leading-relaxed italic text-center">
                {description}
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="py-24 sm:py-32 bg-clementina-50">
          <Container>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
                {t("event.includes.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
                {t("event.includes.title")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {highlights.map((highlight, idx) => (
                <div
                  key={highlight}
                  className="group p-7 rounded-2xl bg-white border border-clementina-100 hover:border-clementina-300 hover:shadow-lg transition-all"
                >
                  <p className="font-display text-4xl text-clementina-300 leading-none mb-4 group-hover:text-clementina-600 transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </p>
                  <p className="font-sans text-base text-clementina-900/85 leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* BODY */}
      {bodyHtml && (
        <section className="py-24 sm:py-32">
          <Container>
            <div
              className="prose-blog max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </Container>
        </section>
      )}

      {/* GALERÍA */}
      {gallery.length > 0 && (
        <section className="py-24 sm:py-32 bg-clementina-50">
          <Container>
            <div className="max-w-3xl mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
                {t("event.gallery.eyebrow")} · {title}
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
                {t("event.gallery.title")}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]">
              {gallery.map((img, i) => {
                const isBig = i % 5 === 0;
                const alt = isEn ? img.alt_en : img.alt_es;
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`group relative overflow-hidden rounded-2xl cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-clementina-600 ${
                      isBig ? "sm:col-span-2 sm:row-span-2" : ""
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes={isBig ? "50vw" : "25vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* CTA final */}
      <section className="relative py-32 overflow-hidden">
        {event.image_url && (
          <Image
            src={event.image_url}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-clementina-900/80" />
        <Container className="relative z-10 text-center text-cream-50 max-w-2xl">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-5">
            {t("event.finalCta.eyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6">
            {t("event.finalCta.title").replace("{event}", title.toLowerCase())}
          </h2>
          <p className="font-sans text-lg text-cream-100/85 mb-10">
            {t("event.finalCta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("event.finalCta.button1")}
            </Link>
            <Link
              href="/calendario"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-cream-50/10 transition-colors"
            >
              {t("event.finalCta.button2")}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t("event.finalCta.button3")}
            </a>
          </div>
        </Container>
      </section>

      {/* Otros tipos */}
      {others.length > 0 && (
        <section className="py-24 bg-cream-50">
          <Container>
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                {t("event.others.eyebrow")}
              </p>
              <h3 className="font-display text-3xl text-clementina-800">
                {t("event.others.title")}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {others.slice(0, 8).map((e) => {
                const otherTitle = isEn ? e.title_en : e.title_es;
                return (
                  <Link
                    key={e.id}
                    href={`/tipos-de-eventos/${e.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-white border border-clementina-100 hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {e.image_url ? (
                        <Image
                          src={e.image_url}
                          alt={otherTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 25vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-clementina-200 to-clementina-400" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/60 to-transparent" />
                      <p className="absolute bottom-3 left-3 right-3 font-display text-lg text-cream-50 leading-tight">
                        {otherTitle}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        images={gallery.map((g) => ({
          src: g.src,
          alt: isEn ? g.alt_en : g.alt_es,
          caption: isEn ? g.alt_en : g.alt_es,
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
