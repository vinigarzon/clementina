-- =====================================================================
-- Finca La Clementina · Migración 0007
-- Crea la tabla leads + policies para que el form público de /contacto
-- pueda guardar solicitudes.
-- =====================================================================
-- Contexto: la migración 0003 (esquema comercial completo) aún no se ha
-- aplicado en la base, pero el form de contacto necesita una tabla
-- mínima para guardar leads. Esta migración crea solo lo necesario:
--   - enum lead_status
--   - tabla public.leads (sin FKs a clients/events que aún no existen)
--   - índices
--   - RLS + dos policies:
--       * leads_admin_rw    → super_admin/comercial (cuando se aplique
--                             el admin comercial completo)
--       * leads_public_insert → anon/authenticated (form público)
-- Si más adelante se aplica 0003 completa, esa migración es idempotente
-- (usa "create table if not exists") así que no chocan.
-- =====================================================================

-- ----- 1. Enum lead_status -----
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum (
      'nuevo',
      'contactado',
      'calificado',
      'descartado',
      'convertido'
    );
  end if;
end$$;

-- ----- 2. Tabla leads -----
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  full_name         text,
  email             text,
  phone             text,
  event_type_slug   text,
  desired_date      date,
  guests            int,
  message           text,
  client_id         uuid,
  event_id          uuid,
  status            public.lead_status not null default 'nuevo',
  consent_given     boolean not null default false,
  source            text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ----- 3. RLS -----
alter table public.leads enable row level security;

-- Policy admin (lee/escribe todo). Solo aplica si la función
-- public.current_role_in existe (la crea la migración 0003). Si todavía
-- no se aplicó 0003, omitimos esta policy: el service-role / admin SQL
-- siguen funcionando porque RLS no aplica a service_role.
do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'current_role_in'
  ) then
    execute 'drop policy if exists leads_admin_rw on public.leads';
    execute $pol$
      create policy leads_admin_rw on public.leads
        for all
        using (public.current_role_in(array['super_admin','comercial']::public.user_role[]))
    $pol$;
  end if;
end$$;

-- Policy pública: cualquier visitante puede insertar un lead, pero solo
-- con valores seguros.
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert
  on public.leads
  for insert
  to anon, authenticated
  with check (
    status = 'nuevo'
    and consent_given = true
    and client_id is null
    and event_id is null
    and (source is null or source like 'web-%')
  );

-- Refresca el cache de PostgREST para que la API REST vea la tabla.
notify pgrst, 'reload schema';
