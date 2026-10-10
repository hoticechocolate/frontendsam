import { useState } from "react"
import Card from "@/components/common/Card"
import type { StatisticsPeriod } from "@/utils/types"
import { useDashboardStore } from "@/hooks/useDashboardStore"

const MONTHLY_VOYAGES = [38, 32, 45, 58, 86, 142, 251, 326, 310, 260, 180, 114]

const YEARLY_LEVELS = [
  15, 18, 22, 20, 25, 28, 31, 35, 34, 40, 
  44, 48, 53, 58, 62, 60, 68, 70, 76, 85, 92
]
const YEARLY_LABELS = Array.from({ length: 21 }, (_, i) => {
  const year = 2005 + i
  return `${String(year).slice(2)}년`
})

const PERIODS: { id: StatisticsPeriod; label: string }[] = [
  { id: "yearly", label: "연간" },
  { id: "monthly", label: "월별" },
]

export default function VoyageChart() {
  const [period, setPeriod] = useState<StatisticsPeriod>("yearly")
  
  // 💡 전역 상태의 값과 변경 함수(set)를 모두 가져옵니다.
  const globalMonth = useDashboardStore((s) => s.month)
  const globalYear = useDashboardStore((s) => s.year)
  const setMonth = useDashboardStore((s) => s.setMonth)
  const setYear = useDashboardStore((s) => s.setYear)

  const monthly = period === "monthly"
  const data = monthly
    ? MONTHLY_VOYAGES.map((v) => (v / 326) * 100)
    : YEARLY_LEVELS
  const labels = monthly
    ? MONTHLY_VOYAGES.map((_, i) => `${i + 1}월`)
    : YEARLY_LABELS

  return (
    <Card
      title={monthly ? "월별 운항 건수" : "연간 운항 건수"}
      badge={monthly ? `${globalYear}년` : "2005–25년"}
    >
      <div
        className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1"
        role="group"
        aria-label="운항 통계 조회 단위"
      >
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={period === p.id}
            onClick={() => setPeriod(p.id)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              period === p.id
                ? "bg-white text-brand shadow-sm"
                : "text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        className="overflow-x-auto pb-1"
        tabIndex={0}
        role="region"
        aria-label={monthly ? "월별 운항 건수 차트" : "연간 운항 건수 차트"}
      >
        <div className={monthly ? "min-w-[320px]" : "min-w-[500px]"}>
          <div className="flex h-28 items-end gap-1.5 border-b border-slate-200 pb-1">
            {data.map((height, i) => {
              const isHighlighted = monthly 
                ? (i + 1 === globalMonth) 
                : (2005 + i === globalYear)

              return (
                <div
                  key={labels[i]}
                  // 💡 클릭 이벤트와 마우스 오버 효과(cursor-pointer, group)를 추가합니다.
                  className="group flex h-full flex-1 cursor-pointer items-end"
                  title={monthly ? `${labels[i]}: ${MONTHLY_VOYAGES[i]}건` : labels[i]}
                  onClick={() => {
                    // 💡 월별 차트면 setMonth, 연간 차트면 setYear를 호출합니다.
                    if (monthly) {
                      setMonth(i + 1)
                    } else {
                      setYear(2005 + i)
                    }
                  }}
                >
                  <div
                    // 💡 마우스 오버 시 막대가 살짝 투명해지는 시각적 피드백(group-hover:opacity-80) 추가
                    className={`w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 ${
                      isHighlighted ? "bg-brand" : "bg-slate-200"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between text-[9px] font-medium text-slate-400">
            {labels.map((label) => (
              <span key={label} className="w-full text-center">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold tracking-tight text-navy-900">
            1,842
          </p>
          <p className="text-[11px] text-slate-500">
            {monthly ? `${globalYear}년 운항 완료 건수` : "운항 완료 건수"}
          </p>
        </div>
        <span className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand">
          +12.4%
        </span>
      </div>
      
      <p className="mt-2 text-[10px] text-slate-400">
        {monthly ? "월별 통계는 예시 데이터입니다." : "연간 통계는 예시 데이터입니다."}
      </p>
    </Card>
  )
}