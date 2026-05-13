-- =====================================================================
-- Finca La Clementina · Migración 0003
-- Esquema comercial: clientes, leads, eventos, catálogo, cotizaciones,
-- contratos, pagos, costos.
-- =====================================================================

-- ---------- ENUMS ----------
do $$ begin
  create type public.event_status as enum (
    'lead', 'propuesta', 'hold', 'reservado', 'contratado',
    'en_ejecucion', 'cerrado', 'cancelado'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.date_hold_status as enum ('hold', 'reserved', 'blocked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.quote_status as enum (
    'borrador', 'enviada', 'aceptada', 'rechazada', 'expirada'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.contract_status as enum (
    'borrador', 'firmado', 'cancelado'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.lead_status as enum (
    'nuevo', 'en_conversacion', 'convertido', 'descartado'
  );
exception when duplicate_object then null;
end $$;

-- ---------- CLIENTS ----------
create table if not exists public.clients (
  id                   uuid primary key default gen_random_uuid(),
  full_name            text not null,
  identification_type  text,                       -- 'cedula', 'ruc', 'pasaporte'
  identification       text,
  email                text,
  phone                text,
  whatsapp             text,
  address              text,
  city                 text,
  country              text default 'Ecuador',
  birthday             date,
  source               text,                       -- 'web', 'whatsapp', 'referido', 'redes'
  notes                text,
  marketing_consent    boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  created_by           uuid references public.profiles(id) on delete set null
);

create index if not exists clients_full_name_idx on public.clients (full_name);
create index if not exists clients_email_idx on public.clients (email);

-- ---------- SPACES ----------
create table if not exists public.spaces (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  capacity_min  int,
  capacity_max  int,
  active        boolean not null default true,
  sort_order    int not null default 0
);

-- ---------- EVENTS ----------
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid references public.clients(id) on delete set null,
  event_type_id   uuid references public.event_types(id) on delete set null,
  space_id        uuid references public.spaces(id) on delete set null,
  title           text not null,
  event_date      date,
  start_time      time,
  end_time        time,
  guests          int,
  status          public.event_status not null default 'lead',
  source          text,
  notes_public    text,
  notes_internal  text,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events (event_date);
create index if not exists events_status_idx on public.events (status);
create index if not exists events_client_id_idx on public.events (client_id);

-- ---------- LEADS ----------
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  full_name         text,
  email             text,
  phone             text,
  event_type_slug   text,
  desired_date      date,
  guests            int,
  message           text,
  client_id         uuid references public.clients(id) on delete set null,
  event_id          uuid references public.events(id) on delete set null,
  status            public.lead_status not null default 'nuevo',
  consent_given     boolean not null default false,
  source            text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ---------- DATE HOLDS ----------
create table if not exists public.date_holds (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references public.events(id) on delete cascade,
  space_id    uuid references public.spaces(id) on delete set null,
  hold_date   date not null,
  status      public.date_hold_status not null default 'hold',
  reason      text,
  created_at  timestamptz not null default now()
);

create index if not exists date_holds_date_idx on public.date_holds (hold_date);

-- ---------- CATALOG ----------
create table if not exists public.catalog_categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name_es      text not null,
  name_en      text not null,
  sort_order   int not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.catalog_items (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid references public.catalog_categories(id) on delete set null,
  slug            text not null unique,
  name_es         text not null,
  name_en         text not null,
  description_es  text,
  description_en  text,
  unit_type       text not null default 'unidad',         -- 'unidad','persona','hora','paquete'
  sale_price      numeric(12,2) not null default 0,
  cost_price      numeric(12,2),
  active          boolean not null default true,
  public_visible  boolean not null default true,
  sort_order      int not null default 0,
  valid_from      date,
  valid_until     date,
  image_url       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists catalog_items_category_idx on public.catalog_items (category_id);
create index if not exists catalog_items_active_idx on public.catalog_items (active);

-- ---------- VENDORS ----------
create table if not exists public.vendors (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  contact_name  text,
  phone         text,
  email         text,
  notes         text,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------- QUOTES ----------
create sequence if not exists public.quote_number_seq start 1001;

create table if not exists public.quotes (
  id              uuid primary key default gen_random_uuid(),
  number          int not null default nextval('public.quote_number_seq'),
  event_id        uuid references public.events(id) on delete set null,
  client_id       uuid references public.clients(id) on delete set null,
  issued_at       timestamptz not null default now(),
  valid_until     date,
  currency        text not null default 'USD',
  subtotal        numeric(12,2) not null default 0,
  tax_rate        numeric(5,2)  not null default 0,
  tax             numeric(12,2) not null default 0,
  discount        numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  status          public.quote_status not null default 'borrador',
  notes_public    text,
  notes_internal  text,
  origin          text not null default 'manual',         -- 'public' | 'manual'
  pdf_url         text,
  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists quotes_event_id_idx on public.quotes (event_id);
create index if not exists quotes_client_id_idx on public.quotes (client_id);
create index if not exists quotes_status_idx on public.quotes (status);

create table if not exists public.quote_lines (
  id               uuid primary key default gen_random_uuid(),
  quote_id         uuid not null references public.quotes(id) on delete cascade,
  catalog_item_id  uuid references public.catalog_items(id) on delete set null,
  description      text not null,
  quantity         numeric(10,2) not null default 1,
  unit_price       numeric(12,2) not null default 0,
  unit_cost        numeric(12,2),
  subtotal         numeric(12,2) generated always as (quantity * unit_price) stored,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now()
);

create index if not exists quote_lines_quote_id_idx on public.quote_lines (quote_id);

-- ---------- CONTRACTS ----------
create table if not exists public.contracts (
  id               uuid primary key default gen_random_uuid(),
  event_id         uuid references public.events(id) on delete set null,
  quote_id         uuid references public.quotes(id) on delete set null,
  client_id        uuid references public.clients(id) on delete set null,
  pdf_url          text,
  signed_pdf_url   text,
  signed_at        timestamptz,
  total            numeric(12,2),
  status           public.contract_status not null default 'borrador',
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- PAYMENT SCHEDULES + PAYMENTS ----------
create table if not exists public.payment_schedules (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references public.events(id) on delete cascade,
  installment_number  int not null,
  label               text,
  percent             numeric(5,2),
  amount              numeric(12,2) not null,
  due_date            date,
  paid                boolean not null default false,
  paid_at             timestamptz,
  paid_amount         numeric(12,2),
  receipt_url         text,
  notes               text,
  sort_order          int not null default 0,
  created_at          timestamptz not null default now()
);

create index if not exists payment_schedules_event_id_idx on public.payment_schedules (event_id);

create table if not exists public.payments (
  id                    uuid primary key default gen_random_uuid(),
  payment_schedule_id   uuid references public.payment_schedules(id) on delete set null,
  event_id              uuid references public.events(id) on delete set null,
  amount                numeric(12,2) not null,
  paid_at               timestamptz not null default now(),
  method                text,                            -- 'transferencia', 'efectivo', 'otro'
  receipt_url           text,
  notes                 text,
  recorded_by           uuid references public.profiles(id) on delete set null,
  created_at            timestamptz not null default now()
);

-- ---------- COSTS ----------
create table if not exists public.costs (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.events(id) on delete cascade,
  vendor_id     uuid references public.vendors(id) on delete set null,
  category      text,                                    -- 'insumos','personal','alquileres','logistica','decoracion','otros'
  description   text,
  amount        numeric(12,2) not null,
  cost_date     date not null default current_date,
  receipt_url   text,
  paid          boolean not null default false,
  notes         text,
  recorded_by   uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists costs_event_id_idx on public.costs (event_id);

-- ---------- TRIGGERS · updated_at ----------
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'clients', 'events', 'leads', 'catalog_categories', 'catalog_items',
      'quotes', 'contracts'
    ])
  loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', t, t);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end $$;

-- ---------- ROW LEVEL SECURITY ----------
alter table public.clients              enable row level security;
alter table public.spaces               enable row level security;
alter table public.events               enable row level security;
alter table public.leads                enable row level security;
alter table public.date_holds           enable row level security;
alter table public.catalog_categories   enable row level security;
alter table public.catalog_items        enable row level security;
alter table public.vendors              enable row level security;
alter table public.quotes               enable row level security;
alter table public.quote_lines          enable row level security;
alter table public.contracts            enable row level security;
alter table public.payment_schedules    enable row level security;
alter table public.payments             enable row level security;
alter table public.costs                enable row level security;

-- Helper de roles ya existe (current_role_in)

-- Clientes: super_admin y comercial leen/escriben; operaciones lee.
drop policy if exists clients_rw on public.clients;
create policy clients_rw on public.clients
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

drop policy if exists clients_read_ops on public.clients;
create policy clients_read_ops on public.clients
  for select using (public.current_role_in(array['operaciones']::public.user_role[]));

-- Leads
drop policy if exists leads_rw on public.leads;
create policy leads_rw on public.leads
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

-- Eventos
drop policy if exists events_rw on public.events;
create policy events_rw on public.events
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

drop policy if exists events_read_ops on public.events;
create policy events_read_ops on public.events
  for select using (public.current_role_in(array['operaciones']::public.user_role[]));

-- Catálogo: super_admin escribe; comercial y operaciones leen; público lee items publicables.
drop policy if exists catalog_categories_read_public on public.catalog_categories;
create policy catalog_categories_read_public on public.catalog_categories
  for select using (active or auth.uid() is not null);

drop policy if exists catalog_categories_write on public.catalog_categories;
create policy catalog_categories_write on public.catalog_categories
  for all using (public.current_role_in(array['super_admin']::public.user_role[]));

drop policy if exists catalog_items_read_public on public.catalog_items;
create policy catalog_items_read_public on public.catalog_items
  for select using ((active and public_visible) or auth.uid() is not null);

drop policy if exists catalog_items_write on public.catalog_items;
create policy catalog_items_write on public.catalog_items
  for all using (public.current_role_in(array['super_admin']::public.user_role[]));

-- Espacios
drop policy if exists spaces_read on public.spaces;
create policy spaces_read on public.spaces
  for select using (true);

drop policy if exists spaces_write on public.spaces;
create policy spaces_write on public.spaces
  for all using (public.current_role_in(array['super_admin']::public.user_role[]));

-- Calendario (lectura pública para sitio /calendario)
drop policy if exists date_holds_read on public.date_holds;
create policy date_holds_read on public.date_holds
  for select using (true);

drop policy if exists date_holds_write on public.date_holds;
create policy date_holds_write on public.date_holds
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

-- Cotizaciones
drop policy if exists quotes_rw on public.quotes;
create policy quotes_rw on public.quotes
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

drop policy if exists quote_lines_rw on public.quote_lines;
create policy quote_lines_rw on public.quote_lines
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

-- Contratos
drop policy if exists contracts_rw on public.contracts;
create policy contracts_rw on public.contracts
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

-- Pagos (super_admin + comercial; operaciones puede registrar pagos manualmente)
drop policy if exists payment_schedules_rw on public.payment_schedules;
create policy payment_schedules_rw on public.payment_schedules
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

drop policy if exists payments_rw on public.payments;
create policy payments_rw on public.payments
  for all using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

-- Vendors (solo super_admin)
drop policy if exists vendors_rw on public.vendors;
create policy vendors_rw on public.vendors
  for all using (public.current_role_in(array['super_admin']::public.user_role[]));

-- Costos (solo super_admin escribe; operaciones puede registrar costos también)
drop policy if exists costs_rw on public.costs;
create policy costs_rw on public.costs
  for all using (public.current_role_in(array['super_admin','operaciones']::public.user_role[]));
