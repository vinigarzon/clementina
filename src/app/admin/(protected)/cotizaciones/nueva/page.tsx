import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewQuoteForm } from "./new-quote-form";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ event?: string }>;
}

export default async function NuevaCotizacionPage({
  searchParams,
}: PageProps) {
  const { event: eventIdParam } = await searchParams;
  const supabase = await createClient();

  const [eventsRes, clientsRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, event_date, client_id, clients(full_name)")
      .order("event_date", { ascending: false, nullsFirst: false })
      .limit(200),
    supabase
      .from("clients")
      .select("id, full_name")
      .order("full_name", { ascending: true })
      .limit(500),
  ]);

  let prefilledEvent: { id: string; client_id: string | null } | null = null;
  if (eventIdParam) {
    const found = eventsRes.data?.find((e) => e.id === eventIdParam);
    if (found) prefilledEvent = { id: found.id, client_id: found.client_id };
  }

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/cotizaciones"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a cotizaciones
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Cotizaciones
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Nueva cotización
        </h1>
        <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
          Define el contexto de la cotización. Después agregas las líneas del
          catálogo en el editor.
        </p>
      </header>

      <NewQuoteForm
        events={(eventsRes.data ?? []).map((e) => ({
          id: e.id,
          title: e.title,
          event_date: e.event_date,
          client_id: e.client_id,
          client_name:
            (e.clients as { full_name: string } | null)?.full_name ?? null,
        }))}
        clients={(clientsRes.data ?? []).map((c) => ({
          id: c.id,
          label: c.full_name,
        }))}
        prefilled={prefilledEvent}
      />
    </div>
  );
}
