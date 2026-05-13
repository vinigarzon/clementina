import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QUOTE_STATUS_META, QUOTE_STATUSES, type QuoteStatus } from "@/lib/quote-status";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d + "T12:00:00").toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminCotizacionesPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("quotes")
    .select(
      "id, number, status, total, issued_at, valid_until, origin, event_id, client_id, clients(full_name), events(title, event_date)",
    )
    .order("issued_at", { ascending: false })
    .limit(200);

  if (status && status !== "all") query = query.eq("status", status);

  const { data: quotes } = await query;

  const { data: countsRaw } = await supabase.from("quotes").select("status");
  const counts: Record<string, number> = {};
  (countsRaw ?? []).forEach((q) => {
    counts[q.status] = (counts[q.status] ?? 0) + 1;
  });
  const totalCount = (countsRaw ?? []).length;

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Comercial · Cotizaciones
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Cotizaciones
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Cada cotización está vinculada a un evento. Construye la cotización
            con líneas del catálogo y compártela con el cliente.
          </p>
        </div>
        <Link
          href="/admin/cotizaciones/nueva"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Nueva cotización
        </Link>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/cotizaciones"
          className={`px-4 py-1.5 rounded-full font-sans text-sm border transition-colors ${
            !status || status === "all"
              ? "bg-clementina-800 text-cream-50 border-clementina-800"
              : "bg-white text-clementina-800 border-clementina-200 hover:border-clementina-400"
          }`}
        >
          Todas ({totalCount})
        </Link>
        {QUOTE_STATUSES.map((s) => {
          const c = counts[s.value] ?? 0;
          if (c === 0 && status !== s.value) return null;
          const active = status === s.value;
          return (
            <Link
              key={s.value}
              href={`/admin/cotizaciones?status=${s.value}`}
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

      {!quotes || quotes.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            Aún no hay cotizaciones
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            Crea una cotización nueva. Puede estar vinculada a un evento existente
            o ser standalone.
          </p>
          <Link
            href="/admin/cotizaciones/nueva"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Crear la primera
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-clementina-100 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-clementina-100 bg-clementina-50/40">
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  #
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Evento / Cliente
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 hidden md:table-cell">
                  Emisión
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700 hidden md:table-cell">
                  Vigencia
                </th>
                <th className="text-right px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Total
                </th>
                <th className="text-left px-5 py-3 font-sans text-xs uppercase tracking-widest text-clementina-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const meta = QUOTE_STATUS_META[q.status as QuoteStatus];
                const client = q.clients as { full_name: string } | null;
                const event = q.events as { title: string; event_date: string | null } | null;
                return (
                  <tr
                    key={q.id}
                    className="border-b border-clementina-50 hover:bg-clementina-50/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-sm text-clementina-900">
                      #{q.number}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/cotizaciones/${q.id}`}
                        className="font-sans text-sm font-medium text-clementina-900 hover:text-clementina-700 block"
                      >
                        {event?.title ?? "(sin evento)"}
                      </Link>
                      {client && (
                        <p className="font-sans text-xs text-clementina-900/60">
                          {client.full_name}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-clementina-900/80 hidden md:table-cell">
                      {formatDate(q.issued_at?.slice(0, 10) ?? null)}
                    </td>
                    <td className="px-5 py-3 font-sans text-sm text-clementina-900/80 hidden md:table-cell">
                      {formatDate(q.valid_until)}
                    </td>
                    <td className="px-5 py-3 text-right font-display text-base text-clementina-800 whitespace-nowrap">
                      {formatMoney(q.total)}
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
