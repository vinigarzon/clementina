import { Resend } from "resend";
import { getSiteSettings } from "@/lib/data/site-settings";

/**
 * Envía un email vía Resend.
 *
 * El "from" se lee de la configuración administrable del sitio
 * (tabla site_settings), con fallback a las variables de entorno
 * RESEND_FROM_EMAIL / RESEND_FROM_NAME.
 *
 * Si RESEND_API_KEY no está configurada, loggea el contenido y
 * retorna éxito sin enviar (útil en dev).
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  // Lee config del sitio (DB > env > defaults).
  const settings = await getSiteSettings();
  const fromEmail = settings.resend_from_email;
  const fromName = settings.resend_from_name;

  if (!apiKey) {
    console.log("[email] (modo dev sin RESEND_API_KEY) → Email no enviado:");
    console.log("  From:", `${fromName} <${fromEmail}>`);
    console.log("  To:", params.to);
    console.log("  Subject:", params.subject);
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Error desconocido",
    };
  }
}
