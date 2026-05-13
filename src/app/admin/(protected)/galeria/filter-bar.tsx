"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface FilterBarProps {
  tags: string[];
  counts: Record<string, number>;
}

export function FilterBar({ tags, counts }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("tag") ?? "all";

  function go(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === "all") params.delete("tag");
    else params.set("tag", tag);
    const qs = params.toString();
    router.push(`/admin/galeria${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        type="button"
        onClick={() => go("all")}
        className={`px-4 py-1.5 rounded-full font-sans text-sm border transition-colors ${
          active === "all"
            ? "bg-clementina-800 text-cream-50 border-clementina-800"
            : "bg-white text-clementina-800 border-clementina-200 hover:border-clementina-400"
        }`}
      >
        Todas ({Object.values(counts).reduce((a, b) => a + b, 0)})
      </button>
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => go(t)}
          className={`px-4 py-1.5 rounded-full font-sans text-sm border transition-colors ${
            active === t
              ? "bg-clementina-800 text-cream-50 border-clementina-800"
              : "bg-white text-clementina-800 border-clementina-200 hover:border-clementina-400"
          }`}
        >
          {t} ({counts[t] ?? 0})
        </button>
      ))}
    </div>
  );
}
