"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { LanguageToggle } from "@/components/site/language-toggle";
import { MobileMenu } from "@/components/site/mobile-menu";
import { useT } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/la-finca", labelKey: "nav.about" },
  { href: "/equipo", labelKey: "nav.team" },
  { href: "/tipos-de-eventos", labelKey: "nav.events" },
  { href: "/galeria", labelKey: "nav.gallery" },
  { href: "/calendario", labelKey: "nav.calendar" },
  { href: "/blog", labelKey: "nav.blog" },
];

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // estado inicial
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cuando cambia la ruta, resetea el estado de scroll inmediato
  // (Next.js no scrollea al top hasta el primer paint).
  useEffect(() => {
    setScrolled(window.scrollY > 50);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-30 transition-all duration-300",
        scrolled
          ? "py-3.5 bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-clementina-100/60"
          : "py-5 bg-transparent",
      )}
    >
      <Container>
        <nav className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Finca La Clementina · Inicio"
          >
            {/* Logo blanco sobre hero, horizontal (oscuro) cuando scrolled. */}
            <Image
              src={
                scrolled
                  ? "/logos/logo-horizontal.png"
                  : "/logos/logo-white.png"
              }
              alt="Finca La Clementina"
              width={240}
              height={80}
              priority
              className={cn(
                "w-auto transition-all duration-300",
                scrolled ? "h-8 sm:h-9" : "h-14 sm:h-16",
              )}
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "font-sans text-sm transition-colors",
                    scrolled
                      ? "text-clementina-800/85 hover:text-clementina-900"
                      : "text-cream-50/90 hover:text-cream-50",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <LanguageToggle light={!scrolled} />
            </div>
            <Link
              href="/contacto"
              className={cn(
                "hidden sm:inline-flex items-center px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-colors",
                scrolled
                  ? "bg-clementina-800 text-cream-50 hover:bg-clementina-700"
                  : "bg-cream-50 text-clementina-800 hover:bg-cream-100",
              )}
            >
              {t("nav.quote")}
            </Link>
            <MobileMenu scrolled={scrolled} />
          </div>
        </nav>
      </Container>
    </header>
  );
}
