import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type UserRole = Database["public"]["Enums"]["user_role"];

/**
 * Devuelve el rol del usuario autenticado, o null si no hay sesión.
 * Pensado para uso en Server Components y Server Actions.
 */
export async function getCurrentRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return (profile?.role as UserRole) ?? null;
}

export async function isSuperAdmin(): Promise<boolean> {
  const role = await getCurrentRole();
  return role === "super_admin";
}
