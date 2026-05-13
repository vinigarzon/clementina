import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "../team-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarMiembroPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!member) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/equipo"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver al equipo
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Equipo
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          {member.name}
        </h1>
      </header>

      <TeamForm initial={member} />
    </div>
  );
}
