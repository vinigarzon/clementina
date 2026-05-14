"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import {
  clientConfirmationEmail,
  leadNotificationEmail,
  type EmailLocale,
} from "@/lib/email/templates";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { getSiteSettings } from "@/lib/data/site-settings";

export interface SubmitLeadInput {
  full_name: string;
  email: string;
  phone?: string;
  event_type_slug?: string;
  desired_date?: string;
  guests?: string;
  message?: string;
  recaptcha_token?: string;
  consent: boolean;
  /** Idioma en el que el visitante navegaba el sitio. */
  locale?: EmailLocale;
}

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

export async function submitLead(
  input: SubmitLeadInput,
): Promise<SubmitLeadResult> {
  const locale: EmailLocale = input.locale === "en" ? "en" : "es";

  // Mensajes de validación localizados.
  const errors = {
    required:
      locale === "en"
        ? "Name and email are required."
        : "Nombre y correo son obligatorios.",
    consent:
      locale === "en"
        ? "You must accept the privacy policy to continue."
        : "Debes aceptar la política de privacidad para continuar.",
    email:
      locale === "en"
        ? "The email doesn't look valid."
        : "El correo no parece válido.",
    captcha:
      locale === "en"
        ? "We couldn't verify that you're human. Refresh the page and try again."
        : "No pudimos verificar que eres una persona. Recarga la página e intenta de nuevo.",
    save:
      locale === "en"
        ? "There was a problem saving your request. Please try again."
        : "Hubo un problema guardando tu solicitud. Intenta de nuevo.",
  };

  if (!input.full_name?.trim() || !input.email?.trim()) {
    return { ok: false, error: errors.required };
  }
  if (!input.consent) {
    return { ok: false, error: errors.consent };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, error: errors.email };
  }

  const captcha = await verifyRecaptcha(input.recaptcha_token);
  if (!captcha.valid) {
    return { ok: false, error: errors.captcha };
  }

  const supabase = await createClient();
  const guestsNum = input.guests ? Number(input.guests) : null;

  // Lookup del título del tipo de evento — usamos el idioma del visitante
  // para el correo de confirmación (y el español siempre para el correo
  // interno del equipo).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  let eventTypeName: string | null = null;
  if (input.event_type_slug && input.event_type_slug !== "otro") {
    const { data } = await sb
      .from("event_types")
      .select("title_es, title_en")
      .eq("slug", input.event_type_slug)
      .maybeSingle();
    if (data) {
      eventTypeName =
        locale === "en"
          ? data.title_en ?? data.title_es
          : data.title_es;
    } else {
      eventTypeName = input.event_type_slug;
    }
  } else if (input.event_type_slug === "otro") {
    eventTypeName = locale === "en" ? "Other" : "Otro";
  }

  const { error: leadErr } = await sb.from("leads").insert({
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    event_type_slug: input.event_type_slug || null,
    desired_date: input.desired_date || null,
    guests: guestsNum && !isNaN(guestsNum) ? guestsNum : null,
    message: input.message?.trim() || null,
    consent_given: input.consent,
    status: "nuevo",
    source: locale === "en" ? "web-contacto-en" : "web-contacto",
  });

  if (leadErr) {
    console.error("[submitLead] DB error:", leadErr);
    return { ok: false, error: errors.save };
  }

  const emailData = {
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    event_type: eventTypeName,
    desired_date: input.desired_date || null,
    guests: guestsNum && !isNaN(guestsNum) ? guestsNum : null,
    message: input.message?.trim() || null,
  };

  // 1. Notificación al equipo — siempre en español, pero indica el
  //    idioma del visitante para que el equipo responda en el correcto.
  const settings = await getSiteSettings();
  const notif = leadNotificationEmail(emailData, locale);
  await sendEmail({
    to: settings.lead_notification_email,
    subject: notif.subject,
    html: notif.html,
    replyTo: emailData.email,
  });

  // 2. Confirmación al cliente en SU idioma.
  const conf = clientConfirmationEmail(emailData, locale);
  await sendEmail({
    to: emailData.email,
    subject: conf.subject,
    html: conf.html,
  });

  return { ok: true };
}
