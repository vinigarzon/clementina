import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminTiposDeEventosPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("event_types")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Contenido · Tipos de evento
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Tipos de evento
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Categorías que ofrece la finca (bodas, quinces, corporativos, etc.).
            Aparecen en /tipos-de-eventos del sitio público.
          </p>
        </div>
        <Link
          href="/admin/tipos-de-eventos/nuevo"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Agregar tipo
        </Link>
      </header>

      {!events || events.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            Aún no hay tipos de evento
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            Agrega el primer tipo de evento para que aparezca en el sitio.
          </p>
          <Link
            href="/admin/tipos-de-eventos/nuevo"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-clementina-100 hover:border-clementina-300 transition-colors"
            >
              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-clementina-100 flex-shrink-0">
                {ev.image_url ? (
                  <Image
                    src={ev.image_url}
                    alt={ev.title_es}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-clementina-700">
                    {ev.title_es.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-clementina-800 truncate">
                    {ev.title_es}
                  </h3>
                  {!ev.published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Oculto
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm text-clementina-900/70 truncate">
                  {ev.short_es}
                </p>
                <p className="font-sans text-xs text-clementina-900/40">
                  /{ev.slug} · Orden {ev.sort_order} ·{" "}
                  {ev.highlights_es?.length ?? 0} highlights
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/tipos-de-eventos/${ev.id}`}
                  className="px-4 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
                >
                  Editar
                </Link>
                <DeleteButton id={ev.id} title={ev.title_es} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
