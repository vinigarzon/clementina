"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeEventStatus } from "./actions";
import { EVENT_STATUSES, type EventStatus } from "@/lib/event-status";

interface StatusChangerProps {
  id: string;
  current: EventStatus;
}

export function StatusChanger({ id, current }: StatusChangerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as EventStatus;
    if (next === current) return;
    startTransition(async () => {
      const res = await changeEventStatus(id, next);
      if (!res?.error) router.refresh();
    });
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={pending}
      className="px-3 py-1.5 rounded-lg border border-clementina-200 bg-white font-sans text-sm focus:outline-none focus:border-clementina-600 disabled:opacity-60"
    >
      {EVENT_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
