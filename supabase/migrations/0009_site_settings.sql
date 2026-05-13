-- =====================================================================
-- Finca La Clementina · Migración 0009
-- Tabla site_settings: configuración del sitio administrable desde
-- el panel admin sin necesidad de redeploy.
--
-- Permite editar:
--   - WhatsApp (número raw y formato display)
--   - Correos (contacto público, receptor de leads, from de Resend)
--   - Redes sociales (Instagram, Facebook)
--   - Dirección (línea 1, línea 2, ciudad)
--   - Identidad (name, tagline)
-- =====================================================================

create table if not exists public.site_settings (
  key          text primary key,
  value        text not null default '',
  label        text not null,
  description  text,
  category     text not null default 'general',
  -- 'text', 'email', 'phone', 'url'. Lo usamos en el form admin para
  -- decidir qué tipo de input mostrar.
  input_type   text not null default 'text',
  -- Lectura pública (true) o solo admin (false).
  -- Por defecto todas son públicas porque el sitio público las consume.
  public_read  boolean not null default true,
  sort_order   int not null default 0,
  updated_at   timestamptz not null default now()
);

-- Trigger updated_at
drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------- SEED de configuraciones iniciales ----------
insert into public.site_settings (key, value, label, description, category, input_type, sort_order)
values
  -- Contacto
  ('whatsapp_number',        '593999660252',                  'Número de WhatsApp (sin signos)',  'Solo dígitos con código de país. Se usa para los links wa.me/...', 'contacto', 'phone', 10),
  ('whatsapp_display',       '+593 99 966 0252',              'WhatsApp visible',                  'Como se muestra al usuario en botones y footer.',                  'contacto', 'text',  11),
  ('contact_email',          'info@fincalaclementina.com',    'Correo público de contacto',        'Aparece en el sitio público y como reply-to.',                     'contacto', 'email', 12),

  -- Notificaciones por correo
  ('lead_notification_email','vinicio.garzon@gmail.com',      'Receptor de leads',                 'A dónde llegan los avisos cuando alguien llena el formulario.',    'notificaciones', 'email', 20),
  ('resend_from_email',      'onboarding@resend.dev',         'Correo "From" (Resend)',            'Dirección que aparece como remitente. Debe estar verificada en Resend.', 'notificaciones', 'email', 21),
  ('resend_from_name',       'Finca La Clementina',           'Nombre del remitente',              'Lo que ve el cliente como nombre del remitente del correo.',       'notificaciones', 'text',  22),

  -- Redes
  ('instagram_url',          'https://instagram.com/fincalaclementina', 'Instagram', 'URL completa del perfil de Instagram.',                                     'redes', 'url', 30),
  ('facebook_url',           'https://facebook.com/fincalaclementina',  'Facebook',  'URL completa de la página de Facebook.',                                    'redes', 'url', 31),

  -- Dirección
  ('address_line1',          'Vía El Carrizal, a 50 m del Centro Turístico', 'Dirección línea 1', 'Calle, número, referencia.',                                  'direccion', 'text', 40),
  ('address_line2',          'Parroquia Urbina',              'Dirección línea 2',                 'Parroquia, barrio, etc.',                                          'direccion', 'text', 41),
  ('address_city',           'Tulcán, Ecuador',               'Ciudad y país',                     'Como aparece en pie de página y emails.',                          'direccion', 'text', 42),

  -- Identidad
  ('site_name',              'Finca La Clementina',           'Nombre del sitio',                  'Aparece en titles y meta tags.',                                   'identidad', 'text', 50),
  ('site_tagline',           'Convenciones & Eventos',        'Tagline',                           'Frase corta que acompaña al nombre.',                              'identidad', 'text', 51)
on conflict (key) do nothing;

-- ---------- RLS ----------
alter table public.site_settings enable row level security;

-- Lectura pública: cualquiera puede leer (el sitio público lo necesita).
drop policy if exists site_settings_read_public on public.site_settings;
create policy site_settings_read_public
  on public.site_settings
  for select
  to anon, authenticated
  using (public_read = true);

-- Escritura: solo super_admin y comercial.
drop policy if exists site_settings_write on public.site_settings;
create policy site_settings_write
  on public.site_settings
  for all
  using (public.current_role_in(array['super_admin','comercial']::public.user_role[]));

notify pgrst, 'reload schema';
