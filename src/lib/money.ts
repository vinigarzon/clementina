/**
 * Helpers de formato monetario.
 */

export function formatMoney(
  value: number | null | undefined,
  currency = "USD",
): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-EC").format(value);
}

/**
 * Calcula los totales de una cotización a partir de las líneas.
 */
export interface QuoteTotalsInput {
  lines: { quantity: number; unit_price: number }[];
  discount: number;
  tax_rate: number;
}

export interface QuoteTotals {
  subtotal: number;
  discount: number;
  taxable_base: number;
  tax: number;
  total: number;
}

export function calcQuoteTotals(input: QuoteTotalsInput): QuoteTotals {
  const subtotal = input.lines.reduce(
    (acc, l) => acc + l.quantity * l.unit_price,
    0,
  );
  const taxable_base = Math.max(0, subtotal - input.discount);
  const tax = (taxable_base * input.tax_rate) / 100;
  const total = taxable_base + tax;
  return {
    subtotal: round2(subtotal),
    discount: round2(input.discount),
    taxable_base: round2(taxable_base),
    tax: round2(tax),
    total: round2(total),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
