import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/data/blog";
import { sanitizeBlogHtml, isHtml, markdownFallbackToHtml } from "@/lib/blog-html";
import { BlogPostContent } from "./blog-post-content";

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

function bodyToHtml(raw: string): string {
  return isHtml(raw) ? sanitizeBlogHtml(raw) : markdownFallbackToHtml(raw);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedBlogPosts())
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <BlogPostContent
      post={{
        title_es: post.title_es,
        title_en: post.title_en ?? post.title_es,
        excerpt_es: post.excerpt_es,
        excerpt_en: post.excerpt_en ?? post.excerpt_es,
        bodyHtml_es: bodyToHtml(post.body_es ?? ""),
        bodyHtml_en: bodyToHtml(post.body_en ?? post.body_es ?? ""),
        cover_url: post.cover_url,
        category: post.category,
        published_at: post.published_at,
        author_name: post.author_name,
        tags: post.tags ?? [],
      }}
      related={related.map((p) => ({
        id: p.id,
        slug: p.slug,
        title_es: p.title_es,
        title_en: p.title_en ?? p.title_es,
        cover_url: p.cover_url,
      }))}
    />
  );
}
