"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface ClientInput {
  full_name: string;
  identification_type: string | null;
  identification: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  birthday: string | null;
  source: string | null;
  notes: string | null;
  marketing_consent: boolean;
}

export async function createClientRecord(input: ClientInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const payload = {
    ...input,
    created_by: user?.id ?? null,
    // Normaliza strings vacíos a null
    email: input.email || null,
    phone: input.phone || null,
    whatsapp: input.whatsapp || null,
    identification: input.identification || null,
    address: input.address || null,
    city: input.city || null,
    country: input.country || null,
    birthday: input.birthday || null,
    source: input.source || null,
    notes: input.notes || null,
    identification_type: input.identification_type || null,
  };

  const { data, error } = await supabase
    .from("clients")
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/clientes");
  redirect(`/admin/clientes/${data.id}`);
}

export async function updateClientRecord(
  id: string,
  input: Partial<ClientInput>,
) {
  const supabase = await createClient();

  const cleaned = Object.fromEntries(
    Object.entries(input).map(([k, v]) => [
      k,
      v === "" ? null : v,
    ]),
  );

  const { error } = await supabase
    .from("clients")
    .update(cleaned)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${id}`);
  return { success: true };
}

export async function deleteClientRecord(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/clientes");
  redirect("/admin/clientes");
}
