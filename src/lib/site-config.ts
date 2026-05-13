/**
 * Configuración central del sitio.
 * Cuando algo cambie (teléfono, dirección, redes), se cambia aquí.
 * En sprints posteriores esto se moverá al admin (base de datos).
 */
export const siteConfig = {
  name: "Finca La Clementina",
  tagline: "Convenciones & Eventos",
  description:
    "Finca exclusiva en Carchi, Ecuador. Bodas, quinces, grados, eventos corporativos y sociales en un entorno natural impresionante.",
  location: "Tulcán, Carchi, Ecuador",
  address: {
    line1: "Vía El Carrizal, a 50 m del Centro Turístico",
    line2: "Parroquia Urbina",
    city: "Tulcán, Ecuador",
  },
  contact: {
    whatsappNumber: "593999660252",
    whatsappDisplay: "+593 99 966 0252",
    email: "info@fincalaclementina.com",
  },
  social: {
    instagram: "https://instagram.com/fincalaclementina",
    facebook: "https://facebook.com/fincalaclementina",
  },
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/la-finca", label: "La Finca" },
    { href: "/equipo", label: "Equipo" },
    { href: "/tipos-de-eventos", label: "Eventos" },
    { href: "/galeria", label: "Galería" },
    { href: "/calendario", label: "Calendario" },
    { href: "/blog", label: "Inspiración" },
    { href: "/contacto", label: "Contacto" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
