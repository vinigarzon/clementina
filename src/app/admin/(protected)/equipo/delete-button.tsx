"use client";

import { useTransition } from "react";
import { deleteTeamMember } from "./actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (
      !confirm(
        `¿Eliminar a "${name}"? Esta acción no se puede deshacer.`,
      )
    )
      return;
    startTransition(async () => {
      await deleteTeamMember(id);
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
