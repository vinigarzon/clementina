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
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { createEventType, updateEventType } from "./actions";

interface EventTypeData {
  id?: string;
  slug: string;
  title_es: string;
  title_en: string;
  short_es: string;
  short_en: string;
  description_es: string;
  description_en: string;
  highlights_es: string[];
  highlights_en: string[];
  body_es: string;
  body_en: string;
  whatsapp_message_es: string | null;
  whatsapp_message_en: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

const EMPTY: EventTypeData = {
  slug: "",
  title_es: "",
  title_en: "",
  short_es: "",
  short_en: "",
  description_es: "",
  description_en: "",
  highlights_es: [],
  highlights_en: [],
  body_es: "",
  body_en: "",
  whatsapp_message_es: null,
  whatsapp_message_en: null,
  image_url: null,
  sort_order: 0,
  published: true,
};

/**
 * Convierte un array de strings en texto multilinea para mostrar en textarea.
 */
function listToText(items: string[]): string {
  return items.join("\n");
}

/**
 * Convierte texto multilinea en array, ignorando líneas vacías.
 */
function textToList(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function EventTypeForm({ initial }: { initial?: EventTypeData }) {
  const router = useRouter();
  const [state, setState] = useState<EventTypeData>(initial ?? EMPTY);
  const [highlightsEsText, setHighlightsEsText] = useState(
    listToText(initial?.highlights_es ?? []),
  );
  const [highlightsEnText, setHighlightsEnText] = useState(
    listToText(initial?.highlights_en ?? []),
  );
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const isNew = !initial?.id;

  function setField<K extends keyof EventTypeData>(
    key: K,
    value: EventTypeData[K],
  ) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!state.title_es.trim() || !state.title_en.trim()) {
      setFeedback({ type: "err", msg: "El título es obligatorio en ambos idiomas." });
      return;
    }

    const data = {
      ...state,
      highlights_es: textToList(highlightsEsText),
      highlights_en: textToList(highlightsEnText),
    };

    startTransition(async () => {
      if (isNew) {
        const res = await createEventType(data);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateEventType(initial.id, data);
        if (res?.error) {
          setFeedback({ type: "err", msg: res.error });
        } else {
          setFeedback({ type: "ok", msg: "Cambios guardados." });
          router.refresh();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Identificación
        </h2>

        <FieldRow>
          <Field>
            <Label required htmlFor="title_es">
              Título (español)
            </Label>
            <Input
              id="title_es"
              value={state.title_es}
              onChange={(e) => setField("title_es", e.target.value)}
              required
              placeholder="Ej: Bodas"
            />
          </Field>
          <Field>
            <Label required htmlFor="title_en">
              Título (inglés)
            </Label>
            <Input
              id="title_en"
              value={state.title_en}
              onChange={(e) => setField("title_en", e.target.value)}
              required
              placeholder="Ej: Weddings"
            />
          </Field>
        </FieldRow>

        <Field>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={state.slug}
            onChange={(e) => setField("slug", e.target.value)}
            placeholder="se genera automático si lo dejas vacío"
          />
          <p className="font-sans text-xs text-clementina-900/60 mt-1">
            Aparece en la URL: /tipos-de-eventos/<strong>{state.slug || "tu-slug"}</strong>
          </p>
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Descripción corta
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Una frase atractiva. Se muestra en la lista de eventos y en cards.
        </p>

        <FieldRow>
          <Field>
            <Label required htmlFor="short_es">
              Frase (español)
            </Label>
            <Input
              id="short_es"
              value={state.short_es}
              onChange={(e) => setField("short_es", e.target.value)}
              required
              maxLength={120}
            />
          </Field>
          <Field>
            <Label required htmlFor="short_en">
              Frase (inglés)
            </Label>
            <Input
              id="short_en"
              value={state.short_en}
              onChange={(e) => setField("short_en", e.target.value)}
              required
              maxLength={120}
            />
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Descripción larga
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Párrafo que aparece en la página detalle del tipo de evento.
        </p>

        <Field>
          <Label htmlFor="description_es">Descripción (español)</Label>
          <Textarea
            id="description_es"
            value={state.description_es}
            onChange={(e) => setField("description_es", e.target.value)}
          />
        </Field>

        <Field>
          <Label htmlFor="description_en">Descripción (inglés)</Label>
          <Textarea
            id="description_en"
            value={state.description_en}
            onChange={(e) => setField("description_en", e.target.value)}
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Lo que incluye (highlights)
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Lista de bullets que aparecen en la página detalle.
          <br />
          <strong>Una línea por bullet.</strong> Las líneas vacías se ignoran.
        </p>

        <Field>
          <Label htmlFor="highlights_es">Highlights (español)</Label>
          <Textarea
            id="highlights_es"
            value={highlightsEsText}
            onChange={(e) => setHighlightsEsText(e.target.value)}
            placeholder={"Ceremonia civil o religiosa\nCapacidad de 50 a 300 invitados\nCatering, flores, música y fotografía"}
            rows={5}
          />
        </Field>

        <Field>
          <Label htmlFor="highlights_en">Highlights (inglés)</Label>
          <Textarea
            id="highlights_en"
            value={highlightsEnText}
            onChange={(e) => setHighlightsEnText(e.target.value)}
            placeholder={"Civil or religious ceremony\nCapacity for 50 to 300 guests\nCatering, flowers, music and photography"}
            rows={5}
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Contenido completo
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Texto extenso que aparece debajo de los highlights en la página
          detalle. Soporta Markdown: usa <code>## Subtítulo</code> para
          separar secciones (Ideas, Conexión con Tulcán, Gastronomía,
          Preguntas frecuentes…) y <code>**negrita**</code> para las
          preguntas de FAQ.
        </p>

        <Field>
          <Label htmlFor="body_es">Contenido (español)</Label>
          <MarkdownEditor
            id="body_es"
            value={state.body_es}
            onChange={(v) => setField("body_es", v)}
            rows={20}
            placeholder={
              "Aquí los novios pueden imaginar una ceremonia al aire libre...\n\n## Ideas para enriquecer la experiencia\n\n- Crear un recorrido fotográfico para los novios.\n- ...\n\n## Conexión con Tulcán y Carchi\n\nUna boda en La Clementina puede conectar con la tradición carchense...\n\n## Preguntas frecuentes\n\n**¿Se puede hacer ceremonia y recepción en el mismo lugar?**\n\nSí. La Clementina puede ser el punto de encuentro..."
            }
          />
        </Field>

        <Field>
          <Label htmlFor="body_en">Contenido (inglés)</Label>
          <MarkdownEditor
            id="body_en"
            value={state.body_en}
            onChange={(v) => setField("body_en", v)}
            rows={20}
            placeholder="English content (markdown)..."
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Mensaje de WhatsApp
        </h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Mensaje precargado que se podrá usar para abrir WhatsApp con el
          contexto de este tipo de evento. Opcional.
        </p>

        <FieldRow>
          <Field>
            <Label htmlFor="whatsapp_message_es">Mensaje (español)</Label>
            <Textarea
              id="whatsapp_message_es"
              value={state.whatsapp_message_es ?? ""}
              onChange={(e) =>
                setField(
                  "whatsapp_message_es",
                  e.target.value || null,
                )
              }
              rows={3}
              placeholder="Hola, quisiera información para celebrar mi boda en Finca La Clementina..."
            />
          </Field>
          <Field>
            <Label htmlFor="whatsapp_message_en">Mensaje (inglés)</Label>
            <Textarea
              id="whatsapp_message_en"
              value={state.whatsapp_message_en ?? ""}
              onChange={(e) =>
                setField(
                  "whatsapp_message_en",
                  e.target.value || null,
                )
              }
              rows={3}
              placeholder="Hi, I'd like information about hosting my wedding at Finca La Clementina..."
            />
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Imagen</h2>
        <p className="font-sans text-sm text-clementina-900/70">
          Foto representativa del tipo de evento. Se usa de portada en cards y
          como hero en la página detalle.
        </p>
        <ImageUpload
          value={state.image_url}
          folder="events"
          aspect="landscape"
          onChange={(url) => setField("image_url", url)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Publicación
        </h2>

        <FieldRow>
          <Field>
            <Label htmlFor="sort_order">Orden</Label>
            <Input
              id="sort_order"
              type="number"
              value={state.sort_order}
              onChange={(e) =>
                setField("sort_order", Number(e.target.value) || 0)
              }
            />
            <p className="font-sans text-xs text-clementina-900/60 mt-1">
              Menor número = aparece primero.
            </p>
          </Field>
          <Field>
            <Label htmlFor="published">Estado</Label>
            <label className="flex items-center gap-3 mt-2">
              <input
                id="published"
                type="checkbox"
                checked={state.published}
                onChange={(e) => setField("published", e.target.checked)}
                className="w-5 h-5 accent-clementina-700"
              />
              <span className="font-sans text-sm text-clementina-900">
                Publicado (visible en el sitio)
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
              ? "Crear tipo de evento"
              : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/tipos-de-eventos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
