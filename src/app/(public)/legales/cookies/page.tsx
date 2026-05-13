import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Cómo usamos cookies en nuestro sitio web.",
};

export default function CookiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Política de Cookies"
        description="Cómo usamos cookies para mejorar tu experiencia."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <article className="max-w-3xl space-y-6 font-sans text-base text-clementina-900/80 leading-relaxed">
            <p className="text-sm text-clementina-900/60">
              Última actualización: mayo de 2026.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en
              tu dispositivo cuando visitas un sitio web. Permiten que el
              sitio recuerde tus preferencias y mejore tu experiencia.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              Cookies que usamos
            </h2>
            <p>
              <strong>Estrictamente necesarias:</strong> permiten el
              funcionamiento básico del sitio (idioma, sesión). No requieren
              consentimiento.
            </p>
            <p>
              <strong>Analíticas:</strong> usamos Google Analytics 4 para
              entender cómo se utiliza el sitio y mejorarlo. Solo se cargan si
              aceptas explícitamente.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              Cómo gestionar tus preferencias
            </h2>
            <p>
              Cuando entras al sitio por primera vez te mostramos un banner
              donde puedes aceptar, rechazar o configurar las cookies. Puedes
              cambiar tu elección en cualquier momento desde el pie de página.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
