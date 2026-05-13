"use client";

import { useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";

interface LanguageToggleProps {
  /** Si es true, usa colores claros para fondos oscuros. */
  light?: boolean;
}

export function LanguageToggle({ light = true }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 font-sans text-xs uppercase tracking-widest",
        light ? "text-cream-50/70" : "text-clementina-700",
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("es")}
        className={cn(
          "px-1.5 py-0.5 transition-colors",
          locale === "es"
            ? light
              ? "text-cream-50 font-medium"
              : "text-clementina-900 font-medium"
            : "hover:" + (light ? "text-cream-50" : "text-clementina-900"),
        )}
        aria-label="Cambiar a español"
        aria-pressed={locale === "es"}
      >
        ES
      </button>
      <span className="opacity-40">/</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "px-1.5 py-0.5 transition-colors",
          locale === "en"
            ? light
              ? "text-cream-50 font-medium"
              : "text-clementina-900 font-medium"
            : "hover:" + (light ? "text-cream-50" : "text-clementina-900"),
        )}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
