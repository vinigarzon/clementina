"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale, useT } from "@/i18n/locale-context";

interface EventListItem {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  short_es: string;
  short_en: string;
  image_url: string | null;
}

export function EventsListContent({ events }: { events: EventListItem[] }) {
  const t = useT();
  const { locale } = useLocale();
  const isEn = locale === "en";

  return (
    <>
      <PageHero
        eyebrow={t("events.list.hero.eyebrow")}
        title={t("events.list.hero.title")}
        description={t("events.list.hero.description")}
        image={{
          src: "/venue/boda-clementina.jpg",
          alt: "Finca La Clementina",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          {events.length === 0 ? (
            <p className="text-center font-sans text-clementina-900/60 italic">
              {t("events.list.empty")}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const title = isEn ? event.title_en : event.title_es;
                const short = isEn ? event.short_en : event.short_es;
                return (
                  <Link
                    key={event.id}
                    href={`/tipos-de-eventos/${event.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-cream-50 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {event.image_url && (
                        <Image
                          src={event.image_url}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/70 via-clementina-900/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-display text-2xl text-cream-50">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="font-sans text-sm text-clementina-900/70 leading-relaxed mb-4">
                        {short}
                      </p>
                      <span className="font-sans text-xs uppercase tracking-widest text-clementina-600 inline-flex items-center gap-2">
                        {t("events.list.learnMore")}
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
