import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/role";
import { ItemForm } from "../../item-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarItemPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: item }, { data: categories }] = await Promise.all([
    supabase.from("catalog_items").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("catalog_categories")
      .select("id, name_es")
      .order("sort_order", { ascending: true }),
  ]);
  if (!item) notFound();
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
          {item.name_es}
        </h1>
      </header>
      <ItemForm
        initial={item}
        categories={categories ?? []}
        canSeeCost={canSeeCost}
      />
    </div>
  );
}
