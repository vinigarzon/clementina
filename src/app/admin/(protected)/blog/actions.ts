"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface BlogInput {
  slug: string;
  title_es: string;
  title_en: string | null;
  excerpt_es: string | null;
  excerpt_en: string | null;
  body_es: string;
  body_en: string | null;
  cover_url: string | null;
  category: string | null;
  tags: string[];
  author_name: string;
  published: boolean;
  published_at: string;
  sort_order: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function createBlogPost(input: BlogInput) {
  const supabase = await createClient();
  const slug = input.slug || slugify(input.title_es);

  const payload = {
    ...input,
    slug,
    title_en: input.title_en || null,
    excerpt_es: input.excerpt_es || null,
    excerpt_en: input.excerpt_en || null,
    body_en: input.body_en || null,
    cover_url: input.cover_url || null,
    category: input.category || null,
  };

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlogPost(id: string, input: Partial<BlogInput>) {
  const supabase = await createClient();
  const cleaned = Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, v === "" ? null : v]),
  );

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("blog_posts")
    .update(cleaned)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/${existing.slug}`);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
