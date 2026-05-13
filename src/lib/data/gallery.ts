import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type GalleryAsset =
  Database["public"]["Tables"]["gallery_assets"]["Row"];

export async function getPublishedGalleryAssets(): Promise<GalleryAsset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_assets")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPublishedGalleryAssets]", error);
    return [];
  }
  return data ?? [];
}

/**
 * Imágenes filtradas por un tag específico (ej: "Bodas", "Quinces").
 * Útil para mostrar la galería relacionada en una página de tipo de evento.
 */
export async function getGalleryByTag(tag: string): Promise<GalleryAsset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_assets")
    .select("*")
    .eq("published", true)
    .eq("tag", tag)
    .order("sort_order", { ascending: true })
    .limit(12);

  if (error) {
    console.error("[getGalleryByTag]", error);
    return [];
  }
  return data ?? [];
}

/**
 * Imágenes marcadas como "Destacada" para el carrusel del home.
 */
export async function getFeaturedGalleryAssets(): Promise<GalleryAsset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_assets")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getFeaturedGalleryAssets]", error);
    return [];
  }
  return data ?? [];
}
