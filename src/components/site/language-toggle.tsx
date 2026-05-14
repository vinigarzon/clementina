"use client";

import { useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";

interface LanguageToggleProps {
  /** Si es true, usa colores claros para fondos oscuros (sobre hero). */
  light?: boolean;
}

/**
 * Toggle pill ES/EN — más visible que el texto suelto.
 * El idioma activo aparece con fondo cream-50 (modo claro) o
 * clementina-800 (modo oscuro), el inactivo solo texto.
 */
export function LanguageToggle({ light = true }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  const container = cn(
    "inline-flex items-center rounded-full p-0.5 border backdrop-blur-sm transition-colors",
    light
      ? "bg-clementina-900/25 border-cream-50/30"
      : "bg-clementina-50 border-clementina-200",
  );

  function buttonClass(active: boolean) {
    return cn(
      "px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all",
      active
        ? light
          ? "bg-cream-50 text-clementina-800 shadow-sm"
          : "bg-clementina-800 text-cream-50 shadow-sm"
        : light
          ? "text-cream-50/75 hover:text-cream-50"
          : "text-clementina-700 hover:text-clementina-900",
    );
  }

  return (
    <div
      className={container}
      role="group"
      aria-label="Language / Idioma"
    >
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={buttonClass(locale === "es")}
        aria-label="Cambiar a español"
        aria-pressed={locale === "es"}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={buttonClass(locale === "en")}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
