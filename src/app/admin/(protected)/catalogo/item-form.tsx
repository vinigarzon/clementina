"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Label,
  Input,
  Textarea,
  Select,
  Button,
  Field,
  FieldRow,
} from "@/components/admin/ui/form";
import { ImageUpload } from "@/components/admin/image-upload";
import { createItem, updateItem } from "./actions";

interface ItemData {
  id?: string;
  category_id: string | null;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  unit_type: string;
  sale_price: number;
  cost_price: number | null;
  active: boolean;
  public_visible: boolean;
  sort_order: number;
  valid_from: string | null;
  valid_until: string | null;
  image_url: string | null;
}

interface Category {
  id: string;
  name_es: string;
}

const EMPTY: ItemData = {
  category_id: null,
  slug: "",
  name_es: "",
  name_en: "",
  description_es: "",
  description_en: "",
  unit_type: "unidad",
  sale_price: 0,
  cost_price: null,
  active: true,
  public_visible: true,
  sort_order: 0,
  valid_from: null,
  valid_until: null,
  image_url: null,
};

const UNIT_TYPES = [
  { value: "unidad", label: "Unidad (por pieza)" },
  { value: "persona", label: "Por persona" },
  { value: "hora", label: "Por hora" },
  { value: "paquete", label: "Paquete" },
  { value: "servicio", label: "Servicio (precio fijo)" },
];

interface ItemFormProps {
  initial?: ItemData;
  categories: Category[];
  canSeeCost: boolean;
}

export function ItemForm({ initial, categories, canSeeCost }: ItemFormProps) {
  const router = useRouter();
  const [state, setState] = useState<ItemData>(initial ?? EMPTY);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const isNew = !initial?.id;

  function set<K extends keyof ItemData>(key: K, value: ItemData[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  const margin = useMemo(() => {
    if (state.cost_price == null || state.sale_price === 0) return null;
    return (
      ((state.sale_price - state.cost_price) / state.sale_price) * 100
    );
  }, [state.sale_price, state.cost_price]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!state.name_es.trim() || !state.name_en.trim()) {
      setFeedback({ type: "err", msg: "El nombre es obligatorio en ambos idiomas." });
      return;
    }
    if (state.sale_price < 0) {
      setFeedback({ type: "err", msg: "El precio no puede ser negativo." });
      return;
    }
    startTransition(async () => {
      if (isNew) {
        const res = await createItem(state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateItem(initial.id, state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
        else {
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
            <Label required htmlFor="name_es">
              Nombre (español)
            </Label>
            <Input
              id="name_es"
              value={state.name_es}
              onChange={(e) => set("name_es", e.target.value)}
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
              required
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field>
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              id="category_id"
              value={state.category_id ?? ""}
              onChange={(e) => set("category_id", e.target.value || null)}
            >
              <option value="">(sin categoría)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_es}
                </option>
              ))}
            </Select>
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
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Descripción
        </h2>
        <Field>
          <Label htmlFor="description_es">Descripción (español)</Label>
          <Textarea
            id="description_es"
            value={state.description_es ?? ""}
            onChange={(e) => set("description_es", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="description_en">Descripción (inglés)</Label>
          <Textarea
            id="description_en"
            value={state.description_en ?? ""}
            onChange={(e) => set("description_en", e.target.value)}
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Precio y unidad
        </h2>

        <FieldRow>
          <Field>
            <Label htmlFor="unit_type">Unidad de cobro</Label>
            <Select
              id="unit_type"
              value={state.unit_type}
              onChange={(e) => set("unit_type", e.target.value)}
            >
              {UNIT_TYPES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label required htmlFor="sale_price">
              Precio de venta (USD)
            </Label>
            <Input
              id="sale_price"
              type="number"
              step="0.01"
              min="0"
              value={state.sale_price}
              onChange={(e) =>
                set("sale_price", Number(e.target.value) || 0)
              }
              required
            />
            <p className="font-sans text-xs text-clementina-900/60 mt-1">
              Es el precio que ve el cliente.
            </p>
          </Field>
        </FieldRow>

        {canSeeCost ? (
          <>
            <FieldRow>
              <Field>
                <Label htmlFor="cost_price">
                  Costo interno (USD) — solo super admin
                </Label>
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={state.cost_price ?? ""}
                  onChange={(e) =>
                    set(
                      "cost_price",
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                  placeholder="opcional"
                />
                <p className="font-sans text-xs text-clementina-900/60 mt-1">
                  No se muestra al cliente. Sirve para calcular margen y
                  utilidad.
                </p>
              </Field>
              {margin !== null && (
                <Field>
                  <Label>Margen calculado</Label>
                  <div
                    className={`mt-2 px-4 py-3 rounded-lg font-display text-2xl ${
                      margin > 30
                        ? "bg-green-50 text-green-800"
                        : margin > 10
                          ? "bg-amber-50 text-amber-800"
                          : "bg-red-50 text-red-800"
                    }`}
                  >
                    {margin.toFixed(1)}%
                  </div>
                </Field>
              )}
            </FieldRow>
          </>
        ) : (
          <p className="font-sans text-xs text-clementina-900/60 italic">
            (El costo interno solo es visible para Super Admins.)
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Imagen (opcional)
        </h2>
        <ImageUpload
          value={state.image_url}
          folder="catalog"
          aspect="landscape"
          onChange={(url) => set("image_url", url)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Vigencia y publicación
        </h2>

        <FieldRow>
          <Field>
            <Label htmlFor="valid_from">Vigente desde</Label>
            <Input
              id="valid_from"
              type="date"
              value={state.valid_from ?? ""}
              onChange={(e) => set("valid_from", e.target.value || null)}
            />
          </Field>
          <Field>
            <Label htmlFor="valid_until">Vigente hasta</Label>
            <Input
              id="valid_until"
              type="date"
              value={state.valid_until ?? ""}
              onChange={(e) => set("valid_until", e.target.value || null)}
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
            <div className="space-y-3 mt-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={state.active}
                  onChange={(e) => set("active", e.target.checked)}
                  className="w-5 h-5 accent-clementina-700"
                />
                <span className="font-sans text-sm text-clementina-900">
                  Activo (cotizable)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={state.public_visible}
                  onChange={(e) => set("public_visible", e.target.checked)}
                  className="w-5 h-5 accent-clementina-700"
                />
                <span className="font-sans text-sm text-clementina-900">
                  Visible en cotizador público
                </span>
              </label>
            </div>
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
          {pending ? "Guardando..." : isNew ? "Crear ítem" : "Guardar cambios"}
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
