import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "../blog-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarPostPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

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
          Inspiración · /{post.slug}
        </p>
        <h1 className="font-display text-4xl text-clementina-800 leading-tight">
          {post.title_es}
        </h1>
      </header>
      <BlogForm initial={post} />
    </div>
  );
}
