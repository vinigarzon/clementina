"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale, useT } from "@/i18n/locale-context";

interface BlogPostListItem {
  id: string;
  slug: string;
  title_es: string;
  title_en: string;
  excerpt_es: string | null;
  excerpt_en: string | null;
  cover_url: string | null;
  category: string | null;
  published_at: string;
}

export function BlogListContent({ posts }: { posts: BlogPostListItem[] }) {
  const t = useT();
  const { locale } = useLocale();
  const isEn = locale === "en";

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(isEn ? "en-US" : "es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      <PageHero
        eyebrow={t("blog.hero.eyebrow")}
        title={t("blog.hero.title")}
        description={t("blog.hero.description")}
        image={{
          src: "/real/diseno-16.jpg",
          alt: "Finca La Clementina",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-3xl text-clementina-700 mb-4">
                {t("blog.empty.title")}
              </p>
              <p className="font-sans text-base text-clementina-900/70 max-w-md mx-auto">
                {t("blog.empty.subtitle")}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = isEn ? post.title_en : post.title_es;
                const excerpt = isEn
                  ? post.excerpt_en ?? post.excerpt_es
                  : post.excerpt_es;
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-cream-50 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {post.cover_url ? (
                        <Image
                          src={post.cover_url}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-clementina-200 to-clementina-400" />
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cream-50/95 backdrop-blur font-sans text-[10px] uppercase tracking-widest text-clementina-700">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                        {formatDate(post.published_at)}
                      </p>
                      <h3 className="font-display text-2xl text-clementina-800 leading-tight mb-3 group-hover:text-clementina-700 transition-colors">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="font-sans text-sm text-clementina-900/70 leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1 font-sans text-xs uppercase tracking-widest text-clementina-600 group-hover:text-clementina-800">
                        {t("blog.card.readArticle")}
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
