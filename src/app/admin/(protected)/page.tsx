import Link from "next/link";
import {
  getDashboardData,
  type DashboardRange,
} from "@/lib/data/dashboard";
import { KpiCard } from "@/components/admin/dashboard/kpi-card";
import { DateRangePicker } from "@/components/admin/dashboard/date-range-picker";
import { SectionCard } from "@/components/admin/dashboard/section-card";
import {
  LeadsTrendChart,
  RevenueByTypeChart,
  PipelineFunnelChart,
  CashflowChart,
} from "@/components/admin/dashboard/charts";
import {
  UpcomingEventsList,
  RecentLeadsList,
  PendingCollectionsList,
} from "@/components/admin/dashboard/lists";

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

const VALID_RANGES: DashboardRange[] = ["week", "month", "quarter", "year", "ytd"];

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rangeKey: DashboardRange =
    params.range && VALID_RANGES.includes(params.range as DashboardRange)
      ? (params.range as DashboardRange)
      : "month";

  const data = await getDashboardData(rangeKey);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-clementina-600 mb-2">
            Dashboard
          </p>
          <h1 className="font-display text-4xl text-clementina-900 leading-tight">
            Resumen del negocio
          </h1>
          <p className="font-sans text-sm text-clementina-900/65 mt-2">
            {data.range.label} · {fmtRange(data.range.start, data.range.end)}
          </p>
        </div>
        <DateRangePicker current={rangeKey} />
      </header>

      {/* FILA 1 — KPIs principales */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          label="Revenue cobrado"
          value={data.revenue}
          format="currency"
          hint="vs. periodo anterior"
        />
        <KpiCard
          label="Pipeline activo"
          value={data.pipelineValue}
          format="currency"
          hint="cotizaciones abiertas"
          href="/admin/cotizaciones"
        />
        <KpiCard
          label="Eventos próximos"
          value={data.upcomingEventsCount}
          format="number"
          hint="confirmados o por confirmar"
          href="/admin/eventos"
        />
        <KpiCard
          label="Leads nuevos"
          value={data.newLeads}
          format="number"
          hint="vs. periodo anterior"
          href="/admin/leads"
        />
        <KpiCard
          label="Conversión leads"
          value={data.conversionRate}
          format="percent"
          hint="todos los tiempos"
        />
        <KpiCard
          label="Por cobrar (30 días)"
          value={data.pendingCollectionsAmount}
          format="currency"
          hint="cuotas no pagadas"
          upIsGood={false}
        />
      </section>

      {/* FILA 2 — Pipeline funnel + Leads trend */}
      <section className="grid lg:grid-cols-2 gap-5">
        <SectionCard
          eyebrow="Pipeline comercial"
          title="Eventos por estado"
          subtitle="Cómo se mueve la cartera por la pipa"
          action={{ label: "Ver eventos", href: "/admin/eventos" }}
        >
          <PipelineFunnelChart data={data.pipelineFunnel} />
        </SectionCard>

        <SectionCard
          eyebrow="Captación"
          title="Leads por mes"
          subtitle="Solicitudes recibidas en los últimos 6 meses"
          action={{ label: "Ver leads", href: "/admin/leads" }}
        >
          <LeadsTrendChart data={data.leadsTrend} />
        </SectionCard>
      </section>

      {/* FILA 3 — Próximos eventos + Revenue por tipo */}
      <section className="grid lg:grid-cols-5 gap-5">
        <SectionCard
          className="lg:col-span-3"
          eyebrow="Operación"
          title="Próximos eventos"
          subtitle="Lo que viene en los próximos días"
          action={{ label: "Calendario", href: "/admin/eventos" }}
        >
          <UpcomingEventsList events={data.upcomingEvents} />
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          eyebrow="Mix comercial"
          title="Revenue por tipo de evento"
          subtitle="Cotizaciones aceptadas, todos los tiempos"
        >
          <RevenueByTypeChart data={data.revenueByType} />
        </SectionCard>
      </section>

      {/* FILA 4 — Cashflow + Cobros pendientes */}
      <section className="grid lg:grid-cols-5 gap-5">
        <SectionCard
          className="lg:col-span-3"
          eyebrow="Financiero"
          title="Cashflow mensual"
          subtitle="Ingresos vs. egresos, últimos 6 meses"
        >
          <CashflowChart data={data.cashflow} />
        </SectionCard>

        <SectionCard
          className="lg:col-span-2"
          eyebrow="Por cobrar"
          title="Cuotas próximas"
          subtitle="Vencimientos en los próximos 30 días"
          action={{ label: "Ver pagos", href: "/admin/pagos" }}
        >
          <PendingCollectionsList items={data.pendingCollections} />
        </SectionCard>
      </section>

      {/* FILA 5 — Leads recientes */}
      <SectionCard
        eyebrow="Bandeja"
        title="Leads recientes"
        subtitle="Los últimos 10 leads recibidos desde el sitio o canal directo"
        action={{ label: "Ver todos", href: "/admin/leads" }}
      >
        <RecentLeadsList leads={data.recentLeads} />
      </SectionCard>

      {/* FILA 6 — Contenido */}
      <section>
        <header className="mb-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-clementina-600 mb-1">
            Contenido del sitio
          </p>
          <h2 className="font-display text-xl text-clementina-900">
            Lo que ve el visitante
          </h2>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ContentCard
            title="Galería"
            count={data.content.gallery.total}
            label="imágenes"
            sub={`${data.content.gallery.published} publicadas · ${data.content.gallery.untagged} sin tag específico`}
            href="/admin/galeria"
          />
          <ContentCard
            title="Tipos de evento"
            count={data.content.eventTypes.total}
            label="categorías"
            sub={`${data.content.eventTypes.published} publicadas`}
            href="/admin/tipos-de-eventos"
          />
          <ContentCard
            title="Blog"
            count={data.content.blog.total}
            label="posts"
            sub={`${data.content.blog.published} publicados · ${data.content.blog.drafts} borradores`}
            href="/admin/blog"
          />
          <ContentCard
            title="Equipo"
            count={data.content.team.total}
            label="miembros"
            sub={`${data.content.team.published} publicados`}
            href="/admin/equipo"
          />
        </div>
      </section>
    </div>
  );
}

function ContentCard({
  title,
  count,
  label,
  sub,
  href,
}: {
  title: string;
  count: number;
  label: string;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block p-5 rounded-2xl bg-white border border-clementina-100 hover:border-clementina-300 hover:shadow-md transition-all"
    >
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-clementina-600 mb-2">
        {title}
      </p>
      <p className="font-display text-3xl text-clementina-900 leading-none">
        {count}
      </p>
      <p className="font-sans text-[11px] uppercase tracking-widest text-clementina-900/50 mt-1">
        {label}
      </p>
      <p className="font-sans text-xs text-clementina-900/65 mt-3 leading-snug">
        {sub}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 font-sans text-xs uppercase tracking-widest text-clementina-700 group-hover:text-clementina-900">
        Administrar
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function fmtRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}
