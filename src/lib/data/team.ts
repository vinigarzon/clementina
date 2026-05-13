import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

/**
 * Lee los miembros publicados del equipo ordenados.
 * Se usa desde Server Components.
 */
export async function getPublishedTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getPublishedTeamMembers]", error);
    return [];
  }
  return data ?? [];
}
