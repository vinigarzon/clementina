"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Label,
  Input,
  Button,
  Field,
  FieldRow,
} from "@/components/admin/ui/form";
import { createCategory, updateCategory } from "./actions";

interface CategoryData {
  id?: string;
  slug: string;
  name_es: string;
  name_en: string;
  sort_order: number;
  active: boolean;
}

const EMPTY: CategoryData = {
  slug: "",
  name_es: "",
  name_en: "",
  sort_order: 0,
  active: true,
};

export function CategoryForm({ initial }: { initial?: CategoryData }) {
  const router = useRouter();
  const [state, setState] = useState<CategoryData>(initial ?? EMPTY);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const isNew = !initial?.id;

  function set<K extends keyof CategoryData>(key: K, value: CategoryData[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!state.name_es.trim() || !state.name_en.trim()) {
      setFeedback({ type: "err", msg: "El nombre es obligatorio en ambos idiomas." });
      return;
    }
    startTransition(async () => {
      if (isNew) {
        const res = await createCategory(state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateCategory(initial.id, state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
        else {
          setFeedback({ type: "ok", msg: "Cambios guardados." });
          router.refresh();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <FieldRow>
          <Field>
            <Label required htmlFor="name_es">
              Nombre (español)
            </Label>
            <Input
              id="name_es"
              value={state.name_es}
              onChange={(e) => set("name_es", e.target.value)}
              placeholder="Ej: Menú, Bebidas, Flores"
              required
            />
          </Field>
          <Field>
            <Label required htmlFor="name_en">
              Nombre (inglés)
            </Label>
            <Input
              id="name_en"
              value={state.name_en}
              onChange={(e) => set("name_en", e.target.value)}
              placeholder="Ej: Menu, Drinks, Flowers"
              required
            />
          </Field>
        </FieldRow>

        <Field>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={state.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="se genera automático"
          />
        </Field>

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
                Activa
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
              ? "Crear categoría"
              : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/catalogo")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
