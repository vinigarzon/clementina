"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleGalleryFeatured } from "./actions";

interface FeatureToggleProps {
  id: string;
  featured: boolean;
}

export function FeatureToggle({ id, featured }: FeatureToggleProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    startTransition(async () => {
      await toggleGalleryFeatured(id, !featured);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title={
        featured
          ? "Quitar de destacadas (no aparecerá en el carrusel del home)"
          : "Marcar como destacada (aparecerá en el carrusel del home)"
      }
      aria-label={featured ? "Quitar de destacadas" : "Marcar como destacada"}
      className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
        featured
          ? "bg-amber-400 text-amber-900 shadow-lg hover:bg-amber-300"
          : "bg-clementina-900/40 text-cream-50/80 hover:bg-clementina-900/70 hover:text-cream-50"
      } disabled:opacity-50`}
    >
      {/* Estrella SVG */}
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill={featured ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={featured ? 0 : 2}
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}
