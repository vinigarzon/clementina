import Link from "next/link";
import { BlogForm } from "../blog-form";

export default function NuevoPostPage() {
  return (
    <div>
      <header className="mb-8">
        <Link
          href="/admin/blog"
          className="font-sans text-sm text-clementina-700 hover:text-clementina-900 inline-flex items-center gap-1 mb-4"
        >
          ← Volver al blog
        </Link>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
          Inspiración
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          Nuevo artículo
        </h1>
      </header>
      <BlogForm />
    </div>
  );
}
