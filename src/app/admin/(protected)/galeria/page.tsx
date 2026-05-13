import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { FilterBar } from "./filter-bar";
import { DeleteButton } from "./delete-button";
import { FeatureToggle } from "./feature-toggle";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function AdminGaleriaPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  const supabase = await createClient();

  // Cuenta por tag para el badge de filtros
  const { data: all } = await supabase
    .from("gallery_assets")
    .select("tag");
  const counts: Record<string, number> = {};
  (all ?? []).forEach((a) => {
    counts[a.tag] = (counts[a.tag] ?? 0) + 1;
  });
  const tags = Object.keys(counts).sort();

  let query = supabase
    .from("gallery_assets")
    .select("*")
    .order("sort_order", { ascending: true });
  if (tag) query = query.eq("tag", tag);

  const { data: assets } = await query;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Contenido · Galería
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Galería
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Sube y administra las imágenes que aparecen en /galeria del sitio.
          </p>
        </div>
        <Link
          href="/admin/galeria/nueva"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Subir imágenes
        </Link>
      </header>

      <FilterBar tags={tags} counts={counts} />

      {!assets || assets.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            {tag ? "Sin imágenes en esta categoría" : "Aún no hay imágenes"}
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            {tag
              ? "Sube imágenes y asígnales esta categoría para verlas aquí."
              : "Sube tus primeras imágenes para llenar la galería pública."}
          </p>
          <Link
            href="/admin/galeria/nueva"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Subir imágenes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((a) => (
            <div
              key={a.id}
              className="group relative rounded-xl overflow-hidden bg-white border border-clementina-100 hover:border-clementina-300 transition-colors"
            >
              <div className="relative aspect-square">
                <Image
                  src={a.image_url}
                  alt={a.alt_es}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {!a.published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-clementina-900/80 text-cream-50">
                      Oculta
                    </span>
                  )}
                </div>
                <FeatureToggle id={a.id} featured={a.featured} />
              </div>

              <div className="p-3">
                <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-1">
                  {a.tag}
                </p>
                <p className="font-sans text-sm text-clementina-900 truncate mb-1">
                  {a.alt_es || "Sin descripción"}
                </p>
                <p className="font-sans text-[10px] text-clementina-900/40 mb-3">
                  Orden: {a.sort_order}
                </p>
                <div className="flex justify-between gap-1">
                  <Link
                    href={`/admin/galeria/${a.id}`}
                    className="px-3 py-1.5 rounded-lg font-sans text-xs text-clementina-700 hover:bg-clementina-50"
                  >
                    Editar
                  </Link>
                  <DeleteButton id={a.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
