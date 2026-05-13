import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventTypeForm } from "../event-type-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarTipoEventoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("event_types")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!event) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/tipos-de-eventos"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a tipos de evento
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Tipos de evento · /{event.slug}
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          {event.title_es}
        </h1>
      </header>

      <EventTypeForm initial={event} />
    </div>
  );
}
