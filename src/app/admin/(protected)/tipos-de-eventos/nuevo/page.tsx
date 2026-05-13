import Link from "next/link";
import { EventTypeForm } from "../event-type-form";

export default function NuevoTipoEventoPage() {
  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/tipos-de-eventos"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver a tipos de evento
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Tipos de evento
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Nuevo tipo de evento
        </h1>
      </header>

      <EventTypeForm />
    </div>
  );
}
