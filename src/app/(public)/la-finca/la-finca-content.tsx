"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Lightbox } from "@/components/site/lightbox";

// ============ DATOS ============

const STATS = [
  { value: "500", label: "Invitados máx." },
  { value: "100", label: "Espacios de parqueo" },
  { value: "1", label: "Lago artificial" },
  { value: "1", label: "Pérgola para ceremonia" },
];

// ============ ICONOS MINIMALISTAS (line icons en currentColor) ============
// Tamaño base 48px; usan stroke-current para heredar el color del card.

type IconProps = { className?: string };

function IconLocation({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 42c8-9 13-15.5 13-22a13 13 0 1 0-26 0c0 6.5 5 13 13 22Z" />
      <circle cx="24" cy="20" r="4.5" />
    </svg>
  );
}

function IconUsers({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="18" cy="18" r="5.5" />
      <circle cx="33" cy="20" r="4" />
      <path d="M7 37c1.5-5.5 6-9 11-9s9.5 3.5 11 9" />
      <path d="M30 28c4 0 8 2.5 9.5 7" />
    </svg>
  );
}

function IconLeaf({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 38c0-15 11-26 28-28-2 17-13 28-28 28Z" />
      <path d="M10 38l16-16" />
    </svg>
  );
}

function IconCar({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
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
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 8c0 7 5 12 12 12-7 0-12 5-12 12 0-7-5-12-12-12 7 0 12-5 12-12Z" />
      <path d="M38 30c0 3 2 5 5 5-3 0-5 2-5 5 0-3-2-5-5-5 3 0 5-2 5-5Z" />
    </svg>
  );
}

function IconShield({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 6l14 5v11c0 9-6.5 16-14 19-7.5-3-14-10-14-19V11l14-5Z" />
      <path d="M18 23l4.5 4.5L31 19" />
    </svg>
  );
}

const FEATURES = [
  {
    eyebrow: "Ubicación",
    title: "En el corazón del Carchi",
    description:
      "Cerca de Tulcán, La Clementina ofrece un entorno natural, tranquilo y accesible para celebraciones familiares, sociales y empresariales.",
    Icon: IconLocation,
  },
  {
    eyebrow: "Capacidad",
    title: "Íntimos o de gran formato",
    description:
      "Espacios versátiles para reuniones pequeñas, eventos en salón y celebraciones exteriores con carpas hasta 500 invitados.",
    Icon: IconUsers,
  },
  {
    eyebrow: "Áreas exteriores",
    title: "Jardines, lago y pérgola",
    description:
      "Amplias áreas verdes, lago artificial, puente con cascada, piletas decorativas y una pérgola ideal para ceremonias al aire libre.",
    Icon: IconLeaf,
  },
  {
    eyebrow: "Parqueadero",
    title: "Aprox. 100 autos",
    description:
      "Un espacio amplio y cómodo para recibir a tus invitados con mayor tranquilidad desde su llegada.",
    Icon: IconCar,
  },
  {
    eyebrow: "Servicios",
    title: "Producción integral",
    description:
      "Catering, decoración, música, fotografía, video y coordinación, con los mejores proveedores de música y entretenimiento.",
    Icon: IconSparkle,
  },
  {
    eyebrow: "Respaldo",
    title: "Tu evento sin sobresaltos",
    description:
      "Reservorio de agua, planta de energía de respaldo y seguridad para que cada detalle esté cubierto.",
    Icon: IconShield,
  },
];

const EXPERIENCES = [
  "Ceremonia al aire libre en la pérgola, con ingreso especial de novios o familia.",
  "Fotos junto al lago, puente, cascada, piletas y jardines.",
  "Cóctel o bienvenida en áreas verdes antes de pasar al salón.",
  "Recepción elegante en salón o bajo carpas, según el tamaño del evento.",
  "Cena, brindis, torta, mesa dulce y bocaditos.",
  "Show musical, DJ o una hora loca memorable.",
  "Recorridos visuales para quinceañeras, novios, graduados o cumpleañeros.",
  "Eventos corporativos con coffee break, charlas, reconocimiento y cierre social.",
  "Celebraciones religiosas: bautizos, primeras comuniones, confirmaciones.",
  "Grandes reuniones familiares para conversar, caminar, tomar fotos y disfrutar.",
];

const GALLERY = [
  {
    src: "/venue/ingreso.jpg",
    alt: "Ingreso a Finca La Clementina",
    caption: "Ingreso a la finca",
  },
  {
    src: "/venue/boda-clementina.jpg",
    alt: "Salón montado para evento",
    caption: "Salón montado",
  },
  {
    src: "/real/banner-finca.jpg",
    alt: "Áreas verdes y entorno natural",
    caption: "Áreas verdes",
  },
  {
    src: "/real/aire-libre.webp",
    alt: "Evento al aire libre",
    caption: "Al aire libre",
  },
  {
    src: "/real/diseno-14.webp",
    alt: "Montaje y decoración",
    caption: "Montaje",
  },
  {
    src: "/real/reunion-social.jpg",
    alt: "Reunión social en la finca",
    caption: "Reuniones sociales",
  },
  {
    src: "/real/diseno-16.jpg",
    alt: "Espacio decorado",
    caption: "Decoración",
  },
  {
    src: "/real/diseno-19.jpg",
    alt: "Salón principal",
    caption: "Salón principal",
  },
];

// ============ COMPONENTE ============

export function LaFincaContent() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {/* HERO con foto de fondo */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <Image
          src="/venue/boda-clementina.jpg"
          alt="Finca La Clementina en Tulcán, Carchi"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/50 via-clementina-900/30 to-clementina-900/85" />

        <Container className="relative z-10 pb-16 sm:pb-24 pt-40">
          <p className="font-sans text-xs uppercase tracking-[0.4em] text-cream-100/90 mb-6">
            La Finca · Carchi, Ecuador
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-[1.05] max-w-4xl drop-shadow-lg">
            Más que un venue, una finca pensada para celebrar en grande
          </h1>
          <p className="font-sans text-lg sm:text-xl text-cream-100/90 leading-relaxed max-w-2xl mt-8 drop-shadow">
            Una finca amplia, elegante y preparada para celebrar sin límites en
            el norte del Ecuador.
          </p>
        </Container>
      </section>

      {/* BANDA DE STATS */}
      <section className="bg-clementina-800 text-cream-50 py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-none">
                  {s.value}
                </p>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-cream-100/70 mt-3">
                  {s.label}
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
                  alt="Vista de Finca La Clementina"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              {/* Imagen pequeña en esquina */}
              <div className="absolute -bottom-8 -left-8 hidden lg:block w-44 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-cream-50">
                <Image
                  src="/real/diseno-14.webp"
                  alt="Detalle de la finca"
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
            </div>

            <div className="lg:order-1">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6">
                Nuestra historia
              </p>
              <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight mb-8">
                Un escenario para historias que se recuerdan toda la vida
              </h2>
              <div className="space-y-5 font-sans text-base text-clementina-900/75 leading-relaxed">
                <p>
                  Finca La Clementina nació como un proyecto familiar con una
                  idea clara: ofrecer al norte del Ecuador un lugar diferente
                  para celebrar los momentos más importantes de la vida.
                </p>
                <p>
                  Ubicada en el Carchi, cerca de Tulcán, combina la calidez de
                  una finca con la infraestructura necesaria para realizar
                  eventos sociales, familiares, religiosos, empresariales y
                  celebraciones de gran formato.
                </p>
                <p>
                  Aquí cada celebración puede tener su propio recorrido:
                  ceremonia en la pérgola, fotos junto al lago, recepción en
                  salón, cena bajo carpas, brindis familiar, música en vivo y
                  una fiesta inolvidable.
                </p>
              </div>

              <blockquote className="mt-10 pl-6 border-l-4 border-clementina-300 font-display text-xl md:text-2xl italic text-clementina-800">
                Más que un salón de eventos, La Clementina es un escenario para
                historias que se recuerdan toda la vida.
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* CARDS DE FEATURES — patrón asimétrico */}
      <section className="py-24 sm:py-32 bg-clementina-50">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
              Lo que vas a encontrar
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
              Todo lo que tu evento necesita, en un solo lugar
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((card, idx) => {
              const isDark = idx === 0 || idx === 4;
              const Icon = card.Icon;
              return (
                <div
                  key={card.eyebrow}
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
                  <p
                    className={`font-sans text-xs uppercase tracking-widest mb-3 ${
                      isDark ? "text-cream-100/70" : "text-clementina-600"
                    }`}
                  >
                    {card.eyebrow}
                  </p>
                  <p
                    className={`font-display text-2xl mb-3 leading-tight ${
                      isDark ? "text-cream-50" : "text-clementina-800"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`font-sans text-sm leading-relaxed ${
                      isDark ? "text-cream-100/85" : "text-clementina-900/70"
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* IMAGEN GRANDE INTERMEDIA */}
      <section className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <Image
          src="/real/banner-finca.jpg"
          alt="Áreas verdes de la finca"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-2xl sm:text-4xl md:text-5xl italic text-cream-50 text-center px-6 drop-shadow-lg max-w-3xl">
            “Cada rincón está pensado para convertirse en recuerdo.”
          </p>
        </div>
      </section>

      {/* EXPERIENCIAS */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="max-w-3xl mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
              Experiencias
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight mb-6">
              Lo que se puede vivir en La Clementina
            </h2>
            <p className="font-sans text-base text-clementina-900/70 leading-relaxed">
              Aquí cada evento puede tener varios momentos: una ceremonia al
              aire libre, una recepción elegante, una sesión de fotos junto al
              lago, una cena en salón o una celebración bajo carpas rodeada de
              naturaleza.
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

      {/* GALERÍA con lightbox */}
      <section className="py-24 sm:py-32 bg-clementina-50">
        <Container>
          <div className="max-w-3xl mb-16">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-5">
              Galería de espacios
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-clementina-800 leading-tight">
              Salón, lago, pérgola y áreas verdes
            </h2>
            <p className="font-sans text-base text-clementina-900/70 leading-relaxed mt-6">
              Toca cualquier imagen para verla en grande. Pronto compartiremos
              fotos actualizadas de cada espacio.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[240px]">
            {GALLERY.map((img, i) => {
              // Patrón: cada 5ª imagen es grande
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
                  <div className="absolute inset-0 bg-gradient-to-t from-clementina-900/80 via-clementina-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 left-3 right-3 font-display text-base text-cream-50 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    {img.caption}
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
          alt="Boda en La Clementina"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-clementina-900/75" />
        <Container className="relative z-10 text-center text-cream-50">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-5">
            ¿Listos?
          </p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6 max-w-2xl mx-auto">
            Hablemos de tu celebración
          </h2>
          <p className="font-sans text-lg text-cream-100/85 max-w-xl mx-auto mb-10">
            Cuéntanos tu fecha y número de invitados. Te ayudamos a imaginar tu
            evento en La Clementina.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              Agendar visita
            </Link>
            <Link
              href="/tipos-de-eventos"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-cream-50/40 text-cream-50 font-sans text-sm font-medium hover:bg-cream-50/10 transition-colors"
            >
              Conocer tipos de eventos
            </Link>
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={GALLERY.map((g) => ({
          src: g.src,
          alt: g.alt,
          caption: g.caption,
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </>
  );
}
