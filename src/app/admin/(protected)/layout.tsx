import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Si hay user pero no profile, redirigimos a una ruta GET que SÍ puede
  // cerrar la sesión (las cookies son escribibles en Route Handlers).
  // Esto rompe el loop entre middleware (cookie válida → /admin) y
  // layout (sin profile → /admin/login).
  if (!profile) {
    const reason = error?.code || "no-profile";
    redirect(`/auth/force-signout?reason=${reason}`);
  }

  return <AdminShell profile={profile}>{children}</AdminShell>;
}
