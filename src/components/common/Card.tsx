import type { ReactNode } from "react"

interface CardProps {
  code?: string
  title: string
  note?: string
  badge?: string
  children: ReactNode
  className?: string
}

// 모든 카드 공통: 남색 헤더 바(상단 헤더와 같은 navy-900) + 흰 본문
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
      className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-white ${className}`}
    >
      <div className="flex min-h-[60px] items-center justify-between gap-3 bg-navy-900 px-5 py-3 text-white">
        <h2 className="flex flex-wrap items-baseline gap-x-2 text-base font-bold text-white">
          {code && <span>{code}</span>}
          <span>{title}</span>
          {note && (
            <span className="text-[11px] font-medium text-slate-300">
              {note}
            </span>
          )}
        </h2>
        {badge && (
          <span className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </section>
  )
}
