import { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  badge?: string;
  className?: string;
}

export default function ResultCard({
  title,
  subtitle,
  children,
  badge,
  className = "",
}: ResultCardProps) {
  return (
    <section
      className={`rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/20 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {title}
          </h2>

          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        {badge ? (
          <span className="rounded-full bg-indigo-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-200">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}