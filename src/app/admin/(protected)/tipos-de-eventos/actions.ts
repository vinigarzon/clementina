"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface EventTypeInput {
  slug: string;
  title_es: string;
  title_en: string;
  short_es: string;
  short_en: string;
  description_es: string;
  description_en: string;
  highlights_es: string[];
  highlights_en: string[];
  body_es: string;
  body_en: string;
  whatsapp_message_es: string | null;
  whatsapp_message_en: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createEventType(input: EventTypeInput) {
  const supabase = await createClient();
  const slug = input.slug || slugify(input.title_es);

  const { data, error } = await supabase
    .from("event_types")
    .insert({ ...input, slug })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/tipos-de-eventos");
  revalidatePath("/admin/tipos-de-eventos");
  redirect(`/admin/tipos-de-eventos/${data.id}`);
}

export async function updateEventType(
  id: string,
  input: Partial<EventTypeInput>,
) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("event_types")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("event_types")
    .update(input)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/tipos-de-eventos");
  if (existing) revalidatePath(`/tipos-de-eventos/${existing.slug}`);
  revalidatePath("/admin/tipos-de-eventos");
  revalidatePath(`/admin/tipos-de-eventos/${id}`);
  return { success: true };
}

export async function deleteEventType(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("event_types").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/tipos-de-eventos");
  revalidatePath("/admin/tipos-de-eventos");
  redirect("/admin/tipos-de-eventos");
}
