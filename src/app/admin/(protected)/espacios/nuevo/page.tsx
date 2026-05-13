import Link from "next/link";
import { SpaceForm } from "../space-form";

export default function NuevoEspacioPage() {
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
          Nuevo espacio
        </h1>
      </header>
      <SpaceForm />
    </div>
  );
}
