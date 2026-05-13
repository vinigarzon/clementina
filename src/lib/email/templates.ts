/**
 * Templates HTML para emails del formulario de contacto.
 * HTML inline simple para máxima compatibilidad con clientes de correo.
 */

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

function wrap(body: string): string {
  // URL absoluta para que el logo se vea en clientes de correo.
  // Configurable vía NEXT_PUBLIC_SITE_URL en producción.
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://fincalaclementina.com").replace(/\/$/, "");
  const logoUrl = `${siteUrl}/logos/logo-white.png`;

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
      Vía El Carrizal, Parroquia Urbina, Tulcán, Ecuador<br/>
      info@fincalaclementina.com · WhatsApp +593 99 966 0252
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Email que recibe el visitante como confirmación.
 */
export function clientConfirmationEmail(data: LeadEmailData): {
  subject: string;
  html: string;
} {
  const subject = "Recibimos tu solicitud — Finca La Clementina";
  const body = `
    <h2 style="font-family:Georgia, serif; font-size:22px; color:${COLORS.primary}; margin:0 0 16px;">¡Gracias por escribirnos, ${escapeHtml(data.full_name.split(" ")[0])}!</h2>
    <p style="margin:0 0 16px;">Recibimos tu solicitud y nuestro equipo se va a poner en contacto contigo muy pronto para conversar los detalles.</p>
    <p style="margin:0 0 24px;">Mientras tanto, puedes escribirnos directamente por WhatsApp al <a href="https://wa.me/593999660252" style="color:${COLORS.primary};">+593 99 966 0252</a> si tienes cualquier pregunta.</p>

    <table cellpadding="0" cellspacing="0" border="0" style="width:100%; background:${COLORS.cream}; border-radius:8px; margin:0 0 24px;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 8px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:${COLORS.muted};">Resumen de tu solicitud</p>
        ${row("Tipo de evento", data.event_type)}
        ${row("Fecha tentativa", data.desired_date)}
        ${row("Invitados estimados", data.guests?.toString() ?? null)}
        ${data.message ? `<p style="margin:8px 0 0; font-size:13px;"><em>"${escapeHtml(data.message)}"</em></p>` : ""}
      </td></tr>
    </table>

    <p style="margin:0; font-size:13px; color:${COLORS.muted};">Un abrazo,<br/>Equipo Finca La Clementina</p>
  `;
  return { subject, html: wrap(body) };
}

/**
 * Email que recibe el responsable de la finca con el lead nuevo.
 */
export function leadNotificationEmail(data: LeadEmailData): {
  subject: string;
  html: string;
} {
  const subject = `Nuevo lead: ${data.full_name}${data.event_type ? " · " + data.event_type : ""}`;
  const body = `
    <h2 style="font-family:Georgia, serif; font-size:22px; color:${COLORS.primary}; margin:0 0 16px;">Nueva solicitud desde el sitio</h2>
    <p style="margin:0 0 24px;">Recibimos un lead nuevo a través del formulario de contacto.</p>

    <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border:1px solid ${COLORS.border}; border-radius:8px;">
      <tr><td style="padding:16px;">
        ${row("Nombre", data.full_name)}
        ${row("Correo", `<a href="mailto:${escapeHtml(data.email)}" style="color:${COLORS.primary};">${escapeHtml(data.email)}</a>`)}
        ${row("Teléfono / WhatsApp", data.phone ? `<a href="https://wa.me/${data.phone.replace(/\\D/g, "")}" style="color:${COLORS.primary};">${escapeHtml(data.phone)}</a>` : null)}
        ${row("Tipo de evento", data.event_type)}
        ${row("Fecha tentativa", data.desired_date)}
        ${row("Invitados estimados", data.guests?.toString() ?? null)}
        ${data.message ? `<p style="margin:12px 0 0; padding-top:12px; border-top:1px solid ${COLORS.border}; font-size:13px;"><strong>Mensaje:</strong><br/>${escapeHtml(data.message).replace(/\\n/g, "<br/>")}</p>` : ""}
      </td></tr>
    </table>

    <p style="margin:24px 0 0; font-size:13px; color:${COLORS.muted};">Responde directamente a este email para contactar al cliente.</p>
  `;
  return { subject, html: wrap(body) };
}

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
