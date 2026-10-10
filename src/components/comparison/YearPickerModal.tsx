import { useEffect, useRef } from "react"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"

interface YearPickerModalProps {
  open: boolean
  title: string
  description?: string
  selected: number
  minYear: number // 선택 가능한 최소 연도
  maxYear: number // 선택 가능한 최대 연도
  onSelect: (year: number) => void
  onClose: () => void
}

const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i)

// 스와이프 비교 카드의 연도 선택 모달
export default function YearPickerModal({
  open,
  title,
  description,
  selected,
  minYear,
  maxYear,
  onSelect,
  onClose,
}: YearPickerModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    // 열리면 현재 선택된 연도 버튼으로 포커스
    panelRef.current?.querySelector<HTMLButtonElement>("[aria-pressed=true]")?.focus()
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 bg-navy-900 px-5 py-3 text-white">
          <h3 className="text-base font-bold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid size-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {description && <p className="mb-3 text-xs text-slate-500">{description}</p>}
          <div className="grid grid-cols-4 gap-2">
            {YEARS.map((y) => {
              const disabled = y < minYear || y > maxYear
              const active = y === selected
              return (
                <button
                  key={y}
                  type="button"
                  disabled={disabled}
                  aria-pressed={active}
                  onClick={() => {
                    onSelect(y)
                    onClose()
                  }}
                  className={`rounded-lg py-2.5 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    active
                      ? "bg-brand text-white"
                      : disabled
                        ? "cursor-not-allowed bg-slate-50 text-slate-300"
                        : "bg-slate-100 text-navy-900 hover:bg-brand-soft hover:text-brand"
                  }`}
                >
                  {y}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
