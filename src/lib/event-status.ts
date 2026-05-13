/**
 * Estados del ciclo de vida de un evento.
 * Define etiquetas, colores y qué estados representan una fecha bloqueada
 * en el calendario.
 */

export type EventStatus =
  | "lead"
  | "propuesta"
  | "hold"
  | "reservado"
  | "contratado"
  | "en_ejecucion"
  | "cerrado"
  | "cancelado";

export interface EventStatusMeta {
  value: EventStatus;
  label: string;
  description: string;
  /** Color para badges (clases Tailwind). */
  badgeClass: string;
  /** Mapeo al estado del calendario público. null = no bloquea fecha. */
  calendarStatus: "hold" | "reserved" | "blocked" | null;
}

export const EVENT_STATUS_META: Record<EventStatus, EventStatusMeta> = {
  lead: {
    value: "lead",
    label: "Lead",
    description: "Solicitud inicial sin compromiso.",
    badgeClass: "bg-slate-100 text-slate-700",
    calendarStatus: null,
  },
  propuesta: {
    value: "propuesta",
    label: "Propuesta enviada",
    description: "Cotización enviada al cliente.",
    badgeClass: "bg-blue-100 text-blue-800",
    calendarStatus: null,
  },
  hold: {
    value: "hold",
    label: "Pre-reserva",
    description: "Fecha tentativamente bloqueada esperando confirmación.",
    badgeClass: "bg-amber-100 text-amber-800",
    calendarStatus: "hold",
  },
  reservado: {
    value: "reservado",
    label: "Reservado",
    description: "Anticipo recibido y fecha bloqueada.",
    badgeClass: "bg-emerald-100 text-emerald-800",
    calendarStatus: "reserved",
  },
  contratado: {
    value: "contratado",
    label: "Contratado",
    description: "Contrato firmado, pagos en curso.",
    badgeClass: "bg-clementina-700 text-cream-50",
    calendarStatus: "reserved",
  },
  en_ejecucion: {
    value: "en_ejecucion",
    label: "En ejecución",
    description: "El evento está ocurriendo o se ejecuta hoy.",
    badgeClass: "bg-purple-100 text-purple-800",
    calendarStatus: "reserved",
  },
  cerrado: {
    value: "cerrado",
    label: "Cerrado",
    description: "Evento terminado, costos cerrados.",
    badgeClass: "bg-gray-200 text-gray-700",
    calendarStatus: null,
  },
  cancelado: {
    value: "cancelado",
    label: "Cancelado",
    description: "Evento cancelado, fecha liberada.",
    badgeClass: "bg-red-100 text-red-700",
    calendarStatus: null,
  },
};

export const EVENT_STATUSES = Object.values(EVENT_STATUS_META);

export const ACTIVE_STATUSES: EventStatus[] = [
  "lead",
  "propuesta",
  "hold",
  "reservado",
  "contratado",
  "en_ejecucion",
];
