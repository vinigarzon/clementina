import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientForm } from "../client-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!client) notFound();

  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/clientes"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a clientes
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          CRM · Clientes
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          {client.full_name}
        </h1>
      </header>

      <ClientForm initial={client} />
    </div>
  );
}
