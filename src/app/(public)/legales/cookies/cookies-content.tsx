"use client";

import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale, useT } from "@/i18n/locale-context";

const CONTENT = {
  es: {
    lastUpdate: "Última actualización: mayo de 2026.",
    sections: [
      {
        title: "¿Qué son las cookies?",
        body: "Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten que el sitio recuerde tus preferencias y mejore tu experiencia.",
      },
      {
        title: "Cookies que usamos",
        body: "Estrictamente necesarias: permiten el funcionamiento básico del sitio (idioma, sesión). No requieren consentimiento. Analíticas: usamos Google Analytics 4 para entender cómo se utiliza el sitio y mejorarlo. Solo se cargan si aceptas explícitamente.",
      },
      {
        title: "Cómo gestionar tus preferencias",
        body: "Cuando entras al sitio por primera vez te mostramos un banner donde puedes aceptar, rechazar o configurar las cookies. Puedes cambiar tu elección en cualquier momento desde el pie de página.",
      },
    ],
  },
  en: {
    lastUpdate: "Last updated: May 2026.",
    sections: [
      {
        title: "What are cookies?",
        body: "Cookies are small text files stored on your device when you visit a website. They allow the site to remember your preferences and improve your experience.",
      },
      {
        title: "Cookies we use",
        body: "Strictly necessary: required for basic site functionality (language, session). They do not require consent. Analytics: we use Google Analytics 4 to understand how the site is used and improve it. They load only if you explicitly accept.",
      },
      {
        title: "How to manage your preferences",
        body: "When you first enter the site, we show a banner where you can accept, reject or configure cookies. You can change your choice at any time from the footer.",
      },
    ],
  },
};

export function CookiesContent() {
  const t = useT();
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <>
      <PageHero
        eyebrow={t("legal.eyebrow")}
        title={t("legal.cookies.title")}
        description={t("legal.cookies.subtitle")}
      />

      <section className="py-24 sm:py-32">
        <Container>
          <article className="max-w-3xl space-y-6 font-sans text-base text-clementina-900/80 leading-relaxed">
            <p className="text-sm text-clementina-900/60">{content.lastUpdate}</p>
            {content.sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-2xl text-clementina-800 mt-10">
                  {s.title}
                </h2>
                <p>{s.body}</p>
              </div>
            ))}
          </article>
        </Container>
      </section>
    </>
  );
}
