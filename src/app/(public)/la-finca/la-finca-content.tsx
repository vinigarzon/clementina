"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Lightbox } from "@/components/site/lightbox";
import { useT } from "@/i18n/locale-context";

// ============ ICONOS MINIMALISTAS ============

type IconProps = { className?: string };

function IconLocation({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M24 42c8-9 13-15.5 13-22a13 13 0 1 0-26 0c0 6.5 5 13 13 22Z" />
      <circle cx="24" cy="20" r="4.5" />
    </svg>
  );
}
function IconUsers({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <circle cx="18" cy="18" r="5.5" />
      <circle cx="33" cy="20" r="4" />
      <path d="M7 37c1.5-5.5 6-9 11-9s9.5 3.5 11 9" />
      <path d="M30 28c4 0 8 2.5 9.5 7" />
    </svg>
  );
}
function IconLeaf({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M10 38c0-15 11-26 28-28-2 17-13 28-28 28Z" />
      <path d="M10 38l16-16" />
    </svg>
  );
}
function IconCar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M9 30v6h4M39 30v6h-4" />
      <path d="M7 30l3-9a4 4 0 0 1 3.8-2.8h20.4A4 4 0 0 1 38 21l3 9" />
      <path d="M7 30h34" />
      <circle cx="15" cy="32" r="2.5" />
      <circle cx="33" cy="32" r="2.5" />
    </svg>
  );
}
function IconSparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M24 8c0 7 5 12 12 12-7 0-12 5-12 12 0-7-5-12-12-12 7 0 12-5 12-12Z" />
      <path d="M38 30c0 3 2 5 5 5-3 0-5 2-5 5 0-3-2-5-5-5 3 0 5-2 5-5Z" />
    </svg>
  );
}
function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M24 6l14 5v11c0 9-6.5 16-14 19-7.5-3-14-10-14-19V11l14-5Z" />
      <path d="M18 23l4.5 4.5L31 19" />
    </svg>
  );
}

// ============ COMPONENTE ============

export function LaFincaContent() {
  const t = useT();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const STATS = [
    { value: "500", labelKey: "lafinca.stats.guests" },
    { value: "100", labelKey: "lafinca.stats.parking" },
    { value: "1", labelKey: "lafinca.stats.lake" },
    { value: "1", labelKey: "lafinca.stats.pergola" },
  ];

  const FEATURES = [
    {
      eyebrowKey: "lafinca.features.location.eyebrow",
      titleKey: "lafinca.features.location.title",
      descKey: "lafinca.features.location.description",
      Icon: IconLocation,
    },
    {
      eyebrowKey: "lafinca.features.capacity.eyebrow",
      titleKey: "lafinca.features.capacity.title",
      descKey: "lafinca.features.capacity.description",
      Icon: IconUsers,
    },
    {
      eyebrowKey: "lafinca.features.outdoor.eyebrow",
      titleKey: "lafinca.features.outdoor.title",
      descKey: "lafinca.features.outdoor.description",
      Icon: IconLeaf,
    },
    {
      eyebrowKey: "lafinca.features.parking.eyebrow",
      titleKey: "lafinca.features.parking.title",
      descKey: "lafinca.features.parking.description",
      Icon: IconCar,
    },
    {
      eyebrowKey: "lafinca.features.services.eyebrow",
      titleKey: "lafinca.features.services.title",
      descKey: "lafinca.features.services.description",
      Icon: IconSparkle,
    },
    {
      eyebrowKey: "lafinca.features.backup.eyebrow",
      titleKey: "lafinca.features.backup.title",
      descKey: "lafinca.features.backup.description",
      Icon: IconShield,
    },
  ];

  const EXPERIENCES = Array.from({ length: 10 }, (_, i) =>
    t(`lafinca.experiences.list.${i + 1}`),
  );

  const GALLERY = [
    { src: "/venue/ingreso.jpg", captionKey: "lafinca.gallery.caption.ingreso" },
    { src: "/venue/boda-clementina.jpg", captionKey: "lafinca.gallery.caption.salon" },
    { src: "/real/banner-finca.jpg", captionKey: "lafinca.gallery.caption.areas" },
    { src: "/real/aire-libre.webp", captionKey: "lafinca.gallery.caption.outdoor" },
    { src: "/real/diseno-14.webp", captionKey: "lafinca.gallery.caption.setup" },
    { src: "/real/reunion-social.jpg", captionKey: "lafinca.gallery.caption.social" },
    { src: "/real/diseno-16.jpg", captionKey: "lafinca.gallery.caption.deco" },
    { src: "/real/diseno-19.jpg", captionKey: "lafinca.gallery.caption.main" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <Image
          src="/venue/boda-clementina.jpg"
          alt="Finca La Clementina"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/50 via-clementina-900/30 to-clementina-900/85" />

        <Container className="relative z-10 pb-16 sm:pb-24 pt-40">
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-cream-100/90 mb-6">
            {t("lafinca.hero.eyebrow")}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-[1.05] max-w-4xl drop-shadow-lg">
            {t("lafinca.hero.title")}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-cream-100/90 leading-relaxed max-w-2xl mt-8 drop-shadow">
            {t("lafinca.hero.description")}
          </p>
        </Container>
      </section>

      {/* STATS */}
      <section className="bg-clementina-800 text-cream-50 py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {STATS.map((s) => (
              <div key={s.labelKey} className="text-center">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-none">
                  {s.value}
                </p>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream-100/70 mt-3">
                  {t(s.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HISTORIA */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="lg:order-2 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/venue/ingreso.jpg"
                  alt="Finca La Clementina"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 hidden lg:block w-44 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-cream-50">
                <Image
                  src="/real/diseno-14.webp"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
            </div>

            <div className="lg:order-1">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6">
                {t("lafinca.history.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight mb-8">
                {t("lafinca.history.title")}
              </h2>
              <div className="space-y-5 font-sans text-base text-clementina-900/75 leading-relaxed">
                <p>{t("lafinca.history.p1")}</p>
                <p>{t("lafinca.history.p2")}</p>
                <p>{t("lafinca.history.p3")}</p>
              </div>

              <blockquote className="mt-10 pl-6 border-l-4 border-clementina-300 font-display text-xl md:text-2xl italic text-clementina-800">
                {t("lafinca.history.quote")}
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-24 sm:py-32 bg-clementina-50">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
              {t("lafinca.features.eyebrow")}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
              {t("lafinca.features.title")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((card, idx) => {
              const isDark = idx === 0 || idx === 4;
              const Icon = card.Icon;
              return (
                <div
                  key={card.eyebrowKey}
                  className={`group p-8 rounded-2xl transition-all hover:-translate-y-1 text-center flex flex-col items-center ${
                    isDark
                      ? "bg-clementina-800 text-cream-50 hover:shadow-xl"
                      : "bg-white border border-clementina-100 hover:shadow-lg hover:border-clementina-300"
                  }`}
                >
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                      isDark
                        ? "bg-cream-50/10 text-cream-50 group-hover:bg-cream-50/15"
                        : "bg-clementina-50 text-clementina-700 group-hover:bg-clementina-100"
                    }`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <p className={`font-sans text-xs uppercase tracking-widest mb-3 ${isDark ? "text-cream-100/70" : "text-clementina-600"}`}>
                    {t(card.eyebrowKey)}
                  </p>
                  <p className={`font-display text-2xl mb-3 leading-tight ${isDark ? "text-cream-50" : "text-clementina-800"}`}>
                    {t(card.titleKey)}
                  </p>
                  <p className={`font-sans text-sm leading-relaxed ${isDark ? "text-cream-100/85" : "text-clementina-900/70"}`}>
                    {t(card.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* BANNER QUOTE */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image
          src="/real/banner-finca.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-2xl sm:text-4xl md:text-5xl italic text-cream-50 text-center px-6 drop-shadow-lg max-w-3xl">
            “{t("lafinca.bannerQuote")}”
          </p>
        </div>
      </section>

      {/* EXPERIENCIAS */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="max-w-3xl mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
              {t("lafinca.experiences.eyebrow")}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight mb-6">
              {t("lafinca.experiences.title")}
            </h2>
            <p className="font-sans text-base text-clementina-900/70 leading-relaxed">
              {t("lafinca.experiences.intro")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {EXPERIENCES.map((item, idx) => (
              <div
                key={item}
                className="group flex items-start gap-5 py-5 border-b border-clementina-100 hover:bg-clementina-50/40 -mx-3 px-3 rounded-lg transition-colors"
              >
                <span className="font-display text-3xl text-clementina-300 group-hover:text-clementina-600 leading-none mt-0.5 transition-colors w-12 flex-shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-base text-clementina-900/80 leading-relaxed pt-1">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* GALERÍA */}
      <section className="py-24 sm:py-32 bg-clementina-50">
        <Container>
          <div className="max-w-3xl mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
              {t("lafinca.gallery.eyebrow")}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
              {t("lafinca.gallery.title")}
            </h2>
            <p className="font-sans text-base text-clementina-900/70 leading-relaxed mt-6">
              {t("lafinca.gallery.intro")}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]">
            {GALLERY.map((img, i) => {
              const isBig = i % 5 === 0;
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
                    alt={t(img.captionKey)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes={isBig ? "50vw" : "25vw"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/80 via-clementina-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 left-3 right-3 font-display text-base text-cream-50 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    {t(img.captionKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <Image
          src="/venue/boda-clementina.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-clementina-900/75" />
        <Container className="relative z-10 text-center text-cream-50">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-5">
            {t("lafinca.cta.eyebrow")}
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6 max-w-2xl mx-auto">
            {t("lafinca.cta.title")}
          </h2>
          <p className="font-sans text-lg text-cream-100/85 max-w-xl mx-auto mb-10">
            {t("lafinca.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("lafinca.cta.button1")}
            </Link>
            <Link
              href="/tipos-de-eventos"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-cream-50/10 transition-colors"
            >
              {t("lafinca.cta.button2")}
            </Link>
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={GALLERY.map((g) => ({
          src: g.src,
          alt: t(g.captionKey),
          caption: t(g.captionKey),
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
