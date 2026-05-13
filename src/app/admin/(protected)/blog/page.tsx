import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
            Contenido · Inspiración
          </p>
          <h1 className="font-display text-4xl text-clementina-800 leading-tight">
            Blog
          </h1>
          <p className="font-sans text-base text-clementina-900/70 mt-3 max-w-2xl">
            Administra los artículos que aparecen en /blog del sitio público.
          </p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700"
        >
          + Nuevo artículo
        </Link>
      </header>

      {!posts || posts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-clementina-100 text-center">
          <p className="font-display text-2xl text-clementina-700 mb-3">
            Aún no hay artículos
          </p>
          <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto mb-6">
            Publica el primer artículo para llenar la sección de inspiración del
            sitio.
          </p>
          <Link
            href="/admin/blog/nuevo"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-clementina-100 hover:border-clementina-300 transition-colors"
            >
              <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-clementina-100 flex-shrink-0">
                {p.cover_url ? (
                  <Image
                    src={p.cover_url}
                    alt={p.title_es}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center font-display text-xl text-clementina-700">
                    {p.title_es.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-lg text-clementina-800 truncate">
                    {p.title_es}
                  </h3>
                  {!p.published && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Borrador
                    </span>
                  )}
                  {p.category && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-clementina-50 text-clementina-700">
                      {p.category}
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-clementina-900/60 mt-1">
                  /{p.slug} · {formatDate(p.published_at)} · {p.author_name}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
                >
                  Ver
                </Link>
                <Link
                  href={`/admin/blog/${p.id}`}
                  className="px-4 py-2 rounded-lg font-sans text-sm text-clementina-700 hover:bg-clementina-50"
                >
                  Editar
                </Link>
                <DeleteButton id={p.id} title={p.title_es} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
