"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import type {
  MonthlyPoint,
  CashflowPoint,
  RevenueByType,
  FunnelStage,
} from "@/lib/data/dashboard";

const COLORS = {
  primary: "#2E4A3A",
  primaryLight: "#5B7A52",
  accent: "#C58C42",
  cream: "#FBF9F4",
  rose: "#B45355",
  grid: "#E5E7EB",
  text: "#1F2F1D",
  muted: "#6B7C66",
};

const CHART_FONT = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: 11,
};

function fmtUSD(n: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ============ LEADS TREND ============

export function LeadsTrendChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <EmptyChart label="Aún no hay leads en este periodo" />;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={COLORS.muted} style={CHART_FONT} tickLine={false} axisLine={false} />
        <YAxis stroke={COLORS.muted} style={CHART_FONT} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: "white",
            border: `1px solid ${COLORS.grid}`,
            borderRadius: 8,
            ...CHART_FONT,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name="Leads"
          stroke={COLORS.primary}
          strokeWidth={2.5}
          dot={{ r: 4, fill: COLORS.primary }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============ REVENUE BY TYPE ============

export function RevenueByTypeChart({ data }: { data: RevenueByType[] }) {
  if (data.length === 0)
    return <EmptyChart label="Aún no hay cotizaciones aceptadas" />;

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke={COLORS.muted} style={CHART_FONT} tickLine={false} axisLine={false} tickFormatter={fmtUSD} />
        <YAxis
          type="category"
          dataKey="type"
          stroke={COLORS.muted}
          style={CHART_FONT}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          formatter={(v) => fmtUSD(Number(v))}
          contentStyle={{
            background: "white",
            border: `1px solid ${COLORS.grid}`,
            borderRadius: 8,
            ...CHART_FONT,
          }}
        />
        <Bar dataKey="revenue" name="Revenue" fill={COLORS.primary} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============ PIPELINE FUNNEL ============

const FUNNEL_COLORS = [
  "#7B9472",
  "#5B7A52",
  "#4A6943",
  "#3D5938",
  "#2E4A3A",
  "#243B2D",
  "#1F2F1D",
];

export function PipelineFunnelChart({ data }: { data: FunnelStage[] }) {
  const total = data.reduce((acc, s) => acc + s.count, 0);
  if (total === 0) return <EmptyChart label="Aún no hay eventos en pipeline" />;

  return (
    <ResponsiveContainer width="100%" height={Math.max(240, data.length * 38)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke={COLORS.muted} style={CHART_FONT} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="stage"
          stroke={COLORS.muted}
          style={CHART_FONT}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip
          contentStyle={{
            background: "white",
            border: `1px solid ${COLORS.grid}`,
            borderRadius: 8,
            ...CHART_FONT,
          }}
        />
        <Bar dataKey="count" name="Eventos" radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============ CASHFLOW ============

export function CashflowChart({ data }: { data: CashflowPoint[] }) {
  const hasData = data.some((d) => d.ingresos > 0 || d.egresos > 0);
  if (!hasData)
    return <EmptyChart label="Aún no hay movimientos financieros registrados" />;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke={COLORS.muted} style={CHART_FONT} tickLine={false} axisLine={false} />
        <YAxis stroke={COLORS.muted} style={CHART_FONT} tickLine={false} axisLine={false} tickFormatter={fmtUSD} />
        <Tooltip
          formatter={(v) => fmtUSD(Number(v))}
          contentStyle={{
            background: "white",
            border: `1px solid ${COLORS.grid}`,
            borderRadius: 8,
            ...CHART_FONT,
          }}
        />
        <Legend wrapperStyle={CHART_FONT} />
        <Bar dataKey="ingresos" name="Ingresos" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
        <Bar dataKey="egresos" name="Egresos" fill={COLORS.accent} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============ EMPTY STATE ============

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[200px] flex items-center justify-center rounded-xl border border-dashed border-clementina-200 bg-cream-50/40">
      <p className="font-sans text-sm text-clementina-900/55 italic px-4 text-center">
        {label}
      </p>
    </div>
  );
}
