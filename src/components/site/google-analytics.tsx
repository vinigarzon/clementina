"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  readConsent,
  consentAcceptsAnalytics,
  type ConsentLevel,
} from "@/lib/consent";

/**
 * Carga GA4 solo si el visitante aceptó analíticas.
 * Si no hay NEXT_PUBLIC_GA4_ID configurado, no carga nada (modo dev).
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(consentAcceptsAnalytics(readConsent()));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as ConsentLevel;
      setEnabled(consentAcceptsAnalytics(detail));
    };
    window.addEventListener("consent-changed", onChange);
    return () => window.removeEventListener("consent-changed", onChange);
  }, []);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
