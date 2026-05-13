"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { DashboardRange } from "@/lib/data/dashboard";

const OPTIONS: Array<{ key: DashboardRange; label: string }> = [
  { key: "week", label: "7 días" },
  { key: "month", label: "30 días" },
  { key: "quarter", label: "3 meses" },
  { key: "ytd", label: "Año en curso" },
  { key: "year", label: "12 meses" },
];

export function DateRangePicker({ current }: { current: DashboardRange }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  function setRange(key: DashboardRange) {
    const next = new URLSearchParams(params);
    if (key === "month") {
      next.delete("range");
    } else {
      next.set("range", key);
    }
    startTransition(() => {
      router.push(`/admin?${next.toString()}`);
    });
  }

  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 rounded-full bg-cream-50 border border-clementina-100 p-1 ${
        pending ? "opacity-60" : ""
      }`}
    >
      {OPTIONS.map((opt) => {
        const active = current === opt.key;
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={active}
            onClick={() => setRange(opt.key)}
            disabled={pending}
            className={`px-3 sm:px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-colors ${
              active
                ? "bg-clementina-800 text-cream-50"
                : "text-clementina-900/70 hover:text-clementina-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
