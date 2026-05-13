"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface SpaceInput {
  slug: string;
  name: string;
  description: string | null;
  capacity_min: number | null;
  capacity_max: number | null;
  active: boolean;
  sort_order: number;
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

export async function createSpace(input: SpaceInput) {
  const supabase = await createClient();
  const slug = input.slug || slugify(input.name);
  const { data, error } = await supabase
    .from("spaces")
    .insert({ ...input, slug })
    .select()
    .single();
  if (error) return { error: error.message };
  revalidatePath("/admin/espacios");
  redirect(`/admin/espacios/${data.id}`);
}

export async function updateSpace(id: string, input: Partial<SpaceInput>) {
  const supabase = await createClient();
  const { error } = await supabase.from("spaces").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/espacios");
  revalidatePath(`/admin/espacios/${id}`);
  return { success: true };
}

export async function deleteSpace(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("spaces").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/espacios");
  redirect("/admin/espacios");
}
