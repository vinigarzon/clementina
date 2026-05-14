"use client";

import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale, useT } from "@/i18n/locale-context";

const CONTENT = {
  es: {
    lastUpdate: "Última actualización: mayo de 2026.",
    paragraphs: [
      "El uso de este sitio web implica la aceptación de las siguientes condiciones. Los precios mostrados en cotizaciones preliminares son referenciales y están sujetos a confirmación con el equipo comercial. La reserva definitiva de una fecha requiere acuerdo comercial expreso entre Finca La Clementina y el cliente.",
      "El contenido de este sitio, incluyendo textos, imágenes y diseño, es propiedad de Finca La Clementina y está protegido por leyes de derecho de autor. Su reproducción total o parcial sin autorización está prohibida.",
    ],
    footer: "Documento sujeto a revisión legal antes del lanzamiento público.",
  },
  en: {
    lastUpdate: "Last updated: May 2026.",
    paragraphs: [
      "Using this website implies acceptance of the following terms. Prices shown in preliminary quotes are referential and subject to confirmation by the commercial team. The definitive reservation of a date requires an express commercial agreement between Finca La Clementina and the client.",
      "The content of this site, including text, images and design, is the property of Finca La Clementina and is protected by copyright laws. Total or partial reproduction without authorization is prohibited.",
    ],
    footer: "Document subject to legal review before public launch.",
  },
};

export function TerminosContent() {
  const t = useT();
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <>
      <PageHero
        eyebrow={t("legal.eyebrow")}
        title={t("legal.terms.title")}
        description={t("legal.terms.subtitle")}
      />

      <section className="py-24 sm:py-32">
        <Container>
          <article className="max-w-3xl space-y-6 font-sans text-base text-clementina-900/80 leading-relaxed">
            <p className="text-sm text-clementina-900/60">{content.lastUpdate}</p>
            {content.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="text-sm text-clementina-900/60 italic mt-12">
              {content.footer}
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
