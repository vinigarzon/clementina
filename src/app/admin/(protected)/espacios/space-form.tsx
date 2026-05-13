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
import { createSpace, updateSpace } from "./actions";

interface SpaceData {
  id?: string;
  slug: string;
  name: string;
  description: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  active: boolean;
  sort_order: number;
}

const EMPTY: SpaceData = {
  slug: "",
  name: "",
  description: "",
  capacity_min: null,
  capacity_max: null,
  active: true,
  sort_order: 0,
};

export function SpaceForm({ initial }: { initial?: SpaceData }) {
  const router = useRouter();
  const [state, setState] = useState<SpaceData>(initial ?? EMPTY);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const isNew = !initial?.id;

  function set<K extends keyof SpaceData>(key: K, value: SpaceData[K]) {
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
        const res = await createSpace(state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateSpace(initial.id, state);
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
          Datos del espacio
        </h2>

        <FieldRow>
          <Field>
            <Label required htmlFor="name">
              Nombre
            </Label>
            <Input
              id="name"
              value={state.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Ej: Salón principal, Jardín, Capilla"
              required
            />
          </Field>
          <Field>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={state.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="se genera automático"
            />
          </Field>
        </FieldRow>

        <Field>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={state.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Notas internas sobre el espacio (orientación, equipamiento, restricciones, etc.)"
          />
        </Field>

        <FieldRow>
          <Field>
            <Label htmlFor="capacity_min">Capacidad mínima</Label>
            <Input
              id="capacity_min"
              type="number"
              min={0}
              value={state.capacity_min ?? ""}
              onChange={(e) =>
                set(
                  "capacity_min",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              placeholder="invitados"
            />
          </Field>
          <Field>
            <Label htmlFor="capacity_max">Capacidad máxima</Label>
            <Input
              id="capacity_max"
              type="number"
              min={0}
              value={state.capacity_max ?? ""}
              onChange={(e) =>
                set(
                  "capacity_max",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              placeholder="invitados"
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
            <Label htmlFor="active">Estado</Label>
            <label className="flex items-center gap-3 mt-2">
              <input
                id="active"
                type="checkbox"
                checked={state.active}
                onChange={(e) => set("active", e.target.checked)}
                className="w-5 h-5 accent-clementina-700"
              />
              <span className="font-sans text-sm text-clementina-900">
                Activo (disponible para reservar)
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
              ? "Crear espacio"
              : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/espacios")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
