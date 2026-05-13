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
import { createTeamMember, updateTeamMember } from "./actions";

interface TeamMemberData {
  id?: string;
  name: string;
  slug: string;
  role_es: string;
  role_en: string;
  bio_es: string;
  bio_en: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

interface TeamFormProps {
  initial?: TeamMemberData;
}

const EMPTY: TeamMemberData = {
  name: "",
  slug: "",
  role_es: "",
  role_en: "",
  bio_es: "",
  bio_en: "",
  image_url: null,
  sort_order: 0,
  published: true,
};

export function TeamForm({ initial }: TeamFormProps) {
  const router = useRouter();
  const [state, setState] = useState<TeamMemberData>(initial ?? EMPTY);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const isNew = !initial?.id;

  function setField<K extends keyof TeamMemberData>(
    key: K,
    value: TeamMemberData[K],
  ) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!state.name.trim()) {
      setFeedback({ type: "err", msg: "El nombre es obligatorio." });
      return;
    }

    startTransition(async () => {
      if (isNew) {
        const res = await createTeamMember(state);
        if (res?.error) {
          setFeedback({ type: "err", msg: res.error });
        }
        // En éxito, createTeamMember redirige al detalle.
      } else if (initial?.id) {
        const res = await updateTeamMember(initial.id, state);
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
          Datos básicos
        </h2>

        <FieldRow>
          <Field>
            <Label required htmlFor="name">
              Nombre completo
            </Label>
            <Input
              id="name"
              value={state.name}
              onChange={(e) => setField("name", e.target.value)}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={state.slug}
              onChange={(e) => setField("slug", e.target.value)}
              placeholder="se genera automático si lo dejas vacío"
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field>
            <Label required htmlFor="role_es">
              Rol (español)
            </Label>
            <Input
              id="role_es"
              value={state.role_es}
              onChange={(e) => setField("role_es", e.target.value)}
              required
            />
          </Field>
          <Field>
            <Label required htmlFor="role_en">
              Rol (inglés)
            </Label>
            <Input
              id="role_en"
              value={state.role_en}
              onChange={(e) => setField("role_en", e.target.value)}
              required
            />
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Biografía</h2>

        <Field>
          <Label required htmlFor="bio_es">
            Biografía (español)
          </Label>
          <Textarea
            id="bio_es"
            value={state.bio_es}
            onChange={(e) => setField("bio_es", e.target.value)}
            required
          />
        </Field>

        <Field>
          <Label required htmlFor="bio_en">
            Biografía (inglés)
          </Label>
          <Textarea
            id="bio_en"
            value={state.bio_en}
            onChange={(e) => setField("bio_en", e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Foto</h2>
        <ImageUpload
          value={state.image_url}
          folder="team"
          aspect="portrait"
          onChange={(url) => setField("image_url", url)}
        />
        <p className="font-sans text-xs text-clementina-900/60">
          Recomendado: foto vertical, formato 4:5, mínimo 800×1000 px.
        </p>
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
          {pending ? "Guardando..." : isNew ? "Crear miembro" : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/equipo")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
