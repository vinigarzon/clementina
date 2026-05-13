"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { useLocale } from "@/i18n/locale-context";
import { useSiteSettings } from "@/components/site/site-settings-provider";
import type { DayStatus, MonthStats } from "@/lib/data/date-holds";

const MONTHS = {
  es: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

const WEEKDAYS = {
  es: ["L", "M", "X", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
};

const COPY = {
  es: {
    eyebrow: "Calendario",
    title: "Consulta disponibilidad",
    description:
      "Las fechas se actualizan en tiempo real desde el sistema interno. Si la fecha que buscas está libre, conversemos.",
    legendAvailable: "Disponible",
    legendHold: "En conversación",
    legendReserved: "Reservada",
    legendBlocked: "No disponible",
    prevMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    urgency: (pct: number, occupied: number, total: number) =>
      `${pct}% de los fines de semana de este mes ya están reservados (${occupied} de ${total}).`,
    quoteButton: "Pedir cotización para esta fecha",
    holdTooltip: "Otra pareja está en conversación para esta fecha.",
    reservedTooltip: "Reservada — la fecha está cerrada.",
    blockedTooltip: "Fecha no disponible.",
  },
  en: {
    eyebrow: "Calendar",
    title: "Check availability",
    description:
      "Dates update in real time from the internal system. If the date you want is free, let's talk.",
    legendAvailable: "Available",
    legendHold: "In conversation",
    legendReserved: "Booked",
    legendBlocked: "Unavailable",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    urgency: (pct: number, occupied: number, total: number) =>
      `${pct}% of this month's weekends are already booked (${occupied} of ${total}).`,
    quoteButton: "Request a quote for this date",
    holdTooltip: "Another couple is in conversation for this date.",
    reservedTooltip: "Booked — this date is closed.",
    blockedTooltip: "Date unavailable.",
  },
};

interface CalendarViewProps {
  year: number;
  month: number; // 1-12
  holds: Record<number, DayStatus>;
  stats: MonthStats;
  prevHref: string;
  nextHref: string;
}

export function CalendarView({
  year,
  month,
  holds,
  stats,
  prevHref,
  nextHref,
}: CalendarViewProps) {
  const { locale } = useLocale();
  const { whatsapp_number } = useSiteSettings();
  const t = COPY[locale];
  const monthName = MONTHS[locale][month - 1];

  // First day of month: getDay() devuelve 0=domingo, 1=lunes, ..., 6=sábado
  // Para empezar en lunes: offset = (getDay + 6) % 7
  const firstDow = new Date(year, month - 1, 1).getDay();
  const offset = (firstDow + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDay = isCurrentMonth ? today.getDate() : -1;

  const cells: Array<{ day: number | null; dow: number }> = [];
  for (let i = 0; i < totalCells; i++) {
    const day = i - offset + 1;
    if (i < offset || day > daysInMonth) {
      cells.push({ day: null, dow: i % 7 });
    } else {
      cells.push({ day, dow: i % 7 });
    }
  }

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        image={{
          src: "/real/diseno-17.jpg",
          alt:
            locale === "es"
              ? "Calendario de eventos en Finca La Clementina"
              : "Finca La Clementina event calendar",
        }}
      />

      <section className="py-24 sm:py-32">
        <Container>
          {/* Header con navegación */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-2">
                {year}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-clementina-800">
                {monthName}
              </h2>
            </div>
            <div className="flex gap-2">
              <Link
                href={prevHref}
                aria-label={t.prevMonth}
                className="w-11 h-11 rounded-full border border-clementina-200 bg-cream-50 hover:bg-clementina-800 hover:text-cream-50 hover:border-clementina-800 font-sans text-base text-clementina-800 transition-colors flex items-center justify-center"
              >
                ←
              </Link>
              <Link
                href={nextHref}
                aria-label={t.nextMonth}
                className="w-11 h-11 rounded-full border border-clementina-200 bg-cream-50 hover:bg-clementina-800 hover:text-cream-50 hover:border-clementina-800 font-sans text-base text-clementina-800 transition-colors flex items-center justify-center"
              >
                →
              </Link>
            </div>
          </div>

          {/* Urgencia */}
          {stats.weekendOccupancyPercent >= 50 && stats.weekendOccupied > 0 && (
            <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-display text-lg text-amber-900 leading-tight">
                  {t.urgency(
                    stats.weekendOccupancyPercent,
                    stats.weekendOccupied,
                    stats.weekendDays,
                  )}
                </p>
                <p className="font-sans text-sm text-amber-800/80 mt-1">
                  {locale === "es"
                    ? "Te recomendamos asegurar tu fecha pronto."
                    : "We recommend securing your date soon."}
                </p>
              </div>
            </div>
          )}

          {/* Calendario */}
          <div className="grid grid-cols-7 gap-2 max-w-3xl mx-auto">
            {WEEKDAYS[locale].map((d, i) => (
              <div
                key={i}
                className="text-center font-sans text-xs uppercase tracking-widest text-clementina-600 py-2"
              >
                {d}
              </div>
            ))}
            {cells.map((cell, i) => {
              if (cell.day == null) {
                return <div key={i} className="aspect-square" />;
              }
              const status = holds[cell.day] ?? "available";
              const isToday = cell.day === todayDay;
              const isWeekend = cell.dow >= 5;

              const baseStyles = "aspect-square rounded-lg border flex flex-col items-center justify-center font-sans text-sm transition-all relative";

              const stateStyles: Record<DayStatus, string> = {
                available: `bg-cream-50 border-clementina-100 text-clementina-800 hover:bg-clementina-100 hover:border-clementina-300 hover:scale-105 cursor-pointer ${isWeekend ? "font-medium" : ""}`,
                hold: "bg-amber-100 border-amber-300 text-amber-900 cursor-help",
                reserved:
                  "bg-clementina-700 border-clementina-800 text-cream-50 cursor-not-allowed",
                blocked:
                  "bg-clementina-100 border-clementina-200 text-clementina-400 line-through cursor-not-allowed",
              };

              const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;

              const className = `${baseStyles} ${stateStyles[status]} ${isToday ? "ring-2 ring-clementina-500 ring-offset-2" : ""}`;

              if (status === "available") {
                const wppMsg =
                  locale === "es"
                    ? `Hola, me interesa la fecha ${dateStr} en Finca La Clementina.`
                    : `Hi, I'm interested in ${dateStr} at Finca La Clementina.`;
                const wppHref = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(wppMsg)}`;
                return (
                  <a
                    key={i}
                    href={wppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                    title={t.quoteButton}
                  >
                    {cell.day}
                  </a>
                );
              }

              const titles: Record<DayStatus, string> = {
                available: "",
                hold: t.holdTooltip,
                reserved: t.reservedTooltip,
                blocked: t.blockedTooltip,
              };

              return (
                <div key={i} className={className} title={titles[status]}>
                  {cell.day}
                </div>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 font-sans text-sm text-clementina-900/70">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-cream-50 border border-clementina-100" />
              {t.legendAvailable}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
              {t.legendHold}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-clementina-700 border border-clementina-800" />
              {t.legendReserved}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-clementina-100 border border-clementina-200" />
              {t.legendBlocked}
            </div>
          </div>

          <p className="font-sans text-sm text-clementina-900/60 italic text-center mt-12 max-w-xl mx-auto">
            {locale === "es"
              ? "Toca un día disponible para pedirnos cotización por WhatsApp con esa fecha pre-seleccionada."
              : "Tap an available day to request a quote via WhatsApp with that date pre-filled."}
          </p>
        </Container>
      </section>
    </>
  );
}
