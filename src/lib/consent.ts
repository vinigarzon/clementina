/**
 * Gestión del consentimiento de cookies (LOPDP Ecuador).
 *
 * Estados posibles:
 *  - 'unset'      → primera visita, mostrar banner
 *  - 'essential'  → solo cookies estrictamente necesarias (rechazado analytics)
 *  - 'all'        → aceptado todo (incluye analytics)
 *
 * Cookies estrictamente necesarias (siempre activas):
 *  - Idioma del visitante
 *  - Estado de consentimiento
 *
 * Cookies sujetas a consentimiento explícito:
 *  - Analíticas (GA4)
 */

export type ConsentLevel = "unset" | "essential" | "all";

const STORAGE_KEY = "clementina_consent";
const STORAGE_DATE_KEY = "clementina_consent_date";

export function readConsent(): ConsentLevel {
  if (typeof window === "undefined") return "unset";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "essential" || v === "all") return v;
    return "unset";
  } catch {
    return "unset";
  }
}

export function writeConsent(level: ConsentLevel) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, level);
    window.localStorage.setItem(STORAGE_DATE_KEY, new Date().toISOString());
    // Notifica a otros listeners (analytics) sin recargar página
    window.dispatchEvent(new CustomEvent("consent-changed", { detail: level }));
  } catch {
    // ignore
  }
}

export function resetConsent() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(STORAGE_DATE_KEY);
    window.dispatchEvent(
      new CustomEvent("consent-changed", { detail: "unset" }),
    );
  } catch {
    // ignore
  }
}

export function consentAcceptsAnalytics(level: ConsentLevel): boolean {
  return level === "all";
}
