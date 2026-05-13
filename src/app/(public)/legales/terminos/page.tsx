import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos de uso del sitio web de Finca La Clementina.",
};

export default function TerminosPage() {
  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Términos y Condiciones"
        description="Condiciones de uso del sitio web."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <article className="max-w-3xl space-y-6 font-sans text-base text-clementina-900/80 leading-relaxed">
            <p className="text-sm text-clementina-900/60">
              Última actualización: mayo de 2026.
            </p>

            <p>
              El uso de este sitio web implica la aceptación de las siguientes
              condiciones. Los precios mostrados en cotizaciones preliminares
              son referenciales y están sujetos a confirmación con el equipo
              comercial. La reserva definitiva de una fecha requiere acuerdo
              comercial expreso entre Finca La Clementina y el cliente.
            </p>

            <p>
              El contenido de este sitio, incluyendo textos, imágenes y diseño,
              es propiedad de Finca La Clementina y está protegido por leyes
              de derecho de autor. Su reproducción total o parcial sin
              autorización está prohibida.
            </p>

            <p className="text-sm text-clementina-900/60 italic mt-12">
              Documento sujeto a revisión legal antes del lanzamiento público.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
