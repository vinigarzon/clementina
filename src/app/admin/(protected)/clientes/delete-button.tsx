"use client";

import { useTransition } from "react";
import { deleteClientRecord } from "./actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `¿Eliminar al cliente "${name}"? Esta acción no se puede deshacer.\n\nSi el cliente tiene eventos asociados, ellos quedarán sin cliente vinculado.`,
      )
    )
      return;
    startTransition(async () => {
      await deleteClientRecord(id);
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
