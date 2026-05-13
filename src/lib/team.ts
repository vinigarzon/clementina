/**
 * Datos del equipo de La Clementina.
 * En Sprint 2 se mueven a base de datos para edición desde el admin.
 */

export interface TeamMember {
  slug: string;
  name: string;
  role: { es: string; en: string };
  bio: { es: string; en: string };
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    slug: "lorena-bolanos",
    name: "Lorena Bolaños",
    role: {
      es: "Fundadora · Dirección General",
      en: "Founder · General Director",
    },
    bio: {
      es: "Lorena Bolaños, fundadora de La Clementina, es una empresaria exitosa y apasionada en el mundo de los eventos. Su liderazgo y dedicación han llevado a La Clementina a convertirse en un referente en la industria, generando múltiples fuentes de trabajo y brindando experiencias excepcionales a través de una coordinación impecable con proveedores y una atención meticulosa a los detalles. Su visión y compromiso han establecido a La Clementina como un destino líder para eventos en la provincia.",
      en: "Lorena Bolaños, founder of La Clementina, is a successful and passionate entrepreneur in the world of events. Her leadership and dedication have made La Clementina a benchmark in the industry, creating jobs and delivering exceptional experiences through flawless coordination with suppliers and meticulous attention to detail. Her vision and commitment have established La Clementina as a leading event destination in the province.",
    },
    image: "/team/lorena.webp",
  },
  {
    slug: "alejandra-bolanos",
    name: "Alejandra Bolaños",
    role: {
      es: "Catering y Pastelería · La Clementina Bakery & Cafe",
      en: "Catering & Pastry · La Clementina Bakery & Cafe",
    },
    bio: {
      es: "Alejandra Bolaños, propietaria de La Clementina Bakery & Cafe en Tulcán, es una experta en repostería y catering que se dedica a crear deliciosos bocaditos y catering para los eventos en La Clementina. Con su pasión por la cocina y una atención excepcional, Alejandra ofrece a sus clientes una experiencia culinaria de alta calidad en un ambiente acogedor y encantador.",
      en: "Alejandra Bolaños, owner of La Clementina Bakery & Cafe in Tulcán, is a pastry and catering expert who creates delicious bites and catering services for events at La Clementina. With her passion for cooking and exceptional attention, Alejandra offers clients a high-quality culinary experience in a warm and charming setting.",
    },
    image: "/team/alejandra.webp",
  },
];
