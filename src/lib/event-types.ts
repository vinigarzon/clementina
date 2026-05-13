/**
 * Tipos de evento de la finca.
 * Por ahora viven como constantes en código. En Sprint 2 se mueven a base de datos
 * y se editan desde el admin (CRUD completo).
 */
export interface EventType {
  slug: string;
  title: string;
  short: string;
  description: string;
  highlights: string[];
  image: string;
}

export const eventTypes: EventType[] = [
  {
    slug: "bodas",
    title: "Bodas",
    short: "Ceremonias y recepciones en un entorno único.",
    description:
      "Una boda en La Clementina es la combinación de naturaleza, intimidad y servicio cuidado al detalle. Ceremonia al aire libre o en salón, recepción con catering propio, decoración floral, ambientación musical y coordinación integral.",
    highlights: [
      "Ceremonia civil o religiosa",
      "Capacidad de 50 a 300 invitados",
      "Catering, flores, música y fotografía",
      "Coordinación integral del evento",
    ],
    image: "/events/bodas.jpg",
  },
  {
    slug: "quince-anos",
    title: "Quince Años",
    short: "El paso a una nueva etapa con todo el detalle.",
    description:
      "Una celebración pensada para que la quinceañera y su familia vivan un día inolvidable. Salón decorado, menú a elección, pista de baile, fotografía profesional y todos los detalles que esperan los invitados.",
    highlights: [
      "Salón ambientado a tu temática",
      "Menú personalizable",
      "Vals y coreografías con espacio dedicado",
      "Iluminación profesional",
    ],
    image: "/events/quinces.jpg",
  },
  {
    slug: "graduaciones",
    title: "Graduaciones",
    short: "Celebrar el logro con tu gente más cercana.",
    description:
      "Grados de colegio, técnicos y universitarios con el ambiente que el momento merece. Cena, brindis, fotografía y un entorno que hace memorable el cierre de un ciclo importante.",
    highlights: [
      "Cena formal o cóctel",
      "Espacios para fotografía de promoción",
      "Brindis y palabras",
      "Música en vivo o DJ",
    ],
    image: "/events/graduaciones.jpg",
  },
  {
    slug: "corporativos",
    title: "Eventos Corporativos",
    short: "Convenciones, reuniones, lanzamientos y celebraciones de empresa.",
    description:
      "Espacios versátiles para eventos institucionales: convenciones, capacitaciones, lanzamientos de producto, celebraciones de fin de año y reuniones ejecutivas. Equipamiento técnico, catering corporativo y atención profesional.",
    highlights: [
      "Salones para 20 a 300 personas",
      "Equipamiento audiovisual",
      "Coffee breaks y almuerzos ejecutivos",
      "Atención profesional al cliente",
    ],
    image: "/events/corporativos.jpg",
  },
  {
    slug: "bautizos-comuniones",
    title: "Bautizos y Primeras Comuniones",
    short: "Reuniones familiares con encanto.",
    description:
      "Un espacio cálido para celebrar los sacramentos en familia. Decoración delicada, menú adaptado para niños y adultos, y un entorno tranquilo donde los pequeños protagonistas pueden disfrutar con libertad.",
    highlights: [
      "Decoración temática",
      "Menú familiar",
      "Espacios seguros para niños",
      "Servicio de fotografía",
    ],
    image: "/events/bautizos-comuniones.jpg",
  },
  {
    slug: "baby-shower",
    title: "Baby Shower",
    short: "Recibir lo que viene en un lugar especial.",
    description:
      "Una tarde para celebrar la llegada del bebé con la familia y las amistades más cercanas. Ambientación a tu medida, menú ligero, juegos y todos los detalles para una reunión memorable.",
    highlights: [
      "Ambientación personalizada",
      "Menú de bocaditos y postres",
      "Espacio para actividades",
      "Decoración fotografiable",
    ],
    image: "/events/baby-shower.jpg",
  },
  {
    slug: "aniversarios",
    title: "Aniversarios",
    short: "Celebrar lo construido juntos.",
    description:
      "Aniversarios de bodas, cumpleaños significativos y otras fechas importantes encuentran en La Clementina el escenario para reunir a quienes importan y celebrar como se merece.",
    highlights: [
      "Cena íntima o gran celebración",
      "Música a tu gusto",
      "Decoración a medida",
      "Fotografía y video",
    ],
    image: "/events/aniversarios.jpg",
  },
  {
    slug: "despedidas",
    title: "Despedidas",
    short: "Cierres con sabor a hasta luego.",
    description:
      "Despedidas de soltería, despedidas laborales o de viaje en un espacio relajado donde los invitados se sienten cómodos. Catering adaptado, música y un programa que tú decides.",
    highlights: [
      "Programa flexible",
      "Catering adaptado al estilo",
      "Música y entretenimiento",
      "Espacios al aire libre",
    ],
    image: "/events/despedidas.jpg",
  },
  {
    slug: "sociales",
    title: "Reuniones Sociales",
    short: "Cualquier excusa para reunir a los tuyos.",
    description:
      "Reuniones familiares, encuentros de amigos, almuerzos especiales o tardes temáticas. La finca se adapta a celebraciones de cualquier tamaño y formato.",
    highlights: [
      "Formato flexible",
      "Capacidad a tu medida",
      "Catering opcional",
      "Espacios cubiertos y al aire libre",
    ],
    image: "/events/sociales.jpg",
  },
];

export function getEventTypeBySlug(slug: string): EventType | undefined {
  return eventTypes.find((e) => e.slug === slug);
}
