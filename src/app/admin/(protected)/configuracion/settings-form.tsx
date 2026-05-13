"use client";

import { useState, useTransition } from "react";
import type { SiteSettingRow } from "@/lib/data/site-settings-defaults";
import { updateSettings } from "./actions";

interface SettingsFormProps {
  rows: SiteSettingRow[];
}

const CATEGORY_LABELS: Record<string, { title: string; subtitle: string }> = {
  contacto: {
    title: "Contacto público",
    subtitle:
      "Lo que ve el visitante: WhatsApp y correo en footer, header móvil y página de contacto.",
  },
  notificaciones: {
    title: "Notificaciones internas",
    subtitle:
      "Cómo se envían los correos del sistema (lead notifications, confirmaciones, etc.).",
  },
  redes: {
    title: "Redes sociales",
    subtitle: "Enlaces que aparecen en el footer del sitio.",
  },
  direccion: {
    title: "Dirección",
    subtitle:
      "Aparece en el footer, página de contacto, emails y cotizaciones PDF.",
  },
  identidad: {
    title: "Identidad del sitio",
    subtitle: "Nombre y tagline que se usan en titles y metadatos.",
  },
};

const CATEGORY_ORDER = [
  "contacto",
  "notificaciones",
  "redes",
  "direccion",
  "identidad",
];

export function SettingsForm({ rows }: SettingsFormProps) {
  // Estado inicial: clave→valor.
  const initial = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "ok" | "error";
    message: string;
  } | null>(null);

  // Agrupa por categoría manteniendo el orden definido.
  const grouped = new Map<string, SiteSettingRow[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const r of rows) {
    if (!grouped.has(r.category)) grouped.set(r.category, []);
    grouped.get(r.category)!.push(r);
  }

  function dirty(): Partial<Record<string, string>> {
    const out: Record<string, string> = {};
    for (const r of rows) {
      if (values[r.key] !== r.value) out[r.key] = values[r.key];
    }
    return out;
  }
  const dirtyKeys = Object.keys(dirty());
  const hasChanges = dirtyKeys.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const changes = dirty();
    if (Object.keys(changes).length === 0) return;
    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await updateSettings(changes as any);
      if (res.ok) {
        setFeedback({
          type: "ok",
          message: `Guardado · ${dirtyKeys.length} cambio${
            dirtyKeys.length > 1 ? "s" : ""
          } aplicado${dirtyKeys.length > 1 ? "s" : ""} al sitio.`,
        });
        // Actualiza el "estado base": ya no hay cambios sin guardar.
        rows.forEach((r) => {
          if (r.key in changes) r.value = changes[r.key]!;
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error ?? "Error guardando los cambios.",
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {Array.from(grouped.entries())
        .filter(([, items]) => items.length > 0)
        .map(([cat, items]) => {
          const meta = CATEGORY_LABELS[cat] ?? {
            title: cat,
            subtitle: "",
          };
          return (
            <section key={cat}>
              <header className="mb-5">
                <h2 className="font-display text-2xl text-clementina-800 leading-tight">
                  {meta.title}
                </h2>
                {meta.subtitle && (
                  <p className="font-sans text-sm text-clementina-900/60 mt-1">
                    {meta.subtitle}
                  </p>
                )}
              </header>
              <div className="grid sm:grid-cols-2 gap-5 p-6 rounded-2xl bg-white border border-clementina-100">
                {items.map((row) => {
                  const id = `setting-${row.key}`;
                  const inputType =
                    row.input_type === "email"
                      ? "email"
                      : row.input_type === "url"
                        ? "url"
                        : row.input_type === "phone"
                          ? "tel"
                          : "text";
                  const isDirty = values[row.key] !== row.value;
                  return (
                    <div
                      key={row.key}
                      className={
                        row.description && row.description.length > 50
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <label
                        htmlFor={id}
                        className="block font-sans text-sm font-medium text-clementina-900 mb-1.5"
                      >
                        {row.label}
                        {isDirty && (
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-amber-700">
                            sin guardar
                          </span>
                        )}
                      </label>
                      <input
                        id={id}
                        type={inputType}
                        value={values[row.key] ?? ""}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [row.key]: e.target.value }))
                        }
                        className={`w-full px-4 py-2.5 rounded-lg border bg-cream-50 font-sans text-sm focus:outline-none focus:border-clementina-600 ${
                          isDirty
                            ? "border-amber-400"
                            : "border-clementina-200"
                        }`}
                      />
                      {row.description && (
                        <p className="font-sans text-xs text-clementina-900/55 mt-1.5">
                          {row.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

      {/* Footer pegajoso con botón de guardar */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 p-4 rounded-2xl bg-clementina-800 text-cream-50 shadow-xl">
        <div>
          {feedback ? (
            <p
              className={`font-sans text-sm ${
                feedback.type === "ok" ? "text-emerald-200" : "text-rose-200"
              }`}
            >
              {feedback.message}
            </p>
          ) : (
            <p className="font-sans text-sm text-cream-100/80">
              {hasChanges
                ? `${dirtyKeys.length} cambio${dirtyKeys.length > 1 ? "s" : ""} sin guardar`
                : "Todo guardado"}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!hasChanges || pending}
          className="px-6 py-2.5 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
