-- =====================================================================
-- 0006 · Contenido enriquecido para tipos de evento
-- =====================================================================
-- Añade columnas `body_es`, `body_en` (markdown extenso por evento) y
-- `whatsapp_message_es`, `whatsapp_message_en` (mensaje precargado para
-- el botón / link de WhatsApp por tipo de evento).
--
-- Después actualiza los 9 tipos de evento existentes con:
--   - short_es nuevo (frase emocional del brief)
--   - highlights_es reemplazados (ahora son "Qué puedes vivir" en el evento)
--   - body_es con el contenido completo en Markdown (texto principal +
--     ideas + conexión con Tulcán + gastronomía + FAQ)
--   - whatsapp_message_es con mensaje precargado del evento
--
-- Estrategia bilingüe: por ahora _en := _es como fallback. En una pasada
-- posterior se hará la traducción real.
-- =====================================================================

alter table public.event_types
  add column if not exists body_es text not null default '',
  add column if not exists body_en text not null default '',
  add column if not exists whatsapp_message_es text,
  add column if not exists whatsapp_message_en text;

-- ---------------------------------------------------------------------
-- 1. BODAS
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Ceremonias y recepciones en un entorno natural, elegante y familiar.',
  description_es = 'En La Clementina, una boda se vive con calma, belleza y emoción. El entorno de finca, los jardines y los espacios para reunión permiten crear una celebración que se siente íntima, elegante y profundamente familiar.',
  highlights_es = array[
    'Ceremonia civil, simbólica o bendición en un ambiente natural',
    'Recepción con cena, brindis, torta, música y baile',
    'Sesión de fotos de los novios en jardines, entradas y rincones verdes',
    'Ingreso especial de los novios y palabras de padres o padrinos',
    'Mesa de dulces, torta, bocaditos y estaciones de bebidas',
    'Hora loca, DJ, música en vivo o show especial',
    'Espacio para una boda íntima o una celebración familiar amplia'
  ],
  body_es = E'Aquí los novios pueden imaginar una ceremonia al aire libre, una recepción con mesas cuidadas, un brindis con sus familias, una cena especial y una noche de música y baile. La experiencia puede ser romántica, campestre, clásica, moderna o muy familiar, según el estilo de cada pareja.\n\nEn Tulcán y Carchi, una boda no une solamente a dos personas. También reúne a padres, padrinos, abuelos, hermanos, primos, amigos de toda la vida e invitados que muchas veces llegan desde Quito, Ibarra, Ipiales, Pasto u otras ciudades. Por eso, en La Clementina entendemos el valor de la familia y de los detalles.\n\n## Ideas para enriquecer la experiencia\n\n- Crear un recorrido fotográfico para los novios: preparación, first look, ceremonia, brindis, baile y fotos familiares.\n- Ofrecer una mesa de bienvenida con bebidas calientes o bocaditos, ideal para el clima andino de Tulcán.\n- Proponer un espacio de recuerdos con fotos de los novios, mensajes de la familia y detalles de la historia de amor.\n- Diseñar paquetes con proveedores aliados: decoración floral, fotografía, video, música, iluminación y coordinación.\n- Incluir una opción de ceremonia de día y recepción al atardecer para aprovechar la luz natural.\n\n## Conexión con Tulcán y Carchi\n\nUna boda en La Clementina puede conectar con la tradición carchense de celebrar en familia, con comida abundante, música, padrinos, brindis y la presencia de varias generaciones. No es solo un evento bonito, sino una reunión familiar con raíces y memoria.\n\n## Gastronomía y detalles\n\n- Cena o almuerzo formal, según el horario del evento.\n- Bocaditos salados y dulces para la recepción.\n- Torta de matrimonio y mesa dulce con el respaldo de La Clementina Bakery & Café.\n- Opciones con guiños locales: papas, ají, carnes, sopas o bebidas calientes, adaptadas a una presentación elegante.\n- Coffee station, chocolate caliente o bebidas de bienvenida para eventos en clima frío.\n\n## Preguntas frecuentes\n\n**¿Se puede hacer ceremonia y recepción en el mismo lugar?**\n\nSí. La Clementina puede ser el punto de encuentro para vivir varios momentos de la boda en un solo espacio, según disponibilidad y montaje.\n\n**¿Pueden ayudarnos con decoración y proveedores?**\n\nSí. Se pueden coordinar detalles como flores, bocaditos, música, fotografía, video e iluminación, de acuerdo con el paquete elegido.\n\n**¿La boda puede ser de día o de noche?**\n\nSí. La finca puede adaptarse a bodas de día, al atardecer o de noche, cuidando iluminación, comida y ambiente.',
  whatsapp_message_es = 'Hola, quisiera información para celebrar mi boda en Finca La Clementina. Tenemos una fecha tentativa y queremos conocer disponibilidad, paquetes y opciones de recepción.'
where slug = 'bodas';

-- ---------------------------------------------------------------------
-- 2. QUINCE AÑOS
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Una nueva etapa celebrada con magia, música y detalles únicos.',
  description_es = 'Los quince años son una celebración llena de ilusión. Es el paso a una nueva etapa, pero también un momento de gratitud para la familia que ha acompañado el crecimiento de la quinceañera.',
  highlights_es = array[
    'Entrada especial de la quinceañera',
    'Vals con papá, familia o chambelanes',
    'Sesión fotográfica previa o durante el evento',
    'Mesa principal, torta y mesa de dulces temática',
    'Decoración con flores, globos, luces y estilo elegido por la familia',
    'DJ, hora loca, baile moderno o show sorpresa',
    'Momento para palabras de los padres, padrinos o abuelos'
  ],
  body_es = E'En La Clementina, esta celebración puede tener entrada especial, sesión de fotos, mesa principal, decoración temática, música, baile, torta y momentos familiares. El entorno natural permite que cada foto se sienta distinta y que la fiesta tenga un aire elegante, fresco y memorable.\n\nEn Tulcán y Carchi, los quince años suelen involucrar a padres, padrinos, abuelos, tíos, primos, amigas y compañeros. Por eso combinamos emoción familiar con la parte moderna y divertida que espera la quinceañera.\n\n## Ideas para enriquecer la experiencia\n\n- Crear un "photo walk" por la finca para fotos con vestido, familia y amigas.\n- Diseñar una entrada tipo alfombra o camino iluminado para la quinceañera.\n- Proponer una mesa de deseos donde los invitados escriban mensajes para la nueva etapa.\n- Armar un rincón para fotos con amigas, globos, luces, flores o letrero personalizado.\n- Combinar una comida familiar elegante con una fiesta juvenil después del brindis.\n\n## Conexión con Tulcán y Carchi\n\nLa fiesta de quince en Carchi tiene mucho de familia, orgullo y acompañamiento. La Clementina permite honrar a los padres y padrinos, pero también darle a la quinceañera una celebración moderna, visual y divertida.\n\n## Gastronomía y detalles\n\n- Menú juvenil y familiar, con opciones para adultos y jóvenes.\n- Mesa dulce con torta temática, cupcakes, bocaditos y postres.\n- Bebidas sin alcohol, estación de mocktails o bebidas calientes.\n- Bocaditos para la recepción y para la hora de baile.\n- Opciones de brunch, almuerzo o cena según el horario.\n\n## Preguntas frecuentes\n\n**¿Se puede personalizar la decoración?**\n\nSí. Personalizamos colores, flores, globos, luces y estilo general del evento.\n\n**¿Hay espacios para sesión de fotos?**\n\nSí. El entorno de finca y jardines es uno de los grandes diferenciales para fotos familiares y de la quinceañera.\n\n**¿Se puede hacer una fiesta juvenil con DJ?**\n\nSí. Se puede plantear una celebración con comida, brindis familiar y luego música o baile, según el paquete contratado.',
  whatsapp_message_es = 'Hola, quisiera información para celebrar unos quince años en Finca La Clementina. Queremos conocer opciones de decoración, comida, música y fotos.'
where slug = 'quince-anos';

-- ---------------------------------------------------------------------
-- 3. GRADUACIONES
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'El logro merece una celebración con quienes hicieron parte del camino.',
  description_es = 'Una graduación es el cierre de años de esfuerzo, disciplina y apoyo familiar. En La Clementina, este logro puede celebrarse con una recepción cálida, elegante y llena de significado.',
  highlights_es = array[
    'Almuerzo o cena familiar de graduación',
    'Fiesta de promoción o curso completo',
    'Brindis con padres, profesores y amigos',
    'Zona para fotos con toga, birrete, diploma y familia',
    'Decoración con colores de la institución educativa',
    'Mesa de postres, bocaditos y torta de graduación',
    'Música, animación o DJ para cerrar la celebración'
  ],
  body_es = E'El espacio se presta para almuerzos familiares, cenas de graduación, fiestas de promoción, brindis, sesiones de fotos con toga y birrete, y reuniones con compañeros, profesores o amigos cercanos.\n\nEn Tulcán y Carchi, una graduación se celebra en familia. Los padres, abuelos y hermanos sienten el logro como propio. Por eso La Clementina ofrece un ambiente cómodo, bonito y especial para agradecer y celebrar juntos.\n\n## Ideas para enriquecer la experiencia\n\n- Crear un backdrop con el nombre del graduado, año y carrera o colegio.\n- Ofrecer un paquete de cena familiar más fotografía básica.\n- Incluir una mesa de recuerdos con fotos de la etapa estudiantil.\n- Preparar un brindis especial para que los padres puedan decir unas palabras.\n- Diseñar opciones para grupos de colegios o universidades.\n\n## Conexión con Tulcán y Carchi\n\nLa graduación en Carchi suele ser un motivo de orgullo para toda la familia. Hablamos de esfuerzo, sacrificio, futuro y gratitud, conectando con esa cultura de celebrar los logros familiares alrededor de la mesa.\n\n## Gastronomía y detalles\n\n- Almuerzo o cena de celebración.\n- Bocaditos para recibir a los invitados.\n- Torta temática con birrete, diploma o colores institucionales.\n- Menú familiar con opciones para adultos, jóvenes y niños.\n- Bebidas calientes o estación de café para eventos de tarde o noche.\n\n## Preguntas frecuentes\n\n**¿Puedo organizar una graduación familiar pequeña?**\n\nSí. No todas las graduaciones deben ser grandes; también pueden ser almuerzos o cenas íntimas.\n\n**¿Sirve para fiestas de promoción?**\n\nSí. La Clementina puede recibir grupos, promociones o cursos completos, según capacidad y disponibilidad.\n\n**¿Se puede decorar con colores del colegio o universidad?**\n\nSí. Es una excelente idea: decoración con colores institucionales, nombres, año de graduación y mesa de fotos.',
  whatsapp_message_es = 'Hola, quisiera información para una graduación en Finca La Clementina. Seríamos aproximadamente [número] invitados y buscamos una celebración familiar y especial.'
where slug = 'graduaciones';

-- ---------------------------------------------------------------------
-- 4. EVENTOS CORPORATIVOS
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Reuniones, lanzamientos y celebraciones empresariales en un ambiente diferente.',
  description_es = 'Los eventos corporativos no tienen que sentirse fríos o repetidos. En La Clementina, las empresas e instituciones pueden reunirse en un ambiente natural, tranquilo y bien presentado, ideal para conversar, capacitar, reconocer logros o celebrar resultados.',
  highlights_es = array[
    'Conferencias, capacitaciones y talleres',
    'Desayunos, almuerzos o cenas empresariales',
    'Lanzamientos de productos o marcas',
    'Premiaciones y reconocimientos a equipos',
    'Reuniones de directorio o planificación',
    'Actividades de integración y fin de año',
    'Eventos institucionales, gremiales o comerciales'
  ],
  body_es = E'El espacio puede adaptarse a desayunos de trabajo, capacitaciones, lanzamientos, cenas institucionales, reuniones de directorio, premiaciones, aniversarios de empresa, ruedas de prensa o actividades de integración.\n\nEn Carchi, donde conviven comercio, agricultura, ganadería, turismo, cooperativas, instituciones educativas y actividad fronteriza, los eventos empresariales necesitan lugares que combinen seriedad, buena atención y cercanía. La Clementina es un espacio premium para Tulcán y la zona norte.\n\n## Ideas para enriquecer la experiencia\n\n- Crear paquetes de medio día o día completo con coffee break y almuerzo.\n- Ofrecer montaje tipo escuela, conferencia, directorio o cóctel.\n- Proponer espacios para fotos institucionales y videos corporativos.\n- Incluir branding básico: mesa de registro, banner, backing o señalética.\n- Diseñar experiencias de integración en áreas verdes para equipos de trabajo.\n\n## Conexión con Tulcán y Carchi\n\nLa Clementina puede atender empresas locales, cooperativas, colegios profesionales, instituciones públicas, florícolas, negocios familiares y marcas que operan entre Tulcán, Carchi, Imbabura y el sur de Colombia. Profesional, pero no fría.\n\n## Gastronomía y detalles\n\n- Coffee break de mañana o tarde.\n- Desayunos empresariales, almuerzos ejecutivos o cenas institucionales.\n- Bocaditos para lanzamientos o cócteles.\n- Mesa de café, postres y bebidas calientes.\n- Menús adaptados a reuniones formales, capacitaciones o celebraciones.\n\n## Preguntas frecuentes\n\n**¿Se pueden hacer capacitaciones o talleres?**\n\nSí. Tenemos montajes para capacitaciones, reuniones y eventos de formación.\n\n**¿Ofrecen coffee break?**\n\nSí, es una opción importante para eventos empresariales, de acuerdo con el paquete contratado.\n\n**¿Sirve para eventos institucionales?**\n\nSí. La Clementina es un lugar pensado para instituciones, cooperativas, marcas, colegios profesionales y empresas locales.',
  whatsapp_message_es = 'Hola, quisiera información para realizar un evento corporativo en Finca La Clementina. Necesitamos conocer disponibilidad, montaje, coffee break y opciones de comida.'
where slug = 'corporativos';

-- ---------------------------------------------------------------------
-- 5. BAUTIZOS Y PRIMERAS COMUNIONES
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Momentos de fe, familia y ternura en un lugar especial.',
  description_es = 'Los bautizos y primeras comuniones son celebraciones íntimas, familiares y llenas de significado. Son momentos para agradecer, compartir y reunir a quienes tienen un papel especial en la vida de los niños.',
  highlights_es = array[
    'Recepción familiar después de la misa',
    'Almuerzo, brunch o merienda para invitados',
    'Mesa de dulces, torta y bocaditos',
    'Decoración en tonos blancos, beige, celeste, rosa, dorado o verde suave',
    'Espacio para fotos con padrinos, padres y abuelos',
    'Actividades suaves para niños',
    'Recuerdos personalizados para invitados'
  ],
  body_es = E'En La Clementina, la familia puede organizar una recepción después de la ceremonia religiosa, con un ambiente tranquilo, elegante y cercano. Los jardines y espacios verdes permiten fotografías con padres, padrinos, abuelos y niños, mientras los invitados disfrutan de comida, bocaditos, postres y una decoración delicada.\n\nEn Tulcán y Carchi, estas celebraciones conservan un fuerte sentido de fe y familia. Los padrinos, abuelos y tíos tienen un rol muy especial. Por eso el ambiente debe sentirse a ternura, gratitud, tradición y unión.\n\n## Ideas para enriquecer la experiencia\n\n- Crear una mesa especial para fotos del niño o niña con sus padrinos.\n- Diseñar un rincón de mensajes o bendiciones familiares.\n- Incluir una mesa dulce delicada con torta, galletas decoradas y bocaditos.\n- Preparar un espacio tranquilo para niños pequeños y adultos mayores.\n- Ofrecer decoración floral sencilla y elegante, sin sobrecargar el ambiente.\n\n## Conexión con Tulcán y Carchi\n\nEn Carchi, las celebraciones religiosas suelen ser momentos de encuentro familiar. Después de la misa, la familia se reúne para comer, conversar, tomar fotos y celebrar con calma.\n\n## Gastronomía y detalles\n\n- Almuerzo familiar, brunch o merienda.\n- Mesa dulce con torta, galletas, cupcakes o bocaditos.\n- Opciones de café, chocolate caliente o bebidas suaves.\n- Menú cómodo para niños, adultos y adultos mayores.\n- Detalles de panadería y repostería de La Clementina Bakery & Café.\n\n## Preguntas frecuentes\n\n**¿Se puede organizar la recepción después de la misa?**\n\nSí. Esta es la promesa principal: un lugar cómodo y bonito para recibir a la familia después de la ceremonia religiosa.\n\n**¿Se pueden hacer mesas dulces para niños?**\n\nSí. Torta, bocaditos, postres y una presentación delicada para fotos son parte central del evento.\n\n**¿El evento puede ser pequeño?**\n\nSí. Bautizos y primeras comuniones funcionan muy bien como eventos íntimos y familiares.',
  whatsapp_message_es = 'Hola, quisiera información para una recepción de bautizo o primera comunión en Finca La Clementina. Queremos algo familiar, bonito y tranquilo.'
where slug = 'bautizos-comuniones';

-- ---------------------------------------------------------------------
-- 6. BABY SHOWER
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Una bienvenida dulce, íntima y llena de ilusión.',
  description_es = 'Un baby shower es una celebración de amor, ilusión y espera. Es el momento en que la futura mamá se reúne con familia y amigos para recibir cariño, consejos, regalos y buenos deseos antes de la llegada del bebé.',
  highlights_es = array[
    'Brunch, almuerzo o té de la tarde',
    'Mesa de dulces y torta temática',
    'Juegos para la futura mamá y sus invitados',
    'Decoración floral, con globos o temática personalizada',
    'Photocorner para fotos familiares',
    'Revelación de género, si la familia lo desea',
    'Espacio para regalos y mensajes al bebé'
  ],
  body_es = E'En La Clementina, este evento puede vivirse en un ambiente dulce, natural y lleno de detalles. Los jardines, las flores y los espacios para fotos permiten crear una celebración delicada, perfecta para una tarde familiar, un brunch, una mesa de postres o una reunión íntima con juegos y sorpresas.\n\nOfrecemos una experiencia visual y emocional: decoración suave, comida bonita, mesa dulce, fotos de la mamá, mensajes para el bebé y un ambiente cómodo para compartir con mujeres de la familia, amigas, abuelas, tías y primas.\n\n## Ideas para enriquecer la experiencia\n\n- Crear un "árbol de deseos" con mensajes para el bebé.\n- Incluir juegos sencillos que no incomoden a la futura mamá.\n- Preparar una mesa de regalos y una silla especial para fotos.\n- Diseñar una decoración en tonos suaves, naturales o temáticos.\n- Ofrecer opciones de brunch o té de la tarde, ideales para un evento femenino y familiar.\n\n## Conexión con Tulcán y Carchi\n\nEn Tulcán, un baby shower suele ser cercano, familiar y lleno de cariño. La Clementina le da un toque más elegante sin perder esa sensación de casa, familia y acompañamiento.\n\n## Gastronomía y detalles\n\n- Brunch, té de la tarde o almuerzo suave.\n- Mesa de postres con torta temática, galletas y bocaditos.\n- Bebidas calientes, jugos, café o infusiones.\n- Opciones ligeras para una celebración de tarde.\n- Detalles de repostería personalizada de La Clementina Bakery & Café.\n\n## Preguntas frecuentes\n\n**¿Se puede hacer revelación de género?**\n\nSí. Puede integrarse dentro del baby shower, cuidando decoración, momento sorpresa y fotos.\n\n**¿Se puede hacer un brunch?**\n\nSí. Es una de las mejores opciones para este tipo de evento, especialmente si se busca algo elegante y relajado.\n\n**¿Hay opciones para mesa dulce?**\n\nSí. La mesa dulce es un elemento central del evento por su valor visual y emocional.',
  whatsapp_message_es = 'Hola, quisiera información para celebrar un baby shower en Finca La Clementina. Queremos conocer opciones de brunch, mesa dulce y decoración.'
where slug = 'baby-shower';

-- ---------------------------------------------------------------------
-- 7. ANIVERSARIOS
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Un homenaje al amor, la historia y los recuerdos compartidos.',
  description_es = 'Un aniversario es una pausa para mirar atrás, agradecer y celebrar lo que se ha construido juntos. Puede ser una cena íntima, una renovación de votos, una reunión con hijos y nietos o una fiesta sorpresa preparada por la familia.',
  highlights_es = array[
    'Cena romántica o cena familiar',
    'Renovación de votos o ceremonia simbólica',
    'Brindis con hijos, nietos y amigos',
    'Proyección de fotos o video de la pareja',
    'Mesa de recuerdos con fotografías antiguas',
    'Música en vivo, boleros, pasillos o canciones especiales',
    'Torta de aniversario y decoración floral'
  ],
  body_es = E'La Clementina ofrece un ambiente natural, sereno y elegante para celebrar matrimonios de varios años, bodas de plata, bodas de oro o fechas especiales de pareja. El entorno permite crear momentos románticos, fotografías familiares y una experiencia que se sienta personal.\n\nEn Carchi, las historias largas de pareja suelen celebrarse con respeto, familia y emoción. Por eso el aniversario suena a homenaje: a la paciencia, al amor, a los hijos, a los nietos y a los recuerdos que siguen creciendo.\n\n## Ideas para enriquecer la experiencia\n\n- Crear una "línea de tiempo" con fotos de la pareja desde sus primeros años.\n- Ofrecer una renovación de votos sencilla en jardines.\n- Incluir una mesa de cartas donde hijos y nietos escriban mensajes.\n- Preparar una playlist con canciones importantes para la pareja.\n- Diseñar un montaje íntimo para aniversarios pequeños o una recepción formal para bodas de plata u oro.\n\n## Conexión con Tulcán y Carchi\n\nEn Tulcán, muchas familias valoran profundamente los matrimonios largos y las historias que unen generaciones. Celebrar a los padres o abuelos no es un evento más: es un acto de gratitud familiar.\n\n## Gastronomía y detalles\n\n- Cena o almuerzo familiar con montaje elegante.\n- Torta de aniversario personalizada.\n- Mesa de postres, café y bocaditos.\n- Opciones de menú tradicional con presentación especial.\n- Brindis y bebidas para la celebración.\n\n## Preguntas frecuentes\n\n**¿Se puede hacer una renovación de votos?**\n\nSí. Es una de las ideas más fuertes: una ceremonia simbólica sencilla, emotiva y familiar.\n\n**¿La celebración puede ser sorpresa?**\n\nSí. Los aniversarios funcionan muy bien como celebración preparada por hijos, hermanos o amigos cercanos.\n\n**¿Se puede incluir música especial?**\n\nSí. Sugerimos música significativa para la pareja: boleros, pasillos, canciones de su época o una playlist familiar.',
  whatsapp_message_es = 'Hola, quisiera información para celebrar un aniversario en Finca La Clementina. Queremos algo especial, familiar y con detalles bonitos.'
where slug = 'aniversarios';

-- ---------------------------------------------------------------------
-- 8. DESPEDIDAS
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Un hasta luego con comida, fotos, música y gente querida.',
  description_es = 'No todas las despedidas son tristes. Muchas son el inicio de una nueva etapa: una boda, un viaje, una mudanza, una jubilación, un cambio de trabajo o una aventura que merece celebrarse antes de partir.',
  highlights_es = array[
    'Despedida de soltera elegante o divertida',
    'Brunch de amigas o reunión familiar',
    'Cena antes de un viaje o cambio de ciudad',
    'Despedida por jubilación o cierre de ciclo laboral',
    'Fiesta temática con juegos y dinámicas',
    'Fotos grupales en jardines o rincones decorados',
    'Música, bocaditos, torta o mesa dulce'
  ],
  body_es = E'La Clementina permite organizar despedidas íntimas, elegantes, divertidas o familiares. Puede ser un brunch entre amigas, una cena con amigos, una reunión familiar antes de un viaje, una despedida de soltera o una celebración sorpresa.\n\nEn una ciudad como Tulcán, donde muchas familias tienen vínculos con Quito, Ibarra, Ipiales, Pasto, Estados Unidos o España, despedirse también es una forma de abrazar antes de la distancia. La emoción se vive con calidez.\n\n## Ideas para enriquecer la experiencia\n\n- Crear un muro de mensajes de "hasta pronto" para la persona homenajeada.\n- Diseñar un photobooth con frases divertidas o emotivas.\n- Proponer juegos suaves para despedidas de soltera o reuniones de amigas.\n- Incluir una cena íntima con brindis y palabras de amigos o familiares.\n- Ofrecer decoración según el motivo: viaje, boda, jubilación o nueva etapa.\n\n## Conexión con Tulcán y Carchi\n\nEn Carchi, despedirse suele tener un fuerte componente familiar. Muchas personas migran, estudian o trabajan fuera, por eso una despedida puede ser un momento muy sentido. La Clementina convierte ese "hasta luego" en un recuerdo bonito y bien cuidado.\n\n## Gastronomía y detalles\n\n- Brunch, almuerzo, cena o mesa de bocaditos.\n- Mesa dulce personalizada con frase de despedida.\n- Bebidas sin alcohol, café, chocolate caliente o mocktails.\n- Opciones ligeras para reuniones de amigas o cenas más completas para familia.\n- Torta temática según el motivo de la despedida.\n\n## Preguntas frecuentes\n\n**¿Solo hacen despedidas de soltera?**\n\nNo. También celebramos despedidas por viaje, jubilación, cambio de ciudad o cierre de etapa.\n\n**¿Puede ser una reunión pequeña?**\n\nSí. Las despedidas funcionan muy bien en formato íntimo, con comida, fotos y detalles personalizados.\n\n**¿Se pueden hacer juegos o dinámicas?**\n\nSí. Se pueden incluir juegos, mensajes, brindis y actividades según el tipo de despedida.',
  whatsapp_message_es = 'Hola, quisiera información para organizar una despedida en Finca La Clementina. Queremos una reunión con comida, fotos y un ambiente especial.'
where slug = 'despedidas';

-- ---------------------------------------------------------------------
-- 9. REUNIONES SOCIALES
-- ---------------------------------------------------------------------
update public.event_types
set
  short_es = 'Cualquier excusa es perfecta para volver a reunirse.',
  description_es = 'Hay celebraciones que no necesitan una fecha enorme para ser importantes. Un almuerzo familiar, un cumpleaños, un reencuentro de amigos, una reunión de promoción, una bienvenida o una tarde entre primos pueden convertirse en un recuerdo especial.',
  highlights_es = array[
    'Almuerzos o cenas familiares',
    'Cumpleaños de adultos o celebraciones íntimas',
    'Reencuentros de promociones o amigos',
    'Bienvenidas a familiares que llegan de otra ciudad o país',
    'Tardes de café, brunch o reuniones especiales',
    'Fiestas temáticas con música y decoración',
    'Fotos familiares y momentos al aire libre'
  ],
  body_es = E'La Clementina es ideal para reuniones sociales porque ofrece un ambiente amplio, natural y cómodo. Los invitados pueden conversar, comer, caminar, tomarse fotos y disfrutar sin sentir que están encerrados en un salón tradicional.\n\nEsta es una opción pensada para familias de Tulcán y Carchi, grupos de amigos, excompañeros de colegio, familias que reciben visitas y personas que quieren celebrar sin complicarse organizando todo en casa.\n\n## Ideas para enriquecer la experiencia\n\n- Crear paquetes por tipo de reunión: familiar, amigos, cumpleaños o reencuentro.\n- Ofrecer un formato de almuerzo dominical para familias.\n- Proponer una mesa de café y postres para reuniones de tarde.\n- Armar espacios para juegos familiares o actividades suaves al aire libre.\n- Incluir decoración sencilla con flores y mesa de postres.\n\n## Conexión con Tulcán y Carchi\n\nEn Carchi, reunirse alrededor de la comida es una de las formas más naturales de celebrar. La Clementina toma esa costumbre familiar y la eleva con mejor ambiente, servicio, montaje, postres, fotos y comodidad.\n\n## Gastronomía y detalles\n\n- Parrillada, almuerzo familiar, brunch o cena.\n- Bocaditos, postres, café y torta para cumpleaños.\n- Opciones de comida tradicional adaptadas a un evento más cuidado.\n- Mesa dulce o estación de café de La Clementina Bakery & Café.\n- Menús flexibles para grupos pequeños o medianos.\n\n## Preguntas frecuentes\n\n**¿Puedo hacer solo un almuerzo familiar?**\n\nSí. No todo tiene que ser una fiesta grande; también se pueden organizar reuniones familiares con comida y detalles.\n\n**¿Sirve para cumpleaños?**\n\nSí. Cumpleaños de adultos, reuniones familiares y celebraciones íntimas encajan muy bien con el concepto.\n\n**¿Se puede hacer algo sencillo pero bonito?**\n\nSí. Ofrecemos un evento cuidado sin necesidad de una producción demasiado grande.',
  whatsapp_message_es = 'Hola, quisiera información para una reunión social en Finca La Clementina. Seríamos aproximadamente [número] personas y queremos conocer opciones.'
where slug = 'sociales';

-- ---------------------------------------------------------------------
-- Fallback bilingüe: _en := _es por ahora (se traducirá en otra pasada)
-- ---------------------------------------------------------------------
update public.event_types
set
  short_en = short_es,
  description_en = description_es,
  highlights_en = highlights_es,
  body_en = body_es,
  whatsapp_message_en = whatsapp_message_es;
