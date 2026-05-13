"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EVENT_STATUS_META, type EventStatus } from "@/lib/event-status";

interface EventInput {
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

function cleanInput<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, v === "" ? null : v]),
  ) as T;
}

/**
 * Sincroniza el bloqueo de fecha (date_holds) con el estado del evento.
 * Si el evento tiene fecha y un estado que bloquea calendario, crea/actualiza
 * un date_hold. Si no, lo elimina.
 */
async function syncDateHold(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
  data: { event_date: string | null; status: EventStatus; space_id: string | null },
) {
  const meta = EVENT_STATUS_META[data.status];
  // Elimina cualquier hold previo de este evento
  await supabase.from("date_holds").delete().eq("event_id", eventId);

  if (data.event_date && meta.calendarStatus) {
    await supabase.from("date_holds").insert({
      event_id: eventId,
      space_id: data.space_id,
      hold_date: data.event_date,
      status: meta.calendarStatus,
      reason: `${meta.label}`,
    });
  }
}

export async function createEvent(input: EventInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const payload = cleanInput({
    ...input,
    guests: input.guests || null,
    created_by: user?.id ?? null,
  });

  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };

  await syncDateHold(supabase, data.id, {
    event_date: data.event_date,
    status: data.status,
    space_id: data.space_id,
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/calendario");
  redirect(`/admin/eventos/${data.id}`);
}

export async function updateEvent(id: string, input: Partial<EventInput>) {
  const supabase = await createClient();
  const cleaned = cleanInput(input as Record<string, unknown>);

  const { data, error } = await supabase
    .from("events")
    .update(cleaned)
    .eq("id", id)
    .select()
    .single();

  if (error) return { error: error.message };

  await syncDateHold(supabase, data.id, {
    event_date: data.event_date,
    status: data.status as EventStatus,
    space_id: data.space_id,
  });

  revalidatePath("/admin/eventos");
  revalidatePath(`/admin/eventos/${id}`);
  revalidatePath("/calendario");
  return { success: true };
}

export async function changeEventStatus(id: string, status: EventStatus) {
  return updateEvent(id, { status });
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("date_holds").delete().eq("event_id", id);
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/eventos");
  revalidatePath("/calendario");
  redirect("/admin/eventos");
}
