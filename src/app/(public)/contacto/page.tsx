import type { Metadata } from "next";
import { getPublishedEventTypes } from "@/lib/data/event-types";
import { ContactSection } from "./contact-section";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Conversemos sobre tu evento. Llámanos, escríbenos por WhatsApp o déjanos tus datos y nos comunicamos contigo.",
};

export const revalidate = 60;

export default async function ContactoPage() {
  const eventTypes = await getPublishedEventTypes();
  return (
    <ContactSection
      eventTypeOptions={eventTypes.map((t) => ({
        slug: t.slug,
        label: t.title_es,
      }))}
    />
  );
}
