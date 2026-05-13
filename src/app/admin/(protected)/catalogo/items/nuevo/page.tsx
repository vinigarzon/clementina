import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/role";
import { ItemForm } from "../../item-form";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NuevoItemPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("catalog_categories")
    .select("id, name_es")
    .order("sort_order", { ascending: true });
  const canSeeCost = await isSuperAdmin();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/catalogo"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver al catálogo
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Catálogo · Ítem
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Nuevo ítem
        </h1>
      </header>
      <ItemForm
        categories={categories ?? []}
        canSeeCost={canSeeCost}
        initial={
          category
            ? {
                category_id: category,
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
              }
            : undefined
        }
      />
    </div>
  );
}
