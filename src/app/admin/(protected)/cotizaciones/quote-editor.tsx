"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Textarea, Label } from "@/components/admin/ui/form";
import { formatMoney, calcQuoteTotals } from "@/lib/money";
import { QUOTE_STATUSES, type QuoteStatus, QUOTE_STATUS_META } from "@/lib/quote-status";
import {
  addQuoteLine,
  updateQuoteLine,
  deleteQuoteLine,
  updateQuoteHeader,
} from "./actions";

interface QuoteLine {
  id: string;
  catalog_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  unit_cost: number | null;
  subtotal: number;
  sort_order: number;
}

interface QuoteData {
  id: string;
  number: number;
  status: QuoteStatus;
  valid_until: string | null;
  tax_rate: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
  notes_public: string | null;
  notes_internal: string | null;
  currency: string;
}

interface CatalogItem {
  id: string;
  name_es: string;
  sale_price: number;
  cost_price: number | null;
  unit_type: string;
  category: string | null;
}

interface QuoteEditorProps {
  quote: QuoteData;
  lines: QuoteLine[];
  catalog: CatalogItem[];
  canSeeCost: boolean;
}

export function QuoteEditor({ quote, lines, catalog, canSeeCost }: QuoteEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // Estado local del header (editable)
  const [header, setHeader] = useState({
    valid_until: quote.valid_until ?? "",
    tax_rate: quote.tax_rate,
    discount: quote.discount,
    notes_public: quote.notes_public ?? "",
    notes_internal: quote.notes_internal ?? "",
    status: quote.status,
  });

  // Cálculo en vivo de totales (los reales se guardan en DB pero esto da feedback inmediato)
  const liveTotals = useMemo(
    () =>
      calcQuoteTotals({
        lines,
        discount: header.discount || 0,
        tax_rate: header.tax_rate || 0,
      }),
    [lines, header.discount, header.tax_rate],
  );

  function saveHeader() {
    startTransition(async () => {
      await updateQuoteHeader(quote.id, {
        valid_until: header.valid_until || null,
        tax_rate: header.tax_rate,
        discount: header.discount,
        status: header.status,
        notes_public: header.notes_public || null,
        notes_internal: header.notes_internal || null,
      });
      router.refresh();
    });
  }

  // ---------- Agregar línea ----------
  const [addMode, setAddMode] = useState<"catalog" | "custom">("catalog");
  const [pickedItemId, setPickedItemId] = useState<string>("");
  const [pickedQty, setPickedQty] = useState<number>(1);
  const [customDesc, setCustomDesc] = useState("");
  const [customQty, setCustomQty] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number>(0);

  function handleAddFromCatalog() {
    const item = catalog.find((c) => c.id === pickedItemId);
    if (!item || pickedQty <= 0) return;
    startTransition(async () => {
      await addQuoteLine({
        quote_id: quote.id,
        catalog_item_id: item.id,
        description: item.name_es,
        quantity: pickedQty,
        unit_price: item.sale_price,
        unit_cost: item.cost_price,
      });
      setPickedItemId("");
      setPickedQty(1);
      router.refresh();
    });
  }

  function handleAddCustom() {
    if (!customDesc.trim() || customQty <= 0) return;
    startTransition(async () => {
      await addQuoteLine({
        quote_id: quote.id,
        catalog_item_id: null,
        description: customDesc.trim(),
        quantity: customQty,
        unit_price: customPrice,
        unit_cost: null,
      });
      setCustomDesc("");
      setCustomQty(1);
      setCustomPrice(0);
      router.refresh();
    });
  }

  function handleDeleteLine(lineId: string) {
    if (!confirm("¿Eliminar esta línea?")) return;
    startTransition(async () => {
      await deleteQuoteLine(lineId, quote.id);
      router.refresh();
    });
  }

  function handleUpdateLine(line: QuoteLine, changes: Partial<QuoteLine>) {
    startTransition(async () => {
      await updateQuoteLine(line.id, quote.id, {
        description: changes.description,
        quantity: changes.quantity,
        unit_price: changes.unit_price,
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {/* HEADER de la cotización */}
      <section className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8">
        <div className="grid sm:grid-cols-4 gap-5">
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select
              id="status"
              value={header.status}
              onChange={(e) =>
                setHeader((h) => ({ ...h, status: e.target.value as QuoteStatus }))
              }
            >
              {QUOTE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
            <p className="font-sans text-xs text-clementina-900/60 mt-1">
              {QUOTE_STATUS_META[header.status].description}
            </p>
          </div>
          <div>
            <Label htmlFor="valid_until">Vigencia hasta</Label>
            <Input
              id="valid_until"
              type="date"
              value={header.valid_until}
              onChange={(e) =>
                setHeader((h) => ({ ...h, valid_until: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="tax_rate">IVA (%)</Label>
            <Input
              id="tax_rate"
              type="number"
              step="0.01"
              min="0"
              value={header.tax_rate}
              onChange={(e) =>
                setHeader((h) => ({
                  ...h,
                  tax_rate: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="discount">Descuento (USD)</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              min="0"
              value={header.discount}
              onChange={(e) =>
                setHeader((h) => ({
                  ...h,
                  discount: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="notes_public">Notas para el cliente</Label>
            <Textarea
              id="notes_public"
              value={header.notes_public}
              onChange={(e) =>
                setHeader((h) => ({ ...h, notes_public: e.target.value }))
              }
              placeholder="Aparecen en el PDF que ve el cliente."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="notes_internal">Notas internas</Label>
            <Textarea
              id="notes_internal"
              value={header.notes_internal}
              onChange={(e) =>
                setHeader((h) => ({ ...h, notes_internal: e.target.value }))
              }
              placeholder="Solo el equipo las ve."
              rows={3}
            />
          </div>
        </div>

        <div className="mt-5">
          <Button type="button" onClick={saveHeader} disabled={pending}>
            {pending ? "Guardando..." : "Guardar encabezado"}
          </Button>
        </div>
      </section>

      {/* LÍNEAS */}
      <section className="bg-white rounded-2xl border border-clementina-100 overflow-hidden">
        <header className="px-6 py-4 bg-clementina-50 border-b border-clementina-100">
          <h2 className="font-display text-xl text-clementina-800">
            Líneas de la cotización
          </h2>
          <p className="font-sans text-xs text-clementina-900/60">
            {lines.length} línea{lines.length === 1 ? "" : "s"}
          </p>
        </header>

        {lines.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-sans text-base text-clementina-900/60 mb-2">
              Aún no hay líneas en esta cotización.
            </p>
            <p className="font-sans text-sm text-clementina-900/50">
              Agrega ítems del catálogo o líneas libres desde el panel de abajo.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-clementina-100">
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Descripción
                </th>
                <th className="text-right px-3 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 w-24">
                  Cantidad
                </th>
                <th className="text-right px-3 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 w-32">
                  Precio unit.
                </th>
                <th className="text-right px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 w-32">
                  Subtotal
                </th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <LineRow
                  key={line.id}
                  line={line}
                  onChange={(changes) => handleUpdateLine(line, changes)}
                  onDelete={() => handleDeleteLine(line.id)}
                  pending={pending}
                />
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* AGREGAR LÍNEA */}
      <section className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8">
        <h2 className="font-display text-xl text-clementina-800 mb-5">
          Agregar línea
        </h2>

        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setAddMode("catalog")}
            className={`px-4 py-2 rounded-full font-sans text-sm transition-colors ${
              addMode === "catalog"
                ? "bg-clementina-800 text-cream-50"
                : "bg-cream-100 text-clementina-800 hover:bg-cream-200"
            }`}
          >
            Desde catálogo
          </button>
          <button
            type="button"
            onClick={() => setAddMode("custom")}
            className={`px-4 py-2 rounded-full font-sans text-sm transition-colors ${
              addMode === "custom"
                ? "bg-clementina-800 text-cream-50"
                : "bg-cream-100 text-clementina-800 hover:bg-cream-200"
            }`}
          >
            Línea libre
          </button>
        </div>

        {addMode === "catalog" ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-7">
                <Label htmlFor="catalog_item">Ítem del catálogo</Label>
                <Select
                  id="catalog_item"
                  value={pickedItemId}
                  onChange={(e) => setPickedItemId(e.target.value)}
                >
                  <option value="">Selecciona un ítem...</option>
                  {catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.category ? `[${item.category}] ` : ""}
                      {item.name_es} — {formatMoney(item.sale_price)} / {item.unit_type}
                    </option>
                  ))}
                </Select>
                {catalog.length === 0 && (
                  <p className="font-sans text-xs text-amber-700 mt-1">
                    No hay ítems en el catálogo. Crea algunos en /admin/catalogo.
                  </p>
                )}
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="catalog_qty">Cantidad</Label>
                <Input
                  id="catalog_qty"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={pickedQty}
                  onChange={(e) => setPickedQty(Number(e.target.value) || 0)}
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  onClick={handleAddFromCatalog}
                  disabled={pending || !pickedItemId || pickedQty <= 0}
                  className="w-full"
                >
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-6">
                <Label htmlFor="custom_desc">Descripción</Label>
                <Input
                  id="custom_desc"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Ej: Decoración especial cliente"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="custom_qty">Cant.</Label>
                <Input
                  id="custom_qty"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={customQty}
                  onChange={(e) => setCustomQty(Number(e.target.value) || 0)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="custom_price">Precio unit.</Label>
                <Input
                  id="custom_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value) || 0)}
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  onClick={handleAddCustom}
                  disabled={pending || !customDesc.trim() || customQty <= 0}
                  className="w-full"
                >
                  Agregar
                </Button>
              </div>
            </div>
            <p className="font-sans text-xs text-clementina-900/60">
              Las líneas libres no están en el catálogo. Si la usas mucho,
              considera agregarla al catálogo en /admin/catalogo.
            </p>
          </div>
        )}
      </section>

      {/* TOTALES */}
      <section className="bg-clementina-800 text-cream-50 rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-xl mb-5">Totales</h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-2">
          <Row label="Subtotal" value={formatMoney(liveTotals.subtotal)} />
          <Row label="Descuento" value={`- ${formatMoney(liveTotals.discount)}`} />
          <Row
            label={`IVA (${header.tax_rate}%)`}
            value={formatMoney(liveTotals.tax)}
          />
          <div className="hidden sm:block" />
          <div className="sm:col-span-2 pt-3 border-t border-cream-100/20 flex justify-between items-baseline">
            <span className="font-sans text-sm uppercase tracking-widest text-cream-100/70">
              Total a pagar
            </span>
            <span className="font-display text-4xl">
              {formatMoney(liveTotals.total)}
            </span>
          </div>
          {canSeeCost && (
            <p className="sm:col-span-2 font-sans text-xs text-cream-100/60 italic mt-2">
              (Margen y utilidad se verán en sub-iteración con vista financiera.)
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="font-sans text-sm text-cream-100/80">{label}</span>
      <span className="font-display text-lg">{value}</span>
    </div>
  );
}

function LineRow({
  line,
  onChange,
  onDelete,
  pending,
}: {
  line: QuoteLine;
  onChange: (changes: Partial<QuoteLine>) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const [desc, setDesc] = useState(line.description);
  const [qty, setQty] = useState(line.quantity);
  const [price, setPrice] = useState(line.unit_price);

  function commit() {
    if (
      desc !== line.description ||
      qty !== line.quantity ||
      price !== line.unit_price
    ) {
      onChange({ description: desc, quantity: qty, unit_price: price });
    }
  }

  return (
    <tr className="border-b border-clementina-50">
      <td className="px-5 py-3">
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={commit}
          className="w-full bg-transparent font-sans text-sm text-clementina-900 px-2 py-1 rounded hover:bg-clementina-50 focus:bg-clementina-50 focus:outline-none"
        />
      </td>
      <td className="px-3 py-3 text-right">
        <input
          type="number"
          step="0.01"
          min="0"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 0)}
          onBlur={commit}
          className="w-20 text-right bg-transparent font-sans text-sm px-2 py-1 rounded hover:bg-clementina-50 focus:bg-clementina-50 focus:outline-none"
        />
      </td>
      <td className="px-3 py-3 text-right">
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || 0)}
          onBlur={commit}
          className="w-28 text-right bg-transparent font-sans text-sm px-2 py-1 rounded hover:bg-clementina-50 focus:bg-clementina-50 focus:outline-none"
        />
      </td>
      <td className="px-5 py-3 text-right font-display text-base text-clementina-800">
        {formatMoney(qty * price)}
      </td>
      <td className="px-3 py-3 text-right">
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="w-8 h-8 rounded-full text-red-600 hover:bg-red-50 disabled:opacity-50"
          aria-label="Eliminar línea"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
