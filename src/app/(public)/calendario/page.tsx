import type { Metadata } from "next";
import {
  getMonthHolds,
  calculateMonthStats,
} from "@/lib/data/date-holds";
import { CalendarView } from "./calendar-view";

export const metadata: Metadata = {
  title: "Calendario de disponibilidad",
  description:
    "Consulta qué fechas están disponibles para tu evento en Finca La Clementina.",
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ m?: string }>;
}

function parseMonth(value: string | undefined): { year: number; month: number } {
  const now = new Date();
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    const [y, m] = value.split("-").map(Number);
    if (m >= 1 && m <= 12) return { year: y, month: m };
  }
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1 + delta, 1);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
  };
}

export default async function CalendarioPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { year, month } = parseMonth(params.m);

  const holds = await getMonthHolds(year, month);
  const stats = calculateMonthStats(year, month, holds);

  const prev = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);

  return (
    <CalendarView
      year={year}
      month={month}
      holds={holds}
      stats={stats}
      prevHref={`/calendario?m=${prev.year}-${String(prev.month).padStart(2, "0")}`}
      nextHref={`/calendario?m=${next.year}-${String(next.month).padStart(2, "0")}`}
    />
  );
}
