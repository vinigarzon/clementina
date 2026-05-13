/**
 * Diccionario de traducciones del sitio público.
 * Estructura plana, accesible con notación de punto (ej: "home.hero.title").
 *
 * En Sprint 2 estos mensajes se mueven a base de datos, así pueden
 * editarse desde el admin sin tocar código.
 */
export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];

type Messages = Record<string, string>;

export const messages: Record<Locale, Messages> = {
  es: {
    // Nav
    "nav.home": "Inicio",
    "nav.about": "La Finca",
    "nav.team": "Equipo",
    "nav.events": "Eventos",
    "nav.gallery": "Galería",
    "nav.calendar": "Calendario",
    "nav.blog": "Inspiración",
    "nav.contact": "Contacto",
    "nav.quote": "Cotizar evento",

    // Hero home
    "home.hero.eyebrow": "Carchi · Ecuador",
    "home.hero.title": "Donde cada celebración encuentra su lugar",
    "home.hero.description":
      "Una finca exclusiva para bodas, quinces, grados y eventos corporativos, con servicio integral y atención personalizada en un entorno natural impresionante.",
    "home.hero.cta1": "Conoce los eventos",
    "home.hero.cta2": "Cotizar mi evento",
    "home.hero.scroll": "↓ Descubre más",

    // Intro
    "home.intro.eyebrow": "La Finca",
    "home.intro.title":
      "Un espacio diseñado para los momentos que se recuerdan toda la vida",
    "home.intro.p1":
      "Desde hace años, Finca La Clementina ha sido el escenario de celebraciones únicas en el norte del Ecuador. Bodas íntimas y grandes recepciones, graduaciones, quince años, primeras comuniones, eventos corporativos y reuniones familiares encuentran aquí el marco que merecen.",
    "home.intro.p2":
      "Trabajamos con un equipo propio que se encarga de cada detalle: catering, decoración floral, ambientación, música, fotografía y coordinación, para que tú solo te ocupes de disfrutar.",
    "home.intro.link": "Conoce más sobre la finca",

    // Tipos preview
    "home.events.eyebrow": "Lo que celebramos",
    "home.events.title": "Cada evento merece su propia historia",
    "home.events.viewAll": "Ver todos los tipos de evento",

    // CTA final
    "home.cta.title": "Hablemos de tu evento",
    "home.cta.description":
      "Cuéntanos qué imaginas y te ayudamos a hacerlo realidad. Sin compromiso, sin apuros.",
    "home.cta.button1": "Iniciar cotización",
    "home.cta.button2": "Ver disponibilidad",

    // Footer
    "footer.explore": "Explorar",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.cookies": "Cookies",

    // Common
    "common.location": "Carchi, Ecuador",
  },

  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "The Venue",
    "nav.team": "Team",
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.calendar": "Calendar",
    "nav.blog": "Inspiration",
    "nav.contact": "Contact",
    "nav.quote": "Get a quote",

    // Hero home
    "home.hero.eyebrow": "Carchi · Ecuador",
    "home.hero.title": "Where every celebration finds its place",
    "home.hero.description":
      "An exclusive venue for weddings, sweet sixteens, graduations and corporate events, with full service and personalized attention in a stunning natural setting.",
    "home.hero.cta1": "Explore events",
    "home.hero.cta2": "Request a quote",
    "home.hero.scroll": "↓ Discover more",

    // Intro
    "home.intro.eyebrow": "The Venue",
    "home.intro.title":
      "A place designed for moments that last a lifetime",
    "home.intro.p1":
      "For years, Finca La Clementina has been the stage for unique celebrations in northern Ecuador. Intimate weddings and grand receptions, graduations, sweet sixteens, first communions, corporate events and family gatherings find here the setting they deserve.",
    "home.intro.p2":
      "We work with our own team that takes care of every detail: catering, floral design, decoration, music, photography and coordination, so all you have to do is enjoy.",
    "home.intro.link": "Learn more about the venue",

    // Tipos preview
    "home.events.eyebrow": "What we celebrate",
    "home.events.title": "Every event deserves its own story",
    "home.events.viewAll": "View all event types",

    // CTA final
    "home.cta.title": "Let's talk about your event",
    "home.cta.description":
      "Tell us what you're imagining and we'll help make it happen. No pressure, no rush.",
    "home.cta.button1": "Start a quote",
    "home.cta.button2": "Check availability",

    // Footer
    "footer.explore": "Explore",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.cookies": "Cookies",

    // Common
    "common.location": "Carchi, Ecuador",
  },
};

/**
 * Idiomas/regiones que reciben español por defecto. Resto del mundo: inglés.
 * Esta lista cubre Latinoamérica y España.
 */
export const spanishRegions = new Set([
  "es",
  "es-ES",
  "es-AR",
  "es-BO",
  "es-CL",
  "es-CO",
  "es-CR",
  "es-CU",
  "es-DO",
  "es-EC",
  "es-GT",
  "es-HN",
  "es-MX",
  "es-NI",
  "es-PA",
  "es-PE",
  "es-PR",
  "es-PY",
  "es-SV",
  "es-UY",
  "es-VE",
]);

export function detectLocale(navigatorLanguage: string): Locale {
  if (!navigatorLanguage) return "es";
  const lang = navigatorLanguage.toLowerCase();
  // Cualquier variante "es" o "es-XX"
  if (lang === "es" || lang.startsWith("es-")) return "es";
  // Otros idiomas: inglés
  return "en";
}
