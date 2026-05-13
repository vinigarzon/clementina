import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Endpoint GET para cerrar sesión desde un redirect.
 * Lo usamos cuando el AdminLayout detecta que el usuario está autenticado
 * pero le falta el profile (rompe el loop entre middleware y layout).
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const reason =
    new URL(request.url).searchParams.get("reason") ?? "session-cleared";
  const url = new URL(`/admin/login?error=${reason}`, request.url);
  return NextResponse.redirect(url, { status: 303 });
}
