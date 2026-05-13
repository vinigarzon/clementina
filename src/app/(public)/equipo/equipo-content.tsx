"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale } from "@/i18n/locale-context";
import type { TeamMember } from "@/lib/data/team";

const COPY = {
  es: {
    eyebrow: "Equipo",
    title: "Personas que hacen posible cada celebración",
    description:
      "Detrás de cada evento exitoso hay un equipo familiar que entiende el peso de los momentos y trabaja con dedicación para que todo salga perfecto.",
    sistersEyebrow: "Hermanas",
    sistersTitle: "Un proyecto familiar",
    sistersDesc:
      "Lorena y Alejandra son hermanas. Juntas conducen La Clementina con la misma exigencia y el mismo cariño con el que reciben a cada cliente. Esa cercanía familiar se siente en cada detalle del evento.",
    sistersAlt: "Lorena y Alejandra Bolaños",
    ctaTitle: "¿Quieres conocernos en persona?",
    ctaDesc: "Te invitamos a visitar la finca y conversar sobre tu evento.",
    ctaButton: "Agendar visita",
    empty:
      "Todavía no hay miembros del equipo publicados. Cárgalos desde el panel admin.",
  },
  en: {
    eyebrow: "Team",
    title: "The people behind every celebration",
    description:
      "Behind every successful event is a family team that understands the weight of important moments and works with dedication so everything turns out perfectly.",
    sistersEyebrow: "Sisters",
    sistersTitle: "A family project",
    sistersDesc:
      "Lorena and Alejandra are sisters. Together they run La Clementina with the same standards and the same warmth with which they welcome every client. That family closeness shows in every detail of the event.",
    sistersAlt: "Lorena and Alejandra Bolaños",
    ctaTitle: "Want to meet us in person?",
    ctaDesc: "Come visit the venue and let's talk about your event.",
    ctaButton: "Schedule a visit",
    empty: "No team members published yet. Add them from the admin panel.",
  },
};

interface EquipoContentProps {
  members: TeamMember[];
}

export function EquipoContent({ members }: EquipoContentProps) {
  const { locale } = useLocale();
  const t = COPY[locale];

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        image={{
          src: "/team/hermanas.jpg",
          alt: "Equipo de Finca La Clementina",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          {members.length === 0 ? (
            <p className="text-center font-sans text-clementina-900/60 italic">
              {t.empty}
            </p>
          ) : (
            <div className="space-y-24 lg:space-y-32">
              {members.map((member, idx) => (
                <article
                  key={member.id}
                  className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                    idx % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                  }`}
                >
                  <div
                    className={`relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl ${
                      idx % 2 === 1 ? "lg:col-start-2" : ""
                    }`}
                  >
                    {member.image_url && (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    )}
                  </div>
                  <div className={idx % 2 === 1 ? "lg:col-start-1" : ""}>
                    <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-4">
                      {locale === "es" ? member.role_es : member.role_en}
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl text-clementina-800 leading-tight mb-8">
                      {member.name}
                    </h2>
                    <p className="font-sans text-base text-clementina-900/75 leading-relaxed">
                      {locale === "es" ? member.bio_es : member.bio_en}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-24 bg-clementina-50">
        <Container>
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-4">
                {t.sistersEyebrow}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-clementina-800 leading-tight mb-6">
                {t.sistersTitle}
              </h2>
              <p className="font-sans text-base text-clementina-900/75 leading-relaxed">
                {t.sistersDesc}
              </p>
            </div>
            <div className="lg:col-span-3 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/team/hermanas.jpg"
                alt={t.sistersAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 bg-clementina-800 text-cream-50">
        <Container className="text-center">
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-6 max-w-2xl mx-auto">
            {t.ctaTitle}
          </h2>
          <p className="font-sans text-lg text-cream-100/80 max-w-xl mx-auto mb-10">
            {t.ctaDesc}
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
          >
            {t.ctaButton}
          </Link>
        </Container>
      </section>
    </>
  );
}
