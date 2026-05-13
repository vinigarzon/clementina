import { createClient } from "@/lib/supabase/server";

export type DayStatus = "available" | "hold" | "reserved" | "blocked";

const STATUS_PRIORITY: Record<DayStatus, number> = {
  available: 0,
  hold: 1,
  blocked: 2,
  reserved: 3,
};

/**
 * Devuelve un mapa { día (1-31) → estado } para el mes indicado.
 * `month` es 1-12.
 */
export async function getMonthHolds(
  year: number,
  month: number,
): Promise<Record<number, DayStatus>> {
  const supabase = await createClient();
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = new Date(year, month, 1); // month es 1-12 → siguiente mes
  const end = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("date_holds")
    .select("hold_date, status")
    .gte("hold_date", start)
    .lt("hold_date", end);

  if (error) {
    console.error("[getMonthHolds]", error);
    return {};
  }

  const map: Record<number, DayStatus> = {};
  (data ?? []).forEach((h) => {
    const day = parseInt(h.hold_date.slice(8, 10), 10);
    const status = h.status as DayStatus;
    const current = map[day] ?? "available";
    if (STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
      map[day] = status;
    }
  });
  return map;
}

/**
 * Devuelve estadísticas del mes para el sentido de urgencia.
 */
export interface MonthStats {
  totalDays: number;
  weekendDays: number;
  weekendOccupied: number;
  monthOccupied: number;
  weekendOccupancyPercent: number;
}

export function calculateMonthStats(
  year: number,
  month: number,
  holds: Record<number, DayStatus>,
): MonthStats {
  const daysInMonth = new Date(year, month, 0).getDate();
  let weekendDays = 0;
  let weekendOccupied = 0;
  let monthOccupied = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const status = holds[day] ?? "available";
    const dow = new Date(year, month - 1, day).getDay();
    const isWeekend = dow === 0 || dow === 6; // domingo o sábado

    if (status !== "available") {
      monthOccupied++;
      if (isWeekend) weekendOccupied++;
    }
    if (isWeekend) weekendDays++;
  }

  return {
    totalDays: daysInMonth,
    weekendDays,
    weekendOccupied,
    monthOccupied,
    weekendOccupancyPercent:
      weekendDays === 0 ? 0 : Math.round((weekendOccupied / weekendDays) * 100),
  };
}
