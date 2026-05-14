"use client";

import { useState, useTransition } from "react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useSiteSettings } from "@/components/site/site-settings-provider";
import { useT } from "@/i18n/locale-context";
import {
  RecaptchaLoader,
  executeRecaptcha,
} from "@/components/site/recaptcha-loader";
import { submitLead } from "./actions";

interface EventTypeOption {
  slug: string;
  label: string;
}

interface ContactSectionProps {
  eventTypeOptions: EventTypeOption[];
}

export function ContactSection({ eventTypeOptions }: ContactSectionProps) {
  const t = useT();
  const settings = useSiteSettings();
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    t("contact.whatsappDefault"),
  )}`;

  const [submitting, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    event_type_slug: "",
    desired_date: "",
    guests: "",
    message: "",
    consent: false,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const token = await executeRecaptcha("contact_form");
      const res = await submitLead({
        ...form,
        recaptcha_token: token ?? undefined,
      });
      if (!res.ok) {
        setError(res.error ?? t("contact.error.generic"));
      } else {
        setSubmitted(true);
      }
    });
  }

  return (
    <>
      <RecaptchaLoader />
      <PageHero
        eyebrow={t("contact.hero.eyebrow")}
        title={t("contact.hero.title")}
        description={t("contact.hero.description")}
        image={{
          src: "/venue/ingreso.jpg",
          alt: "Finca La Clementina",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Formulario */}
            <div className="lg:col-span-3">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-6">
                {t("contact.form.eyebrow")}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-clementina-800 leading-tight mb-10">
                {t("contact.form.title")}
              </h2>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-clementina-50 border border-clementina-200">
                  <p className="font-display text-2xl text-clementina-800 mb-3">
                    {t("contact.success.title")}
                  </p>
                  <p className="font-sans text-base text-clementina-900/80 leading-relaxed">
                    {t("contact.success.description")}
                  </p>
                  <p className="font-sans text-sm text-clementina-900/65 mt-4">
                    {t("contact.success.whatsappPrompt")}{" "}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 text-clementina-700 hover:text-clementina-800"
                    >
                      {t("contact.success.whatsappLink")}
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                        {t("contact.form.name")}
                      </label>
                      <input
                        type="text"
                        required
                        value={form.full_name}
                        onChange={(e) => set("full_name", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600"
                        placeholder={t("contact.form.name.placeholder")}
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                        {t("contact.form.phone")}
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600"
                        placeholder={t("contact.form.phone.placeholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                      {t("contact.form.email")}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600"
                      placeholder={t("contact.form.email.placeholder")}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                        {t("contact.form.eventType")}
                      </label>
                      <select
                        value={form.event_type_slug}
                        onChange={(e) =>
                          set("event_type_slug", e.target.value)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600"
                      >
                        <option value="">
                          {t("contact.form.eventType.placeholder")}
                        </option>
                        {eventTypeOptions.map((opt) => (
                          <option key={opt.slug} value={opt.slug}>
                            {opt.label}
                          </option>
                        ))}
                        <option value="otro">
                          {t("contact.form.eventType.other")}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                        {t("contact.form.date")}
                      </label>
                      <input
                        type="date"
                        value={form.desired_date}
                        onChange={(e) => set("desired_date", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                      {t("contact.form.guests")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.guests}
                      onChange={(e) => set("guests", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600"
                      placeholder={t("contact.form.guests.placeholder")}
                    />
                  </div>

                  <div>
                    <label className="block font-sans text-sm font-medium text-clementina-900 mb-2">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-clementina-200 bg-cream-50 font-sans text-base focus:outline-none focus:border-clementina-600 resize-none"
                      placeholder={t("contact.form.message.placeholder")}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="mt-1"
                    />
                    <label
                      htmlFor="consent"
                      className="font-sans text-sm text-clementina-900/70 leading-relaxed"
                    >
                      {t("contact.form.consent").split("política de privacidad")[0]}
                      <a
                        href="/legales/privacidad"
                        className="underline hover:text-clementina-800"
                      >
                        {t("contact.form.consent.link")}
                      </a>
                      {t("contact.form.consent").split("política de privacidad")[1] ??
                        t("contact.form.consent").split("privacy policy")[1] ??
                        "."}
                    </label>
                  </div>

                  {error && (
                    <div className="px-5 py-3 rounded-lg bg-red-50 text-red-800 border border-red-200 font-sans text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-4 rounded-full bg-clementina-800 text-cream-50 font-sans text-sm font-medium hover:bg-clementina-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? t("contact.form.submitting")
                      : t("contact.form.submit")}
                  </button>

                  <p className="font-sans text-[10px] text-clementina-900/50 leading-relaxed">
                    {t("contact.form.recaptcha")}
                  </p>
                </form>
              )}
            </div>

            {/* Datos de contacto */}
            <aside className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30">
                <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                  {t("contact.aside.whatsapp.eyebrow")}
                </p>
                <p className="font-display text-2xl text-clementina-800 mb-4">
                  {settings.whatsapp_display}
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {t("contact.aside.whatsapp.button")}
                </a>
              </div>

              <div className="p-8 rounded-2xl bg-clementina-50 border border-clementina-100">
                <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                  {t("contact.aside.email.eyebrow")}
                </p>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="font-display text-xl text-clementina-800 hover:text-clementina-700 transition-colors block break-all"
                >
                  {settings.contact_email}
                </a>
              </div>

              <div className="p-8 rounded-2xl bg-clementina-50 border border-clementina-100">
                <p className="font-sans text-xs uppercase tracking-widest text-clementina-600 mb-3">
                  {t("contact.aside.location.eyebrow")}
                </p>
                <p className="font-display text-xl text-clementina-800 mb-3">
                  {settings.site_name}
                </p>
                <p className="font-sans text-sm text-clementina-900/75 leading-relaxed">
                  {settings.address_line1}
                  <br />
                  {settings.address_line2}
                  <br />
                  {settings.address_city}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
