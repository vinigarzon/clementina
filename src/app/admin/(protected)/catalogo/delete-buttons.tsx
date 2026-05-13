"use client";

import { useTransition } from "react";
import { deleteCategory, deleteItem } from "./actions";

export function DeleteCategoryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  function onClick() {
    if (
      !confirm(
        `¿Eliminar la categoría "${name}"? Los items que tenga quedarán sin categoría.`,
      )
    )
      return;
    startTransition(async () => {
      await deleteCategory(id);
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="px-3 py-1.5 rounded-lg font-sans text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}

export function DeleteItemButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();
  function onClick() {
    if (!confirm(`¿Eliminar el ítem "${name}"?`)) return;
    startTransition(async () => {
      await deleteItem(id);
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="px-3 py-1.5 rounded-lg font-sans text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "..." : "Eliminar"}
    </button>
  );
}
