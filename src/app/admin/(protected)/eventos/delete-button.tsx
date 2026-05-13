"use client";

import { useTransition } from "react";
import { deleteEvent } from "./actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();
  function onClick() {
    if (
      !confirm(
        `¿Eliminar el evento "${title}"? También se libera la fecha del calendario. No se puede deshacer.`,
      )
    )
      return;
    startTransition(async () => {
      await deleteEvent(id);
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="px-4 py-2 rounded-lg font-sans text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}
