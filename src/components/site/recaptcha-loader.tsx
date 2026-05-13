"use client";

import Script from "next/script";

/**
 * Carga el script de reCAPTCHA v3 cuando hay una NEXT_PUBLIC_RECAPTCHA_SITE_KEY.
 * Si no está configurada, no carga nada (el server action acepta tokens vacíos en modo dev).
 */
export function RecaptchaLoader() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;
  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="afterInteractive"
    />
  );
}

/**
 * Ejecuta reCAPTCHA v3 y devuelve un token. Si no hay site key, devuelve null
 * (el server action lo aceptará en modo dev).
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return null;

  type GrecaptchaWindow = Window & {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  };

  const w = window as GrecaptchaWindow;
  if (!w.grecaptcha) return null;

  return new Promise((resolve) => {
    w.grecaptcha!.ready(async () => {
      try {
        const token = await w.grecaptcha!.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(null);
      }
    });
  });
}
