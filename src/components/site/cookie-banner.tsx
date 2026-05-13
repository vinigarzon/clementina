"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readConsent,
  writeConsent,
  type ConsentLevel,
} from "@/lib/consent";
import { useLocale } from "@/i18n/locale-context";

const COPY = {
  es: {
    title: "Tu privacidad importa",
    description:
      "Usamos cookies estrictamente necesarias para que el sitio funcione. Con tu permiso, también usamos analíticas (Google Analytics) para entender cómo se usa el sitio y mejorarlo. Tú decides.",
    acceptAll: "Aceptar todas",
    onlyEssential: "Solo necesarias",
    learnMore: "Saber más",
  },
  en: {
    title: "Your privacy matters",
    description:
      "We use strictly necessary cookies for the site to work. With your permission, we also use analytics (Google Analytics) to understand how the site is used and improve it. Your choice.",
    acceptAll: "Accept all",
    onlyEssential: "Only essential",
    learnMore: "Learn more",
  },
};

export function CookieBanner() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const current = readConsent();
    setVisible(current === "unset");

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as ConsentLevel;
      setVisible(detail === "unset");
    };
    window.addEventListener("consent-changed", onChange);
    return () => window.removeEventListener("consent-changed", onChange);
  }, []);

  if (!visible) return null;

  const t = COPY[locale];

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-md z-50 bg-clementina-900 text-cream-50 rounded-2xl shadow-2xl border border-clementina-700/60 p-6 cookie-banner-enter"
    >
      <p
        id="cookie-banner-title"
        className="font-display text-xl mb-3"
      >
        {t.title}
      </p>
      <p
        id="cookie-banner-desc"
        className="font-sans text-sm text-cream-100/85 leading-relaxed mb-5"
      >
        {t.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <button
          type="button"
          onClick={() => writeConsent("all")}
          className="flex-1 px-4 py-2.5 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
        >
          {t.acceptAll}
        </button>
        <button
          type="button"
          onClick={() => writeConsent("essential")}
          className="flex-1 px-4 py-2.5 rounded-full border border-cream-100/40 text-cream-50 font-sans text-sm font-medium hover:bg-cream-100/10 transition-colors"
        >
          {t.onlyEssential}
        </button>
      </div>
      <Link
        href="/legales/cookies"
        className="font-sans text-xs text-cream-100/70 hover:text-cream-50 underline underline-offset-2"
      >
        {t.learnMore}
      </Link>
    </div>
  );
}
