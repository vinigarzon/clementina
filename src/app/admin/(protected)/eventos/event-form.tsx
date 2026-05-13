"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Label,
  Input,
  Textarea,
  Select,
  Button,
  Field,
  FieldRow,
} from "@/components/admin/ui/form";
import { createEvent, updateEvent } from "./actions";
import { EVENT_STATUSES, type EventStatus } from "@/lib/event-status";

interface EventData {
  id?: string;
  client_id: string | null;
  event_type_id: string | null;
  space_id: string | null;
  title: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  guests: number | null;
  status: EventStatus;
  source: string | null;
  notes_public: string | null;
  notes_internal: string | null;
}

interface Option {
  id: string;
  label: string;
}

const EMPTY: EventData = {
  client_id: null,
  event_type_id: null,
  space_id: null,
  title: "",
  event_date: null,
  start_time: null,
  end_time: null,
  guests: null,
  status: "lead",
  source: "",
  notes_public: "",
  notes_internal: "",
};

const SOURCES = [
  { value: "", label: "(sin especificar)" },
  { value: "web", label: "Sitio web (cotizador)" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "llamada", label: "Llamada telefónica" },
  { value: "visita", label: "Visita a la finca" },
  { value: "referido", label: "Referido" },
  { value: "redes", label: "Redes sociales" },
  { value: "otro", label: "Otro" },
];

interface EventFormProps {
  initial?: EventData;
  clients: Option[];
  eventTypes: Option[];
  spaces: Option[];
}

export function EventForm({
  initial,
  clients,
  eventTypes,
  spaces,
}: EventFormProps) {
  const router = useRouter();
  const [state, setState] = useState<EventData>(initial ?? EMPTY);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();
  const isNew = !initial?.id;

  function set<K extends keyof EventData>(key: K, value: EventData[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    if (!state.title.trim()) {
      setFeedback({ type: "err", msg: "El título del evento es obligatorio." });
      return;
    }

    startTransition(async () => {
      if (isNew) {
        const res = await createEvent(state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateEvent(initial.id, state);
        if (res?.error) {
          setFeedback({ type: "err", msg: res.error });
        } else {
          setFeedback({ type: "ok", msg: "Cambios guardados." });
          router.refresh();
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Datos básicos
        </h2>

        <Field>
          <Label required htmlFor="title">
            Título del evento
          </Label>
          <Input
            id="title"
            value={state.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ej: Boda Mishelle y Byron"
            required
          />
          <p className="font-sans text-xs text-clementina-900/60 mt-1">
            Para identificar internamente. No se muestra al cliente.
          </p>
        </Field>

        <FieldRow>
          <Field>
            <Label htmlFor="event_type_id">Tipo de evento</Label>
            <Select
              id="event_type_id"
              value={state.event_type_id ?? ""}
              onChange={(e) =>
                set("event_type_id", e.target.value || null)
              }
            >
              <option value="">(sin tipo)</option>
              {eventTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor="space_id">Espacio</Label>
            <Select
              id="space_id"
              value={state.space_id ?? ""}
              onChange={(e) => set("space_id", e.target.value || null)}
            >
              <option value="">(por definir)</option>
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Cliente</h2>

        <Field>
          <Label htmlFor="client_id">Cliente asociado</Label>
          <Select
            id="client_id"
            value={state.client_id ?? ""}
            onChange={(e) => set("client_id", e.target.value || null)}
          >
            <option value="">(sin cliente todavía)</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <p className="font-sans text-xs text-clementina-900/60 mt-2">
            ¿No está el cliente en la lista?{" "}
            <Link
              href="/admin/clientes/nuevo"
              target="_blank"
              className="text-clementina-700 underline underline-offset-2 hover:text-clementina-900"
            >
              Crear cliente nuevo
            </Link>{" "}
            (abre en nueva pestaña).
          </p>
        </Field>

        <Field>
          <Label htmlFor="source">Origen del lead</Label>
          <Select
            id="source"
            value={state.source ?? ""}
            onChange={(e) => set("source", e.target.value)}
          >
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Fecha y capacidad
        </h2>

        <FieldRow>
          <Field>
            <Label htmlFor="event_date">Fecha del evento</Label>
            <Input
              id="event_date"
              type="date"
              value={state.event_date ?? ""}
              onChange={(e) => set("event_date", e.target.value || null)}
            />
          </Field>
          <Field>
            <Label htmlFor="guests">Invitados estimados</Label>
            <Input
              id="guests"
              type="number"
              min={0}
              value={state.guests ?? ""}
              onChange={(e) =>
                set(
                  "guests",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </Field>
        </FieldRow>

        <FieldRow>
          <Field>
            <Label htmlFor="start_time">Hora inicio</Label>
            <Input
              id="start_time"
              type="time"
              value={state.start_time ?? ""}
              onChange={(e) => set("start_time", e.target.value || null)}
            />
          </Field>
          <Field>
            <Label htmlFor="end_time">Hora fin</Label>
            <Input
              id="end_time"
              type="time"
              value={state.end_time ?? ""}
              onChange={(e) => set("end_time", e.target.value || null)}
            />
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Estado del evento
        </h2>

        <Field>
          <Label htmlFor="status">Estado</Label>
          <Select
            id="status"
            value={state.status}
            onChange={(e) => set("status", e.target.value as EventStatus)}
          >
            {EVENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label} · {s.description}
              </option>
            ))}
          </Select>
          <p className="font-sans text-xs text-clementina-900/60 mt-1">
            El estado define si la fecha se bloquea en el calendario público.
            Lead y Propuesta no bloquean; Pre-reserva, Reservado y Contratado
            sí.
          </p>
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">Notas</h2>

        <Field>
          <Label htmlFor="notes_internal">
            Notas internas (no visibles al cliente)
          </Label>
          <Textarea
            id="notes_internal"
            value={state.notes_internal ?? ""}
            onChange={(e) => set("notes_internal", e.target.value)}
            placeholder="Observaciones del equipo comercial, alertas, requisitos especiales..."
          />
        </Field>

        <Field>
          <Label htmlFor="notes_public">
            Notas públicas (pueden aparecer en cotización)
          </Label>
          <Textarea
            id="notes_public"
            value={state.notes_public ?? ""}
            onChange={(e) => set("notes_public", e.target.value)}
            placeholder="Información que el cliente puede ver."
          />
        </Field>
      </div>

      {feedback && (
        <div
          className={`px-5 py-3 rounded-lg font-sans text-sm ${
            feedback.type === "ok"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Guardando..."
            : isNew
              ? "Crear evento"
              : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/eventos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
