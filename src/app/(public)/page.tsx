import { getFeaturedGalleryAssets } from "@/lib/data/gallery";
import { getPublishedEventTypes } from "@/lib/data/event-types";
import { getPublishedBlogPosts } from "@/lib/data/blog";
import { HomeContent } from "./home-content";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, eventTypes, posts] = await Promise.all([
    getFeaturedGalleryAssets(),
    getPublishedEventTypes(),
    getPublishedBlogPosts(),
  ]);

  return (
    <HomeContent
      featuredImages={featured.map((f) => ({
        src: f.image_url,
        alt: f.alt_es,
      }))}
      eventTypes={eventTypes.map((t) => ({
        slug: t.slug,
        title_es: t.title_es,
        title_en: t.title_en ?? t.title_es,
        short_es: t.short_es,
        short_en: t.short_en ?? t.short_es,
        image: t.image_url,
      }))}
      latestPosts={posts.slice(0, 3).map((p) => ({
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
