"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { useT } from "@/i18n/locale-context";
import { useSiteSettings } from "@/components/site/site-settings-provider";

export function Footer() {
  const t = useT();
  const settings = useSiteSettings();

  const exploreLinks = [
    { href: "/la-finca", labelKey: "nav.about" },
    { href: "/tipos-de-eventos", labelKey: "nav.events" },
    { href: "/galeria", labelKey: "nav.gallery" },
    { href: "/calendario", labelKey: "nav.calendar" },
    { href: "/blog", labelKey: "nav.blog" },
  ];

  return (
    <footer className="bg-clementina-900 text-cream-100">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image
              src="/logos/logo-white.png"
              alt="Finca La Clementina"
              width={220}
              height={75}
              className="h-14 w-auto mb-2"
            />
            <p className="font-sans text-base text-cream-100/80 mt-6 max-w-md leading-relaxed">
              {settings.site_name} · {settings.site_tagline}.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-cream-100/60 mb-4">
              {t("footer.explore")}
            </h4>
            <ul className="space-y-2">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-cream-100/90 hover:text-cream-50 transition-colors"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-cream-100/60 mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 font-sans text-sm text-cream-100/90">
              <li className="leading-relaxed">
                {settings.address_line1}, {settings.address_line2},{" "}
                {settings.address_city}
              </li>
              <li>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-cream-50 transition-colors"
                >
                  {settings.contact_email}
                </a>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-cream-100/20 flex items-center justify-center text-cream-100/80 hover:text-cream-50 hover:border-cream-100/50 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.38 2.13a5.86 5.86 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24c3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
                </svg>
              </a>
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-cream-100/20 flex items-center justify-center text-cream-100/80 hover:text-cream-50 hover:border-cream-100/50 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.09 24 12.07Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream-100/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-sans text-xs text-cream-100/60">
            © {new Date().getFullYear()} {settings.site_name}. {t("footer.rights")}
          </p>
          <div className="flex gap-6 font-sans text-xs text-cream-100/60">
            <Link href="/legales/privacidad" className="hover:text-cream-50">
              {t("footer.privacy")}
            </Link>
            <Link href="/legales/terminos" className="hover:text-cream-50">
              {t("footer.terms")}
            </Link>
            <Link href="/legales/cookies" className="hover:text-cream-50">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
