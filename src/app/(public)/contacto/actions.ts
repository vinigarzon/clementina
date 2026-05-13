"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import {
  clientConfirmationEmail,
  leadNotificationEmail,
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
}

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

export async function submitLead(
  input: SubmitLeadInput,
): Promise<SubmitLeadResult> {
  // Validación básica
  if (!input.full_name?.trim() || !input.email?.trim()) {
    return { ok: false, error: "Nombre y correo son obligatorios." };
  }
  if (!input.consent) {
    return {
      ok: false,
      error: "Debes aceptar la política de privacidad para continuar.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, error: "El correo no parece válido." };
  }

  // reCAPTCHA
  const captcha = await verifyRecaptcha(input.recaptcha_token);
  if (!captcha.valid) {
    return {
      ok: false,
      error:
        "No pudimos verificar que eres una persona. Recarga la página e intenta de nuevo.",
    };
  }

  // Guarda lead en BD
  const supabase = await createClient();
  const guestsNum = input.guests ? Number(input.guests) : null;

  // Lookup del nombre del tipo de evento para el email
  let eventTypeName: string | null = null;
  if (input.event_type_slug && input.event_type_slug !== "otro") {
    const { data } = await supabase
      .from("event_types")
      .select("title_es")
      .eq("slug", input.event_type_slug)
      .maybeSingle();
    eventTypeName = data?.title_es ?? input.event_type_slug;
  } else if (input.event_type_slug === "otro") {
    eventTypeName = "Otro";
  }

  const { error: leadErr } = await supabase.from("leads").insert({
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    event_type_slug: input.event_type_slug || null,
    desired_date: input.desired_date || null,
    guests: guestsNum && !isNaN(guestsNum) ? guestsNum : null,
    message: input.message?.trim() || null,
    consent_given: input.consent,
    status: "nuevo",
    source: "web-contacto",
  });

  if (leadErr) {
    console.error("[submitLead] DB error:", leadErr);
    return {
      ok: false,
      error: "Hubo un problema guardando tu solicitud. Intenta de nuevo.",
    };
  }

  // Envío de emails (no bloquea el éxito si falla)
  const emailData = {
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    event_type: eventTypeName,
    desired_date: input.desired_date || null,
    guests: guestsNum && !isNaN(guestsNum) ? guestsNum : null,
    message: input.message?.trim() || null,
  };

  // 1. Email al responsable (destino administrable desde /admin/configuracion)
  const settings = await getSiteSettings();
  const notif = leadNotificationEmail(emailData);
  await sendEmail({
    to: settings.lead_notification_email,
    subject: notif.subject,
    html: notif.html,
    replyTo: emailData.email,
  });

  // 2. Confirmación al cliente
  const conf = clientConfirmationEmail(emailData);
  await sendEmail({
    to: emailData.email,
    subject: conf.subject,
    html: conf.html,
  });

  return { ok: true };
}
