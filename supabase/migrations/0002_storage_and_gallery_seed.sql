-- =====================================================================
-- Finca La Clementina · Migración 0002
-- Storage bucket "media" + seed inicial de gallery_assets
-- =====================================================================

-- ---------- STORAGE BUCKET ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Cualquiera puede leer archivos (sitio público).
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Solo usuarios autenticados pueden subir / modificar / borrar.
drop policy if exists "media_authenticated_insert" on storage.objects;
create policy "media_authenticated_insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media_authenticated_update" on storage.objects;
create policy "media_authenticated_update"
  on storage.objects for update
  using (bucket_id = 'media' and auth.uid() is not null);

drop policy if exists "media_authenticated_delete" on storage.objects;
create policy "media_authenticated_delete"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.uid() is not null);

-- ---------- SEED de gallery_assets ----------
-- Reemplaza las imágenes hardcoded de /galeria por filas reales en BD.
-- Las URLs apuntan a /public/, que sirve Next.js como estático.

insert into public.gallery_assets (image_url, alt_es, alt_en, tag, sort_order, featured, published)
values
  ('/venue/boda-clementina.jpg', 'Boda en La Clementina', 'Wedding at La Clementina', 'Bodas', 1, true, true),
  ('/venue/ingreso.jpg', 'Ingreso a la finca', 'Venue entrance', 'La Finca', 2, true, true),
  ('/real/banner-finca.jpg', 'Vista general de la finca', 'Venue overview', 'La Finca', 3, false, true),
  ('/real/diseno-14.webp', 'Detalle de la finca', 'Venue detail', 'La Finca', 4, false, true),
  ('/real/diseno-16.jpg', 'Espacio decorado', 'Decorated space', 'La Finca', 5, false, true),
  ('/real/diseno-17.jpg', 'Ambiente de evento', 'Event ambience', 'La Finca', 6, false, true),
  ('/real/diseno-18.jpg', 'Decoración floral', 'Floral decoration', 'La Finca', 7, false, true),
  ('/real/diseno-19.jpg', 'Salón principal', 'Main hall', 'La Finca', 8, false, true),
  ('/real/mishelle-byron.webp', 'Boda Mishelle y Byron', 'Mishelle and Byron wedding', 'Bodas', 9, false, true),
  ('/real/mishelle-byron-boda.jpg', 'Recepción Mishelle y Byron', 'Mishelle and Byron reception', 'Bodas', 10, false, true),
  ('/real/katherine-juandiego.webp', 'Boda Katherine y Juan Diego', 'Katherine and Juan Diego wedding', 'Bodas', 11, false, true),
  ('/real/erick-dayana.webp', 'Boda Erick y Dayana', 'Erick and Dayana wedding', 'Bodas', 12, false, true),
  ('/gallery/anillos.jpg', 'Anillos de boda', 'Wedding rings', 'Bodas', 13, false, true),
  ('/gallery/bouquet.jpg', 'Bouquet de novia', 'Bridal bouquet', 'Bodas', 14, false, true),
  ('/gallery/vestido.jpg', 'Vestido de novia', 'Wedding dress', 'Bodas', 15, false, true),
  ('/gallery/ceremonia.jpg', 'Ceremonia', 'Ceremony', 'Bodas', 16, false, true),
  ('/gallery/paseo.jpg', 'Paseo de los novios', 'Newlyweds stroll', 'Bodas', 17, false, true),
  ('/real/ascenso-policia.webp', 'Ascenso de policía', 'Police promotion ceremony', 'Corporativos', 18, false, true),
  ('/events/corporativos.jpg', 'Evento corporativo', 'Corporate event', 'Corporativos', 19, false, true),
  ('/gallery/corporativo-2.jpg', 'Reunión corporativa', 'Corporate meeting', 'Corporativos', 20, false, true),
  ('/real/aire-libre.webp', 'Evento al aire libre', 'Outdoor event', 'Sociales', 21, false, true),
  ('/real/reunion-social.jpg', 'Reunión social en la finca', 'Social gathering', 'Sociales', 22, false, true),
  ('/gallery/pinata.jpg', 'Piñata', 'Piñata moment', 'Sociales', 23, false, true),
  ('/events/sociales.jpg', 'Música y celebración', 'Music and celebration', 'Sociales', 24, false, true),
  ('/events/quinces.jpg', 'Quince años', 'Sweet fifteen', 'Quinces', 25, false, true),
  ('/events/graduaciones.jpg', 'Graduación', 'Graduation', 'Graduaciones', 26, false, true)
on conflict do nothing;
