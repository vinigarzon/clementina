-- =====================================================================
-- Finca La Clementina · Migración 0004a (solo schema del blog)
-- Aplicar PRIMERO esta, después la 0004b_blog_seed.sql
-- =====================================================================

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title_es     text not null,
  title_en     text,
  excerpt_es   text,
  excerpt_en   text,
  body_es      text not null default '',
  body_en      text,
  cover_url    text,
  category     text,
  tags         text[] not null default '{}',
  author_name  text not null default 'Equipo La Clementina',
  published    boolean not null default true,
  published_at timestamptz not null default now(),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists blog_posts_published_at_idx
  on public.blog_posts (published_at desc);
create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
  for select using (published = true or auth.uid() is not null);

drop policy if exists blog_posts_write on public.blog_posts;
create policy blog_posts_write on public.blog_posts
  for all using (
    public.current_role_in(array['super_admin', 'apoyo']::public.user_role[])
  );

-- Recarga el cache del API REST para que pueda ver la nueva tabla
notify pgrst, 'reload schema';
