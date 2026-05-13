import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/role";
import { QuoteEditor } from "../quote-editor";
import { DeleteButton } from "../delete-button";
import { formatMoney } from "@/lib/money";
import {
  QUOTE_STATUS_META,
  type QuoteStatus,
} from "@/lib/quote-status";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditarCotizacionPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [quoteRes, linesRes, catalogRes] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "*, clients(id, full_name, email, phone), events(id, title, event_date)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("quote_lines")
      .select("*")
      .eq("quote_id", id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("catalog_items")
      .select("id, name_es, sale_price, cost_price, unit_type, category_id, catalog_categories(name_es)")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const quote = quoteRes.data;
  if (!quote) notFound();

  const canSeeCost = await isSuperAdmin();
  const meta = QUOTE_STATUS_META[quote.status as QuoteStatus];

  const client = quote.clients as
    | { id: string; full_name: string; email: string | null; phone: string | null }
    | null;
  const event = quote.events as
    | { id: string; title: string; event_date: string | null }
    | null;

  const catalog = (catalogRes.data ?? []).map((it) => ({
    id: it.id,
    name_es: it.name_es,
    sale_price: Number(it.sale_price),
    cost_price: it.cost_price != null ? Number(it.cost_price) : null,
    unit_type: it.unit_type,
    category: (it.catalog_categories as { name_es: string } | null)?.name_es ?? null,
  }));

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/cotizaciones"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a cotizaciones
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
              Cotización #{quote.number}
            </p>
            <h1 className="font-display text-4xl text-clementina-800 leading-tight">
              {event?.title ?? "Cotización standalone"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium ${meta.badgeClass}`}
              >
                {meta.label}
              </span>
              <span className="font-display text-2xl text-clementina-800">
                {formatMoney(quote.total)}
              </span>
              {client && (
                <span className="font-sans text-sm text-clementina-900/70">
                  · {client.full_name}
                </span>
              )}
              {event?.event_date && (
                <span className="font-sans text-sm text-clementina-900/70">
                  · {event.event_date}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`/api/cotizaciones/${quote.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700 inline-flex items-center gap-2"
            >
              Descargar PDF
            </a>
            {event && (
              <Link
                href={`/admin/eventos/${event.id}`}
                className="px-4 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
              >
                Ver evento
              </Link>
            )}
            <DeleteButton id={quote.id} number={quote.number} />
          </div>
        </div>
      </header>

      <QuoteEditor
        quote={{
          id: quote.id,
          number: quote.number,
          status: quote.status as QuoteStatus,
          valid_until: quote.valid_until,
          tax_rate: Number(quote.tax_rate),
          discount: Number(quote.discount),
          subtotal: Number(quote.subtotal),
          tax: Number(quote.tax),
          total: Number(quote.total),
          notes_public: quote.notes_public,
          notes_internal: quote.notes_internal,
          currency: quote.currency,
        }}
        lines={(linesRes.data ?? []).map((l) => ({
          id: l.id,
          catalog_item_id: l.catalog_item_id,
          description: l.description,
          quantity: Number(l.quantity),
          unit_price: Number(l.unit_price),
          unit_cost: l.unit_cost != null ? Number(l.unit_cost) : null,
          subtotal: Number(l.subtotal),
          sort_order: l.sort_order,
        }))}
        catalog={catalog}
        canSeeCost={canSeeCost}
      />
    </div>
  );
}
