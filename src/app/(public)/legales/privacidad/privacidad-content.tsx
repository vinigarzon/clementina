"use client";

import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale, useT } from "@/i18n/locale-context";

const CONTENT = {
  es: {
    lastUpdate: "Última actualización: mayo de 2026.",
    sections: [
      {
        title: "1. Responsable del tratamiento",
        body: "Finca La Clementina, ubicada en Carchi, Ecuador, es responsable del tratamiento de los datos personales que recopila a través de su sitio web y canales de contacto.",
      },
      {
        title: "2. Datos que recopilamos",
        body: "Recopilamos únicamente los datos necesarios para responder tus consultas y gestionar tu evento: nombre, teléfono, correo, información del evento solicitado y cualquier dato que tú nos compartas voluntariamente.",
      },
      {
        title: "3. Finalidad",
        body: "Tus datos se usan exclusivamente para atender tu consulta, preparar cotizaciones, formalizar tu evento y comunicarnos contigo. No vendemos ni compartimos tus datos con terceros sin tu consentimiento.",
      },
      {
        title: "4. Tus derechos",
        body: "Conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP), tienes derecho a acceder, rectificar, eliminar, oponerte al tratamiento, solicitar la portabilidad y limitar el uso de tus datos personales. Puedes ejercer estos derechos escribiéndonos al correo de contacto.",
      },
      {
        title: "5. Conservación",
        body: "Conservamos tus datos durante el tiempo necesario para cumplir la finalidad para la que fueron recopilados y, posteriormente, durante los plazos legales aplicables.",
      },
      {
        title: "6. Seguridad",
        body: "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra acceso no autorizado, alteración o pérdida.",
      },
      {
        title: "7. Autoridad de control",
        body: "Si consideras que tus derechos no han sido respetados, puedes presentar un reclamo ante la Superintendencia de Protección de Datos Personales del Ecuador.",
      },
    ],
    footer:
      "Esta política se revisará por un abogado local antes del lanzamiento público definitivo.",
  },
  en: {
    lastUpdate: "Last updated: May 2026.",
    sections: [
      {
        title: "1. Data controller",
        body: "Finca La Clementina, located in Carchi, Ecuador, is the data controller for personal information collected through its website and contact channels.",
      },
      {
        title: "2. Data we collect",
        body: "We only collect the data needed to respond to your inquiries and manage your event: name, phone, email, requested event information, and any data you voluntarily share with us.",
      },
      {
        title: "3. Purpose",
        body: "Your data is used exclusively to handle your inquiry, prepare quotes, formalize your event and communicate with you. We do not sell or share your data with third parties without your consent.",
      },
      {
        title: "4. Your rights",
        body: "Under Ecuador's Personal Data Protection Law (LOPDP), you have the right to access, rectify, delete, object to the processing, request portability and limit the use of your personal data. You can exercise these rights by writing to our contact email.",
      },
      {
        title: "5. Retention",
        body: "We keep your data for as long as needed to fulfill the purpose it was collected for and, afterwards, during the applicable legal periods.",
      },
      {
        title: "6. Security",
        body: "We apply reasonable technical and organizational measures to protect your data against unauthorized access, alteration or loss.",
      },
      {
        title: "7. Supervisory authority",
        body: "If you believe your rights have not been respected, you may file a complaint with Ecuador's Superintendence of Personal Data Protection.",
      },
    ],
    footer:
      "This policy will be reviewed by a local lawyer before the definitive public launch.",
  },
};

export function PrivacidadContent() {
  const t = useT();
  const { locale } = useLocale();
  const content = CONTENT[locale];

  return (
    <>
      <PageHero
        eyebrow={t("legal.eyebrow")}
        title={t("legal.privacy.title")}
        description={t("legal.privacy.subtitle")}
      />

      <section className="py-24 sm:py-32">
        <Container>
          <article className="prose-clementina max-w-3xl space-y-6 font-sans text-base text-clementina-900/80 leading-relaxed">
            <p className="text-sm text-clementina-900/60">{content.lastUpdate}</p>

            {content.sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-2xl text-clementina-800 mt-10">
                  {s.title}
                </h2>
                <p>{s.body}</p>
              </div>
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
