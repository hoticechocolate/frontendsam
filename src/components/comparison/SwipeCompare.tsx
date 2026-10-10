import { useEffect, useRef, useState } from "react"
import Card from "@/components/common/Card"
import Icon from "@/components/common/Icon"
import MapView from "@/components/mapViewer/MapView"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"
import { formatYearMonth } from "@/utils/formatters"

// 최초 진입 시 스플리터를 좌우로 한 번 흔들어 사용법을 알려준다
function useIntroNudge(setPos: (v: number) => void, enabled: boolean) {
  const done = useRef(false)
  useEffect(() => {
    if (!enabled || done.current) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    done.current = true
    const DURATION = 1400
    let timer = 0
    let start = 0
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / DURATION)
      // 감쇠하는 사인파: 50 → 약 41 ↔ 59 → 50
      setPos(50 + 9 * Math.sin(t * Math.PI * 3) * (1 - t))
      if (t < 1) timer = window.setTimeout(step, 16)
      else setPos(50)
    }
    const delay = window.setTimeout(() => {
      start = performance.now()
      step()
    }, 700)
    return () => {
      window.clearTimeout(delay)
      window.clearTimeout(timer)
    }
  }, [enabled, setPos])
}

const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i)

// 월 선택과 같은 모양의 연도 버튼 묶음 (회색 트랙 + 선택된 연도는 흰 칸·파란 글씨)
function YearSegment({
  label,
  dot,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  dot: string
  value: number
  min: number
  max: number
  onChange: (y: number) => void
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
        <span className={`size-2.5 rounded-full ${dot}`} aria-hidden="true" />
        {label}
      </p>
      <div className="grid grid-cols-6 gap-1.5 rounded-lg bg-slate-100 p-1.5" role="group" aria-label={label}>
        {YEARS.map((y) => {
          const active = y === value
          const disabled = y < min || y > max
          return (
            <button
              key={y}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onChange(y)}
              className={`rounded-md py-3.5 text-base font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                active
                  ? "bg-white text-brand shadow-sm"
                  : disabled
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {y}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function SwipeCompare() {
  const month = useDashboardStore((s) => s.month)
  const [pos, setPos] = useState(50)
  const [touched, setTouched] = useState(false) // 사용자가 직접 움직이면 안내 애니메이션 중단
  // 왼쪽(기준) 연도 < 오른쪽(비교) 연도 — 최소 1년 차이
  const [leftYear, setLeftYear] = useState(YEAR_MIN)
  const [rightYear, setRightYear] = useState(YEAR_MAX)
  useIntroNudge(setPos, !touched)


  const pickLeft = (y: number) => {
    setLeftYear(y)
    // 오른쪽 연도가 왼쪽보다 늦지 않으면 왼쪽 + 1년으로 밀어줌
    if (rightYear <= y) setRightYear(Math.min(YEAR_MAX, y + 1))
  }

  return (
    <Card title="두 연도 스와이프 비교">
      {/* 사진 너비 = 북극 해빙 지도 뷰어 카드 너비 (페이지 2열 기준 50%+100px, 카드 안쪽 여백·테두리 34px 보정) */}
      <div className="grid items-start gap-4 xl:grid-cols-[calc(50%+117px)_minmax(0,1fr)]">
        <div className="overflow-visible rounded-xl border border-line">
          {/* 1. 지도 위 컨트롤 바 — 왼쪽/오른쪽 사진이 어떤 연도인지 표시 */}
          <div className="flex items-center justify-between gap-2 rounded-t-xl border-b border-line bg-slate-50 px-3 py-2 text-sm">
            <span className="flex items-center gap-1.5 font-bold text-navy-900">
              <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
              <span className="text-[11px] font-semibold text-slate-500">기준</span>
              <span className="tabular-nums">{formatYearMonth(leftYear, month)}</span>
            </span>
            <span className="hidden items-center gap-1 text-[11px] font-medium text-slate-500 sm:flex">
              <Icon name="swap" className="size-3.5" />
              가운데 핸들을 좌우로 끌어 비교
            </span>
            <span className="flex items-center gap-1.5 font-bold text-navy-900">
              <span className="tabular-nums">{formatYearMonth(rightYear, month)}</span>
              <span className="text-[11px] font-semibold text-slate-500">비교</span>
              <span className="size-2 rounded-full bg-navy-900" aria-hidden="true" />
            </span>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-b-xl bg-white">
            <MapView
              variable="sic"
              year={leftYear}
              month={month}
              size={320}
              className="absolute inset-0 size-full"
              label={`${formatYearMonth(leftYear, month)} 해빙 농도`}
            />
            <MapView
              variable="sic"
              year={rightYear}
              month={month}
              size={320}
              className="absolute inset-0 size-full"
              style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
              label={`${formatYearMonth(rightYear, month)} 해빙 농도`}
            />

            {/* 2. 스플리터 — 그림자로 어떤 배경 위에서도 보이게 */}
            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(6,18,43,0.25),0_0_8px_rgba(6,18,43,0.55)]"
              style={{ left: `${pos}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white ring-[3px] ring-white drop-shadow-[0_2px_6px_rgba(6,18,43,0.6)]">
                {!touched && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-brand/60"
                    style={{ animationIterationCount: 2 }}
                    aria-hidden="true"
                  />
                )}
                <Icon name="swap" className="relative size-5" />
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={pos}
              onChange={(e) => {
                setTouched(true)
                setPos(Number(e.target.value))
              }}
              onPointerDown={() => setTouched(true)}
              aria-label="비교 경계 위치"
              className="absolute inset-0 size-full cursor-ew-resize opacity-0"
            />
          </div>
        </div>

        {/* 연도 선택 — 월 선택 카드와 같은 디자인 */}
        <section className="flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex min-h-[52px] items-center bg-navy-900 px-5 py-3">
            <h3 className="text-base font-bold text-white">연도 선택</h3>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-7 p-5">
            <YearSegment
              label="기준 연도 (왼쪽 사진)"
              dot="bg-brand"
              value={leftYear}
              min={YEAR_MIN}
              max={YEAR_MAX - 1}
              onChange={pickLeft}
            />
            <YearSegment
              label={`비교 연도 (오른쪽 사진 · ${leftYear + 1}년부터 선택 가능)`}
              dot="bg-navy-900"
              value={rightYear}
              min={leftYear + 1}
              max={YEAR_MAX}
              onChange={setRightYear}
            />
          </div>
        </section>

      </div>
    </Card>
  )
}
