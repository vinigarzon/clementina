-- =====================================================================
-- Finca La Clementina · Migración 0004b (seed de los 4 posts del blog)
-- Aplicar DESPUÉS de la 0004a_blog_schema.sql
-- =====================================================================

insert into public.blog_posts
  (slug, title_es, excerpt_es, body_es, cover_url, category, tags, sort_order, published, published_at)
values
  (
    'consejos-vestido-de-novia',
    '10 Consejos Para Encontrar el Vestido de Novia de Tus Sueños',
    'Encontrar el vestido de novia perfecto puede ser un desafío. Aquí te compartimos 10 consejos prácticos para que el proceso sea más fácil y disfrutable.',
    E'El vestido de novia es uno de los elementos más importantes de una boda. Es el centro de atención y una representación de la personalidad y el estilo de la novia. Sin embargo, encontrar el vestido de novia perfecto puede ser un desafío debido a la gran cantidad de opciones disponibles. Aquí te compartimos 10 consejos que te ayudarán a encontrar el vestido de novia de tus sueños.\n\n## 1. Investiga Antes de Comprar\n\nAntes de visitar tiendas de vestidos de novia, investiga en la web diferentes estilos y siluetas. Revisar algunos catálogos digitales te ayudará a reducir las opciones y a encontrar el vestido adecuado más rápidamente.\n\n## 2. Establece un Presupuesto Realista\n\nEs importante que definas un presupuesto realista y evites gastar más de lo que puedes pagar. No es necesario romper el banco para conseguir un vestido impresionante.\n\n## 3. Elige la Silueta Adecuada para Tu Tipo de Cuerpo\n\nTienes que asegurarte de que el vestido que elijas sea favorecedor para tu tipo de cuerpo. Por ejemplo, si eres una persona con curvas, un vestido de novia con línea A puede ser lo mejor para ti.\n\n## 4. Visita Diferentes Boutiques\n\nPrueba diferentes tiendas y boutiques de novias para encontrar la que se adapte mejor a tus necesidades y estilo.\n\n## 5. Prueba con Varios Estilos de Vestidos\n\nNo te limites a probar un solo estilo de vestido. Siéntete libre de experimentar con diferentes cortes, siluetas y detalles para encontrar el que se adapte a tu personalidad y estilo.\n\n## 6. Considera la Época del Año\n\nToma en cuenta la época en la que te casarás y elige un vestido que sea apropiado para el clima. Si te casas en verano, busca vestidos de telas ligeras y frescas que te permitan sentirte cómoda durante todo el día.\n\n## 7. Ten en Cuenta el Tema de Tu Boda\n\nSi estás planeando una boda en la playa, por ejemplo, un vestido con estilo boho chic podría ser una gran opción. Asegúrate de elegir un vestido que vaya acorde con el tema general de tu boda.\n\n## 8. Busca Inspiración en las Celebridades\n\nObserva cómo las celebridades usan sus vestidos de novia y toma ideas de ellas para crear tu propio estilo.\n\n## 9. No Renuncies a Tu Estilo Personal\n\nAsegúrate de que el vestido de novia que elijas refleje tu personalidad y estilo.\n\n## 10. No Tomes una Decisión Apresurada\n\nLa elección del vestido de novia es una de las decisiones más importantes de tu boda, así que tómate tu tiempo para encontrar el vestido adecuado.',
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
    'La Marcha Nupcial es sinónimo de bodas. Te contamos su historia desde Mendelssohn hasta hoy.',
    E'La Marcha Nupcial es una pieza musical que ha llegado a ser sinónimo de bodas, un sonido que evoca imágenes de novias caminando por el pasillo hacia su futuro. Pero, ¿alguna vez te has preguntado cómo se popularizó esta tradición? En este artículo, exploraremos la historia de la Marcha Nupcial y cómo se convirtió en una parte integral de las ceremonias de boda.\n\n## Origen de la Marcha Nupcial\n\nLa Marcha Nupcial más conocida fue compuesta por el compositor alemán Felix Mendelssohn en 1842. Esta pieza musical fue creada como parte de la música para la obra de teatro "Sueño De Una Noche de Verano" de William Shakespeare. Sin embargo, no fue hasta años después que esta melodía se asociaría con las bodas.\n\n## La Reina Victoria y la Marcha Nupcial\n\nLa tradición de utilizar la Marcha Nupcial en las bodas comenzó con la reina Victoria del Reino Unido. Era una gran admiradora de la música de Mendelssohn y amiga personal del compositor. Cuando su hija, la princesa Victoria, se casó con el príncipe Federico Guillermo de Prusia el 25 de enero de 1858, la reina Victoria pidió que se tocara la Marcha Nupcial durante la ceremonia.\n\n## Influencia de la Reina Victoria\n\nLa reina Victoria fue una de las grandes influencers de su época. Muchas Casas Reales y familias aristocráticas copiaron sus gustos y modas, incluyendo la elección de la música para las bodas. A partir de la boda de la princesa Victoria, la Marcha Nupcial de Mendelssohn se convirtió en la pieza musical por excelencia para la entrada de la novia en las bodas.\n\n## La Marcha Nupcial Hoy\n\nHoy en día, la Marcha Nupcial sigue siendo una elección popular para las bodas. Aunque algunas parejas optan por canciones más modernas o personales, la Marcha Nupcial mantiene su lugar como un clásico atemporal.',
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
    'Cada aniversario tiene un nombre único que simboliza la fuerza y evolución de la relación. Desde Bodas de Papel hasta Bodas de Hueso.',
    E'Los aniversarios de matrimonio son una hermosa tradición que permite a las parejas celebrar cada año de amor y compromiso. Cada aniversario tiene un nombre único, que simboliza la fuerza y la evolución de la relación a lo largo del tiempo.\n\n## El Origen de los Aniversarios\n\nLa tradición de asignar un nombre a cada aniversario de matrimonio tiene sus raíces en la Alemania medieval. Cuando una pareja lograba llegar a su 25 aniversario, se le regalaba a la mujer una corona de plata, simbolizando la armonía y la fortaleza de su unión. Al llegar al 50 aniversario, la mujer recibía una corona de oro.\n\n## Los Primeros Años: De Papel a Bronce\n\nEl primer aniversario se conoce como Bodas de Papel, simbolizando la fragilidad y frescura del primer año. Bodas de Algodón en el segundo, Cuero en el tercero, Lino en el cuarto, Madera en el quinto, Hierro en el sexto, Lana en el séptimo y Bronce en el octavo.\n\n## De Arcilla a Cristal: Consolidación\n\nA partir del noveno aniversario, las Bodas de Arcilla, la relación se consolida. Los siguientes años: Aluminio, Acero, Seda, Encaje, Marfil y finalmente Bodas de Cristal en el decimoquinto.\n\n## De Hiedra a Oro: Madurez\n\nDesde las Bodas de Hiedra (16) hasta las Bodas de Oro (50), estos años representan la madurez y la profundidad de la relación.\n\n## Más Allá del Oro\n\nDespués de las Bodas de Oro, cada aniversario sigue teniendo un nombre especial, desde las Bodas de Camelia hasta las impresionantes Bodas de Hueso en el centésimo aniversario.',
    '/blog/anillos.webp',
    'bodas',
    array['aniversarios','bodas de plata','bodas de oro','tradiciones','celebraciones'],
    3,
    true,
    '2023-07-05T12:00:00Z'::timestamptz
  ),
  (
    'como-escoger-flores-evento',
    'Cómo Escoger las Flores para un Evento',
    'Las flores son un elemento esencial en cualquier evento. Consejos para elegir las flores ideales para tu celebración.',
    E'Las flores son un elemento esencial en cualquier evento, ya sea una boda, un cumpleaños, una cena de gala o una reunión informal. Aportan color, vida y un toque de belleza que transforma cualquier espacio.\n\n## Define el Estilo del Evento\n\nAntes de elegir flores, define el estilo y la atmósfera del evento. Una boda clásica pide flores tradicionales como rosas blancas y lirios. Una celebración boho chic combina mejor con girasoles, eucalipto y flores silvestres.\n\n## Considera la Temporada\n\nLas flores de temporada son más frescas, más bonitas y más económicas. En Ecuador tenemos la fortuna de contar con rosas todo el año, además de hortensias, calas, gypsophila y muchas otras opciones locales.\n\n## Define la Paleta de Colores\n\nLa paleta de colores marca el tono visual del evento. Decide si quieres tonos suaves y pasteles, contrastes vibrantes o un solo color en distintos matices.\n\n## Piensa en los Aromas\n\nAlgunas flores tienen aromas muy fuertes. Para un evento al aire libre los aromas potentes funcionan bien, pero en un salón cerrado con muchos invitados pueden ser invasivos.\n\n## Define los Puntos Focales\n\nDecide dónde quieres concentrar las flores: arco de ceremonia, centros de mesa, mesa principal, ingreso, ramo de la novia. Concentrar las flores en pocos puntos clave suele ser más impactante.\n\n## En La Clementina\n\nNuestro equipo coordina toda la decoración floral del evento. Conversa con nosotros y diseñamos juntos la propuesta que mejor refleje tu estilo.',
    '/blog/bouquet.webp',
    'consejos',
    array['flores','decoración floral','flores para bodas','consejos','flores para eventos'],
    4,
    true,
    '2023-08-10T12:00:00Z'::timestamptz
  )
on conflict (slug) do nothing;
