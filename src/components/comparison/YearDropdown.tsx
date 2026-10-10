import { useEffect, useRef, useState } from "react"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"
import { formatYearMonth } from "@/utils/formatters"

interface YearDropdownProps {
  year: number
  month: number
  minYear: number // 선택 가능한 최소 연도
  maxYear: number // 선택 가능한 최대 연도
  onChange: (year: number) => void
  align: "left" | "right"
  dot: string // 왼쪽/오른쪽 사진을 구분하는 점 색상 클래스
  label: string // 기준 연도 / 비교 연도
}

const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i)

// 📅 2018년 9월 [변경] 형태의 필(pill) 버튼 + 바로 아래 펼쳐지는 연도 목록
export default function YearDropdown({
  year,
  month,
  minYear,
  maxYear,
  onChange,
  align,
  dot,
  label,
}: YearDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    ref.current?.querySelector<HTMLButtonElement>("[aria-selected=true]")?.focus()
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative z-30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} 변경 (현재 ${year}년)`}
        className={`group flex items-center gap-2 rounded-full border bg-white py-1.5 pl-2.5 pr-1.5 text-sm font-bold text-navy-900 shadow-sm transition-colors hover:border-brand/40 hover:bg-brand-soft/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          open ? "border-brand/50 ring-2 ring-brand/15" : "border-line"
        }`}
      >
        <span className={`size-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
        <svg viewBox="0 0 24 24" className="size-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
        <span className="tabular-nums">{formatYearMonth(year, month)}</span>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand group-hover:bg-brand group-hover:text-white">
          변경
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={`absolute top-full mt-1.5 max-h-72 w-40 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-xl ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {YEARS.map((y) => {
            const disabled = y < minYear || y > maxYear
            const active = y === year
            return (
              <li key={y}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={disabled}
                  onClick={() => {
                    onChange(y)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm tabular-nums ${
                    active
                      ? "bg-brand-soft font-bold text-brand"
                      : disabled
                        ? "cursor-not-allowed text-slate-300"
                        : "text-navy-900 hover:bg-slate-100"
                  }`}
                >
                  {y}년
                  {active && (
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
