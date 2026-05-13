"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface NewAsset {
  image_url: string;
  alt_es: string;
  alt_en: string;
  tag: string;
  sort_order: number;
  featured: boolean;
  published: boolean;
}

export async function createGalleryAssets(assets: NewAsset[]) {
  if (assets.length === 0) return { error: "Nada para crear" };
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_assets").insert(assets);
  if (error) return { error: error.message };
  revalidatePath("/galeria");
  revalidatePath("/admin/galeria");
  return { success: true, count: assets.length };
}

export async function updateGalleryAsset(
  id: string,
  input: Partial<NewAsset>,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_assets")
    .update(input)
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/galeria");
  revalidatePath("/admin/galeria");
  revalidatePath(`/admin/galeria/${id}`);
  return { success: true };
}

/**
 * Toggle rápido del flag "featured" desde la lista.
 * Las imágenes destacadas aparecen en el carrusel del hero del home.
 */
export async function toggleGalleryFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_assets")
    .update({ featured })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/galeria");
  return { success: true };
}

export async function deleteGalleryAsset(id: string) {
  const supabase = await createClient();

  // Borra del Storage si la imagen vive en el bucket "media".
  const { data: existing } = await supabase
    .from("gallery_assets")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  if (existing?.image_url) {
    const url = existing.image_url;
    const marker = "/storage/v1/object/public/media/";
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const path = url.slice(idx + marker.length);
      await supabase.storage.from("media").remove([path]);
    }
  }

  const { error } = await supabase
    .from("gallery_assets")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/galeria");
  revalidatePath("/admin/galeria");
  redirect("/admin/galeria");
}
