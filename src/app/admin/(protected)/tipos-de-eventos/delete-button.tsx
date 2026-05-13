"use client";

import { useTransition } from "react";
import { deleteEventType } from "./actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `¿Eliminar el tipo "${title}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    startTransition(async () => {
      await deleteEventType(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="px-4 py-2 rounded-lg font-sans text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}
