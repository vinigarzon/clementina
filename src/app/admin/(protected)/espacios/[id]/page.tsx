import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SpaceForm } from "../space-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarEspacioPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!space) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/espacios"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a espacios
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Espacios
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          {space.name}
        </h1>
      </header>
      <SpaceForm initial={space} />
    </div>
  );
}
