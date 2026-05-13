import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/data/blog";
import { sanitizeBlogHtml, isHtml, markdownFallbackToHtml } from "@/lib/blog-html";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title_es,
    description: post.excerpt_es ?? undefined,
    openGraph: {
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// El render del cuerpo vive en @/lib/markdown (renderMarkdown).

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedBlogPosts())
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title_es}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-clementina-700 to-clementina-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/40 via-clementina-900/20 to-clementina-900/85" />

        <Container className="relative z-10 pb-16">
          <Link
            href="/blog"
            className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/90 mb-4 inline-flex items-center gap-2 hover:text-cream-50"
          >
            ← Inspiración
          </Link>
          {post.category && (
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-3">
              {post.category}
            </p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream-50 leading-tight max-w-3xl drop-shadow-lg">
            {post.title_es}
          </h1>
          <p className="font-sans text-sm text-cream-100/90 mt-4">
            {formatDate(post.published_at)} · {post.author_name}
          </p>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <article className="max-w-3xl mx-auto">
            {post.excerpt_es && (
              <p className="font-display text-2xl text-clementina-800 leading-relaxed mb-10 pb-10 border-b border-clementina-100">
                {post.excerpt_es}
              </p>
            )}
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{
                __html: isHtml(post.body_es)
                  ? sanitizeBlogHtml(post.body_es)
                  : markdownFallbackToHtml(post.body_es),
              }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-clementina-100">
                <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-clementina-50 border border-clementina-100 font-sans text-xs text-clementina-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-24 bg-clementina-50">
          <Container>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-3">
              Sigue leyendo
            </p>
            <h2 className="font-display text-3xl text-clementina-800 mb-10">
              Otros artículos
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-cream-50 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {p.cover_url ? (
                      <Image
                        src={p.cover_url}
                        alt={p.title_es}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(min-width: 1024px) 33vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-clementina-200 to-clementina-400" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-clementina-800 leading-tight">
                      {p.title_es}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
