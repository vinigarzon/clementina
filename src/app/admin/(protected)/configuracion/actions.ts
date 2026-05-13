"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/data/site-settings";

export interface UpdateSettingsResult {
  ok: boolean;
  error?: string;
}

/**
 * Actualiza uno o varios settings en la tabla site_settings.
 * Después revalida toda la app para que los nuevos valores
 * aparezcan inmediatamente en el sitio público.
 */
export async function updateSettings(
  values: Partial<SiteSettings>,
): Promise<UpdateSettingsResult> {
  const supabase = await createClient();

  // Validación básica de emails y URLs.
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string") continue;
    if (key.endsWith("_email") && value && !isValidEmail(value)) {
      return { ok: false, error: `"${key}": el correo no es válido.` };
    }
    if (key.endsWith("_url") && value && !isValidUrl(value)) {
      return { ok: false, error: `"${key}": la URL no es válida.` };
    }
  }

  // Upsert key por key (la tabla es key-value).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== "string") continue;
    const { error } = await sb
      .from("site_settings")
      .update({ value })
      .eq("key", key);
    if (error) {
      console.error("[updateSettings]", key, error);
      return {
        ok: false,
        error: `No se pudo guardar "${key}": ${error.message}`,
      };
    }
  }

  // Refresca todo el sitio público (el provider lee desde el layout raíz).
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");

  return { ok: true };
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
