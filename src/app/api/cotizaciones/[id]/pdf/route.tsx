import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { QuotePdf } from "@/lib/pdf/quote-pdf-template";
import { getSiteSettings } from "@/lib/data/site-settings";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Verifica auth (las cotizaciones son privadas)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "no-auth" }, { status: 401 });
  }

  // 2. Fetch cotización + relaciones
  const [quoteRes, linesRes] = await Promise.all([
    supabase
      .from("quotes")
      .select(
        "*, clients(full_name, email, phone, identification, address, city), events(title, event_date, guests, event_types(title_es), spaces(name))",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("quote_lines")
      .select("description, quantity, unit_price, subtotal")
      .eq("quote_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  const quote = quoteRes.data;
  if (!quote) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  // 3. Cargar logo desde /public (file system)
  let logoUrl: string | null = null;
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "logos",
      "logo-horizontal.png",
    );
    const buffer = await readFile(logoPath);
    const base64 = buffer.toString("base64");
    logoUrl = `data:image/png;base64,${base64}`;
  } catch {
    logoUrl = null;
  }

  const client = quote.clients as
    | {
        full_name: string;
        email: string | null;
        phone: string | null;
        identification: string | null;
        address: string | null;
        city: string | null;
      }
    | null;

  const event = quote.events as
    | {
        title: string;
        event_date: string | null;
        guests: number | null;
        event_types: { title_es: string } | null;
        spaces: { name: string } | null;
      }
    | null;

  // 4. Configuración del sitio (administrable)
  const settings = await getSiteSettings();

  // 5. Renderizar PDF
  const pdfBuffer = await renderToBuffer(
    <QuotePdf
      number={quote.number}
      issued_at={quote.issued_at}
      valid_until={quote.valid_until}
      currency={quote.currency}
      subtotal={Number(quote.subtotal)}
      discount={Number(quote.discount)}
      tax_rate={Number(quote.tax_rate)}
      tax={Number(quote.tax)}
      total={Number(quote.total)}
      notes_public={quote.notes_public}
      lines={(linesRes.data ?? []).map((l) => ({
        description: l.description,
        quantity: Number(l.quantity),
        unit_price: Number(l.unit_price),
        subtotal: Number(l.subtotal),
      }))}
      client={client}
      event={
        event
          ? {
              title: event.title,
              event_date: event.event_date,
              guests: event.guests,
              space_name: event.spaces?.name ?? null,
              type_name: event.event_types?.title_es ?? null,
            }
          : null
      }
      venue={{
        name: settings.site_name,
        tagline: settings.site_tagline,
        address: `${settings.address_line1}, ${settings.address_line2}`,
        city: settings.address_city,
        email: settings.contact_email,
        whatsapp_display: settings.whatsapp_display,
        website: "fincalaclementina.com",
      }}
      logo_url={logoUrl}
    />,
  );

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cotizacion-${quote.number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
