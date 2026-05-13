"use client";

import { useState, useTransition } from "react";
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
import { createClientRecord, updateClientRecord } from "./actions";

interface ClientData {
  id?: string;
  full_name: string;
  identification_type: string | null;
  identification: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  birthday: string | null;
  source: string | null;
  notes: string | null;
  marketing_consent: boolean;
}

const EMPTY: ClientData = {
  full_name: "",
  identification_type: "cedula",
  identification: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  country: "Ecuador",
  birthday: "",
  source: "",
  notes: "",
  marketing_consent: false,
};

const SOURCES = [
  { value: "", label: "(sin especificar)" },
  { value: "web", label: "Sitio web" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referido", label: "Referido" },
  { value: "redes", label: "Redes sociales" },
  { value: "evento-previo", label: "Evento previo en la finca" },
  { value: "llamada", label: "Llamada telefónica" },
  { value: "visita", label: "Visita a la finca" },
  { value: "otro", label: "Otro" },
];

export function ClientForm({ initial }: { initial?: ClientData }) {
  const router = useRouter();
  const [state, setState] = useState<ClientData>(initial ?? EMPTY);
  const [feedback, setFeedback] = useState<{
    type: "ok" | "err";
    msg: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  const isNew = !initial?.id;

  function set<K extends keyof ClientData>(key: K, value: ClientData[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!state.full_name.trim()) {
      setFeedback({ type: "err", msg: "El nombre completo es obligatorio." });
      return;
    }

    startTransition(async () => {
      if (isNew) {
        const res = await createClientRecord(state);
        if (res?.error) setFeedback({ type: "err", msg: res.error });
      } else if (initial?.id) {
        const res = await updateClientRecord(initial.id, state);
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
          Identidad
        </h2>

        <Field>
          <Label required htmlFor="full_name">
            Nombre completo
          </Label>
          <Input
            id="full_name"
            value={state.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            required
            autoComplete="name"
          />
        </Field>

        <FieldRow>
          <Field>
            <Label htmlFor="identification_type">Tipo de identificación</Label>
            <Select
              id="identification_type"
              value={state.identification_type ?? ""}
              onChange={(e) => set("identification_type", e.target.value || null)}
            >
              <option value="">(sin especificar)</option>
              <option value="cedula">Cédula</option>
              <option value="ruc">RUC</option>
              <option value="pasaporte">Pasaporte</option>
            </Select>
          </Field>
          <Field>
            <Label htmlFor="identification">Número</Label>
            <Input
              id="identification"
              value={state.identification ?? ""}
              onChange={(e) => set("identification", e.target.value)}
            />
          </Field>
        </FieldRow>

        <Field>
          <Label htmlFor="birthday">Fecha de cumpleaños</Label>
          <Input
            id="birthday"
            type="date"
            value={state.birthday ?? ""}
            onChange={(e) => set("birthday", e.target.value)}
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Contacto</h2>

        <FieldRow>
          <Field>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={state.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              value={state.phone ?? ""}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
              placeholder="+593..."
            />
          </Field>
        </FieldRow>

        <Field>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            value={state.whatsapp ?? ""}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="+593... (puede ser el mismo número que el teléfono)"
          />
        </Field>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">Ubicación</h2>

        <Field>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            value={state.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
            autoComplete="street-address"
          />
        </Field>

        <FieldRow>
          <Field>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={state.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
              autoComplete="address-level2"
            />
          </Field>
          <Field>
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={state.country ?? ""}
              onChange={(e) => set("country", e.target.value)}
            />
          </Field>
        </FieldRow>
      </div>

      <div className="bg-white rounded-2xl border border-clementina-100 p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-xl text-clementina-800">
          Origen y notas
        </h2>

        <Field>
          <Label htmlFor="source">¿Cómo nos conoció?</Label>
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

        <Field>
          <Label htmlFor="notes">Notas internas</Label>
          <Textarea
            id="notes"
            value={state.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Información relevante para el equipo comercial..."
          />
        </Field>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={state.marketing_consent}
            onChange={(e) => set("marketing_consent", e.target.checked)}
            className="w-5 h-5 mt-0.5 accent-clementina-700"
          />
          <span className="font-sans text-sm text-clementina-900/85 leading-relaxed">
            El cliente aceptó recibir comunicaciones de marketing (LOPDP).
            <br />
            <span className="text-xs text-clementina-900/60">
              Solo marca esta casilla si tienes constancia explícita.
            </span>
          </span>
        </label>
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
          {pending ? "Guardando..." : isNew ? "Crear cliente" : "Guardar cambios"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/clientes")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
