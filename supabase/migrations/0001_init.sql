-- =====================================================================
-- Finca La Clementina · Esquema inicial
-- Migración 0001 · Mayo 2026
-- =====================================================================
-- Crea las tablas core para Sprint 2: roles, equipo, galería, tipos de evento,
-- contenido de páginas y auditoría. Las tablas operacionales (eventos,
-- cotizaciones, pagos, costos, etc.) se agregan en migraciones posteriores.
--
-- Aplicar desde el SQL Editor de Supabase pegando todo este archivo.
-- =====================================================================

-- ---------- ENUMS ----------
do $$ begin
  create type public.user_role as enum (
    'super_admin',
    'comercial',
    'operaciones',
    'apoyo'
  );
exception
  when duplicate_object then null;
end $$;

-- ---------- PROFILES ----------
-- Extiende auth.users con datos públicos del operador interno.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  role        public.user_role not null default 'apoyo',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- TEAM MEMBERS ----------
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  role_es     text not null,
  role_en     text not null,
  bio_es      text not null,
  bio_en      text not null,
  image_url   text,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- GALLERY ASSETS ----------
create table if not exists public.gallery_assets (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  alt_es      text not null default '',
  alt_en      text not null default '',
  tag         text not null default 'finca',  -- Bodas, Quinces, Corporativos, Sociales, La Finca, etc.
  sort_order  int not null default 0,
  featured    boolean not null default false,
  published   boolean not null default true,
  event_id    uuid,                            -- vincula con events cuando exista
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists gallery_assets_tag_idx on public.gallery_assets(tag);
create index if not exists gallery_assets_sort_idx on public.gallery_assets(sort_order);

-- ---------- EVENT TYPES ----------
-- Catálogo administrable de tipos de evento (bodas, quinces, etc).
create table if not exists public.event_types (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title_es        text not null,
  title_en        text not null,
  short_es        text not null,
  short_en        text not null,
  description_es  text not null default '',
  description_en  text not null default '',
  highlights_es   text[] not null default '{}',
  highlights_en   text[] not null default '{}',
  image_url       text,
  sort_order      int not null default 0,
  published       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------- AUDIT LOGS ----------
create table if not exists public.audit_logs (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid references public.profiles(id) on delete set null,
  actor_email  text,
  action       text not null,
  entity_type  text not null,
  entity_id    uuid,
  payload      jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx
  on public.audit_logs(entity_type, entity_id);

-- ---------- TRIGGERS · updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

drop trigger if exists gallery_assets_set_updated_at on public.gallery_assets;
create trigger gallery_assets_set_updated_at
  before update on public.gallery_assets
  for each row execute function public.set_updated_at();

drop trigger if exists event_types_set_updated_at on public.event_types;
create trigger event_types_set_updated_at
  before update on public.event_types
  for each row execute function public.set_updated_at();

-- ---------- TRIGGER · crear profile al registrarse ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table public.profiles       enable row level security;
alter table public.team_members   enable row level security;
alter table public.gallery_assets enable row level security;
alter table public.event_types    enable row level security;
alter table public.audit_logs     enable row level security;

-- Helper: ¿el usuario actual tiene alguno de estos roles?
create or replace function public.current_role_in(allowed public.user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = any(allowed)
  );
$$;

-- ---- profiles ----
drop policy if exists profiles_read_self on public.profiles;
create policy profiles_read_self on public.profiles
  for select using (auth.uid() = id or public.current_role_in(array['super_admin']::public.user_role[]));

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id);

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.current_role_in(array['super_admin']::public.user_role[]));

-- ---- team_members ----  (lectura pública; escritura: super_admin o apoyo)
drop policy if exists team_public_read on public.team_members;
create policy team_public_read on public.team_members
  for select using (published = true or auth.uid() is not null);

drop policy if exists team_write on public.team_members;
create policy team_write on public.team_members
  for all using (
    public.current_role_in(array['super_admin', 'apoyo']::public.user_role[])
  );

-- ---- gallery_assets ----  (lectura pública; escritura: super_admin o apoyo)
drop policy if exists gallery_public_read on public.gallery_assets;
create policy gallery_public_read on public.gallery_assets
  for select using (published = true or auth.uid() is not null);

drop policy if exists gallery_write on public.gallery_assets;
create policy gallery_write on public.gallery_assets
  for all using (
    public.current_role_in(array['super_admin', 'apoyo']::public.user_role[])
  );

-- ---- event_types ----  (lectura pública; escritura: super_admin)
drop policy if exists event_types_public_read on public.event_types;
create policy event_types_public_read on public.event_types
  for select using (published = true or auth.uid() is not null);

drop policy if exists event_types_write on public.event_types;
create policy event_types_write on public.event_types
  for all using (
    public.current_role_in(array['super_admin']::public.user_role[])
  );

-- ---- audit_logs ----  (solo super_admin lee; cualquier authenticated escribe)
drop policy if exists audit_read on public.audit_logs;
create policy audit_read on public.audit_logs
  for select using (
    public.current_role_in(array['super_admin']::public.user_role[])
  );

drop policy if exists audit_insert on public.audit_logs;
create policy audit_insert on public.audit_logs
  for insert with check (auth.uid() is not null);

-- =====================================================================
-- SEED inicial
-- =====================================================================

-- Tipos de evento (replican los que están hardcoded en src/lib/event-types.ts)
insert into public.event_types
  (slug, title_es, title_en, short_es, short_en, description_es, description_en,
   highlights_es, highlights_en, image_url, sort_order, published)
values
  ('bodas', 'Bodas', 'Weddings',
   'Ceremonias y recepciones en un entorno único.',
   'Ceremonies and receptions in a unique setting.',
   'Una boda en La Clementina es la combinación de naturaleza, intimidad y servicio cuidado al detalle.',
   'A wedding at La Clementina combines nature, intimacy and attention to detail.',
   array['Ceremonia civil o religiosa','Capacidad de 50 a 300 invitados','Catering, flores, música y fotografía','Coordinación integral del evento'],
   array['Civil or religious ceremony','Capacity for 50 to 300 guests','Catering, flowers, music and photography','Full event coordination'],
   '/events/bodas.jpg', 1, true),

  ('quince-anos', 'Quince Años', 'Sweet Fifteen',
   'El paso a una nueva etapa con todo el detalle.',
   'A milestone celebration in style.',
   'Una celebración pensada para que la quinceañera y su familia vivan un día inolvidable.',
   'A celebration designed to make the day unforgettable.',
   array['Salón ambientado a tu temática','Menú personalizable','Vals y coreografías con espacio dedicado','Iluminación profesional'],
   array['Themed setting','Custom menu','Dedicated space for waltz and choreography','Professional lighting'],
   '/events/quinces.jpg', 2, true),

  ('graduaciones', 'Graduaciones', 'Graduations',
   'Celebrar el logro con tu gente más cercana.',
   'Celebrate the milestone with those closest to you.',
   'Grados de colegio, técnicos y universitarios con el ambiente que el momento merece.',
   'High school, technical and university graduations with the atmosphere they deserve.',
   array['Cena formal o cóctel','Espacios para fotografía de promoción','Brindis y palabras','Música en vivo o DJ'],
   array['Formal dinner or cocktail','Spaces for class photography','Toast and speeches','Live music or DJ'],
   '/events/graduaciones.jpg', 3, true),

  ('corporativos', 'Eventos Corporativos', 'Corporate Events',
   'Convenciones, reuniones, lanzamientos y celebraciones de empresa.',
   'Conventions, meetings, launches and company celebrations.',
   'Espacios versátiles para eventos institucionales.',
   'Versatile spaces for institutional events.',
   array['Salones para 20 a 300 personas','Equipamiento audiovisual','Coffee breaks y almuerzos ejecutivos','Atención profesional al cliente'],
   array['Rooms for 20 to 300 people','AV equipment','Coffee breaks and executive lunches','Professional client service'],
   '/events/corporativos.jpg', 4, true),

  ('bautizos-comuniones', 'Bautizos y Primeras Comuniones', 'Baptisms & First Communions',
   'Reuniones familiares con encanto.',
   'Charming family gatherings.',
   'Un espacio cálido para celebrar los sacramentos en familia.',
   'A warm space to celebrate sacraments with family.',
   array['Decoración temática','Menú familiar','Espacios seguros para niños','Servicio de fotografía'],
   array['Themed decoration','Family menu','Safe spaces for children','Photography service'],
   '/events/bautizos-comuniones.jpg', 5, true),

  ('baby-shower', 'Baby Shower', 'Baby Shower',
   'Recibir lo que viene en un lugar especial.',
   'Welcoming what is to come in a special place.',
   'Una tarde para celebrar la llegada del bebé con la familia y las amistades.',
   'An afternoon to welcome the baby with family and friends.',
   array['Ambientación personalizada','Menú de bocaditos y postres','Espacio para actividades','Decoración fotografiable'],
   array['Custom theme','Snacks and desserts menu','Space for activities','Photo-worthy decoration'],
   '/events/baby-shower.jpg', 6, true),

  ('aniversarios', 'Aniversarios', 'Anniversaries',
   'Celebrar lo construido juntos.',
   'Celebrate what you have built together.',
   'Aniversarios de bodas, cumpleaños significativos y otras fechas importantes.',
   'Wedding anniversaries, milestone birthdays and other important dates.',
   array['Cena íntima o gran celebración','Música a tu gusto','Decoración a medida','Fotografía y video'],
   array['Intimate dinner or large celebration','Music to taste','Custom decoration','Photo and video'],
   '/events/aniversarios.jpg', 7, true),

  ('despedidas', 'Despedidas', 'Farewells',
   'Cierres con sabor a hasta luego.',
   'Goodbyes that feel like see-you-soon.',
   'Despedidas de soltería, laborales o de viaje en un espacio relajado.',
   'Bachelor or bachelorette parties, work farewells in a relaxed setting.',
   array['Programa flexible','Catering adaptado al estilo','Música y entretenimiento','Espacios al aire libre'],
   array['Flexible program','Catering tailored to style','Music and entertainment','Outdoor spaces'],
   '/events/despedidas.jpg', 8, true),

  ('sociales', 'Reuniones Sociales', 'Social Gatherings',
   'Cualquier excusa para reunir a los tuyos.',
   'Any reason to bring your people together.',
   'Reuniones familiares, encuentros de amigos, almuerzos especiales o tardes temáticas.',
   'Family reunions, friend gatherings, special lunches or themed afternoons.',
   array['Formato flexible','Capacidad a tu medida','Catering opcional','Espacios cubiertos y al aire libre'],
   array['Flexible format','Capacity to your needs','Optional catering','Indoor and outdoor spaces'],
   '/events/sociales.jpg', 9, true)
on conflict (slug) do nothing;

-- Equipo (Lorena y Alejandra)
insert into public.team_members
  (slug, name, role_es, role_en, bio_es, bio_en, image_url, sort_order, published)
values
  ('lorena-bolanos', 'Lorena Bolaños',
   'Fundadora · Dirección General',
   'Founder · General Director',
   'Lorena Bolaños, fundadora de La Clementina, es una empresaria exitosa y apasionada en el mundo de los eventos. Su liderazgo y dedicación han llevado a La Clementina a convertirse en un referente en la industria, generando múltiples fuentes de trabajo y brindando experiencias excepcionales a través de una coordinación impecable con proveedores y una atención meticulosa a los detalles. Su visión y compromiso han establecido a La Clementina como un destino líder para eventos en la provincia.',
   'Lorena Bolaños, founder of La Clementina, is a successful and passionate entrepreneur in the world of events. Her leadership and dedication have made La Clementina a benchmark in the industry, creating jobs and delivering exceptional experiences through flawless coordination with suppliers and meticulous attention to detail. Her vision and commitment have established La Clementina as a leading event destination in the province.',
   '/team/lorena.webp', 1, true),

  ('alejandra-bolanos', 'Alejandra Bolaños',
   'Catering y Pastelería · La Clementina Bakery & Cafe',
   'Catering & Pastry · La Clementina Bakery & Cafe',
   'Alejandra Bolaños, propietaria de La Clementina Bakery & Cafe en Tulcán, es una experta en repostería y catering que se dedica a crear deliciosos bocaditos y catering para los eventos en La Clementina. Con su pasión por la cocina y una atención excepcional, Alejandra ofrece a sus clientes una experiencia culinaria de alta calidad en un ambiente acogedor y encantador.',
   'Alejandra Bolaños, owner of La Clementina Bakery & Cafe in Tulcán, is a pastry and catering expert who creates delicious bites and catering services for events at La Clementina. With her passion for cooking and exceptional attention, Alejandra offers clients a high-quality culinary experience in a warm and charming setting.',
   '/team/alejandra.webp', 2, true)
on conflict (slug) do nothing;
