import Link from "next/link";
import type {
  UpcomingEvent,
  RecentLead,
  PendingCollection,
} from "@/lib/data/dashboard";

// ============ UPCOMING EVENTS ============

export function UpcomingEventsList({ events }: { events: UpcomingEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        message="No hay eventos próximos."
        cta={{ label: "Crear evento", href: "/admin/eventos/nuevo" }}
      />
    );
  }
  return (
    <ul className="divide-y divide-clementina-100">
      {events.map((e) => (
        <li key={e.id}>
          <Link
            href={`/admin/eventos/${e.id}`}
            className="grid grid-cols-12 gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-clementina-50/60 transition-colors"
          >
            <div className="col-span-3 sm:col-span-2">
              <DateBadge iso={e.event_date} />
            </div>
            <div className="col-span-6 sm:col-span-7 min-w-0">
              <p className="font-sans text-sm font-medium text-clementina-900 truncate">
                {e.title}
              </p>
              <p className="font-sans text-xs text-clementina-900/55 truncate">
                {[e.client_name, e.event_type, e.space]
                  .filter(Boolean)
                  .join(" · ") || "Sin detalles"}
              </p>
            </div>
            <div className="col-span-3 text-right">
              <StatusPill status={e.status} />
              {e.guests != null && (
                <p className="font-sans text-[11px] text-clementina-900/55 mt-1">
                  {e.guests} invitados
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ============ RECENT LEADS ============

export function RecentLeadsList({ leads }: { leads: RecentLead[] }) {
  if (leads.length === 0) {
    return <EmptyState message="Aún no hay leads recibidos." />;
  }
  return (
    <ul className="divide-y divide-clementina-100">
      {leads.map((l) => (
        <li key={l.id} className="py-3 grid grid-cols-12 gap-3">
          <div className="col-span-3 sm:col-span-2">
            <p className="font-sans text-xs uppercase tracking-widest text-clementina-600">
              {fmtDateShort(l.created_at)}
            </p>
          </div>
          <div className="col-span-6 sm:col-span-7 min-w-0">
            <p className="font-sans text-sm font-medium text-clementina-900 truncate">
              {l.full_name || "Sin nombre"}
            </p>
            <p className="font-sans text-xs text-clementina-900/55 truncate">
              {[l.email, l.phone].filter(Boolean).join(" · ") || "—"}
              {l.event_type_slug ? ` · ${l.event_type_slug}` : ""}
              {l.desired_date ? ` · ${l.desired_date}` : ""}
              {l.guests ? ` · ${l.guests} invitados` : ""}
            </p>
          </div>
          <div className="col-span-3 text-right">
            <StatusPill status={l.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// ============ PENDING COLLECTIONS ============

export function PendingCollectionsList({
  items,
}: {
  items: PendingCollection[];
}) {
  if (items.length === 0) {
    return <EmptyState message="No hay cobros vencidos ni próximos." />;
  }
  return (
    <ul className="divide-y divide-clementina-100">
      {items.map((p) => (
        <li key={p.id}>
          <Link
            href={`/admin/eventos/${p.event_id}`}
            className="grid grid-cols-12 gap-3 py-3 px-2 -mx-2 rounded-lg hover:bg-clementina-50/60 transition-colors"
          >
            <div className="col-span-3 sm:col-span-2">
              <DateBadge iso={p.due_date} />
            </div>
            <div className="col-span-5 sm:col-span-6 min-w-0">
              <p className="font-sans text-sm font-medium text-clementina-900 truncate">
                {p.event_title || "Evento sin título"}
              </p>
              <p className="font-sans text-xs text-clementina-900/55 truncate">
                {p.client_name || "Sin cliente"}
                {p.installment_label ? ` · ${p.installment_label}` : ""}
              </p>
            </div>
            <div className="col-span-4 sm:col-span-4 text-right">
              <p className="font-sans text-sm font-medium text-clementina-900">
                {fmtUSD(p.amount)}
              </p>
              {p.days_left != null && (
                <p
                  className={`font-sans text-[11px] mt-0.5 ${
                    p.days_left < 0
                      ? "text-rose-700 font-medium"
                      : p.days_left <= 7
                        ? "text-amber-700"
                        : "text-clementina-900/55"
                  }`}
                >
                  {p.days_left < 0
                    ? `${Math.abs(p.days_left)} días vencido`
                    : p.days_left === 0
                      ? "Vence hoy"
                      : `En ${p.days_left} días`}
                </p>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ============ HELPERS ============

function DateBadge({ iso }: { iso: string | null }) {
  if (!iso) {
    return (
      <p className="font-sans text-xs text-clementina-900/40 italic">
        Sin fecha
      </p>
    );
  }
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("es-EC", { month: "short" });
  return (
    <div className="inline-flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-clementina-50 border border-clementina-100 min-w-[52px]">
      <span className="font-display text-xl text-clementina-800 leading-none">
        {day}
      </span>
      <span className="font-sans text-[10px] uppercase tracking-widest text-clementina-600 mt-0.5">
        {month}
      </span>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  // Events
  lead: "bg-stone-100 text-stone-700",
  propuesta: "bg-amber-50 text-amber-800",
  hold: "bg-amber-100 text-amber-900",
  reservado: "bg-blue-50 text-blue-800",
  contratado: "bg-emerald-50 text-emerald-800",
  en_ejecucion: "bg-violet-50 text-violet-800",
  cerrado: "bg-stone-100 text-stone-600",
  cancelado: "bg-rose-50 text-rose-700",
  // Leads
  nuevo: "bg-clementina-50 text-clementina-800",
  contactado: "bg-blue-50 text-blue-800",
  calificado: "bg-emerald-50 text-emerald-800",
  convertido: "bg-emerald-100 text-emerald-900",
  descartado: "bg-stone-100 text-stone-500",
};

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-stone-100 text-stone-700";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function EmptyState({
  message,
  cta,
}: {
  message: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="py-8 px-2 text-center">
      <p className="font-sans text-sm text-clementina-900/55 italic">
        {message}
      </p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-block mt-3 font-sans text-xs uppercase tracking-widest text-clementina-700 hover:text-clementina-900"
        >
          {cta.label} →
        </Link>
      )}
    </div>
  );
}

function fmtDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
  });
}

function fmtUSD(n: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
