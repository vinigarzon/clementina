import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo Finca La Clementina trata tus datos personales, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHero
        eyebrow="Legales"
        title="Política de Privacidad"
        description="Cómo tratamos tus datos personales en cumplimiento de la LOPDP del Ecuador."
      />

      <section className="py-24 sm:py-32">
        <Container>
          <article className="prose-clementina max-w-3xl space-y-6 font-sans text-base text-clementina-900/80 leading-relaxed">
            <p className="text-sm text-clementina-900/60">
              Última actualización: mayo de 2026.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              1. Responsable del tratamiento
            </h2>
            <p>
              Finca La Clementina, ubicada en Carchi, Ecuador, es responsable
              del tratamiento de los datos personales que recopila a través de
              su sitio web y canales de contacto.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              2. Datos que recopilamos
            </h2>
            <p>
              Recopilamos únicamente los datos necesarios para responder tus
              consultas y gestionar tu evento: nombre, teléfono, correo,
              información del evento solicitado y cualquier dato que tú nos
              compartas voluntariamente.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              3. Finalidad
            </h2>
            <p>
              Tus datos se usan exclusivamente para atender tu consulta,
              preparar cotizaciones, formalizar tu evento y comunicarnos
              contigo. No vendemos ni compartimos tus datos con terceros sin
              tu consentimiento.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              4. Tus derechos
            </h2>
            <p>
              Conforme a la Ley Orgánica de Protección de Datos Personales
              (LOPDP), tienes derecho a acceder, rectificar, eliminar, oponerte
              al tratamiento, solicitar la portabilidad y limitar el uso de
              tus datos personales. Puedes ejercer estos derechos escribiéndonos
              al correo de contacto.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              5. Conservación
            </h2>
            <p>
              Conservamos tus datos durante el tiempo necesario para cumplir la
              finalidad para la que fueron recopilados y, posteriormente,
              durante los plazos legales aplicables.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              6. Seguridad
            </h2>
            <p>
              Aplicamos medidas técnicas y organizativas razonables para
              proteger tus datos contra acceso no autorizado, alteración o
              pérdida.
            </p>

            <h2 className="font-display text-2xl text-clementina-800 mt-10">
              7. Autoridad de control
            </h2>
            <p>
              Si consideras que tus derechos no han sido respetados, puedes
              presentar un reclamo ante la Superintendencia de Protección de
              Datos Personales del Ecuador.
            </p>

            <p className="text-sm text-clementina-900/60 italic mt-12">
              Esta política se revisará por un abogado local antes del
              lanzamiento público definitivo.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
