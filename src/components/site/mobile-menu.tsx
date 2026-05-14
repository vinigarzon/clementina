"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/i18n/locale-context";
import { LanguageToggle } from "@/components/site/language-toggle";
import { useSiteSettings } from "@/components/site/site-settings-provider";

const navItems = [
  { href: "/", labelKey: "nav.home" },
  { href: "/la-finca", labelKey: "nav.about" },
  { href: "/equipo", labelKey: "nav.team" },
  { href: "/tipos-de-eventos", labelKey: "nav.events" },
  { href: "/galeria", labelKey: "nav.gallery" },
  { href: "/calendario", labelKey: "nav.calendar" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/contacto", labelKey: "nav.contact" },
];

interface MobileMenuProps {
  /** Si el header está en estado scrolled, usa color oscuro para el botón hamburguesa. */
  scrolled?: boolean;
}

export function MobileMenu({ scrolled = false }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const pathname = usePathname();
  const settings = useSiteSettings();

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape para cerrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Botón hamburguesa (visible solo en <lg) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className={`lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-colors ${
          scrolled ? "text-clementina-800" : "text-cream-50"
        }`}
      >
        <span className="w-6 h-px bg-current" />
        <span className="w-6 h-px bg-current" />
        <span className="w-6 h-px bg-current" />
      </button>

      {/* Drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-clementina-900 text-cream-50 flex flex-col mobile-menu-enter"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-6">
            <span className="font-display text-xl">Finca La Clementina</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="w-10 h-10 flex items-center justify-center text-cream-50 text-2xl"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block font-display text-3xl py-3 transition-colors ${
                        active
                          ? "text-cream-50"
                          : "text-cream-100/70 hover:text-cream-50"
                      }`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-12 pt-8 border-t border-cream-100/15 space-y-6">
              <LanguageToggle light />

              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-sans text-sm text-cream-100/80 hover:text-cream-50"
              >
                WhatsApp · {settings.whatsapp_display}
              </a>
              <a
                href={`mailto:${settings.contact_email}`}
                className="block font-sans text-sm text-cream-100/80 hover:text-cream-50"
              >
                {settings.contact_email}
              </a>
            </div>
          </nav>

          <div className="p-6">
            <Link
              href="/contacto"
              className="block w-full text-center px-8 py-4 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("nav.quote")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
