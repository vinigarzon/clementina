import Link from "next/link";
import { CategoryForm } from "../../category-form";

export default function NuevaCategoriaPage() {
  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/catalogo"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver al catálogo
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Catálogo · Categorías
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Nueva categoría
        </h1>
      </header>
      <CategoryForm />
    </div>
  );
}
