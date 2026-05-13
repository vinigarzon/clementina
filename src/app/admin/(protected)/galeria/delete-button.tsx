"use client";

import { useTransition } from "react";
import { deleteGalleryAsset } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta imagen? Esta acción no se puede deshacer."))
      return;
    startTransition(async () => {
      await deleteGalleryAsset(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="px-3 py-1.5 rounded-lg font-sans text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}
