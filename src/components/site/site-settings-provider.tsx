"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  SITE_SETTINGS_DEFAULTS,
  type SiteSettings,
} from "@/lib/data/site-settings-defaults";

/**
 * Context que expone los SiteSettings a todo client component.
 * El layout raíz (server) lee `getSiteSettings()` y hidrata el provider.
 */
const SiteSettingsContext = createContext<SiteSettings>(SITE_SETTINGS_DEFAULTS);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/**
 * Hook para consumir la configuración del sitio desde cualquier
 * client component.
 *
 * @example
 *   const { whatsapp_number, contact_email } = useSiteSettings();
 *   const wppUrl = `https://wa.me/${whatsapp_number}`;
 */
export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext);
}
