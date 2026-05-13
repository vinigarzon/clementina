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
        title: t.title_es,
        short: t.short_es,
        image: t.image_url,
      }))}
      latestPosts={posts.slice(0, 3).map((p) => ({
        slug: p.slug,
        title: p.title_es,
        excerpt: p.excerpt_es,
        cover_url: p.cover_url,
        category: p.category,
        published_at: p.published_at,
      }))}
    />
  );
}
