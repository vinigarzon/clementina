"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Lightbox } from "@/components/site/lightbox";
import { useSiteSettings } from "@/components/site/site-settings-provider";

interface OtherEvent {
  id: string;
  slug: string;
  title_es: string;
  image_url: string | null;
}

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string | null;
}

interface EventTypeContentProps {
  event: {
    slug: string;
    title_es: string;
    short_es: string;
    description_es: string;
    highlights_es: string[];
    image_url: string | null;
    whatsappMessage?: string | null;
    bodyHtml: string | null;
  };
  others: OtherEvent[];
  gallery: GalleryImage[];
}

export function EventTypeContent({
  event,
  others,
  gallery,
}: EventTypeContentProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { whatsapp_number } = useSiteSettings();

  const whatsappText =
    event.whatsappMessage ||
    `Hola, me interesa información sobre ${event.title_es.toLowerCase()} en Finca La Clementina.`;
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
            alt={event.title_es}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/40 via-clementina-900/20 to-clementina-900/85" />

        <Container className="relative z-10 pb-16 sm:pb-24 pt-40">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-6">
            <Link
              href="/tipos-de-eventos"
              className="hover:text-cream-50 transition-colors"
            >
              Eventos
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-cream-50">{event.title_es}</span>
          </nav>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-[1.05] max-w-4xl drop-shadow-lg">
            {event.title_es}
          </h1>
          <p className="font-sans text-lg sm:text-xl text-cream-100/95 leading-relaxed max-w-2xl mt-8 drop-shadow">
            {event.short_es}
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="/contacto"
              className="inline-flex items-center px-7 py-3 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              Cotizar este evento
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

      {/* DESCRIPCIÓN larga (tipo editorial) */}
      {event.description_es && (
        <section className="py-24 sm:py-32">
          <Container>
            <div className="max-w-3xl mx-auto">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6 text-center">
                La experiencia
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight text-center mb-12">
                Pensado para que solo te ocupes de disfrutar
              </h2>
              <p className="font-display text-2xl md:text-3xl text-clementina-800/90 leading-relaxed italic text-center">
                {event.description_es}
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* HIGHLIGHTS como cards numeradas */}
      {event.highlights_es.length > 0 && (
        <section className="py-24 sm:py-32 bg-clementina-50">
          <Container>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
                Lo que incluye
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
                Cada detalle pensado para ti
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {event.highlights_es.map((highlight, idx) => (
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

      {/* BODY markdown renderizado (si existe) */}
      {event.bodyHtml && (
        <section className="py-24 sm:py-32">
          <Container>
            <div
              className="prose-blog max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: event.bodyHtml }}
            />
          </Container>
        </section>
      )}

      {/* GALERÍA filtrada con lightbox */}
      {gallery.length > 0 && (
        <section className="py-24 sm:py-32 bg-clementina-50">
          <Container>
            <div className="max-w-3xl mb-12">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
                Galería · {event.title_es}
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
                Momentos reales de este tipo de evento
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]">
              {gallery.map((img, i) => {
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
                      alt={img.alt}
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
            Próximo paso
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6">
            ¿Te imaginas tu {event.title_es.toLowerCase()} aquí?
          </h2>
          <p className="font-sans text-lg text-cream-100/85 mb-10">
            Cuéntanos tu fecha y número de invitados. Te ayudamos a imaginarlo
            paso a paso, sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              Iniciar cotización
            </Link>
            <Link
              href="/calendario"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-cream-50/10 transition-colors"
            >
              Ver disponibilidad
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity"
            >
              WhatsApp directo
            </a>
          </div>
        </Container>
      </section>

      {/* Otros tipos de evento */}
      {others.length > 0 && (
        <section className="py-24 bg-cream-50">
          <Container>
            <div className="text-center mb-12">
              <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                Sigue explorando
              </p>
              <h3 className="font-display text-3xl text-clementina-800">
                Otros tipos de evento
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {others.slice(0, 8).map((e) => (
                <Link
                  key={e.id}
                  href={`/tipos-de-eventos/${e.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-clementina-100 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {e.image_url ? (
                      <Image
                        src={e.image_url}
                        alt={e.title_es}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-clementina-200 to-clementina-400" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/60 to-transparent" />
                    <p className="absolute bottom-3 left-3 right-3 font-display text-lg text-cream-50 leading-tight">
                      {e.title_es}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        images={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
