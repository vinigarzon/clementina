import Link from "next/link";
import { ClientForm } from "../client-form";

export default function NuevoClientePage() {
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
          Nuevo cliente
        </h1>
      </header>

      <ClientForm />
    </div>
  );
}
