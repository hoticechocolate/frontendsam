import Card from "@/components/common/Card"
import ModelState from "./ModelState"
import { count, pct } from "./modelTheme"

// 순차 단일 색상(파랑): 값이 클수록 진하게
const RAMP = ["#eaf2fd", "#c4dbf8", "#8ab8f0", "#4f92e3", "#2a78d6"]
const shade = (share: number) => RAMP[Math.min(RAMP.length - 1, Math.floor(share * RAMP.length * 1.6))]
const darkInk = (share: number) => RAMP.indexOf(shade(share)) >= 3

export default function ConfusionMatrixCard() {
  return (
    <Card title="혼동 행렬" note="(test 픽셀 수)">
      <ModelState>
        {({ classification_metrics: c }) => {
          const cm = c.confusion_matrix
          if (!cm) return <p className="py-10 text-center text-xs text-slate-500">혼동 행렬 데이터가 없습니다</p>
          const total = cm.total || cm.tp + cm.fn + cm.fp + cm.tn
          const cells = [
            [
              { key: "tp", label: "맞힌 얼음", v: cm.tp, good: true },
              { key: "fn", label: "놓친 얼음", v: cm.fn, good: false },
            ],
            [
              { key: "fp", label: "없는데 얼음", v: cm.fp, good: false },
              { key: "tn", label: "맞힌 바다", v: cm.tn, good: true },
            ],
          ]
          return (
            <>
              <div className="grid flex-1 grid-cols-[auto_1fr_1fr] grid-rows-[auto_1fr_1fr] gap-1 text-[11px]">
                <span />
                <span className="pb-1 text-center font-semibold text-slate-500">예측: 얼음</span>
                <span className="pb-1 text-center font-semibold text-slate-500">예측: 바다</span>
                {cells.map((row, r) => (
                  <div key={r} className="contents">
                    <span className="flex flex-col items-center justify-center pr-1 text-center font-semibold leading-tight text-slate-500">
                      <span>실제</span>
                      <span>{r === 0 ? "얼음" : "바다"}</span>
                    </span>
                    {row.map((cell) => {
                      const share = cell.v / total
                      const dark = darkInk(share)
                      return (
                        <div
                          key={cell.key}
                          title={`${cell.label}: ${count(cell.v)}픽셀 (${pct(share)})`}
                          className="flex min-h-28 flex-col justify-center rounded-lg px-2 py-4 text-center"
                          style={{ background: shade(share) }}
                        >
                          <p className={`font-semibold ${dark ? "text-white" : "text-navy-900"}`}>
                            {cell.good ? "✓" : "✕"} {cell.label}
                          </p>
                          <p className={`mt-1 text-sm font-bold tabular-nums ${dark ? "text-white" : "text-navy-900"}`}>
                            {count(cell.v)}
                          </p>
                          <p className={`tabular-nums ${dark ? "text-white/85" : "text-slate-600"}`}>{pct(share)}</p>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                총 {count(total)}픽셀 · 오탐(없는데 얼음)이 미탐(놓친 얼음)의{" "}
                <b className="text-navy-900">{cm.fp_fn_ratio ?? (cm.fp / cm.fn).toFixed(2)}배</b>
              </p>
            </>
          )
        }}
      </ModelState>
    </Card>
  )
}
