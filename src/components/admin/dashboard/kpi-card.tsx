import Link from "next/link";
import type { KpiValue } from "@/lib/data/dashboard";

interface KpiCardProps {
  label: string;
  value: KpiValue;
  /** Cómo formatear el número: moneda USD, número entero, porcentaje. */
  format?: "currency" | "number" | "percent";
  /** Acompañamiento textual debajo del número. */
  hint?: string;
  /** Si se pasa, la card es un Link al destino. */
  href?: string;
  /** Indica si un delta positivo es bueno (default true). */
  upIsGood?: boolean;
}

export function KpiCard({
  label,
  value,
  format = "number",
  hint,
  href,
  upIsGood = true,
}: KpiCardProps) {
  const display = formatValue(value.current, format);
  const showDelta = value.deltaPct !== null;
  const positive = (value.deltaPct ?? 0) >= 0;
  const goodDirection = upIsGood ? positive : !positive;

  const inner = (
    <div className="h-full p-6 rounded-2xl bg-white border border-clementina-100 hover:border-clementina-300 hover:shadow-md transition-all">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-clementina-600 mb-3">
        {label}
      </p>
      <p className="font-display text-4xl text-clementina-900 leading-none mb-3">
        {display}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {showDelta && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
              goodDirection
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <span aria-hidden="true">{positive ? "▲" : "▼"}</span>
            {formatPercent(Math.abs(value.deltaPct!))}
          </span>
        )}
        {hint && (
          <span className="font-sans text-xs text-clementina-900/55">
            {hint}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

function formatValue(n: number, fmt: "currency" | "number" | "percent"): string {
  if (fmt === "currency") {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }
  if (fmt === "percent") {
    return `${n.toFixed(1)}%`;
  }
  return new Intl.NumberFormat("es-EC").format(n);
}

function formatPercent(n: number): string {
  if (n >= 10) return `${n.toFixed(0)}%`;
  return `${(n * 100).toFixed(0)}%`;
}
