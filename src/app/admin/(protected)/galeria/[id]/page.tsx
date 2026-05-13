import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "../gallery-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarImagenPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: asset } = await supabase
    .from("gallery_assets")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!asset) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/galeria"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a galería
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Galería · {asset.tag}
        </p>
        <h1 className="font-display text-3xl text-clementina-800 leading-tight">
          {asset.alt_es || "Editar imagen"}
        </h1>
      </header>

      <GalleryForm initial={asset} />
    </div>
  );
}
