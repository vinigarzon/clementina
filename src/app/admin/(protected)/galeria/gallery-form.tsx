"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Label,
  Input,
  Select,
  Button,
  Field,
  FieldRow,
} from "@/components/admin/ui/form";
import { ImageUpload } from "@/components/admin/image-upload";
import { updateGalleryAsset } from "./actions";

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

interface AssetData {
  id: string;
  image_url: string;
  alt_es: string;
  alt_en: string;
  tag: string;
  sort_order: number;
  featured: boolean;
  published: boolean;
}

export function GalleryForm({ initial }: { initial: AssetData }) {
  const router = useRouter();
  const [state, setState] = useState<AssetData>(initial);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof AssetData>(key: K, value: AssetData[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!state.image_url) {
      setFeedback({ type: "err", msg: "Sube una imagen primero." });
      return;
    }

    startTransition(async () => {
      const res = await updateGalleryAsset(state.id, {
        image_url: state.image_url,
        alt_es: state.alt_es,
        alt_en: state.alt_en,
        tag: state.tag,
        sort_order: state.sort_order,
        featured: state.featured,
        published: state.published,
      });
      if (res?.error) {
        setFeedback({ type: "err", msg: res.error });
      } else {
        setFeedback({ type: "ok", msg: "Cambios guardados." });
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8">
        <h2 className="font-display text-xl text-clementina-800 mb-6">Imagen</h2>
        <ImageUpload
          value={state.image_url}
          folder="gallery"
          aspect="square"
          onChange={(url) => set("image_url", url ?? "")}
        />
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">Metadatos</h2>

        <FieldRow>
          <Field>
            <Label htmlFor="alt_es">Descripción (español)</Label>
            <Input
              id="alt_es"
              value={state.alt_es}
              onChange={(e) => set("alt_es", e.target.value)}
              placeholder="Ej: Boda en La Clementina"
            />
          </Field>
          <Field>
            <Label htmlFor="alt_en">Descripción (inglés)</Label>
            <Input
              id="alt_en"
              value={state.alt_en}
              onChange={(e) => set("alt_en", e.target.value)}
              placeholder="Ej: Wedding at La Clementina"
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field>
            <Label htmlFor="tag">Categoría</Label>
            <Select
              id="tag"
              value={state.tag}
              onChange={(e) => set("tag", e.target.value)}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              {!TAGS.includes(state.tag) && (
                <option value={state.tag}>{state.tag}</option>
              )}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="sort_order">Orden</Label>
            <Input
              id="sort_order"
              type="number"
              value={state.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
            />
          </Field>
        </FieldRow>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={state.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-5 h-5 accent-clementina-700"
            />
            <span className="font-sans text-sm text-clementina-900">
              Destacada (carrusel home)
            </span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={state.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-5 h-5 accent-clementina-700"
            />
            <span className="font-sans text-sm text-clementina-900">
              Publicada en /galeria
            </span>
          </label>
        </div>
      </div>

      {feedback && (
        <div
          className={`px-5 py-3 rounded-lg font-sans text-sm ${
            feedback.type === "ok"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Guardar cambios"}
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
