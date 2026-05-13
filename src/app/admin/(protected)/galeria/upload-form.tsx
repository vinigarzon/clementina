"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Select, Label, Field } from "@/components/admin/ui/form";
import { maybeConvertHeic, isHeic } from "@/lib/heic-convert";
import { createGalleryAssets } from "./actions";

const TAGS = [
  "Bodas",
  "Quinces",
  "Graduaciones",
  "Corporativos",
  "Sociales",
  "La Finca",
  "Bautizos",
  "Baby Shower",
  "Aniversarios",
  "Despedidas",
];

interface PendingItem {
  id: string;
  file: File;
  previewUrl: string;
  /** Descripción editable que será el alt en el sitio público. */
  alt: string;
  uploadedUrl: string | null;
  progress: "converting" | "pending" | "uploading" | "done" | "error";
  error?: string;
}

/**
 * Limpia el nombre de archivo para usar como descripción inicial.
 * Ej: "IMG_1313.HEIC" → "IMG 1313", "boda-clementina.jpg" → "Boda clementina"
 */
function filenameToAlt(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function UploadForm() {
  const router = useRouter();
  const [items, setItems] = useState<PendingItem[]>([]);
  const [tag, setTag] = useState("La Finca");
  const [published, setPublished] = useState(true);
  const [pending, startTransition] = useTransition();

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;

    // Insertamos placeholders en estado "converting" para los HEIC.
    // Los no-HEIC quedan listos al instante.
    const initial = Array.from(fileList).map((file) => {
      const heic = isHeic(file);
      return {
        id: crypto.randomUUID(),
        file,
        // El preview de HEIC arranca vacío; lo llenamos después de convertir.
        previewUrl: heic ? "" : URL.createObjectURL(file),
        alt: filenameToAlt(file.name),
        uploadedUrl: null,
        progress: heic
          ? ("converting" as const)
          : ("pending" as const),
      };
    });
    setItems((prev) => [...prev, ...initial]);

    // Convertir HEIC en background, actualizar item con el File JPEG real
    for (const item of initial) {
      if (!isHeic(item.file)) continue;
      try {
        const converted = await maybeConvertHeic(item.file);
        const previewUrl = URL.createObjectURL(converted);
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  file: converted,
                  previewUrl,
                  progress: "pending",
                }
              : p,
          ),
        );
      } catch (e) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  progress: "error",
                  error:
                    e instanceof Error
                      ? e.message
                      : "No se pudo convertir HEIC",
                }
              : p,
          ),
        );
      }
    }
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target && target.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  }

  function setItemAlt(id: string, alt: string) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, alt } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    const supabase = createClient();

    // Marca todos como uploading
    setItems((prev) => prev.map((i) => ({ ...i, progress: "uploading" })));

    // Sube en paralelo. Para entonces ya están convertidos los HEIC.
    const uploads = await Promise.all(
      items.map(async (item) => {
        try {
          const ext = item.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
          const filename = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("media")
            .upload(filename, item.file, { contentType: item.file.type });
          if (upErr) return { item, error: upErr.message };
          const { data } = supabase.storage
            .from("media")
            .getPublicUrl(filename);
          return { item, url: data.publicUrl };
        } catch (e) {
          return {
            item,
            error: e instanceof Error ? e.message : "Error",
          };
        }
      }),
    );

    // Actualiza estados
    setItems((prev) =>
      prev.map((p) => {
        const u = uploads.find((x) => x.item.id === p.id);
        if (!u) return p;
        if ("error" in u && u.error) {
          return { ...p, progress: "error", error: u.error };
        }
        return { ...p, progress: "done", uploadedUrl: u.url! };
      }),
    );

    // Inserta en gallery_assets las que subieron OK
    const ok = uploads.filter((u) => "url" in u && u.url);
    if (ok.length === 0) return;

    startTransition(async () => {
      // Lee del state actual para tomar el alt editado más reciente
      const currentItems = items;
      const res = await createGalleryAssets(
        ok.map((u, idx) => {
          const live = currentItems.find((x) => x.id === u.item.id) ?? u.item;
          const altValue =
            (live.alt && live.alt.trim()) || filenameToAlt(live.file.name);
          return {
            image_url: u.url!,
            alt_es: altValue,
            alt_en: altValue,
            tag,
            sort_order: 1000 + idx,
            featured: false,
            published,
          };
        }),
      );
      if (!res.error) {
        // limpieza y vuelta a la lista
        items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
        router.push("/admin/galeria");
        router.refresh();
      }
    });
  }

  const allDone = items.length > 0 && items.every((i) => i.progress === "done");
  const anyConverting = items.some((i) => i.progress === "converting");

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8">
        <h2 className="font-display text-xl text-clementina-800 mb-6">
          Elige las imágenes
        </h2>

        <label className="block">
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 rounded-2xl border-2 border-dashed border-clementina-300 bg-clementina-50/50 hover:bg-clementina-50 cursor-pointer transition-colors">
            <span className="text-4xl text-clementina-700">+</span>
            <p className="font-sans text-sm text-clementina-900 font-medium">
              Click aquí para seleccionar imágenes
            </p>
            <p className="font-sans text-xs text-clementina-900/60">
              Puedes elegir varias a la vez. Formatos: jpg, png, webp, heic.
              Después podrás editar la descripción de cada una.
            </p>
          </div>
          <input
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>

        {items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {items.map((item) => (
              <div key={item.id} className="space-y-2">
              <div
                className="relative aspect-square rounded-xl overflow-hidden border border-clementina-200 bg-clementina-50"
              >
                {item.previewUrl ? (
                  <Image
                    src={item.previewUrl}
                    alt={item.file.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized
                  />
                ) : (
                  // HEIC en proceso de conversión, aún sin preview
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-clementina-700/70 gap-2">
                    <span className="text-2xl">📷</span>
                    <span className="font-sans text-[10px] text-center px-2 leading-tight">
                      {item.file.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-clementina-900/0 group-hover:bg-clementina-900/40 transition-colors" />
                {item.progress === "converting" && (
                  <div className="absolute inset-0 bg-clementina-900/70 flex flex-col items-center justify-center text-cream-50 font-sans text-xs gap-2">
                    <div className="w-6 h-6 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                    <span>Convirtiendo HEIC…</span>
                  </div>
                )}
                {item.progress === "uploading" && (
                  <div className="absolute inset-0 bg-clementina-900/60 flex items-center justify-center text-cream-50 font-sans text-xs">
                    Subiendo...
                  </div>
                )}
                {item.progress === "done" && (
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                    ✓
                  </div>
                )}
                {item.progress === "error" && (
                  <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white font-sans text-xs p-2 text-center">
                    {item.error || "Error"}
                  </div>
                )}
                {item.progress === "pending" && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-clementina-900/80 text-cream-50 text-lg flex items-center justify-center"
                    aria-label="Quitar"
                  >
                    ×
                  </button>
                )}
              </div>
              {/* Input de descripción debajo del preview */}
              <input
                type="text"
                value={item.alt}
                onChange={(e) => setItemAlt(item.id, e.target.value)}
                placeholder="Describe esta imagen..."
                disabled={
                  item.progress === "uploading" ||
                  item.progress === "done" ||
                  item.progress === "converting"
                }
                className="w-full px-2 py-1.5 text-xs font-sans border border-clementina-200 rounded-md bg-white focus:outline-none focus:border-clementina-600 disabled:bg-clementina-50/60 disabled:text-clementina-900/60"
              />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Datos compartidos
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Estos datos se aplican a todas las imágenes que subas en esta tanda.
          Después puedes editar cada una individualmente.
        </p>

        <Field>
          <Label htmlFor="tag">Categoría</Label>
          <Select
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 accent-clementina-700"
            />
            <span className="font-sans text-sm text-clementina-900">
              Publicar inmediatamente (visible en /galeria)
            </span>
          </label>
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={
            items.length === 0 || pending || allDone || anyConverting
          }
        >
          {pending
            ? "Guardando..."
            : anyConverting
              ? "Convirtiendo HEIC…"
              : items.length === 0
                ? "Elige imágenes primero"
                : `Subir ${items.length} imagen${items.length === 1 ? "" : "es"}`}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/galeria")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
