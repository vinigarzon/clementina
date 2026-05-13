/**
 * Tipos y valores por defecto de la configuración del sitio.
 *
 * Este archivo NO importa nada server-only (Supabase, next/headers,
 * fs, etc.) para que sea seguro consumirlo desde client components
 * (el SiteSettingsProvider lo usa).
 *
 * Los fetchers (`getSiteSettings`, `getAllSiteSettings`) viven en
 * `./site-settings.ts` (server-only).
 */
import { siteConfig } from "@/lib/site-config";

// ============ TIPOS ============

export interface SiteSettings {
  // Contacto
  whatsapp_number: string;
  whatsapp_display: string;
  contact_email: string;
  // Notificaciones
  lead_notification_email: string;
  resend_from_email: string;
  resend_from_name: string;
  // Redes
  instagram_url: string;
  facebook_url: string;
  // Dirección
  address_line1: string;
  address_line2: string;
  address_city: string;
  // Identidad
  site_name: string;
  site_tagline: string;
}

export type SiteSettingKey = keyof SiteSettings;

export interface SiteSettingRow {
  key: SiteSettingKey;
  value: string;
  label: string;
  description: string | null;
  category: string;
  input_type: "text" | "email" | "phone" | "url";
  public_read: boolean;
  sort_order: number;
}

// ============ DEFAULTS ============

/** Si la tabla aún no existe o falta una clave, caemos a esto. */
export const SITE_SETTINGS_DEFAULTS: SiteSettings = {
  whatsapp_number: siteConfig.contact.whatsappNumber,
  whatsapp_display: siteConfig.contact.whatsappDisplay,
  contact_email: siteConfig.contact.email,
  // En cliente las env vars no están disponibles, pero solo
  // se usa este default si la tabla site_settings no respondió
  // (caso muy raro). En ese escenario fallback al correo público.
  lead_notification_email: siteConfig.contact.email,
  resend_from_email: "onboarding@resend.dev",
  resend_from_name: siteConfig.name,
  instagram_url: siteConfig.social.instagram,
  facebook_url: siteConfig.social.facebook,
  address_line1: siteConfig.address.line1,
  address_line2: siteConfig.address.line2,
  address_city: siteConfig.address.city,
  site_name: siteConfig.name,
  site_tagline: siteConfig.tagline,
};
