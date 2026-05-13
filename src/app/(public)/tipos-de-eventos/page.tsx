import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { getPublishedEventTypes } from "@/lib/data/event-types";

export const metadata: Metadata = {
  title: "Tipos de eventos",
  description:
    "Bodas, quinces, grados, eventos corporativos, bautizos, baby showers, aniversarios, despedidas y reuniones sociales. Cada celebración encuentra su lugar.",
};

export const revalidate = 60;

export default async function TiposDeEventosPage() {
  const events = await getPublishedEventTypes();

  return (
    <>
      <PageHero
        eyebrow="Eventos"
        title="Cada celebración encuentra su lugar"
        description="Desde una boda íntima hasta una convención corporativa, la finca se adapta al estilo y la escala de tu evento."
        image={{
          src: "/venue/boda-clementina.jpg",
          alt: "Celebraciones en Finca La Clementina",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          {events.length === 0 ? (
            <p className="text-center font-sans text-clementina-900/60 italic">
              Todavía no hay tipos de evento publicados.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/tipos-de-eventos/${event.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-cream-50 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {event.image_url && (
                      <Image
                        src={event.image_url}
                        alt={event.title_es}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/70 via-clementina-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-2xl text-cream-50">
                        {event.title_es}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="font-sans text-sm text-clementina-900/70 leading-relaxed mb-4">
                      {event.short_es}
                    </p>
                    <span className="font-sans text-xs uppercase tracking-widest text-clementina-600 inline-flex items-center gap-2">
                      Conocer más
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
