export type QuoteStatus =
  | "borrador"
  | "enviada"
  | "aceptada"
  | "rechazada"
  | "expirada";

export interface QuoteStatusMeta {
  value: QuoteStatus;
  label: string;
  badgeClass: string;
  description: string;
}

export const QUOTE_STATUS_META: Record<QuoteStatus, QuoteStatusMeta> = {
  borrador: {
    value: "borrador",
    label: "Borrador",
    badgeClass: "bg-slate-100 text-slate-700",
    description: "En construcción, no se ha enviado al cliente.",
  },
  enviada: {
    value: "enviada",
    label: "Enviada",
    badgeClass: "bg-blue-100 text-blue-800",
    description: "Cotización enviada al cliente, esperando respuesta.",
  },
  aceptada: {
    value: "aceptada",
    label: "Aceptada",
    badgeClass: "bg-emerald-100 text-emerald-800",
    description: "Cliente aprobó la cotización.",
  },
  rechazada: {
    value: "rechazada",
    label: "Rechazada",
    badgeClass: "bg-red-100 text-red-700",
    description: "Cliente rechazó o no respondió.",
  },
  expirada: {
    value: "expirada",
    label: "Expirada",
    badgeClass: "bg-amber-100 text-amber-800",
    description: "Pasó la vigencia sin respuesta.",
  },
};

export const QUOTE_STATUSES = Object.values(QUOTE_STATUS_META);
