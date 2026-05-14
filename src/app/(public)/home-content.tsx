"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { useT, useLocale } from "@/i18n/locale-context";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QuoteSection } from "@/components/home/quote-section";

interface HomeEventType {
  slug: string;
  title_es: string;
  title_en: string;
  short_es: string;
  short_en: string;
  image: string | null;
}

interface HomeBlogPost {
  slug: string;
  title_es: string;
  title_en: string;
  excerpt_es: string | null;
  excerpt_en: string | null;
  cover_url: string | null;
  category: string | null;
  published_at: string;
}

interface HomeContentProps {
  featuredImages: { src: string; alt: string }[];
  eventTypes: HomeEventType[];
  latestPosts: HomeBlogPost[];
}

export function HomeContent({
  featuredImages,
  eventTypes,
  latestPosts,
}: HomeContentProps) {
  const t = useT();
  const { locale } = useLocale();
  const isEn = locale === "en";

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(isEn ? "en-US" : "es-EC", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const heroImages =
    featuredImages.length > 0
      ? featuredImages
      : [
          {
            src: "/venue/boda-clementina.jpg",
            alt: "Boda en Finca La Clementina",
          },
        ];

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <HeroCarousel images={heroImages} />
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/60 via-clementina-900/40 to-clementina-900/70 z-10" />

        <Container className="relative z-10 text-center pt-32 pb-20">
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-cream-100/90 mb-8">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream-50 leading-[1.05] mb-8 max-w-4xl mx-auto drop-shadow-lg">
            {t("home.hero.title")}
          </h1>
          <p className="font-sans text-lg md:text-xl text-cream-100/95 leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow">
            {t("home.hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tipos-de-eventos"
              className="inline-flex items-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("home.hero.cta1")}
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-4 rounded-full bg-clementina-800/40 backdrop-blur-sm border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-800/60 transition-colors"
            >
              {t("home.hero.cta2")}
            </Link>
          </div>
        </Container>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-cream-100/70 text-xs font-sans uppercase tracking-widest animate-pulse pointer-events-none">
          {t("home.hero.scroll")}
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6">
                {t("home.intro.eyebrow")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-clementina-800 leading-tight mb-8">
                {t("home.intro.title")}
              </h2>
              <p className="font-sans text-lg text-clementina-900/70 leading-relaxed mb-6">
                {t("home.intro.p1")}
              </p>
              <p className="font-sans text-lg text-clementina-900/70 leading-relaxed mb-10">
                {t("home.intro.p2")}
              </p>
              <Link
                href="/la-finca"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-clementina-700 hover:text-clementina-900 transition-colors group"
              >
                {t("home.intro.link")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/venue/ingreso.jpg"
                alt="Ingreso a Finca La Clementina"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CITA */}
      <QuoteSection />

      {/* TIPOS DE EVENTOS (desde Supabase) */}
      {eventTypes.length > 0 && (
        <section className="py-24 sm:py-32 bg-clementina-50">
          <Container>
            <div className="text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6">
                {t("home.events.eyebrow")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-clementina-800 leading-tight">
                {t("home.events.title")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.slice(0, 6).map((event) => {
                const eTitle = isEn ? event.title_en : event.title_es;
                const eShort = isEn ? event.short_en : event.short_es;
                return (
                  <Link
                    key={event.slug}
                    href={`/tipos-de-eventos/${event.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-cream-50 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {event.image && (
                        <Image
                          src={event.image}
                          alt={eTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-display text-2xl text-cream-50 mb-1">
                          {eTitle}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="font-sans text-sm text-clementina-900/70 leading-relaxed">
                        {eShort}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/tipos-de-eventos"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-clementina-700 hover:text-clementina-900 transition-colors group"
              >
                {t("home.events.viewAll")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* BLOG - 3 últimos posts */}
      {latestPosts.length > 0 && (
        <section className="py-24 sm:py-32">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-4">
                  {t("blog.hero.eyebrow")}
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-clementina-800 leading-tight max-w-xl">
                  {t("blog.hero.title")}
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-clementina-700 hover:text-clementina-900 transition-colors group"
              >
                {t("common.viewAll")}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.slice(0, 3).map((post) => {
                const pTitle = isEn ? post.title_en : post.title_es;
                const pExcerpt = isEn
                  ? post.excerpt_en ?? post.excerpt_es
                  : post.excerpt_es;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-cream-50 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {post.cover_url ? (
                        <Image
                          src={post.cover_url}
                          alt={pTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-clementina-200 to-clementina-400" />
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cream-50/95 backdrop-blur font-sans text-[10px] uppercase tracking-widest text-clementina-700">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                        {formatDate(post.published_at)}
                      </p>
                      <h3 className="font-display text-2xl text-clementina-800 leading-tight mb-3 group-hover:text-clementina-700 transition-colors">
                        {pTitle}
                      </h3>
                      {pExcerpt && (
                        <p className="font-sans text-sm text-clementina-900/70 leading-relaxed line-clamp-3">
                          {pExcerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="py-24 sm:py-32 bg-clementina-800 text-cream-50">
        <Container className="text-center">
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 max-w-3xl mx-auto">
            {t("home.cta.title")}
          </h2>
          <p className="font-sans text-lg text-cream-100/80 max-w-2xl mx-auto mb-10">
            {t("home.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("home.cta.button1")}
            </Link>
            <Link
              href="/calendario"
              className="inline-flex items-center px-8 py-4 rounded-full border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-cream-50/10 transition-colors"
            >
              {t("home.cta.button2")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
