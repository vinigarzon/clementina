"use client";

import { useSiteSettings } from "@/components/site/site-settings-provider";
import { useLocale } from "@/i18n/locale-context";

interface WhatsappFabProps {
  message?: string;
}

/**
 * Botón flotante de WhatsApp. Persistente en todo el sitio.
 * El mensaje se puede personalizar por página pasando el prop `message`.
 */
export function WhatsappFab({ message }: WhatsappFabProps) {
  const { whatsapp_number } = useSiteSettings();
  const { locale } = useLocale();
  const defaultMessage =
    locale === "en"
      ? "Hi, I'd like to know more about Finca La Clementina for my event."
      : "Hola, me interesa conocer más sobre Finca La Clementina para mi evento.";
  const finalMessage = message ?? defaultMessage;
  const url = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-[#25D366] text-white shadow-lg shadow-clementina-900/20 hover:scale-105 hover:shadow-xl transition-all"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 fill-current"
        aria-hidden="true"
      >
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.43 0 .07 5.36.07 11.99a11.94 11.94 0 0 0 1.62 6.01L0 24l6.18-1.62a11.97 11.97 0 0 0 5.88 1.5h.01c6.62 0 11.99-5.37 11.99-11.99 0-3.2-1.25-6.21-3.54-8.41ZM12.06 21.81h-.01a9.79 9.79 0 0 1-4.98-1.36l-.36-.21-3.66.96.98-3.57-.24-.37a9.81 9.81 0 1 1 8.27 4.55Zm5.36-7.34c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.59-.9-2.18-.24-.57-.49-.49-.66-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.49 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.74-.71 1.99-1.39.25-.69.25-1.27.17-1.39-.07-.12-.27-.2-.56-.34Z" />
      </svg>
      <span className="font-sans text-sm font-medium">WhatsApp</span>
    </a>
  );
}
