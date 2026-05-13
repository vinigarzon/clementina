"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { LanguageToggle } from "@/components/site/language-toggle";
import { MobileMenu } from "@/components/site/mobile-menu";
import { useT } from "@/i18n/locale-context";

export function Header() {
  const t = useT();

  const navItems = [
    { href: "/la-finca", labelKey: "nav.about" },
    { href: "/equipo", labelKey: "nav.team" },
    { href: "/tipos-de-eventos", labelKey: "nav.events" },
    { href: "/galeria", labelKey: "nav.gallery" },
    { href: "/calendario", labelKey: "nav.calendar" },
    { href: "/blog", labelKey: "nav.blog" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pt-6">
      <Container>
        <nav className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Finca La Clementina · Inicio"
          >
            <Image
              src="/logos/logo-white.png"
              alt="Finca La Clementina"
              width={240}
              height={80}
              priority
              className="h-14 sm:h-16 w-auto"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-sans text-sm text-cream-50/90 hover:text-cream-50 transition-colors"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <LanguageToggle light />
            </div>
            <Link
              href="/contacto"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-cream-50 text-clementina-800 font-sans text-sm font-medium hover:bg-cream-100 transition-colors"
            >
              {t("nav.quote")}
            </Link>
            <MobileMenu />
          </div>
        </nav>
      </Container>
    </header>
  );
}
