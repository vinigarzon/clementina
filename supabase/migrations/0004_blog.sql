-- =====================================================================
-- Finca La Clementina · Migración 0004
-- Blog (Inspiración) con posts bilingües.
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
  category     text,                  -- 'bodas', 'consejos', 'flores', etc.
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

-- Trigger updated_at
drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
  for select using (published = true or auth.uid() is not null);

drop policy if exists blog_posts_write on public.blog_posts;
create policy blog_posts_write on public.blog_posts
  for all using (
    public.current_role_in(array['super_admin', 'apoyo']::public.user_role[])
  );

-- =====================================================================
-- SEED: 4 posts del sitio actual
-- =====================================================================

insert into public.blog_posts
  (slug, title_es, excerpt_es, body_es, cover_url, category, tags, sort_order, published, published_at)
values
  (
    'consejos-vestido-de-novia',
    '10 Consejos Para Encontrar el Vestido de Novia de Tus Sueños',
    'Encontrar el vestido de novia perfecto puede ser un desafío. Aquí te compartimos 10 consejos prácticos para que el proceso sea más fácil y disfrutable.',
    E'El vestido de novia es uno de los elementos más importantes de una boda. Es el centro de atención y una representación de la personalidad y el estilo de la novia. Sin embargo, encontrar el vestido de novia perfecto puede ser un desafío debido a la gran cantidad de opciones disponibles. Aquí te compartimos 10 consejos que te ayudarán a encontrar el vestido de novia de tus sueños.\n\n## 1. Investiga Antes de Comprar\n\nAntes de visitar tiendas de vestidos de novia, investiga en la web diferentes estilos y siluetas. Revisar algunos catálogos digitales te ayudará a reducir las opciones y a encontrar el vestido adecuado más rápidamente.\n\n## 2. Establece un Presupuesto Realista\n\nEs importante que definas un presupuesto realista y evites gastar más de lo que puedes pagar. No es necesario romper el banco para conseguir un vestido impresionante.\n\n## 3. Elige la Silueta Adecuada para Tu Tipo de Cuerpo\n\nTienes que asegurarte de que el vestido que elijas sea favorecedor para tu tipo de cuerpo. Por ejemplo, si eres una persona con curvas, un vestido de novia con línea A puede ser lo mejor para ti.\n\n## 4. Visita Diferentes Boutiques\n\nPrueba diferentes tiendas y boutiques de novias para encontrar la que se adapte mejor a tus necesidades y estilo.\n\n## 5. Prueba con Varios Estilos de Vestidos\n\nNo te limites a probar un solo estilo de vestido. Siéntete libre de experimentar con diferentes cortes, siluetas y detalles para encontrar el que se adapte a tu personalidad y estilo.\n\n## 6. Considera la Época del Año\n\nToma en cuenta la época en la que te casarás y elige un vestido que sea apropiado para el clima. Si te casas en verano, busca vestidos de telas ligeras y frescas que te permitan sentirte cómoda durante todo el día.\n\n## 7. Ten en Cuenta el Tema de Tu Boda\n\nSi estás planeando una boda en la playa, por ejemplo, un vestido con estilo boho chic podría ser una gran opción. Asegúrate de elegir un vestido que vaya acorde con el tema general de tu boda.\n\n## 8. Busca Inspiración en las Celebridades\n\nObserva cómo las celebridades usan sus vestidos de novia y toma ideas de ellas para crear tu propio estilo.\n\n## 9. No Renuncies a Tu Estilo Personal\n\nAsegúrate de que el vestido de novia que elijas refleje tu personalidad y estilo. Si eres una persona que prefiere un estilo más clásico, elige un vestido con un diseño más tradicional. Si prefieres algo más moderno, elige un vestido con un diseño más atrevido.\n\n## 10. ¡No Tomes una Decisión Apresurada!\n\nLa elección del vestido de novia es una de las decisiones más importantes de tu boda, así que tómate tu tiempo para encontrar el vestido adecuado. ¡No tomes una decisión apresurada!',
    '/blog/vestido-novia.webp',
    'consejos',
    array['boda','vestido de novia','consejos','estilo','presupuesto'],
    1,
    true,
    '2023-06-15T12:00:00Z'::timestamptz
  ),

  (
    'marcha-nupcial-historia',
    'La Marcha Nupcial en las Bodas: Historia y Popularización',
    'La Marcha Nupcial es sinónimo de bodas. ¿Sabes cómo se popularizó esta tradición? Te contamos su historia desde Mendelssohn hasta hoy.',
    E'La Marcha Nupcial es una pieza musical que ha llegado a ser sinónimo de bodas, un sonido que evoca imágenes de novias caminando por el pasillo hacia su futuro. Pero, ¿alguna vez te has preguntado cómo se popularizó esta tradición? En este artículo, exploraremos la historia de la Marcha Nupcial y cómo se convirtió en una parte integral de las ceremonias de boda.\n\n## Origen de la Marcha Nupcial\n\nLa Marcha Nupcial más conocida fue compuesta por el compositor alemán Felix Mendelssohn en 1842. Esta pieza musical fue creada como parte de la música para la obra de teatro «Sueño De Una Noche de Verano» de William Shakespeare. Sin embargo, no fue hasta años después que esta melodía se asociaría con las bodas.\n\n## La Reina Victoria y la Marcha Nupcial\n\nLa tradición de utilizar la Marcha Nupcial en las bodas comenzó con la reina Victoria del Reino Unido. Era una gran admiradora de la música de Mendelssohn y amiga personal del compositor. Cuando su hija, la princesa Victoria, se casó con el príncipe Federico Guillermo de Prusia el 25 de enero de 1858, la reina Victoria pidió que se tocara la Marcha Nupcial durante la ceremonia. Este evento tuvo lugar en la Capilla Real del Palacio de St. James en Londres.\n\n## Influencia de la Reina Victoria\n\nLa reina Victoria fue una de las grandes influencers de su época. Muchas Casas Reales y familias aristocráticas copiaron sus gustos y modas, incluyendo la elección de la música para las bodas. A partir de la boda de la princesa Victoria, la Marcha Nupcial de Mendelssohn se convirtió en la pieza musical por excelencia para la entrada de la novia en las bodas.\n\n## La Marcha Nupcial Hoy\n\nHoy en día, la Marcha Nupcial sigue siendo una elección popular para las bodas. Aunque algunas parejas optan por canciones más modernas o personales, la Marcha Nupcial mantiene su lugar como un clásico atemporal. Su melodía evocadora y su rica historia la convierten en una elección significativa para muchas parejas en su día especial.',
    '/blog/marcha-nupcial.webp',
    'bodas',
    array['bodas','marcha nupcial','música de boda','historia','tradición'],
    2,
    true,
    '2023-06-20T12:00:00Z'::timestamptz
  ),

  (
    'aniversarios-de-matrimonio',
    'Aniversarios de Matrimonio: Nombres y Significados',
    'Cada aniversario tiene un nombre que simboliza la fuerza y evolución de la relación. Desde Bodas de Papel hasta Bodas de Hueso, descubre el significado de cada uno.',
    E'Los aniversarios de matrimonio son una hermosa tradición que permite a las parejas celebrar cada año de amor y compromiso. Cada aniversario tiene un nombre único, que simboliza la fuerza y la evolución de la relación a lo largo del tiempo. En este artículo, exploraremos el significado de cada aniversario de matrimonio, desde las Bodas de Papel hasta las Bodas de Hueso.\n\n## El Origen de los Aniversarios de Matrimonio\n\nLa tradición de asignar un nombre a cada aniversario de matrimonio tiene sus raíces en la Alemania medieval. Cuando una pareja lograba llegar a su 25° aniversario, se le regalaba a la mujer una corona de plata, simbolizando la armonía y la fortaleza de su unión. Al llegar al 50° aniversario, la mujer recibía una corona de oro. De esta manera, nacieron las Bodas de Plata y las Bodas de Oro.\n\n## Los Primeros Años: De Papel a Bronce\n\nEl primer aniversario de matrimonio se conoce como Bodas de Papel, simbolizando la fragilidad y frescura del primer año de casados. A medida que los años avanzan, los materiales se vuelven más resistentes, reflejando el fortalecimiento de la relación. Así, tenemos las Bodas de Algodón en el segundo año, las Bodas de Cuero en el tercero, las Bodas de Lino en el cuarto, las Bodas de Madera en el quinto, las Bodas de Hierro en el sexto, las Bodas de Lana en el séptimo y las Bodas de Bronce en el octavo.\n\n## De Arcilla a Cristal: Los Años de Consolidación\n\nA partir del noveno aniversario, las Bodas de Arcilla, la relación se consolida y se vuelve más sólida. Los siguientes años incluyen las Bodas de Aluminio, Acero, Seda, Encaje, Marfil y finalmente las Bodas de Cristal en el decimoquinto aniversario.\n\n## De Hiedra a Oro: Los Años de Madurez\n\nDesde las Bodas de Hiedra en el decimosexto aniversario hasta las Bodas de Oro en el quincuagésimo, estos años representan la madurez y la profundidad de la relación. Cada aniversario durante este período tiene un nombre único, desde las Bodas de Alhelí hasta las Bodas de Circón.\n\n## Más Allá del Oro: De Camelia a Hueso\n\nDespués de las Bodas de Oro, cada aniversario sigue teniendo un nombre especial, desde las Bodas de Camelia hasta las impresionantes Bodas de Hueso en el centésimo aniversario. Estos años representan un amor y un compromiso que han resistido la prueba del tiempo.',
    '/blog/anillos.webp',
    'bodas',
    array['aniversarios','bodas de plata','bodas de oro','tradiciones','celebraciones'],
    3,
    true,
    '2023-07-05T12:00:00Z'::timestamptz
  ),

  (
    'como-escoger-flores-evento',
    'Cómo Escoger las Flores para un Evento: Un Toque de Belleza y Elegancia',
    'Las flores son un elemento esencial en cualquier evento. Te compartimos consejos para elegir las flores ideales para tu boda, cumpleaños o reunión especial.',
    E'Las flores son un elemento esencial en cualquier evento, ya sea una boda, un cumpleaños, una cena de gala o una reunión informal. Aportan color, vida y un toque de belleza que transforma cualquier espacio en un lugar memorable. Pero elegir las flores adecuadas no siempre es sencillo. Aquí te dejamos algunas guías que te ayudarán a tomar la decisión correcta.\n\n## Define el Estilo del Evento\n\nAntes de elegir flores, define el estilo y la atmósfera del evento. Una boda clásica pide flores tradicionales como rosas blancas y lirios. Una celebración boho chic combina mejor con girasoles, eucalipto y flores silvestres. Si el evento es corporativo, opta por arreglos más formales y minimalistas.\n\n## Considera la Temporada\n\nLas flores de temporada son más frescas, más bonitas y más económicas. Pregunta a tu florista qué flores están disponibles en la fecha de tu evento. En Ecuador tenemos la fortuna de contar con rosas todo el año, además de hortensias, calas, gypsophila y muchas otras opciones locales de excelente calidad.\n\n## Define la Paleta de Colores\n\nLa paleta de colores marca el tono visual del evento. Decide si quieres tonos suaves y pasteles, contrastes vibrantes o un solo color en distintos matices. Asegúrate de que la paleta floral combine con la decoración general, los manteles y el vestuario de la pareja o anfitriones.\n\n## Piensa en los Aromas\n\nAlgunas flores tienen aromas muy fuertes (lirios, jazmines, gardenias). Considera el ambiente: para un evento al aire libre los aromas potentes funcionan bien, pero en un salón cerrado con muchos invitados pueden ser invasivos.\n\n## Define los Puntos Focales\n\nDecide dónde quieres concentrar las flores: arco de ceremonia, centros de mesa, mesa principal, ingreso, ramo de la novia, boutonnieres, decoración de sillas. Concentrar las flores en pocos puntos clave suele ser más impactante que dispersarlas por todo el espacio.\n\n## Trabaja con un Florista Profesional\n\nUn buen florista te asesora con honestidad, te muestra opciones según tu presupuesto y se encarga del montaje el día del evento. Pide referencias, revisa portafolios y confirma que entiende tu visión antes de cerrar el trato.\n\n## En La Clementina\n\nNuestro equipo coordina toda la decoración floral del evento, desde el arco de ceremonia hasta los centros de mesa. Conversa con nosotros y diseñamos juntos la propuesta que mejor refleje tu estilo.',
    '/blog/bouquet.webp',
    'consejos',
    array['flores','decoración floral','flores para bodas','consejos','flores para eventos'],
    4,
    true,
    '2023-08-10T12:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;
