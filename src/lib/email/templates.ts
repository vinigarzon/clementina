/**
 * Templates HTML para emails del formulario de contacto.
 * Bilingüe: el email que recibe el cliente sale en el idioma que
 * tenía el sitio cuando llenó el form. El email interno (al equipo)
 * siempre va en español.
 */

export type EmailLocale = "es" | "en";

export interface LeadEmailData {
  full_name: string;
  email: string;
  phone: string | null;
  event_type: string | null;
  desired_date: string | null;
  guests: number | null;
  message: string | null;
}

const COLORS = {
  primary: "#2E4A3A",
  primaryDark: "#1F2F1D",
  cream: "#FBF9F4",
  border: "#D5DDD0",
  muted: "#6B7C66",
  text: "#1F2F1D",
};

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: ${COLORS.text};
  line-height: 1.5;
`;

function wrap(body: string, footerLocale: EmailLocale = "es"): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://fincalaclementina.com").replace(/\/$/, "");
  const logoUrl = `${siteUrl}/logos/logo-white.png`;
  const footerText =
    footerLocale === "en"
      ? "Vía El Carrizal, Parroquia Urbina, Tulcán, Ecuador"
      : "Vía El Carrizal, Parroquia Urbina, Tulcán, Ecuador";

  return `<!DOCTYPE html>
<html><body style="margin:0; padding:24px; background:${COLORS.cream};">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:600px; margin:0 auto; background:white; border-radius:16px; overflow:hidden; ${baseStyles}">
    <tr><td align="center" style="padding:32px 32px 28px; background:${COLORS.primary};">
      <img src="${logoUrl}" alt="Finca La Clementina" width="160" style="display:block; height:auto; max-width:160px; border:0; outline:none;" />
    </td></tr>
    <tr><td style="padding:32px;">
      ${body}
    </td></tr>
    <tr><td style="padding:16px 32px; background:${COLORS.cream}; color:${COLORS.muted}; font-size:11px; text-align:center; border-top:1px solid ${COLORS.border};">
      ${footerText}<br/>
      info@fincalaclementina.com · WhatsApp +593 99 966 0252
    </td></tr>
  </table>
</body></html>`;
}

// ============ COPY POR IDIOMA ============

const CLIENT_COPY = {
  es: {
    subject: "Recibimos tu solicitud — Finca La Clementina",
    greeting: (name: string) => `¡Gracias por escribirnos, ${name}!`,
    intro:
      "Recibimos tu solicitud y nuestro equipo se va a poner en contacto contigo muy pronto para conversar los detalles.",
    whatsappPrompt: (link: string) =>
      `Mientras tanto, puedes escribirnos directamente por WhatsApp al ${link} si tienes cualquier pregunta.`,
    summary: "Resumen de tu solicitud",
    row: {
      event: "Tipo de evento",
      date: "Fecha tentativa",
      guests: "Invitados estimados",
    },
    closing: "Un abrazo,",
    team: "Equipo Finca La Clementina",
  },
  en: {
    subject: "We received your request — Finca La Clementina",
    greeting: (name: string) => `Thanks for reaching out, ${name}!`,
    intro:
      "We received your request and our team will contact you very soon to discuss the details.",
    whatsappPrompt: (link: string) =>
      `In the meantime, you can message us directly on WhatsApp at ${link} if you have any questions.`,
    summary: "Your request summary",
    row: {
      event: "Event type",
      date: "Preferred date",
      guests: "Estimated guests",
    },
    closing: "Warmly,",
    team: "Finca La Clementina Team",
  },
};

const INTERNAL_COPY = {
  subject: (name: string, eventType: string | null) =>
    `Nuevo lead: ${name}${eventType ? " · " + eventType : ""}`,
  title: "Nueva solicitud desde el sitio",
  intro: "Recibimos un lead nuevo a través del formulario de contacto.",
  row: {
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono / WhatsApp",
    event: "Tipo de evento",
    date: "Fecha tentativa",
    guests: "Invitados estimados",
    locale: "Idioma del visitante",
    message: "Mensaje",
  },
  reply: "Responde directamente a este email para contactar al cliente.",
};

// ============ EMAIL: confirmación al cliente ============

export function clientConfirmationEmail(
  data: LeadEmailData,
  locale: EmailLocale = "es",
): { subject: string; html: string } {
  const t = CLIENT_COPY[locale];
  const firstName = data.full_name.split(" ")[0];
  const whatsappLink = `<a href="https://wa.me/593999660252" style="color:${COLORS.primary};">+593 99 966 0252</a>`;

  const body = `
    <h2 style="font-family:Georgia, serif; font-size:22px; color:${COLORS.primary}; margin:0 0 16px;">${t.greeting(escapeHtml(firstName))}</h2>
    <p style="margin:0 0 16px;">${t.intro}</p>
    <p style="margin:0 0 24px;">${t.whatsappPrompt(whatsappLink)}</p>

    <table cellpadding="0" cellspacing="0" border="0" style="width:100%; background:${COLORS.cream}; border-radius:8px; margin:0 0 24px;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 8px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:${COLORS.muted};">${t.summary}</p>
        ${row(t.row.event, data.event_type)}
        ${row(t.row.date, data.desired_date)}
        ${row(t.row.guests, data.guests?.toString() ?? null)}
        ${data.message ? `<p style="margin:8px 0 0; font-size:13px;"><em>"${escapeHtml(data.message)}"</em></p>` : ""}
      </td></tr>
    </table>

    <p style="margin:0; font-size:13px; color:${COLORS.muted};">${t.closing}<br/>${t.team}</p>
  `;

  return { subject: t.subject, html: wrap(body, locale) };
}

// ============ EMAIL: notificación interna ============

export function leadNotificationEmail(
  data: LeadEmailData,
  locale: EmailLocale = "es",
): { subject: string; html: string } {
  const t = INTERNAL_COPY;
  const localeLabel = locale === "en" ? "Inglés (visitante extranjero)" : "Español";

  const body = `
    <h2 style="font-family:Georgia, serif; font-size:22px; color:${COLORS.primary}; margin:0 0 16px;">${t.title}</h2>
    <p style="margin:0 0 8px;">${t.intro}</p>
    <p style="margin:0 0 24px; font-size:12px; color:${COLORS.muted};"><strong>${t.row.locale}:</strong> ${localeLabel}</p>

    <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border:1px solid ${COLORS.border}; border-radius:8px;">
      <tr><td style="padding:16px;">
        ${row(t.row.name, data.full_name)}
        ${row(t.row.email, `<a href="mailto:${escapeHtml(data.email)}" style="color:${COLORS.primary};">${escapeHtml(data.email)}</a>`)}
        ${row(t.row.phone, data.phone ? `<a href="https://wa.me/${data.phone.replace(/\D/g, "")}" style="color:${COLORS.primary};">${escapeHtml(data.phone)}</a>` : null)}
        ${row(t.row.event, data.event_type)}
        ${row(t.row.date, data.desired_date)}
        ${row(t.row.guests, data.guests?.toString() ?? null)}
        ${data.message ? `<p style="margin:12px 0 0; padding-top:12px; border-top:1px solid ${COLORS.border}; font-size:13px;"><strong>${t.row.message}:</strong><br/>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>` : ""}
      </td></tr>
    </table>

    <p style="margin:24px 0 0; font-size:13px; color:${COLORS.muted};">${t.reply}</p>
  `;

  return { subject: t.subject(data.full_name, data.event_type), html: wrap(body, "es") };
}

// ============ HELPERS ============

function row(label: string, value: string | null): string {
  if (!value) return "";
  return `<p style="margin:0 0 6px; font-size:13px;"><strong style="color:${COLORS.primary};">${label}:</strong> ${value}</p>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
