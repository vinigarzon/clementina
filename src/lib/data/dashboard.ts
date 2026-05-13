/**
 * Data layer del dashboard del admin.
 * Calcula todos los KPIs y series temporales en paralelo desde Supabase.
 *
 * Nota: muchas tablas comerciales son nuevas (migración 0008) y los tipos
 * generados todavía no las incluyen, por eso usamos `as any` puntualmente.
 * Cuando regeneremos los tipos quitamos esos casts.
 */
import { createClient } from "@/lib/supabase/server";

// ============ RANGOS DE FECHA ============

export type DashboardRange = "week" | "month" | "quarter" | "year" | "ytd";

export interface DateRange {
  start: Date;
  end: Date;
  /** Periodo anterior del mismo tamaño, para calcular deltas. */
  prevStart: Date;
  prevEnd: Date;
  label: string;
}

export function resolveRange(range: DashboardRange): DateRange {
  const now = new Date();
  const end = endOfDay(now);
  let start: Date;
  let label: string;

  switch (range) {
    case "week": {
      start = startOfDay(new Date(now));
      start.setDate(start.getDate() - 6); // últimos 7 días incluyendo hoy
      label = "Últimos 7 días";
      break;
    }
    case "quarter": {
      start = startOfDay(new Date(now));
      start.setMonth(start.getMonth() - 2);
      start.setDate(1);
      label = "Últimos 3 meses";
      break;
    }
    case "year": {
      start = startOfDay(new Date(now));
      start.setFullYear(start.getFullYear() - 1);
      start.setDate(start.getDate() + 1);
      label = "Últimos 12 meses";
      break;
    }
    case "ytd": {
      start = new Date(now.getFullYear(), 0, 1);
      label = "Año en curso";
      break;
    }
    case "month":
    default: {
      start = startOfDay(new Date(now));
      start.setDate(start.getDate() - 29);
      label = "Últimos 30 días";
      break;
    }
  }

  const ms = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - ms);

  return { start, end, prevStart, prevEnd, label };
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function iso(d: Date): string {
  return d.toISOString();
}
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ============ TIPOS DE SALIDA ============

export interface KpiValue {
  current: number;
  previous: number;
  /** Delta porcentual (current - previous) / previous. Null si previous=0. */
  deltaPct: number | null;
}

export interface MonthlyPoint {
  month: string; // 'YYYY-MM'
  label: string; // 'mar 2026'
  value: number;
}

export interface CashflowPoint {
  month: string;
  label: string;
  ingresos: number;
  egresos: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  event_date: string | null;
  status: string;
  guests: number | null;
  client_name: string | null;
  event_type: string | null;
  space: string | null;
}

export interface RecentLead {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  event_type_slug: string | null;
  desired_date: string | null;
  guests: number | null;
  status: string;
  created_at: string;
}

export interface PendingCollection {
  id: string;
  event_id: string;
  event_title: string | null;
  client_name: string | null;
  installment_label: string | null;
  amount: number;
  due_date: string | null;
  days_left: number | null;
}

export interface FunnelStage {
  stage: string;
  count: number;
  value: number;
}

export interface RevenueByType {
  type: string;
  revenue: number;
  count: number;
}

export interface ContentStats {
  gallery: { total: number; published: number; untagged: number };
  blog: { total: number; published: number; drafts: number };
  eventTypes: { total: number; published: number };
  team: { total: number; published: number };
}

export interface DashboardData {
  range: DateRange;
  rangeKey: DashboardRange;
  // KPIs principales
  revenue: KpiValue;
  pipelineValue: KpiValue;
  newLeads: KpiValue;
  upcomingEventsCount: KpiValue;
  conversionRate: KpiValue; // % leads→cliente
  pendingCollectionsAmount: KpiValue;
  // Gráficos
  leadsTrend: MonthlyPoint[];
  revenueByType: RevenueByType[];
  pipelineFunnel: FunnelStage[];
  cashflow: CashflowPoint[];
  // Listas
  upcomingEvents: UpcomingEvent[];
  recentLeads: RecentLead[];
  pendingCollections: PendingCollection[];
  // Contenido
  content: ContentStats;
}

// ============ HELPERS ============

function delta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return (current - previous) / previous;
}

function safeSum(rows: Array<Record<string, unknown>> | null, key: string): number {
  if (!rows) return 0;
  return rows.reduce((acc, r) => {
    const v = r[key];
    return acc + (typeof v === "number" ? v : Number(v) || 0);
  }, 0);
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(d: Date): string {
  return d.toLocaleDateString("es-EC", { month: "short", year: "2-digit" });
}

function buildEmptyMonths(months: number): MonthlyPoint[] {
  const arr: MonthlyPoint[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push({ month: monthKey(d), label: monthLabel(d), value: 0 });
  }
  return arr;
}

function buildEmptyCashflow(months: number): CashflowPoint[] {
  const arr: CashflowPoint[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push({
      month: monthKey(d),
      label: monthLabel(d),
      ingresos: 0,
      egresos: 0,
    });
  }
  return arr;
}

// ============ MAIN FETCHER ============

export async function getDashboardData(
  rangeKey: DashboardRange = "month",
): Promise<DashboardData> {
  const range = resolveRange(rangeKey);
  const supabase = await createClient();

  // Today para "próximos eventos"
  const today = new Date();
  const todayIso = isoDate(today);
  const thirtyDaysAhead = new Date(today);
  thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);

  // Fecha hace 6 meses para series mensuales
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  // Lanzamos todas las queries en paralelo. Cualquier error individual
  // se captura — el dashboard nunca debe romperse por una tabla vacía.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const [
    // 1. payments en periodo actual y anterior (revenue cobrado)
    paymentsNow,
    paymentsPrev,
    // 2. quotes en estado activo (pipeline)
    pipelineQuotes,
    pipelinePrev,
    // 3. leads
    leadsNow,
    leadsPrev,
    leadsLastSixMonths,
    leadsAll,
    // 4. eventos próximos
    upcomingEventsRows,
    upcomingPrevRows,
    upcomingDetailed,
    // 5. cobros pendientes (payment_schedules)
    pendingSchedulesNow,
    pendingSchedulesPrev,
    pendingDetailed,
    // 6. pipeline funnel (eventos por status)
    eventsByStatus,
    // 7. revenue por tipo de evento
    quotesAccepted,
    // 8. cashflow: payments + costs últimos 6 meses
    paymentsLastSix,
    costsLastSix,
    // 9. recent leads
    recentLeadsRows,
    // 10. contenido
    galleryAgg,
    blogAgg,
    eventTypesAgg,
    teamAgg,
  ] = await Promise.all([
    sb.from("payments").select("amount, paid_at")
      .gte("paid_at", iso(range.start))
      .lte("paid_at", iso(range.end)),
    sb.from("payments").select("amount, paid_at")
      .gte("paid_at", iso(range.prevStart))
      .lte("paid_at", iso(range.prevEnd)),

    sb.from("quotes").select("total, status, created_at")
      .in("status", ["enviada", "aceptada"]),
    sb.from("quotes").select("total, status, created_at, issued_at")
      .in("status", ["enviada", "aceptada"])
      .lte("issued_at", iso(range.prevEnd)),

    sb.from("leads").select("id, created_at")
      .gte("created_at", iso(range.start))
      .lte("created_at", iso(range.end)),
    sb.from("leads").select("id, created_at")
      .gte("created_at", iso(range.prevStart))
      .lte("created_at", iso(range.prevEnd)),
    sb.from("leads").select("created_at, status")
      .gte("created_at", iso(sixMonthsAgo)),
    sb.from("leads").select("status, client_id"),

    sb.from("events").select("id, event_date, status")
      .gte("event_date", todayIso)
      .in("status", ["reservado", "contratado", "en_ejecucion", "propuesta"]),
    sb.from("events").select("id, event_date, status")
      .lte("event_date", todayIso)
      .gte("event_date", isoDate(range.prevStart))
      .in("status", ["reservado", "contratado", "en_ejecucion", "propuesta"]),
    sb.from("events")
      .select(
        "id, title, event_date, status, guests, client:clients(full_name), event_type:event_types(title_es), space:spaces(name)",
      )
      .gte("event_date", todayIso)
      .in("status", ["reservado", "contratado", "en_ejecucion", "propuesta"])
      .order("event_date", { ascending: true })
      .limit(10),

    sb.from("payment_schedules").select("amount, due_date, paid")
      .eq("paid", false)
      .lte("due_date", isoDate(thirtyDaysAhead)),
    sb.from("payment_schedules").select("amount, due_date, paid")
      .eq("paid", false)
      .lte("due_date", isoDate(range.prevEnd)),
    sb.from("payment_schedules")
      .select(
        "id, event_id, amount, due_date, label, event:events(title, client:clients(full_name))",
      )
      .eq("paid", false)
      .lte("due_date", isoDate(thirtyDaysAhead))
      .order("due_date", { ascending: true })
      .limit(10),

    sb.from("events").select("status, id"),

    sb.from("quotes")
      .select(
        "total, status, event:events(event_type:event_types(title_es))",
      )
      .eq("status", "aceptada"),

    sb.from("payments").select("amount, paid_at")
      .gte("paid_at", iso(sixMonthsAgo)),
    sb.from("costs").select("amount, cost_date")
      .gte("cost_date", isoDate(sixMonthsAgo)),

    sb.from("leads")
      .select("id, full_name, email, phone, event_type_slug, desired_date, guests, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),

    sb.from("gallery_assets").select("id, tag, published"),
    sb.from("blog_posts").select("id, published"),
    sb.from("event_types").select("id, published"),
    sb.from("team_members").select("id, published"),
  ]);

  // ===== KPI 1: Revenue =====
  const revenueCurrent = safeSum(paymentsNow.data, "amount");
  const revenuePrev = safeSum(paymentsPrev.data, "amount");

  // ===== KPI 2: Pipeline value =====
  const pipelineCurrent = safeSum(pipelineQuotes.data, "total");
  const pipelinePrevTotal = safeSum(pipelinePrev.data, "total");

  // ===== KPI 3: New leads =====
  const newLeadsCount = leadsNow.data?.length ?? 0;
  const newLeadsPrev = leadsPrev.data?.length ?? 0;

  // ===== KPI 4: Upcoming events =====
  const upcomingCount = upcomingEventsRows.data?.length ?? 0;
  const upcomingPrev = upcomingPrevRows.data?.length ?? 0;

  // ===== KPI 5: Conversion rate (leads convertidos / total) =====
  const allLeads = leadsAll.data ?? [];
  const convertedLeads = allLeads.filter(
    (l: { status?: string; client_id?: string | null }) =>
      l.status === "convertido" || !!l.client_id,
  ).length;
  const totalLeads = allLeads.length;
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
  // (no calculamos previous para conversion rate — es una métrica acumulada)

  // ===== KPI 6: Pending collections =====
  const pendingNow = safeSum(pendingSchedulesNow.data, "amount");
  const pendingPrevTotal = safeSum(pendingSchedulesPrev.data, "amount");

  // ===== Gráfico: Leads por mes (últimos 6 meses) =====
  const leadsTrend = buildEmptyMonths(6);
  for (const lead of leadsLastSixMonths.data ?? []) {
    const key = monthKey(new Date((lead as { created_at: string }).created_at));
    const slot = leadsTrend.find((s) => s.month === key);
    if (slot) slot.value += 1;
  }

  // ===== Gráfico: Pipeline funnel =====
  const funnelStages: Array<{ key: string; stage: string }> = [
    { key: "lead", stage: "Lead" },
    { key: "propuesta", stage: "Propuesta" },
    { key: "hold", stage: "Hold" },
    { key: "reservado", stage: "Reservado" },
    { key: "contratado", stage: "Contratado" },
    { key: "en_ejecucion", stage: "En ejecución" },
    { key: "cerrado", stage: "Cerrado" },
  ];
  const pipelineFunnel: FunnelStage[] = funnelStages.map(({ key, stage }) => {
    const rows = (eventsByStatus.data ?? []).filter(
      (r: { status?: string }) => r.status === key,
    );
    return { stage, count: rows.length, value: 0 };
  });

  // ===== Gráfico: Revenue por tipo =====
  const byType = new Map<string, { revenue: number; count: number }>();
  for (const q of quotesAccepted.data ?? []) {
    const qq = q as {
      total?: number;
      event?: { event_type?: { title_es?: string } } | null;
    };
    const type = qq.event?.event_type?.title_es ?? "Sin tipo";
    const cur = byType.get(type) ?? { revenue: 0, count: 0 };
    cur.revenue += Number(qq.total) || 0;
    cur.count += 1;
    byType.set(type, cur);
  }
  const revenueByType: RevenueByType[] = Array.from(byType.entries())
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // ===== Gráfico: Cashflow =====
  const cashflow = buildEmptyCashflow(6);
  for (const p of paymentsLastSix.data ?? []) {
    const pp = p as { paid_at?: string; amount?: number };
    if (!pp.paid_at) continue;
    const key = monthKey(new Date(pp.paid_at));
    const slot = cashflow.find((s) => s.month === key);
    if (slot) slot.ingresos += Number(pp.amount) || 0;
  }
  for (const c of costsLastSix.data ?? []) {
    const cc = c as { cost_date?: string; amount?: number };
    if (!cc.cost_date) continue;
    const key = monthKey(new Date(cc.cost_date));
    const slot = cashflow.find((s) => s.month === key);
    if (slot) slot.egresos += Number(cc.amount) || 0;
  }

  // ===== Listas =====
  const upcomingEvents: UpcomingEvent[] = (upcomingDetailed.data ?? []).map(
    (e: {
      id: string;
      title: string;
      event_date: string | null;
      status: string;
      guests: number | null;
      client?: { full_name?: string } | null;
      event_type?: { title_es?: string } | null;
      space?: { name?: string } | null;
    }) => ({
      id: e.id,
      title: e.title,
      event_date: e.event_date,
      status: e.status,
      guests: e.guests,
      client_name: e.client?.full_name ?? null,
      event_type: e.event_type?.title_es ?? null,
      space: e.space?.name ?? null,
    }),
  );

  const recentLeads: RecentLead[] = (recentLeadsRows.data ?? []).map(
    (l: {
      id: string;
      full_name: string | null;
      email: string | null;
      phone: string | null;
      event_type_slug: string | null;
      desired_date: string | null;
      guests: number | null;
      status: string;
      created_at: string;
    }) => l,
  );

  const pendingCollections: PendingCollection[] = (pendingDetailed.data ?? []).map(
    (s: {
      id: string;
      event_id: string;
      amount: number;
      due_date: string | null;
      label: string | null;
      event?: { title?: string; client?: { full_name?: string } | null } | null;
    }) => {
      const due = s.due_date ? new Date(s.due_date) : null;
      const daysLeft = due
        ? Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      return {
        id: s.id,
        event_id: s.event_id,
        event_title: s.event?.title ?? null,
        client_name: s.event?.client?.full_name ?? null,
        installment_label: s.label,
        amount: Number(s.amount) || 0,
        due_date: s.due_date,
        days_left: daysLeft,
      };
    },
  );

  // ===== Contenido =====
  const galleryRows = (galleryAgg.data ?? []) as Array<{
    tag?: string | null;
    published?: boolean;
  }>;
  const blogRows = (blogAgg.data ?? []) as Array<{ published?: boolean }>;
  const eventTypeRows = (eventTypesAgg.data ?? []) as Array<{ published?: boolean }>;
  const teamRows = (teamAgg.data ?? []) as Array<{ published?: boolean }>;

  const content: ContentStats = {
    gallery: {
      total: galleryRows.length,
      published: galleryRows.filter((r) => r.published).length,
      untagged: galleryRows.filter((r) => !r.tag || r.tag === "finca").length,
    },
    blog: {
      total: blogRows.length,
      published: blogRows.filter((r) => r.published).length,
      drafts: blogRows.filter((r) => !r.published).length,
    },
    eventTypes: {
      total: eventTypeRows.length,
      published: eventTypeRows.filter((r) => r.published).length,
    },
    team: {
      total: teamRows.length,
      published: teamRows.filter((r) => r.published).length,
    },
  };

  return {
    range,
    rangeKey,
    revenue: {
      current: revenueCurrent,
      previous: revenuePrev,
      deltaPct: delta(revenueCurrent, revenuePrev),
    },
    pipelineValue: {
      current: pipelineCurrent,
      previous: pipelinePrevTotal,
      deltaPct: delta(pipelineCurrent, pipelinePrevTotal),
    },
    newLeads: {
      current: newLeadsCount,
      previous: newLeadsPrev,
      deltaPct: delta(newLeadsCount, newLeadsPrev),
    },
    upcomingEventsCount: {
      current: upcomingCount,
      previous: upcomingPrev,
      deltaPct: delta(upcomingCount, upcomingPrev),
    },
    conversionRate: {
      current: conversionRate,
      previous: 0,
      deltaPct: null,
    },
    pendingCollectionsAmount: {
      current: pendingNow,
      previous: pendingPrevTotal,
      deltaPct: delta(pendingNow, pendingPrevTotal),
    },
    leadsTrend,
    revenueByType,
    pipelineFunnel,
    cashflow,
    upcomingEvents,
    recentLeads,
    pendingCollections,
    content,
  };
}
