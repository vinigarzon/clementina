"use client";

import { useTransition } from "react";
import { deleteQuote } from "./actions";

export function DeleteButton({
  id,
  number,
}: {
  id: string;
  number: number;
}) {
  const [pending, startTransition] = useTransition();
  function onClick() {
    if (!confirm(`¿Eliminar la cotización #${number}? No se puede deshacer.`))
      return;
    startTransition(async () => {
      await deleteQuote(id);
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
