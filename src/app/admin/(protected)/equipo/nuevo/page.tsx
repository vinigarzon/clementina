import Link from "next/link";
import { TeamForm } from "../team-form";

export default function NuevoMiembroPage() {
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
          Nuevo miembro
        </h1>
      </header>

      <TeamForm />
    </div>
  );
}
