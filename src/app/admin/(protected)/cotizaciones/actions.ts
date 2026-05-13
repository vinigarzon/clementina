"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calcQuoteTotals } from "@/lib/money";
import type { QuoteStatus } from "@/lib/quote-status";

// ---------- CREATE ----------

interface CreateQuoteInput {
  event_id: string | null;
  client_id: string | null;
  valid_until: string | null;
  tax_rate: number;
  origin: "manual" | "public";
  notes_public?: string | null;
  notes_internal?: string | null;
}

export async function createQuote(input: CreateQuoteInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const payload = {
    event_id: input.event_id,
    client_id: input.client_id,
    valid_until: input.valid_until,
    tax_rate: input.tax_rate,
    origin: input.origin,
    notes_public: input.notes_public ?? null,
    notes_internal: input.notes_internal ?? null,
    status: "borrador" as QuoteStatus,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    created_by: user?.id ?? null,
  };

  const { data, error } = await supabase
    .from("quotes")
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/cotizaciones");
  redirect(`/admin/cotizaciones/${data.id}`);
}

// ---------- UPDATE HEADER ----------

interface UpdateHeaderInput {
  valid_until?: string | null;
  tax_rate?: number;
  discount?: number;
  status?: QuoteStatus;
  notes_public?: string | null;
  notes_internal?: string | null;
}

export async function updateQuoteHeader(id: string, input: UpdateHeaderInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quotes")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };

  // Si cambiaron tax_rate o discount, recalcula totales
  if (input.tax_rate !== undefined || input.discount !== undefined) {
    await recalcQuoteTotals(id);
  }

  revalidatePath(`/admin/cotizaciones/${id}`);
  revalidatePath("/admin/cotizaciones");
  return { success: true };
}

// ---------- LINES ----------

interface AddLineInput {
  quote_id: string;
  catalog_item_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  unit_cost: number | null;
}

export async function addQuoteLine(input: AddLineInput) {
  const supabase = await createClient();

  // sort_order = max actual + 1
  const { data: existing } = await supabase
    .from("quote_lines")
    .select("sort_order")
    .eq("quote_id", input.quote_id)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 10;

  const { error } = await supabase.from("quote_lines").insert({
    ...input,
    sort_order: nextOrder,
  });
  if (error) return { error: error.message };

  await recalcQuoteTotals(input.quote_id);
  revalidatePath(`/admin/cotizaciones/${input.quote_id}`);
  return { success: true };
}

interface UpdateLineInput {
  description?: string;
  quantity?: number;
  unit_price?: number;
  unit_cost?: number | null;
}

export async function updateQuoteLine(
  id: string,
  quote_id: string,
  input: UpdateLineInput,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_lines")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };

  await recalcQuoteTotals(quote_id);
  revalidatePath(`/admin/cotizaciones/${quote_id}`);
  return { success: true };
}

export async function deleteQuoteLine(id: string, quote_id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("quote_lines")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  await recalcQuoteTotals(quote_id);
  revalidatePath(`/admin/cotizaciones/${quote_id}`);
  return { success: true };
}

// ---------- RECALC ----------

async function recalcQuoteTotals(quote_id: string) {
  const supabase = await createClient();
  const { data: quote } = await supabase
    .from("quotes")
    .select("discount, tax_rate")
    .eq("id", quote_id)
    .single();
  if (!quote) return;

  const { data: lines } = await supabase
    .from("quote_lines")
    .select("quantity, unit_price")
    .eq("quote_id", quote_id);

  const totals = calcQuoteTotals({
    lines: lines ?? [],
    discount: quote.discount,
    tax_rate: quote.tax_rate,
  });

  await supabase
    .from("quotes")
    .update({
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
    })
    .eq("id", quote_id);
}

// ---------- DELETE ----------

export async function deleteQuote(id: string) {
  const supabase = await createClient();
  await supabase.from("quote_lines").delete().eq("quote_id", id);
  const { error } = await supabase.from("quotes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/cotizaciones");
  redirect("/admin/cotizaciones");
}
