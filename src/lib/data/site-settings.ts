/**
 * Server-only: lee la tabla site_settings desde Supabase.
 *
 * Para tipos/defaults que también necesitan client components, importa
 * desde `./site-settings-defaults.ts`. Este archivo importa
 * `@/lib/supabase/server` (que usa `next/headers`) y NO puede ser
 * arrastrado al bundle client.
 */
import { createClient } from "@/lib/supabase/server";
import {
  SITE_SETTINGS_DEFAULTS,
  type SiteSettings,
  type SiteSettingRow,
} from "./site-settings-defaults";
import { siteConfig } from "@/lib/site-config";

// Re-exportamos para que los consumers server-side puedan seguir
// importando todo desde "@/lib/data/site-settings" sin saber del split.
export {
  SITE_SETTINGS_DEFAULTS,
  type SiteSettings,
  type SiteSettingRow,
  type SiteSettingKey,
} from "./site-settings-defaults";

/**
 * Lee TODOS los settings (incluso los no públicos). Solo úsalo desde
 * el panel admin o desde server actions.
 */
export async function getAllSiteSettings(): Promise<SiteSettingRow[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data, error } = await sb
    .from("site_settings")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[getAllSiteSettings]", error);
    return [];
  }
  return (data ?? []) as SiteSettingRow[];
}

/**
 * Devuelve un objeto fuertemente tipado con todos los valores actuales
 * del sitio. Fusiona DB > env vars > defaults. Si la tabla aún no existe
 * (porque no se aplicó la migración 0009) devuelve los defaults.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  // Defaults enriquecidos con env vars (solo disponibles server-side).
  const defaults: SiteSettings = {
    ...SITE_SETTINGS_DEFAULTS,
    lead_notification_email:
      process.env.LEAD_NOTIFICATION_EMAIL ||
      SITE_SETTINGS_DEFAULTS.lead_notification_email,
    resend_from_email:
      process.env.RESEND_FROM_EMAIL ||
      SITE_SETTINGS_DEFAULTS.resend_from_email,
    resend_from_name:
      process.env.RESEND_FROM_NAME || siteConfig.name,
  };

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data, error } = await sb.from("site_settings").select("key, value");
  if (error || !data) {
    return defaults;
  }
  const merged: SiteSettings = { ...defaults };
  const mergedAny = merged as unknown as Record<string, string>;
  for (const row of data as Array<{ key: string; value: string }>) {
    if (row.key in merged) {
      mergedAny[row.key] = row.value;
    }
  }
  return merged;
}
