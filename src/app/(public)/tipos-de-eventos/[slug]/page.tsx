import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getEventTypeBySlug,
  getPublishedEventTypes,
} from "@/lib/data/event-types";
import { getGalleryByTag } from "@/lib/data/gallery";
import {
  isHtml,
  sanitizeBlogHtml,
  markdownFallbackToHtml,
} from "@/lib/blog-html";
import { EventTypeContent } from "./event-type-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventTypeBySlug(slug);
  if (!event) return {};
  return {
    title: event.title_es,
    description: event.short_es,
    openGraph: {
      images: event.image_url ? [event.image_url] : undefined,
    },
  };
}

/**
 * Mapeo de slug → tag de galería. Si un slug coincide con un tag
 * usado en gallery_assets, mostramos las fotos relacionadas.
 */
const SLUG_TO_GALLERY_TAG: Record<string, string> = {
  bodas: "Bodas",
  "quince-anos": "Quinces",
  graduaciones: "Graduaciones",
  corporativos: "Corporativos",
  "bautizos-comuniones": "Bautizos",
  "baby-shower": "Baby Shower",
  aniversarios: "Aniversarios",
  despedidas: "Despedidas",
  sociales: "Sociales",
};

export default async function EventTypePage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventTypeBySlug(slug);
  if (!event) notFound();

  const tag = SLUG_TO_GALLERY_TAG[slug] ?? event.title_es;
  const [others, gallery] = await Promise.all([
    (await getPublishedEventTypes()).filter((e) => e.slug !== event.slug),
    getGalleryByTag(tag),
  ]);

  // Body puede venir como Markdown (legacy) o HTML (editor nuevo)
  const rawBody = (event as { body_es?: string | null }).body_es ?? "";
  const bodyHtml = rawBody
    ? isHtml(rawBody)
      ? sanitizeBlogHtml(rawBody)
      : markdownFallbackToHtml(rawBody)
    : null;

  // WhatsApp message custom del evento si existe
  const whatsappMessage =
    (event as { whatsapp_message_es?: string | null }).whatsapp_message_es ??
    null;

  return (
    <EventTypeContent
      event={{
        slug: event.slug,
        title_es: event.title_es,
        short_es: event.short_es,
        description_es: event.description_es,
        highlights_es: event.highlights_es ?? [],
        image_url: event.image_url,
        whatsappMessage,
        bodyHtml,
      }}
      others={others.map((o) => ({
        id: o.id,
        slug: o.slug,
        title_es: o.title_es,
        image_url: o.image_url,
      }))}
      gallery={gallery.map((g) => ({
        src: g.image_url,
        alt: g.alt_es,
        caption: g.alt_es,
      }))}
    />
  );
}
