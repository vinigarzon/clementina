import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminEquipoPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Contenido · Equipo
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Equipo
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Administra los miembros del equipo que aparecen en /equipo del sitio.
          </p>
        </div>
        <Link
          href="/admin/equipo/nuevo"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Agregar miembro
        </Link>
      </header>

      {!members || members.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            Aún no hay miembros
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            Agrega el primer miembro del equipo para que aparezca en el sitio.
          </p>
          <Link
            href="/admin/equipo/nuevo"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-clementina-100 hover:border-clementina-300 transition-colors"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-clementina-100 flex-shrink-0">
                {m.image_url ? (
                  <Image
                    src={m.image_url}
                    alt={m.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-clementina-700">
                    {m.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-clementina-800 truncate">
                    {m.name}
                  </h3>
                  {!m.published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Oculto
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm text-clementina-900/70 truncate">
                  {m.role_es}
                </p>
                <p className="font-sans text-xs text-clementina-900/40">
                  Orden: {m.sort_order}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/equipo/${m.id}`}
                  className="px-4 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
                >
                  Editar
                </Link>
                <DeleteButton id={m.id} name={m.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
