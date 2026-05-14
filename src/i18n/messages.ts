/**
 * Diccionario de traducciones del sitio público.
 * Estructura plana, accesible con notación de punto (ej: "home.hero.title").
 */
export type Locale = "es" | "en";

export const locales: Locale[] = ["es", "en"];

type Messages = Record<string, string>;

export const messages: Record<Locale, Messages> = {
  es: {
    // ============ NAV ============
    "nav.home": "Inicio",
    "nav.about": "La Finca",
    "nav.team": "Equipo",
    "nav.events": "Eventos",
    "nav.gallery": "Galería",
    "nav.calendar": "Calendario",
    "nav.blog": "Inspiración",
    "nav.contact": "Contacto",
    "nav.quote": "Cotizar evento",

    // ============ COMMON ============
    "common.location": "Carchi, Ecuador",
    "common.readMore": "Leer más",
    "common.viewAll": "Ver todos",
    "common.back": "Volver",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.close": "Cerrar",
    "common.loading": "Cargando...",
    "common.whatsapp": "WhatsApp",
    "common.email": "Correo",
    "common.phone": "Teléfono",
    "common.address": "Dirección",
    "common.guests": "invitados",
    "common.from": "Desde",
    "common.until": "Hasta",

    // ============ HOME ============
    "home.hero.eyebrow": "Carchi · Ecuador",
    "home.hero.title": "Donde cada celebración encuentra su lugar",
    "home.hero.description":
      "Una finca exclusiva para bodas, quinces, grados y eventos corporativos, con servicio integral y atención personalizada en un entorno natural impresionante.",
    "home.hero.cta1": "Conoce los eventos",
    "home.hero.cta2": "Cotizar mi evento",
    "home.hero.scroll": "↓ Descubre más",

    "home.intro.eyebrow": "La Finca",
    "home.intro.title":
      "Un espacio diseñado para los momentos que se recuerdan toda la vida",
    "home.intro.p1":
      "Desde hace años, Finca La Clementina ha sido el escenario de celebraciones únicas en el norte del Ecuador. Bodas íntimas y grandes recepciones, graduaciones, quince años, primeras comuniones, eventos corporativos y reuniones familiares encuentran aquí el marco que merecen.",
    "home.intro.p2":
      "Trabajamos con un equipo propio que se encarga de cada detalle: catering, decoración floral, ambientación, música, fotografía y coordinación, para que tú solo te ocupes de disfrutar.",
    "home.intro.link": "Conoce más sobre la finca",

    "home.events.eyebrow": "Lo que celebramos",
    "home.events.title": "Cada evento merece su propia historia",
    "home.events.viewAll": "Ver todos los tipos de evento",

    "home.cta.title": "Hablemos de tu evento",
    "home.cta.description":
      "Cuéntanos qué imaginas y te ayudamos a hacerlo realidad. Sin compromiso, sin apuros.",
    "home.cta.button1": "Iniciar cotización",
    "home.cta.button2": "Ver disponibilidad",

    // ============ FOOTER ============
    "footer.explore": "Explorar",
    "footer.contact": "Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.cookies": "Cookies",

    // ============ LA FINCA ============
    "lafinca.hero.eyebrow": "La Finca · Carchi, Ecuador",
    "lafinca.hero.title":
      "Más que un venue, una finca pensada para celebrar en grande",
    "lafinca.hero.description":
      "Una finca amplia, elegante y preparada para celebrar sin límites en el norte del Ecuador.",

    "lafinca.stats.guests": "Invitados máx.",
    "lafinca.stats.parking": "Espacios de parqueo",
    "lafinca.stats.lake": "Lago artificial",
    "lafinca.stats.pergola": "Pérgola para ceremonia",

    "lafinca.history.eyebrow": "Nuestra historia",
    "lafinca.history.title":
      "Un escenario para historias que se recuerdan toda la vida",
    "lafinca.history.p1":
      "Finca La Clementina nació como un proyecto familiar con una idea clara: ofrecer al norte del Ecuador un lugar diferente para celebrar los momentos más importantes de la vida.",
    "lafinca.history.p2":
      "Ubicada en el Carchi, cerca de Tulcán, combina la calidez de una finca con la infraestructura necesaria para realizar eventos sociales, familiares, religiosos, empresariales y celebraciones de gran formato.",
    "lafinca.history.p3":
      "Aquí cada celebración puede tener su propio recorrido: ceremonia en la pérgola, fotos junto al lago, recepción en salón, cena bajo carpas, brindis familiar, música en vivo y una fiesta inolvidable.",
    "lafinca.history.quote":
      "Más que un salón de eventos, La Clementina es un escenario para historias que se recuerdan toda la vida.",

    "lafinca.features.eyebrow": "Lo que vas a encontrar",
    "lafinca.features.title":
      "Todo lo que tu evento necesita, en un solo lugar",
    "lafinca.features.location.eyebrow": "Ubicación",
    "lafinca.features.location.title": "En el corazón del Carchi",
    "lafinca.features.location.description":
      "Cerca de Tulcán, La Clementina ofrece un entorno natural, tranquilo y accesible para celebraciones familiares, sociales y empresariales.",
    "lafinca.features.capacity.eyebrow": "Capacidad",
    "lafinca.features.capacity.title": "Íntimos o de gran formato",
    "lafinca.features.capacity.description":
      "Espacios versátiles para reuniones pequeñas, eventos en salón y celebraciones exteriores con carpas hasta 500 invitados.",
    "lafinca.features.outdoor.eyebrow": "Áreas exteriores",
    "lafinca.features.outdoor.title": "Jardines, lago y pérgola",
    "lafinca.features.outdoor.description":
      "Amplias áreas verdes, lago artificial, puente con cascada, piletas decorativas y una pérgola ideal para ceremonias al aire libre.",
    "lafinca.features.parking.eyebrow": "Parqueadero",
    "lafinca.features.parking.title": "Aprox. 100 autos",
    "lafinca.features.parking.description":
      "Un espacio amplio y cómodo para recibir a tus invitados con mayor tranquilidad desde su llegada.",
    "lafinca.features.services.eyebrow": "Servicios",
    "lafinca.features.services.title": "Producción integral",
    "lafinca.features.services.description":
      "Catering, decoración, música, fotografía, video y coordinación, con los mejores proveedores de música y entretenimiento.",
    "lafinca.features.backup.eyebrow": "Respaldo",
    "lafinca.features.backup.title": "Tu evento sin sobresaltos",
    "lafinca.features.backup.description":
      "Reservorio de agua, planta de energía de respaldo y seguridad para que cada detalle esté cubierto.",

    "lafinca.bannerQuote":
      "Cada rincón está pensado para convertirse en recuerdo.",

    "lafinca.experiences.eyebrow": "Experiencias",
    "lafinca.experiences.title": "Lo que se puede vivir en La Clementina",
    "lafinca.experiences.intro":
      "Aquí cada evento puede tener varios momentos: una ceremonia al aire libre, una recepción elegante, una sesión de fotos junto al lago, una cena en salón o una celebración bajo carpas rodeada de naturaleza.",
    "lafinca.experiences.list.1":
      "Ceremonia al aire libre en la pérgola, con ingreso especial de novios o familia.",
    "lafinca.experiences.list.2":
      "Fotos junto al lago, puente, cascada, piletas y jardines.",
    "lafinca.experiences.list.3":
      "Cóctel o bienvenida en áreas verdes antes de pasar al salón.",
    "lafinca.experiences.list.4":
      "Recepción elegante en salón o bajo carpas, según el tamaño del evento.",
    "lafinca.experiences.list.5": "Cena, brindis, torta, mesa dulce y bocaditos.",
    "lafinca.experiences.list.6": "Show musical, DJ o una hora loca memorable.",
    "lafinca.experiences.list.7":
      "Recorridos visuales para quinceañeras, novios, graduados o cumpleañeros.",
    "lafinca.experiences.list.8":
      "Eventos corporativos con coffee break, charlas, reconocimiento y cierre social.",
    "lafinca.experiences.list.9":
      "Celebraciones religiosas: bautizos, primeras comuniones, confirmaciones.",
    "lafinca.experiences.list.10":
      "Grandes reuniones familiares para conversar, caminar, tomar fotos y disfrutar.",

    "lafinca.gallery.eyebrow": "Galería de espacios",
    "lafinca.gallery.title": "Salón, lago, pérgola y áreas verdes",
    "lafinca.gallery.intro":
      "Toca cualquier imagen para verla en grande. Pronto compartiremos fotos actualizadas de cada espacio.",
    "lafinca.gallery.caption.ingreso": "Ingreso a la finca",
    "lafinca.gallery.caption.salon": "Salón montado",
    "lafinca.gallery.caption.areas": "Áreas verdes",
    "lafinca.gallery.caption.outdoor": "Al aire libre",
    "lafinca.gallery.caption.setup": "Montaje",
    "lafinca.gallery.caption.social": "Reuniones sociales",
    "lafinca.gallery.caption.deco": "Decoración",
    "lafinca.gallery.caption.main": "Salón principal",

    "lafinca.cta.eyebrow": "¿Listos?",
    "lafinca.cta.title": "Hablemos de tu celebración",
    "lafinca.cta.description":
      "Cuéntanos tu fecha y número de invitados. Te ayudamos a imaginar tu evento en La Clementina.",
    "lafinca.cta.button1": "Agendar visita",
    "lafinca.cta.button2": "Conocer tipos de eventos",

    // ============ TIPOS DE EVENTOS (lista) ============
    "events.list.hero.eyebrow": "Eventos",
    "events.list.hero.title": "Cada celebración encuentra su lugar",
    "events.list.hero.description":
      "Desde una boda íntima hasta una convención corporativa, la finca se adapta al estilo y la escala de tu evento.",
    "events.list.empty": "Todavía no hay tipos de evento publicados.",
    "events.list.learnMore": "Conocer más",

    // ============ TIPO DE EVENTO (detalle) ============
    "event.breadcrumb": "Eventos",
    "event.cta.quote": "Cotizar este evento",
    "event.experience.eyebrow": "La experiencia",
    "event.experience.title": "Pensado para que solo te ocupes de disfrutar",
    "event.includes.eyebrow": "Lo que incluye",
    "event.includes.title": "Cada detalle pensado para ti",
    "event.gallery.eyebrow": "Galería",
    "event.gallery.title": "Momentos reales de este tipo de evento",
    "event.finalCta.eyebrow": "Próximo paso",
    "event.finalCta.title": "¿Te imaginas tu {event} aquí?",
    "event.finalCta.description":
      "Cuéntanos tu fecha y número de invitados. Te ayudamos a imaginarlo paso a paso, sin compromiso.",
    "event.finalCta.button1": "Iniciar cotización",
    "event.finalCta.button2": "Ver disponibilidad",
    "event.finalCta.button3": "WhatsApp directo",
    "event.others.eyebrow": "Sigue explorando",
    "event.others.title": "Otros tipos de evento",
    "event.whatsappDefault":
      "Hola, me interesa información sobre {event} en Finca La Clementina.",

    // ============ BLOG ============
    "blog.hero.eyebrow": "Inspiración",
    "blog.hero.title": "Ideas para tu evento",
    "blog.hero.description":
      "Historias, tendencias y consejos prácticos para que cada celebración sea como la imaginas.",
    "blog.empty.title": "Próximamente",
    "blog.empty.subtitle": "Aún no hay artículos publicados.",
    "blog.card.readArticle": "Leer artículo",
    "blog.detail.related": "Artículos relacionados",
    "blog.detail.backToBlog": "Volver al blog",

    // ============ CONTACTO ============
    "contact.hero.eyebrow": "Contacto",
    "contact.hero.title": "Conversemos sobre tu evento",
    "contact.hero.description":
      "Cuéntanos qué imaginas y te ayudamos a hacerlo realidad. Sin compromiso, sin apuros.",
    "contact.form.eyebrow": "Formulario",
    "contact.form.title": "Déjanos tus datos",
    "contact.form.name": "Nombre completo *",
    "contact.form.name.placeholder": "Tu nombre",
    "contact.form.phone": "Teléfono / WhatsApp",
    "contact.form.phone.placeholder": "+593...",
    "contact.form.email": "Correo electrónico *",
    "contact.form.email.placeholder": "tu@correo.com",
    "contact.form.eventType": "Tipo de evento",
    "contact.form.eventType.placeholder": "Selecciona...",
    "contact.form.eventType.other": "Otro",
    "contact.form.date": "Fecha tentativa",
    "contact.form.guests": "Invitados estimados",
    "contact.form.guests.placeholder": "Ej: 150",
    "contact.form.message": "Cuéntanos más",
    "contact.form.message.placeholder":
      "Detalles, preguntas, lo que necesites...",
    "contact.form.consent":
      "Acepto que mis datos sean tratados conforme a la política de privacidad para responder mi solicitud.",
    "contact.form.consent.link": "política de privacidad",
    "contact.form.submit": "Enviar solicitud",
    "contact.form.submitting": "Enviando...",
    "contact.form.recaptcha":
      "Este sitio está protegido por reCAPTCHA. Aplican la Política de Privacidad y los Términos del Servicio de Google.",
    "contact.success.title": "¡Gracias por escribirnos!",
    "contact.success.description":
      "Hemos recibido tu solicitud. Te enviamos una confirmación a tu correo y nuestro equipo te contactará pronto.",
    "contact.success.whatsappPrompt": "¿Quieres conversar más rápido?",
    "contact.success.whatsappLink": "Escríbenos por WhatsApp",
    "contact.aside.whatsapp.eyebrow": "Más rápido por WhatsApp",
    "contact.aside.whatsapp.button": "Escribir por WhatsApp",
    "contact.aside.email.eyebrow": "Correo",
    "contact.aside.location.eyebrow": "Ubicación",
    "contact.error.required": "Nombre y correo son obligatorios.",
    "contact.error.consent":
      "Debes aceptar la política de privacidad para continuar.",
    "contact.error.email": "El correo no parece válido.",
    "contact.error.captcha":
      "No pudimos verificar que eres una persona. Recarga la página e intenta de nuevo.",
    "contact.error.save":
      "Hubo un problema guardando tu solicitud. Intenta de nuevo.",
    "contact.error.generic": "Ocurrió un error. Intenta de nuevo.",
    "contact.whatsappDefault":
      "Hola, me gustaría conversar sobre un evento en Finca La Clementina.",

    // ============ EQUIPO ============
    "team.hero.eyebrow": "El equipo",
    "team.hero.title": "Las personas detrás de cada evento",
    "team.hero.description":
      "Un equipo familiar con experiencia, atención al detalle y una pasión por hacer que cada celebración sea única.",
    "team.empty":
      "Aún no hay miembros del equipo publicados.",

    // ============ GALERÍA ============
    "gallery.hero.eyebrow": "Galería",
    "gallery.hero.title": "Momentos que ya son recuerdo",
    "gallery.hero.description":
      "Una selección visual de las celebraciones que la finca ha acogido. Toca cualquier imagen para verla en grande.",
    "gallery.filter.all": "Todas",
    "gallery.empty": "Aún no hay imágenes publicadas en esta categoría.",

    // ============ CALENDARIO ============
    "calendar.hero.eyebrow": "Disponibilidad",
    "calendar.hero.title": "Calendario de fechas",
    "calendar.hero.description":
      "Consulta qué fechas están libres y reserva la tuya. Las fechas disponibles puedes asegurarlas por WhatsApp.",
    "calendar.legend.available": "Disponible",
    "calendar.legend.hold": "En conversación",
    "calendar.legend.reserved": "Reservada",
    "calendar.legend.blocked": "No disponible",
    "calendar.quoteButton": "Reservar por WhatsApp",
    "calendar.empty.title": "Sin información",
    "calendar.empty.subtitle":
      "Aún no hay datos cargados para este mes.",

    // ============ COOKIE BANNER ============
    "cookies.title": "Usamos cookies",
    "cookies.description":
      "Usamos cookies esenciales para que el sitio funcione y, con tu consentimiento, cookies de analítica para entender cómo lo usas y mejorarlo.",
    "cookies.accept": "Aceptar todo",
    "cookies.reject": "Solo esenciales",
    "cookies.learnMore": "Más información",

    // ============ LEGALES ============
    "legal.privacy.title": "Política de Privacidad",
    "legal.privacy.subtitle":
      "Cómo tratamos tus datos personales en cumplimiento de la LOPDP del Ecuador.",
    "legal.terms.title": "Términos y Condiciones",
    "legal.terms.subtitle": "Condiciones de uso del sitio web.",
    "legal.cookies.title": "Política de Cookies",
    "legal.cookies.subtitle": "Cómo usamos cookies para mejorar tu experiencia.",
    "legal.eyebrow": "Legales",
    "legal.lastUpdated": "Última actualización",
  },

  en: {
    // ============ NAV ============
    "nav.home": "Home",
    "nav.about": "The Venue",
    "nav.team": "Team",
    "nav.events": "Events",
    "nav.gallery": "Gallery",
    "nav.calendar": "Calendar",
    "nav.blog": "Inspiration",
    "nav.contact": "Contact",
    "nav.quote": "Get a quote",

    // ============ COMMON ============
    "common.location": "Carchi, Ecuador",
    "common.readMore": "Read more",
    "common.viewAll": "View all",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.whatsapp": "WhatsApp",
    "common.email": "Email",
    "common.phone": "Phone",
    "common.address": "Address",
    "common.guests": "guests",
    "common.from": "From",
    "common.until": "Until",

    // ============ HOME ============
    "home.hero.eyebrow": "Carchi · Ecuador",
    "home.hero.title": "Where every celebration finds its place",
    "home.hero.description":
      "An exclusive venue for weddings, sweet sixteens, graduations and corporate events, with full service and personalized attention in a stunning natural setting.",
    "home.hero.cta1": "Explore events",
    "home.hero.cta2": "Request a quote",
    "home.hero.scroll": "↓ Discover more",

    "home.intro.eyebrow": "The Venue",
    "home.intro.title": "A place designed for moments that last a lifetime",
    "home.intro.p1":
      "For years, Finca La Clementina has been the stage for unique celebrations in northern Ecuador. Intimate weddings and grand receptions, graduations, sweet sixteens, first communions, corporate events and family gatherings find here the setting they deserve.",
    "home.intro.p2":
      "We work with our own team that takes care of every detail: catering, floral design, decoration, music, photography and coordination, so all you have to do is enjoy.",
    "home.intro.link": "Learn more about the venue",

    "home.events.eyebrow": "What we celebrate",
    "home.events.title": "Every event deserves its own story",
    "home.events.viewAll": "View all event types",

    "home.cta.title": "Let's talk about your event",
    "home.cta.description":
      "Tell us what you're imagining and we'll help make it happen. No pressure, no rush.",
    "home.cta.button1": "Start a quote",
    "home.cta.button2": "Check availability",

    // ============ FOOTER ============
    "footer.explore": "Explore",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.cookies": "Cookies",

    // ============ THE VENUE (LA FINCA) ============
    "lafinca.hero.eyebrow": "The Venue · Carchi, Ecuador",
    "lafinca.hero.title":
      "More than a venue — an estate designed to celebrate in style",
    "lafinca.hero.description":
      "A spacious, elegant estate ready to host celebrations without limits in northern Ecuador.",

    "lafinca.stats.guests": "Max. guests",
    "lafinca.stats.parking": "Parking spaces",
    "lafinca.stats.lake": "Lake",
    "lafinca.stats.pergola": "Ceremony pergola",

    "lafinca.history.eyebrow": "Our story",
    "lafinca.history.title":
      "A stage for stories that last a lifetime",
    "lafinca.history.p1":
      "Finca La Clementina began as a family project with a clear idea: to offer northern Ecuador a different place to celebrate life's most important moments.",
    "lafinca.history.p2":
      "Located in Carchi, near Tulcán, it blends the warmth of an estate with the infrastructure needed to host social, family, religious and corporate events, plus large-scale celebrations.",
    "lafinca.history.p3":
      "Here, every celebration can have its own path: ceremony at the pergola, photos by the lake, reception in the hall, dinner under the marquee, family toast, live music and an unforgettable party.",
    "lafinca.history.quote":
      "More than an event venue, La Clementina is a stage for stories that last a lifetime.",

    "lafinca.features.eyebrow": "What you'll find",
    "lafinca.features.title":
      "Everything your event needs, all in one place",
    "lafinca.features.location.eyebrow": "Location",
    "lafinca.features.location.title": "In the heart of Carchi",
    "lafinca.features.location.description":
      "Near Tulcán, La Clementina offers a natural, calm and accessible setting for family, social and corporate celebrations.",
    "lafinca.features.capacity.eyebrow": "Capacity",
    "lafinca.features.capacity.title": "Intimate or large-scale",
    "lafinca.features.capacity.description":
      "Versatile spaces for small gatherings, indoor receptions and outdoor celebrations under marquees for up to 500 guests.",
    "lafinca.features.outdoor.eyebrow": "Outdoor areas",
    "lafinca.features.outdoor.title": "Gardens, lake and pergola",
    "lafinca.features.outdoor.description":
      "Wide green areas, a lake, a bridge with a waterfall, decorative ponds and a pergola perfect for open-air ceremonies.",
    "lafinca.features.parking.eyebrow": "Parking",
    "lafinca.features.parking.title": "Around 100 cars",
    "lafinca.features.parking.description":
      "A wide, comfortable area to welcome your guests with ease from the moment they arrive.",
    "lafinca.features.services.eyebrow": "Services",
    "lafinca.features.services.title": "Full production",
    "lafinca.features.services.description":
      "Catering, decoration, music, photography, video and coordination, with the best music and entertainment partners.",
    "lafinca.features.backup.eyebrow": "Backup",
    "lafinca.features.backup.title": "Your event without surprises",
    "lafinca.features.backup.description":
      "Water reserve, backup power generator and security so every detail is covered.",

    "lafinca.bannerQuote":
      "Every corner is designed to become a memory.",

    "lafinca.experiences.eyebrow": "Experiences",
    "lafinca.experiences.title": "What you can experience at La Clementina",
    "lafinca.experiences.intro":
      "Here, each event can have several moments: an outdoor ceremony, an elegant reception, a photo session by the lake, dinner indoors or a celebration under marquees surrounded by nature.",
    "lafinca.experiences.list.1":
      "Open-air ceremony at the pergola, with a special entrance for the couple or family.",
    "lafinca.experiences.list.2":
      "Photos by the lake, bridge, waterfall, ponds and gardens.",
    "lafinca.experiences.list.3":
      "Cocktail or welcome reception in the gardens before moving inside.",
    "lafinca.experiences.list.4":
      "Elegant reception in the hall or under marquees, depending on the size of the event.",
    "lafinca.experiences.list.5":
      "Dinner, toast, cake, sweet table and appetizers.",
    "lafinca.experiences.list.6":
      "Live show, DJ or a memorable highlight hour.",
    "lafinca.experiences.list.7":
      "Visual journeys for quinceañeras, couples, graduates or birthday parties.",
    "lafinca.experiences.list.8":
      "Corporate events with coffee break, talks, recognition and social closing.",
    "lafinca.experiences.list.9":
      "Religious celebrations: christenings, first communions, confirmations.",
    "lafinca.experiences.list.10":
      "Big family gatherings to talk, walk, take photos and enjoy.",

    "lafinca.gallery.eyebrow": "Venue gallery",
    "lafinca.gallery.title": "Hall, lake, pergola and green areas",
    "lafinca.gallery.intro":
      "Tap any image to see it full size. We'll soon share updated photos of every space.",
    "lafinca.gallery.caption.ingreso": "Estate entrance",
    "lafinca.gallery.caption.salon": "Hall set up",
    "lafinca.gallery.caption.areas": "Green areas",
    "lafinca.gallery.caption.outdoor": "Outdoors",
    "lafinca.gallery.caption.setup": "Setup",
    "lafinca.gallery.caption.social": "Social gatherings",
    "lafinca.gallery.caption.deco": "Decoration",
    "lafinca.gallery.caption.main": "Main hall",

    "lafinca.cta.eyebrow": "Ready?",
    "lafinca.cta.title": "Let's talk about your celebration",
    "lafinca.cta.description":
      "Tell us your date and guest count. We'll help you picture your event at La Clementina.",
    "lafinca.cta.button1": "Schedule a visit",
    "lafinca.cta.button2": "See event types",

    // ============ EVENT TYPES (list) ============
    "events.list.hero.eyebrow": "Events",
    "events.list.hero.title": "Every celebration finds its place",
    "events.list.hero.description":
      "From an intimate wedding to a corporate convention, the venue adapts to the style and scale of your event.",
    "events.list.empty": "No event types have been published yet.",
    "events.list.learnMore": "Learn more",

    // ============ EVENT TYPE (detail) ============
    "event.breadcrumb": "Events",
    "event.cta.quote": "Request a quote",
    "event.experience.eyebrow": "The experience",
    "event.experience.title": "Designed so all you do is enjoy",
    "event.includes.eyebrow": "What it includes",
    "event.includes.title": "Every detail thought through for you",
    "event.gallery.eyebrow": "Gallery",
    "event.gallery.title": "Real moments from this event type",
    "event.finalCta.eyebrow": "Next step",
    "event.finalCta.title": "Can you picture your {event} here?",
    "event.finalCta.description":
      "Tell us your date and guest count. We'll walk you through it step by step, no pressure.",
    "event.finalCta.button1": "Start a quote",
    "event.finalCta.button2": "Check availability",
    "event.finalCta.button3": "WhatsApp us",
    "event.others.eyebrow": "Keep exploring",
    "event.others.title": "Other event types",
    "event.whatsappDefault":
      "Hi, I'm interested in information about {event} at Finca La Clementina.",

    // ============ BLOG ============
    "blog.hero.eyebrow": "Inspiration",
    "blog.hero.title": "Ideas for your event",
    "blog.hero.description":
      "Stories, trends and practical advice to make every celebration what you imagine.",
    "blog.empty.title": "Coming soon",
    "blog.empty.subtitle": "No articles published yet.",
    "blog.card.readArticle": "Read article",
    "blog.detail.related": "Related articles",
    "blog.detail.backToBlog": "Back to blog",

    // ============ CONTACT ============
    "contact.hero.eyebrow": "Contact",
    "contact.hero.title": "Let's talk about your event",
    "contact.hero.description":
      "Tell us what you're imagining and we'll help make it happen. No pressure, no rush.",
    "contact.form.eyebrow": "Form",
    "contact.form.title": "Leave us your details",
    "contact.form.name": "Full name *",
    "contact.form.name.placeholder": "Your name",
    "contact.form.phone": "Phone / WhatsApp",
    "contact.form.phone.placeholder": "+593...",
    "contact.form.email": "Email *",
    "contact.form.email.placeholder": "you@email.com",
    "contact.form.eventType": "Event type",
    "contact.form.eventType.placeholder": "Select...",
    "contact.form.eventType.other": "Other",
    "contact.form.date": "Preferred date",
    "contact.form.guests": "Estimated guests",
    "contact.form.guests.placeholder": "E.g. 150",
    "contact.form.message": "Tell us more",
    "contact.form.message.placeholder":
      "Details, questions, anything you need...",
    "contact.form.consent":
      "I accept that my data will be processed according to the privacy policy to respond to my request.",
    "contact.form.consent.link": "privacy policy",
    "contact.form.submit": "Send request",
    "contact.form.submitting": "Sending...",
    "contact.form.recaptcha":
      "This site is protected by reCAPTCHA. Google's Privacy Policy and Terms of Service apply.",
    "contact.success.title": "Thanks for reaching out!",
    "contact.success.description":
      "We received your request. We've sent a confirmation to your email and our team will contact you soon.",
    "contact.success.whatsappPrompt": "Want to chat faster?",
    "contact.success.whatsappLink": "Message us on WhatsApp",
    "contact.aside.whatsapp.eyebrow": "Faster via WhatsApp",
    "contact.aside.whatsapp.button": "Message on WhatsApp",
    "contact.aside.email.eyebrow": "Email",
    "contact.aside.location.eyebrow": "Location",
    "contact.error.required": "Name and email are required.",
    "contact.error.consent":
      "You must accept the privacy policy to continue.",
    "contact.error.email": "The email doesn't look valid.",
    "contact.error.captcha":
      "We couldn't verify that you're human. Refresh the page and try again.",
    "contact.error.save":
      "There was a problem saving your request. Please try again.",
    "contact.error.generic": "An error occurred. Please try again.",
    "contact.whatsappDefault":
      "Hi, I'd like to chat about an event at Finca La Clementina.",

    // ============ TEAM ============
    "team.hero.eyebrow": "The team",
    "team.hero.title": "The people behind every event",
    "team.hero.description":
      "A family team with experience, attention to detail and a passion for making every celebration unique.",
    "team.empty": "No team members published yet.",

    // ============ GALLERY ============
    "gallery.hero.eyebrow": "Gallery",
    "gallery.hero.title": "Moments that are already memories",
    "gallery.hero.description":
      "A visual selection of the celebrations the venue has hosted. Tap any image to see it full size.",
    "gallery.filter.all": "All",
    "gallery.empty": "No images published yet in this category.",

    // ============ CALENDAR ============
    "calendar.hero.eyebrow": "Availability",
    "calendar.hero.title": "Date calendar",
    "calendar.hero.description":
      "Check which dates are open and book yours. Available dates can be secured via WhatsApp.",
    "calendar.legend.available": "Available",
    "calendar.legend.hold": "On hold",
    "calendar.legend.reserved": "Booked",
    "calendar.legend.blocked": "Unavailable",
    "calendar.quoteButton": "Book via WhatsApp",
    "calendar.empty.title": "No information",
    "calendar.empty.subtitle": "No data loaded for this month yet.",

    // ============ COOKIE BANNER ============
    "cookies.title": "We use cookies",
    "cookies.description":
      "We use essential cookies to make the site work and, with your consent, analytics cookies to understand how you use it and improve it.",
    "cookies.accept": "Accept all",
    "cookies.reject": "Essentials only",
    "cookies.learnMore": "Learn more",

    // ============ LEGAL ============
    "legal.privacy.title": "Privacy Policy",
    "legal.privacy.subtitle":
      "How we process your personal data in compliance with Ecuador's LOPDP.",
    "legal.terms.title": "Terms and Conditions",
    "legal.terms.subtitle": "Conditions of use of the website.",
    "legal.cookies.title": "Cookie Policy",
    "legal.cookies.subtitle":
      "How we use cookies to improve your experience.",
    "legal.eyebrow": "Legal",
    "legal.lastUpdated": "Last updated",
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
  if (lang === "es" || lang.startsWith("es-")) return "es";
  return "en";
}
