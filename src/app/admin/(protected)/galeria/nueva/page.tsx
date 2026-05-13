import Link from "next/link";
import { UploadForm } from "../upload-form";

export default function NuevaImagenPage() {
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
          Galería
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Subir imágenes
        </h1>
        <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
          Puedes subir varias imágenes a la vez. Les asignas categoría
          compartida y después editas cada una individualmente si lo necesitas.
        </p>
      </header>

      <UploadForm />
    </div>
  );
}
