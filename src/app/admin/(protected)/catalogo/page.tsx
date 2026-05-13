import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/role";
import { DeleteCategoryButton, DeleteItemButton } from "./delete-buttons";

export const dynamic = "force-dynamic";

const UNIT_LABELS: Record<string, string> = {
  unidad: "unidad",
  persona: "por persona",
  hora: "por hora",
  paquete: "paquete",
  servicio: "servicio",
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function AdminCatalogoPage() {
  const supabase = await createClient();
  const canSeeCost = await isSuperAdmin();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("catalog_categories")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("catalog_items")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const cats = categories ?? [];
  const its = items ?? [];

  const itemsByCategory: Record<string, typeof its> = {};
  const orphans: typeof its = [];
  for (const item of its) {
    if (item.category_id) {
      (itemsByCategory[item.category_id] ??= []).push(item);
    } else {
      orphans.push(item);
    }
  }

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Comercial · Catálogo
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Catálogo
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Todo lo que la finca vende: menús, bebidas, flores, ambientación,
            música, fotografía, mobiliario y más. Organízalo en categorías y
            define precio de venta y costo interno.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/catalogo/categorias/nueva"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-cream-100 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-200 border border-clementina-200"
          >
            + Categoría
          </Link>
          <Link
            href="/admin/catalogo/items/nuevo"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
          >
            + Ítem
          </Link>
        </div>
      </header>

      {cats.length === 0 && its.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            Catálogo vacío
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            Empieza creando una categoría (por ejemplo "Menú principal") y
            agregándole ítems con sus precios.
          </p>
          <Link
            href="/admin/catalogo/categorias/nueva"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Crear primera categoría
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {cats.map((cat) => {
            const catItems = itemsByCategory[cat.id] ?? [];
            return (
              <section
                key={cat.id}
                className="bg-white rounded-2xl border border-clementina-100 overflow-hidden"
              >
                <header className="flex items-center justify-between gap-4 px-6 py-4 bg-clementina-50 border-b border-clementina-100">
                  <div>
                    <h2 className="font-display text-xl text-clementina-800">
                      {cat.name_es}
                      {!cat.active && (
                        <span className="ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Inactiva
                        </span>
                      )}
                    </h2>
                    <p className="font-sans text-xs text-clementina-900/60">
                      {catItems.length} ítem{catItems.length === 1 ? "" : "es"}
                      {" · "}/{cat.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/catalogo/categorias/${cat.id}`}
                      className="px-3 py-1.5 rounded-lg font-sans text-xs text-clementina-700 hover:bg-clementina-100"
                    >
                      Editar
                    </Link>
                    <DeleteCategoryButton id={cat.id} name={cat.name_es} />
                  </div>
                </header>

                {catItems.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="font-sans text-sm text-clementina-900/60 mb-3">
                      Esta categoría no tiene ítems aún.
                    </p>
                    <Link
                      href={`/admin/catalogo/items/nuevo?category=${cat.id}`}
                      className="font-sans text-sm text-clementina-700 hover:text-clementina-900 underline underline-offset-2"
                    >
                      + Agregar ítem a esta categoría
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-clementina-100">
                    {catItems.map((it) => (
                      <ItemRow
                        key={it.id}
                        item={it}
                        canSeeCost={canSeeCost}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

          {orphans.length > 0 && (
            <section className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
              <header className="px-6 py-4 bg-amber-50 border-b border-amber-200">
                <h2 className="font-display text-xl text-amber-900">
                  Sin categoría
                </h2>
                <p className="font-sans text-xs text-amber-800">
                  {orphans.length} ítem{orphans.length === 1 ? "" : "es"} sin
                  asignar
                </p>
              </header>
              <div className="divide-y divide-amber-100">
                {orphans.map((it) => (
                  <ItemRow key={it.id} item={it} canSeeCost={canSeeCost} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  canSeeCost,
}: {
  item: {
    id: string;
    name_es: string;
    sale_price: number;
    cost_price: number | null;
    unit_type: string;
    active: boolean;
    public_visible: boolean;
    image_url: string | null;
  };
  canSeeCost: boolean;
}) {
  const unitLabel = UNIT_LABELS[item.unit_type] ?? item.unit_type;
  return (
    <div className="flex items-center gap-4 px-6 py-3">
      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-clementina-100 flex-shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name_es}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display text-base text-clementina-700">
            {item.name_es.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-sans text-sm font-medium text-clementina-900 truncate">
            {item.name_es}
          </p>
          {!item.active && (
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Inactivo
            </span>
          )}
          {!item.public_visible && (
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-clementina-100 text-clementina-700">
              Solo interno
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="font-display text-base text-clementina-800">
            {formatMoney(item.sale_price)}
          </span>
          <span className="font-sans text-xs text-clementina-900/60">
            {unitLabel}
          </span>
          {canSeeCost && item.cost_price != null && (
            <span className="font-sans text-xs text-clementina-900/50">
              · costo {formatMoney(item.cost_price)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Link
          href={`/admin/catalogo/items/${item.id}`}
          className="px-3 py-1.5 rounded-lg font-sans text-xs text-clementina-700 hover:bg-clementina-50"
        >
          Editar
        </Link>
        <DeleteItemButton id={item.id} name={item.name_es} />
      </div>
    </div>
  );
}
