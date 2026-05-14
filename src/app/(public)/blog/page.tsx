import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { BlogListContent } from "./blog-list-content";

export const metadata: Metadata = {
  title: "Inspiración",
  description:
    "Ideas, tendencias y consejos para planear tu evento perfecto en Finca La Clementina.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <BlogListContent
      posts={posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title_es: p.title_es,
        title_en: p.title_en ?? p.title_es,
        excerpt_es: p.excerpt_es,
        excerpt_en: p.excerpt_en ?? p.excerpt_es,
        cover_url: p.cover_url,
        category: p.category,
        published_at: p.published_at,
      }))}
    />
  );
}
