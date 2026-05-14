import type { Metadata } from "next";
import { getPublishedEventTypes } from "@/lib/data/event-types";
import { EventsListContent } from "./events-list-content";

export const metadata: Metadata = {
  title: "Tipos de eventos",
  description:
    "Bodas, quinces, grados, eventos corporativos, bautizos, baby showers, aniversarios, despedidas y reuniones sociales. Cada celebración encuentra su lugar.",
};

export const revalidate = 60;

export default async function TiposDeEventosPage() {
  const events = await getPublishedEventTypes();

  return (
    <EventsListContent
      events={events.map((e) => ({
        id: e.id,
        slug: e.slug,
        title_es: e.title_es,
        title_en: e.title_en ?? e.title_es,
        short_es: e.short_es,
        short_en: e.short_en ?? e.short_es,
        image_url: e.image_url,
      }))}
    />
  );
}
