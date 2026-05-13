import Link from "next/link";

interface SectionCardProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  eyebrow,
  subtitle,
  action,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={`p-6 sm:p-7 rounded-2xl bg-white border border-clementina-100 ${className ?? ""}`}
    >
      <header className="flex items-start justify-between gap-3 mb-5">
        <div>
          {eyebrow && (
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-clementina-600 mb-2">
              {eyebrow}
            </p>
          )}
          <h3 className="font-display text-xl text-clementina-900 leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="font-sans text-xs text-clementina-900/55 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="shrink-0 font-sans text-xs uppercase tracking-widest text-clementina-700 hover:text-clementina-900 mt-1"
          >
            {action.label} →
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}
