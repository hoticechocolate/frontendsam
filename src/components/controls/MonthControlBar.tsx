import { useEffect, useRef, useState } from "react"
import Icon from "@/components/common/Icon"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"
import { formatYearMonth } from "@/utils/formatters"
import MonthSelector from "./MonthSelector"

// 월 선택 — 아코디언 + 고정 바 하이브리드
// · 페이지 위쪽: 1~12월이 모두 보이는 카드
// · 카드가 화면 밖으로 스크롤되면: 화면 상단에 가로로 꽉 찬 얇은 바(현재 연·월, ◀ ▶, 월 전체 보기)
export default function MonthControlBar() {
  const cardRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  const year = useDashboardStore((s) => s.year)
  const month = useDashboardStore((s) => s.month)
  const stepMonth = useDashboardStore((s) => s.stepMonth)

  const atStart = year === YEAR_MIN && month === 1
  const atEnd = year === YEAR_MAX && month === 12

  // 카드가 화면 위로 완전히 사라지면 고정 바 표시
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0
      setStuck(passed)
      if (!passed) setOpen(false)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 월을 고르면 펼친 목록 자동으로 접기
  useEffect(() => {
    setOpen(false)
  }, [month])

  // 바깥 클릭 / Esc 로 접기
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const stepBtn =
    "grid size-8 place-items-center rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"

  return (
    <>
      {/* 1. 페이지 안의 기본 카드 (펼친 상태) */}
      <section ref={cardRef} className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex min-h-[60px] items-center bg-navy-900 px-5 py-3">
          <h2 className="text-base font-bold text-white">월 선택</h2>
        </div>
        <div className="p-4">
          <MonthSelector />
        </div>
      </section>

      {/* 2. 스크롤 시 나타나는 상단 고정 바 (접힌 상태 + 아코디언) */}
      <div
        ref={barRef}
        aria-hidden={!stuck}
        className={`fixed inset-x-0 top-0 z-40 transition-[transform,opacity] duration-200 ease-out ${
          stuck ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="bg-navy-900/95 text-white shadow-[0_4px_16px_rgba(6,18,43,0.35)] backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            <p className="min-w-0 text-base font-bold tabular-nums">
              {formatYearMonth(year, month)}
              <span className="ml-2 hidden text-xs font-medium text-slate-300 sm:inline">해빙 농도 (SIC)</span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className={stepBtn}
                onClick={() => stepMonth(-1)}
                disabled={atStart}
                aria-label="이전 달"
                tabIndex={stuck ? 0 : -1}
              >
                <Icon name="left" className="size-4" />
              </button>
              <button
                type="button"
                className={stepBtn}
                onClick={() => stepMonth(1)}
                disabled={atEnd}
                aria-label="다음 달"
                tabIndex={stuck ? 0 : -1}
              >
                <Icon name="right" className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="month-accordion"
              tabIndex={stuck ? 0 : -1}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              월 전체 보기
              <svg viewBox="0 0 24 24" className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* 아코디언: 바 아래로 겹쳐서 펼쳐짐 (아래 내용을 밀지 않음) */}
        <div
          id="month-accordion"
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="border-b border-line bg-white/95 shadow-[0_8px_20px_rgba(10,28,66,0.15)] backdrop-blur">
              <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6" inert={!open}>
                <MonthSelector />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
