import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminClientesPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(
      `full_name.ilike.${term},email.ilike.${term},phone.ilike.${term},whatsapp.ilike.${term},identification.ilike.${term}`,
    );
  }

  const { data: clients } = await query;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Comercial · CRM
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Clientes
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Ficha de cada persona con la que la finca ha tenido contacto comercial.
          </p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Nuevo cliente
        </Link>
      </header>

      <form className="mb-6" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre, correo, teléfono o cédula..."
          className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600"
        />
      </form>

      {!clients || clients.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            {q ? "Sin resultados" : "Aún no hay clientes"}
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            {q
              ? `No encontramos clientes que coincidan con "${q}".`
              : "Agrega tu primer cliente. Cuando crees eventos podrás vincularlos a clientes existentes."}
          </p>
          {!q && (
            <Link
              href="/admin/clientes/nuevo"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
            >
              Agregar el primero
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-clementina-100 hover:border-clementina-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-clementina-100 flex items-center justify-center font-display text-base text-clementina-700 flex-shrink-0">
                {c.full_name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-clementina-800 truncate">
                  {c.full_name}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 font-sans text-xs text-clementina-900/60">
                  {c.email && <span>{c.email}</span>}
                  {c.phone && <span>{c.phone}</span>}
                  {c.city && <span>{c.city}</span>}
                  {c.source && (
                    <span className="px-2 py-0.5 rounded-full bg-clementina-50 text-clementina-700">
                      {c.source}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/clientes/${c.id}`}
                  className="px-4 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
                >
                  Editar
                </Link>
                <DeleteButton id={c.id} name={c.full_name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
