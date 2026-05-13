"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AdminShellProps {
  profile: Profile;
  children: React.ReactNode;
}

const ROLE_LABELS: Record<Profile["role"], string> = {
  super_admin: "Super Admin",
  comercial: "Comercial",
  operaciones: "Operaciones",
  apoyo: "Apoyo",
};

interface NavItem {
  href: string;
  label: string;
  roles?: Profile["role"][];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    title: "General",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    title: "Comercial",
    items: [
      { href: "/admin/clientes", label: "Clientes" },
      { href: "/admin/eventos", label: "Eventos" },
      { href: "/admin/cotizaciones", label: "Cotizaciones" },
      { href: "/admin/catalogo", label: "Catálogo" },
    ],
  },
  {
    title: "Contenido",
    items: [
      { href: "/admin/galeria", label: "Galería" },
      { href: "/admin/equipo", label: "Equipo" },
      { href: "/admin/tipos-de-eventos", label: "Tipos de evento" },
      { href: "/admin/blog", label: "Inspiración (blog)" },
    ],
  },
  {
    title: "Configuración",
    items: [
      { href: "/admin/espacios", label: "Espacios" },
      { href: "/admin/configuracion", label: "Sitio (contactos, redes…)" },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        href: "/admin/usuarios",
        label: "Usuarios",
        roles: ["super_admin"],
      },
      {
        href: "/admin/auditoria",
        label: "Auditoría",
        roles: ["super_admin"],
      },
    ],
  },
];

export function AdminShell({ profile, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = NAV.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.roles || item.roles.includes(profile.role),
    ),
  })).filter((s) => s.items.length > 0);

  const initials =
    (profile.full_name || profile.email)
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-clementina-900 text-cream-100">
        <div className="px-6 py-6 border-b border-cream-100/10">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logos/logo-white.png"
              alt="Finca La Clementina"
              width={180}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-2 font-sans text-[10px] uppercase tracking-widest text-cream-100/40">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
                          active
                            ? "bg-clementina-700 text-cream-50"
                            : "text-cream-100/80 hover:bg-clementina-800 hover:text-cream-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-cream-100/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-clementina-700 flex items-center justify-center font-sans text-sm font-medium text-cream-50">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-sans text-sm text-cream-50 truncate">
                {profile.full_name || profile.email}
              </p>
              <p className="font-sans text-xs text-cream-100/60">
                {ROLE_LABELS[profile.role]}
              </p>
            </div>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full px-3 py-2 rounded-lg border border-cream-100/20 font-sans text-sm text-cream-100/80 hover:bg-clementina-800 hover:text-cream-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Header mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-clementina-900 text-cream-50 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/logos/logo-white.png"
            alt="Finca La Clementina"
            width={140}
            height={48}
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        >
          <span className="w-5 h-px bg-cream-50" />
          <span className="w-5 h-px bg-cream-50" />
          <span className="w-5 h-px bg-cream-50" />
        </button>
      </div>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-clementina-900 text-cream-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <Image
              src="/logos/logo-white.png"
              alt="Finca La Clementina"
              width={140}
              height={48}
              className="h-8 w-auto"
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar"
              className="w-10 h-10 flex items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 font-sans text-[10px] uppercase tracking-widest text-cream-100/40">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-lg font-sans text-base text-cream-100/90 hover:bg-clementina-800"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-cream-100/10">
            <p className="font-sans text-sm text-cream-50 mb-1">
              {profile.full_name || profile.email}
            </p>
            <p className="font-sans text-xs text-cream-100/60 mb-3">
              {ROLE_LABELS[profile.role]}
            </p>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="w-full px-3 py-2 rounded-lg border border-cream-100/20 font-sans text-sm text-cream-100"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
