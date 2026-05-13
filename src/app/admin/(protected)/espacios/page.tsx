import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminEspaciosPage() {
  const supabase = await createClient();
  const { data: spaces } = await supabase
    .from("spaces")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Configuración · Espacios
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Espacios físicos
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Define los espacios que tiene la finca (salones, jardín, capilla)
            para asignarlos a cada evento y al calendario de disponibilidad.
          </p>
        </div>
        <Link
          href="/admin/espacios/nuevo"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Nuevo espacio
        </Link>
      </header>

      {!spaces || spaces.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            Aún no hay espacios definidos
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            Define el primer espacio. Después podrás asignarlo a cada evento.
          </p>
          <Link
            href="/admin/espacios/nuevo"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {spaces.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 p-5 rounded-xl bg-white border border-clementina-100 hover:border-clementina-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-clementina-800 truncate">
                    {s.name}
                  </h3>
                  {!s.active && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Inactivo
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="font-sans text-sm text-clementina-900/70 mt-1 line-clamp-2">
                    {s.description}
                  </p>
                )}
                <p className="font-sans text-xs text-clementina-900/40 mt-1">
                  /{s.slug}
                  {(s.capacity_min || s.capacity_max) &&
                    ` · Capacidad ${s.capacity_min ?? "?"}-${s.capacity_max ?? "?"}`}
                  {" "}· Orden {s.sort_order}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/espacios/${s.id}`}
                  className="px-4 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
                >
                  Editar
                </Link>
                <DeleteButton id={s.id} name={s.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
