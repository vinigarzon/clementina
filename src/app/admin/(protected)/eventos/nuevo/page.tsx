import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../event-form";

export const dynamic = "force-dynamic";

export default async function NuevoEventoPage() {
  const supabase = await createClient();

  const [clientsRes, typesRes, spacesRes] = await Promise.all([
    supabase
      .from("clients")
      .select("id, full_name")
      .order("full_name", { ascending: true })
      .limit(500),
    supabase
      .from("event_types")
      .select("id, title_es")
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("spaces")
      .select("id, name")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/eventos"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a eventos
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Eventos
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Nuevo evento
        </h1>
      </header>

      <EventForm
        clients={(clientsRes.data ?? []).map((c) => ({
          id: c.id,
          label: c.full_name,
        }))}
        eventTypes={(typesRes.data ?? []).map((t) => ({
          id: t.id,
          label: t.title_es,
        }))}
        spaces={(spacesRes.data ?? []).map((s) => ({
          id: s.id,
          label: s.name,
        }))}
      />
    </div>
  );
}
