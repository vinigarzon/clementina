"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Label,
  Input,
  Textarea,
  Button,
  Field,
  FieldRow,
} from "@/components/admin/ui/form";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createBlogPost, updateBlogPost } from "./actions";

interface BlogPostData {
  id?: string;
  slug: string;
  title_es: string;
  title_en: string | null;
  excerpt_es: string | null;
  excerpt_en: string | null;
  body_es: string;
  body_en: string | null;
  cover_url: string | null;
  category: string | null;
  tags: string[];
  author_name: string;
  published: boolean;
  published_at: string;
  sort_order: number;
}

const EMPTY: BlogPostData = {
  slug: "",
  title_es: "",
  title_en: "",
  excerpt_es: "",
  excerpt_en: "",
  body_es: "",
  body_en: "",
  cover_url: null,
  category: "",
  tags: [],
  author_name: "Equipo La Clementina",
  published: true,
  published_at: new Date().toISOString().slice(0, 10),
  sort_order: 0,
};

const CATEGORIES = [
  "bodas",
  "consejos",
  "flores",
  "gastronomia",
  "corporativos",
  "tendencias",
];

export function BlogForm({ initial }: { initial?: BlogPostData }) {
  const router = useRouter();
  const [state, setState] = useState<BlogPostData>(
    initial
      ? {
          ...initial,
          // Recortar timestamp a yyyy-mm-dd para el input date
          published_at: initial.published_at.slice(0, 10),
        }
      : EMPTY,
  );
  const [tagsText, setTagsText] = useState(state.tags.join(", "));
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const isNew = !initial?.id;

  function set<K extends keyof BlogPostData>(key: K, value: BlogPostData[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!state.title_es.trim()) {
      setFeedback({ type: "err", msg: "El título en español es obligatorio." });
      return;
    }
    if (!state.body_es.trim()) {
      setFeedback({ type: "err", msg: "El cuerpo del artículo es obligatorio." });
      return;
    }

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = { ...state, tags };

    startTransition(async () => {
      if (isNew) {
        const res = await createBlogPost(payload);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateBlogPost(initial.id, payload);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
        else {
          setFeedback({ type: "ok", msg: "Cambios guardados." });
          router.refresh();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Título</h2>
        <FieldRow>
          <Field>
            <Label required htmlFor="title_es">
              Título (español)
            </Label>
            <Input
              id="title_es"
              value={state.title_es}
              onChange={(e) => set("title_es", e.target.value)}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="title_en">Título (inglés)</Label>
            <Input
              id="title_en"
              value={state.title_en ?? ""}
              onChange={(e) => set("title_en", e.target.value)}
              placeholder="(opcional)"
            />
          </Field>
        </FieldRow>
        <Field>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={state.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="se genera automático si lo dejas vacío"
          />
          <p className="font-sans text-xs text-clementina-900/60 mt-1">
            URL: /blog/<strong>{state.slug || "tu-slug"}</strong>
          </p>
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Imagen de portada
        </h2>
        <ImageUpload
          value={state.cover_url}
          folder="blog"
          aspect="landscape"
          onChange={(url) => set("cover_url", url)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Resumen (excerpt)
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Aparece en la lista de artículos y como descripción para SEO.
        </p>
        <Field>
          <Label htmlFor="excerpt_es">Resumen (español)</Label>
          <Textarea
            id="excerpt_es"
            value={state.excerpt_es ?? ""}
            onChange={(e) => set("excerpt_es", e.target.value)}
            rows={3}
          />
        </Field>
        <Field>
          <Label htmlFor="excerpt_en">Resumen (inglés)</Label>
          <Textarea
            id="excerpt_en"
            value={state.excerpt_en ?? ""}
            onChange={(e) => set("excerpt_en", e.target.value)}
            rows={3}
            placeholder="(opcional)"
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Cuerpo del artículo
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Editor visual. Copia y pega desde Word, Google Docs o cualquier
          página web — se conserva el formato (negritas, listas, links,
          subtítulos).
        </p>
        <Field>
          <Label required>Contenido (español)</Label>
          <RichTextEditor
            value={state.body_es}
            onChange={(html) => set("body_es", html)}
          />
        </Field>
        <Field>
          <Label>Contenido (inglés)</Label>
          <RichTextEditor
            value={state.body_en ?? ""}
            onChange={(html) => set("body_en", html)}
            placeholder="(opcional — si está vacío se muestra el español)"
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Categorización
        </h2>
        <FieldRow>
          <Field>
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              value={state.category ?? ""}
              onChange={(e) => set("category", e.target.value)}
              placeholder="ej: bodas, consejos, flores..."
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field>
            <Label htmlFor="tags">Etiquetas (separadas por coma)</Label>
            <Input
              id="tags"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="boda, decoración, flores"
            />
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Publicación
        </h2>
        <FieldRow>
          <Field>
            <Label htmlFor="author_name">Autor</Label>
            <Input
              id="author_name"
              value={state.author_name}
              onChange={(e) => set("author_name", e.target.value)}
            />
          </Field>
          <Field>
            <Label htmlFor="published_at">Fecha de publicación</Label>
            <Input
              id="published_at"
              type="date"
              value={state.published_at.slice(0, 10)}
              onChange={(e) => set("published_at", e.target.value)}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field>
            <Label htmlFor="sort_order">Orden</Label>
            <Input
              id="sort_order"
              type="number"
              value={state.sort_order}
              onChange={(e) =>
                set("sort_order", Number(e.target.value) || 0)
              }
            />
          </Field>
          <Field>
            <Label htmlFor="published">Estado</Label>
            <label className="flex items-center gap-3 mt-2">
              <input
                id="published"
                type="checkbox"
                checked={state.published}
                onChange={(e) => set("published", e.target.checked)}
                className="w-5 h-5 accent-clementina-700"
              />
              <span className="font-sans text-sm text-clementina-900">
                Publicado (visible en /blog)
              </span>
            </label>
          </Field>
        </FieldRow>
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
          {pending
            ? "Guardando..."
            : isNew
              ? "Publicar artículo"
              : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/blog")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
