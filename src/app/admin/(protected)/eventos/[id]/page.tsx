import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "../event-form";
import { DeleteButton } from "../delete-button";
import { StatusChanger } from "../status-changer";
import {
  EVENT_STATUS_META,
  type EventStatus,
} from "@/lib/event-status";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(d: string | null): string {
  if (!d) return "(sin fecha)";
  return new Date(d + "T12:00:00").toLocaleDateString("es-EC", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function EditarEventoPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [eventRes, clientsRes, typesRes, spacesRes] = await Promise.all([
    supabase
      .from("events")
      .select(
        "*, clients(id, full_name, email, phone, whatsapp), event_types(id, title_es), spaces(id, name)",
      )
      .eq("id", id)
      .maybeSingle(),
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

  const event = eventRes.data;
  if (!event) notFound();

  const meta = EVENT_STATUS_META[event.status as EventStatus];
  const client = event.clients as
    | { id: string; full_name: string; email: string | null; phone: string | null; whatsapp: string | null }
    | null;

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/eventos"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a eventos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
              Evento · {formatDate(event.event_date)}
            </p>
            <h1 className="font-display text-4xl text-clementina-800 leading-tight">
              {event.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${meta.badgeClass}`}
              >
                {meta.label}
              </span>
              <span className="font-sans text-xs text-clementina-900/60">
                {meta.description}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs text-clementina-900/60">
              Cambiar estado:
            </span>
            <StatusChanger id={event.id} current={event.status as EventStatus} />
            <DeleteButton id={event.id} title={event.title} />
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventForm
            initial={{
              id: event.id,
              client_id: event.client_id,
              event_type_id: event.event_type_id,
              space_id: event.space_id,
              title: event.title,
              event_date: event.event_date,
              start_time: event.start_time,
              end_time: event.end_time,
              guests: event.guests,
              status: event.status as EventStatus,
              source: event.source,
              notes_public: event.notes_public,
              notes_internal: event.notes_internal,
            }}
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

        <aside className="space-y-4">
          {client ? (
            <div className="bg-white rounded-2xl border border-clementina-100 p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                Cliente
              </p>
              <Link
                href={`/admin/clientes/${client.id}`}
                className="block font-display text-xl text-clementina-800 hover:text-clementina-700"
              >
                {client.full_name}
              </Link>
              <div className="mt-3 space-y-1 font-sans text-sm text-clementina-900/70">
                {client.email && <p>{client.email}</p>}
                {client.phone && <p>{client.phone}</p>}
                {client.whatsapp && (
                  <a
                    href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-green-800 inline-flex items-center gap-1"
                  >
                    WhatsApp →
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <p className="font-sans text-xs uppercase tracking-widest text-amber-800 mb-2">
                Sin cliente
              </p>
              <p className="font-sans text-sm text-amber-900/80">
                Asigna un cliente al evento usando el formulario.{" "}
                <Link
                  href="/admin/clientes/nuevo"
                  className="underline underline-offset-2"
                >
                  Crear cliente nuevo
                </Link>
              </p>
            </div>
          )}

          <div className="bg-clementina-50 border border-clementina-100 rounded-2xl p-6">
            <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
              Cotizaciones
            </p>
            <Link
              href={`/admin/cotizaciones/nueva?event=${event.id}`}
              className="block w-full text-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
            >
              + Nueva cotización para este evento
            </Link>
            <Link
              href={`/admin/cotizaciones?event=${event.id}`}
              className="block mt-2 text-center font-sans text-xs text-clementina-700 hover:text-clementina-900 underline underline-offset-2"
            >
              Ver todas las cotizaciones del evento
            </Link>
          </div>

          <div className="bg-clementina-50 border border-clementina-100 rounded-2xl p-6">
            <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
              Próximas funciones
            </p>
            <ul className="space-y-2 font-sans text-sm text-clementina-900/70">
              <li>📑 Contrato PDF (Sprint 3.6)</li>
              <li>💵 Cronograma de pagos</li>
              <li>📊 Costos y utilidad</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
