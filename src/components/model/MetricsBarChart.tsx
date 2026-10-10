import { useState } from "react"
import Card from "@/components/common/Card"
import { useModelEvaluation } from "@/hooks/useSupabaseData"
import ModelState from "./ModelState"
import { SERIES, pct } from "./modelTheme"

const ITEMS = [
  { key: "f1", label: "F1 점수", desc: "정밀도와 재현율의 조화 평균" },
  { key: "accuracy", label: "정확도", desc: "전체 픽셀 중 맞힌 비율" },
  { key: "precision", label: "정밀도", desc: "얼음이라 예측한 것 중 실제 얼음" },
  { key: "recall", label: "재현율", desc: "실제 얼음 중 얼음으로 맞힌 비율" },
] as const

export default function MetricsBarChart() {
  const { data } = useModelEvaluation()
  const [hover, setHover] = useState<string | null>(null)

  return (
    <Card title="분류 성능" note="(얼음/바다 판별)" badge={data?.classification_metrics.test_period}>
      <ModelState>
        {({ classification_metrics: c }) => {
          const m = c.metrics
          return (
            <>
              <ul className="space-y-3">
                {ITEMS.map((it) => {
                  const v = m?.[it.key]
                  return (
                    <li
                      key={it.key}
                      onMouseEnter={() => setHover(it.key)}
                      onMouseLeave={() => setHover(null)}
                      className="group"
                    >
                      <div className="mb-1 flex items-baseline justify-between text-xs">
                        <span className="font-semibold text-navy-900">{it.label}</span>
                        <span className="font-bold tabular-nums text-navy-900">{pct(v)}</span>
                      </div>
                      {/* 0~100% 축 — 막대는 0에서 시작 */}
                      <div className="h-2.5 w-full rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full transition-opacity"
                          style={{
                            width: `${(v ?? 0) * 100}%`,
                            background: SERIES.train,
                            opacity: hover && hover !== it.key ? 0.45 : 1,
                          }}
                        />
                      </div>
                      <p
                        className={`mt-1 text-[10px] text-slate-500 ${hover === it.key ? "block" : "hidden"}`}
                      >
                        {it.desc}
                      </p>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                SIC {c.threshold != null ? `${c.threshold * 100}%` : "15%"} 이상을 얼음으로 판별 ·{" "}
                {c.n_months ?? 96}개월 픽셀 합산
              </p>
            </>
          )
        }}
      </ModelState>
    </Card>
  )
}
