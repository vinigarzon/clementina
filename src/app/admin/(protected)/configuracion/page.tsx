import { getAllSiteSettings } from "@/lib/data/site-settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracionPage() {
  const rows = await getAllSiteSettings();

  return (
    <div>
      <header className="mb-10">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Sistema · Configuración
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Configuración del sitio
        </h1>
        <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
          Edita aquí los datos de contacto, redes y notificaciones. Los cambios
          impactan inmediatamente en el sitio público (sin redeploy).
        </p>
      </header>

      {rows.length === 0 ? (
        <div className="p-8 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="font-display text-xl text-amber-900 mb-2">
            La tabla site_settings aún no está creada
          </p>
          <p className="font-sans text-sm text-amber-900/80">
            Aplica la migración{" "}
            <code className="px-1.5 py-0.5 rounded bg-amber-100">
              0009_site_settings.sql
            </code>{" "}
            en Supabase → SQL Editor para activar esta pantalla.
          </p>
        </div>
      ) : (
        <SettingsForm rows={rows} />
      )}
    </div>
  );
}
