import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type EventType = Database["public"]["Tables"]["event_types"]["Row"];

export async function getPublishedEventTypes(): Promise<EventType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPublishedEventTypes]", error);
    return [];
  }
  return data ?? [];
}

export async function getEventTypeBySlug(
  slug: string,
): Promise<EventType | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("[getEventTypeBySlug]", error);
    return null;
  }
  return data;
}

export async function getAllEventTypeSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("event_types")
    .select("slug")
    .eq("published", true);
  return (data ?? []).map((r) => r.slug);
}
