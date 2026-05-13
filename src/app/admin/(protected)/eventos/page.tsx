import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  EVENT_STATUS_META,
  EVENT_STATUSES,
  type EventStatus,
} from "@/lib/event-status";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

function formatDate(d: string | null): string {
  if (!d) return "(sin fecha)";
  return new Date(d + "T12:00:00").toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminEventosPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select(
      "id, title, event_date, status, guests, source, client_id, clients(full_name), event_types(title_es), spaces(name)",
    )
    .order("event_date", { ascending: true, nullsFirst: false })
    .limit(200);

  if (status && status !== "all") query = query.eq("status", status);
  if (q && q.trim()) query = query.ilike("title", `%${q.trim()}%`);

  const { data: events } = await query;

  // Conteos por estado para la barra de filtros
  const { data: countsRaw } = await supabase
    .from("events")
    .select("status");
  const counts: Record<string, number> = {};
  (countsRaw ?? []).forEach((e) => {
    counts[e.status] = (counts[e.status] ?? 0) + 1;
  });
  const totalCount = (countsRaw ?? []).length;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Comercial · Eventos
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Eventos
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Cada evento es el núcleo de la operación: tiene cliente, fecha,
            espacio, cotización, contrato y costos. Aquí los administras todos.
          </p>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Nuevo evento
        </Link>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/eventos"
          className={`px-4 py-1.5 rounded-full font-sans text-sm border transition-colors ${
            !status || status === "all"
              ? "bg-clementina-800 text-cream-50 border-clementina-800"
              : "bg-white text-clementina-800 border-clementina-200 hover:border-clementina-400"
          }`}
        >
          Todos ({totalCount})
        </Link>
        {EVENT_STATUSES.map((s) => {
          const c = counts[s.value] ?? 0;
          if (c === 0 && status !== s.value) return null;
          const active = status === s.value;
          return (
            <Link
              key={s.value}
              href={`/admin/eventos?status=${s.value}`}
              className={`px-4 py-1.5 rounded-full font-sans text-sm border transition-colors ${
                active
                  ? "bg-clementina-800 text-cream-50 border-clementina-800"
                  : "bg-white text-clementina-800 border-clementina-200 hover:border-clementina-400"
              }`}
            >
              {s.label} ({c})
            </Link>
          );
        })}
      </div>

      <form method="get" className="mb-6">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por título del evento..."
          className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600"
        />
      </form>

      {!events || events.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            {q || status ? "Sin resultados" : "Aún no hay eventos"}
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            {q || status
              ? "Ajusta el filtro o crea un evento nuevo."
              : "Crea tu primer evento. Cuando lo guardes, la fecha se bloqueará automáticamente en el calendario público (si está en estado pre-reserva o superior)."}
          </p>
          {!q && !status && (
            <Link
              href="/admin/eventos/nuevo"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
            >
              Crear el primero
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-clementina-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-clementina-100 bg-clementina-50/40">
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Fecha
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Evento
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 hidden md:table-cell">
                  Cliente
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 hidden lg:table-cell">
                  Espacio
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 hidden sm:table-cell">
                  Inv.
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const meta = EVENT_STATUS_META[ev.status as EventStatus];
                const client = ev.clients as { full_name: string } | null;
                const type = ev.event_types as { title_es: string } | null;
                const space = ev.spaces as { name: string } | null;
                return (
                  <tr
                    key={ev.id}
                    className="border-b border-clementina-50 hover:bg-clementina-50/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-sans text-sm text-clementina-900 whitespace-nowrap">
                      {formatDate(ev.event_date)}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/eventos/${ev.id}`}
                        className="font-sans text-sm font-medium text-clementina-900 hover:text-clementina-700 block"
                      >
                        {ev.title}
                      </Link>
                      {type && (
                        <p className="font-sans text-xs text-clementina-900/60">
                          {type.title_es}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-clementina-900 hidden md:table-cell">
                      {client?.full_name ?? (
                        <span className="text-clementina-900/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-clementina-900 hidden lg:table-cell">
                      {space?.name ?? (
                        <span className="text-clementina-900/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-clementina-900 hidden sm:table-cell">
                      {ev.guests ?? (
                        <span className="text-clementina-900/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
