"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Label,
  Input,
  Select,
  Button,
  Field,
  FieldRow,
  Textarea,
} from "@/components/admin/ui/form";
import { createQuote } from "../actions";

interface EventOption {
  id: string;
  title: string;
  event_date: string | null;
  client_id: string | null;
  client_name: string | null;
}

interface ClientOption {
  id: string;
  label: string;
}

interface NewQuoteFormProps {
  events: EventOption[];
  clients: ClientOption[];
  prefilled: { id: string; client_id: string | null } | null;
}

export function NewQuoteForm({
  events,
  clients,
  prefilled,
}: NewQuoteFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [eventId, setEventId] = useState<string>(prefilled?.id ?? "");
  const [clientId, setClientId] = useState<string>(prefilled?.client_id ?? "");
  const [validUntil, setValidUntil] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [taxRate, setTaxRate] = useState<number>(0);
  const [notesPublic, setNotesPublic] = useState<string>("");
  const [notesInternal, setNotesInternal] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === eventId) ?? null,
    [events, eventId],
  );

  function handleEventChange(value: string) {
    setEventId(value);
    const ev = events.find((e) => e.id === value);
    if (ev?.client_id) setClientId(ev.client_id);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createQuote({
        event_id: eventId || null,
        client_id: clientId || null,
        valid_until: validUntil || null,
        tax_rate: taxRate,
        origin: "manual",
        notes_public: notesPublic || null,
        notes_internal: notesInternal || null,
      });
      if (res?.error) {
        setError(res.error);
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Vinculación
        </h2>

        <Field>
          <Label htmlFor="event_id">Evento (opcional)</Label>
          <Select
            id="event_id"
            value={eventId}
            onChange={(e) => handleEventChange(e.target.value)}
          >
            <option value="">(sin evento — cotización standalone)</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
                {e.event_date ? ` · ${e.event_date}` : ""}
                {e.client_name ? ` · ${e.client_name}` : ""}
              </option>
            ))}
          </Select>
          <p className="font-sans text-xs text-clementina-900/60 mt-1">
            Si vinculas a un evento, el cliente se autocompleta. Recomendado.
          </p>
        </Field>

        <Field>
          <Label htmlFor="client_id">Cliente</Label>
          <Select
            id="client_id"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">(sin cliente — definir después)</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          {selectedEvent && selectedEvent.client_id && (
            <p className="font-sans text-xs text-clementina-900/60 mt-1">
              Heredado del evento seleccionado.
            </p>
          )}
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Vigencia e impuesto
        </h2>

        <FieldRow>
          <Field>
            <Label htmlFor="valid_until">Vigencia hasta</Label>
            <Input
              id="valid_until"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
            <p className="font-sans text-xs text-clementina-900/60 mt-1">
              Por defecto 30 días desde hoy.
            </p>
          </Field>
          <Field>
            <Label htmlFor="tax_rate">IVA (%)</Label>
            <Input
              id="tax_rate"
              type="number"
              step="0.01"
              min="0"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
            />
            <p className="font-sans text-xs text-clementina-900/60 mt-1">
              Ecuador: 15% (estándar). Deja 0 si no aplica.
            </p>
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-xl text-clementina-800">
          Notas iniciales (opcional)
        </h2>
        <Field>
          <Label htmlFor="notes_public">Para el cliente</Label>
          <Textarea
            id="notes_public"
            value={notesPublic}
            onChange={(e) => setNotesPublic(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="notes_internal">Internas</Label>
          <Textarea
            id="notes_internal"
            value={notesInternal}
            onChange={(e) => setNotesInternal(e.target.value)}
          />
        </Field>
      </div>

      {error && (
        <div className="px-5 py-3 rounded-lg bg-red-50 text-red-800 border border-red-200 font-sans text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Creando..." : "Crear cotización y abrir editor"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/cotizaciones")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
