"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// ---------- CATEGORÍAS ----------

interface CategoryInput {
  slug: string;
  name_es: string;
  name_en: string;
  sort_order: number;
  active: boolean;
}

export async function createCategory(input: CategoryInput) {
  const supabase = await createClient();
  const slug = input.slug || slugify(input.name_es);
  const { error } = await supabase
    .from("catalog_categories")
    .insert({ ...input, slug });
  if (error) return { error: error.message };
  revalidatePath("/admin/catalogo");
  redirect("/admin/catalogo");
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("catalog_categories")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/catalogo");
  revalidatePath(`/admin/catalogo/categorias/${id}`);
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("catalog_categories")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/catalogo");
  redirect("/admin/catalogo");
}

// ---------- ITEMS ----------

interface ItemInput {
  category_id: string | null;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string | null;
  description_en: string | null;
  unit_type: string;
  sale_price: number;
  cost_price: number | null;
  active: boolean;
  public_visible: boolean;
  sort_order: number;
  valid_from: string | null;
  valid_until: string | null;
  image_url: string | null;
}

export async function createItem(input: ItemInput) {
  const supabase = await createClient();
  const slug = input.slug || slugify(input.name_es);
  const payload = {
    ...input,
    slug,
    description_es: input.description_es || null,
    description_en: input.description_en || null,
    valid_from: input.valid_from || null,
    valid_until: input.valid_until || null,
    image_url: input.image_url || null,
  };
  const { data, error } = await supabase
    .from("catalog_items")
    .insert(payload)
    .select()
    .single();
  if (error) return { error: error.message };
  revalidatePath("/admin/catalogo");
  redirect(`/admin/catalogo/items/${data.id}`);
}

export async function updateItem(id: string, input: Partial<ItemInput>) {
  const supabase = await createClient();
  const cleaned = Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, v === "" ? null : v]),
  );
  const { error } = await supabase
    .from("catalog_items")
    .update(cleaned)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/catalogo");
  revalidatePath(`/admin/catalogo/items/${id}`);
  return { success: true };
}

export async function deleteItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("catalog_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/catalogo");
  redirect("/admin/catalogo");
}
