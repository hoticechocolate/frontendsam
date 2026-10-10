import type { ReactNode } from "react"

interface CardProps {
  code?: string
  title: string
  note?: string
  badge?: string
  children: ReactNode
  className?: string
}

export default function Card({
  code,
  title,
  note,
  badge,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-line bg-white p-4 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex flex-wrap items-baseline gap-x-2 text-sm font-bold text-navy-900">
          {code && <span className="text-base font-bold">{code}</span>}
          <span>{title}</span>
          {note && (
            <span className="text-[11px] font-medium text-slate-500">
              {note}
            </span>
          )}
        </h2>
        {badge && (
          <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}
