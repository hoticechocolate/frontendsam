import { useState, type MouseEvent } from "react"
import Card from "@/components/common/Card"
import { useModelEvaluation } from "@/hooks/useSupabaseData"
import ModelState from "./ModelState"
import { INK, SERIES, loss } from "./modelTheme"

type Point = { epoch: number; train_loss: number; val_loss: number }

const W = 640
const H = 250
const L = 48
const R = 64
const T = 16
const B = 34

function niceMax(v: number) {
  const step = 0.005
  return Math.ceil(v / step) * step
}

function CurveSvg({ points, bestEpoch }: { points: Point[]; bestEpoch?: number }) {
  const [hover, setHover] = useState<Point | null>(null)
  const maxEpoch = points[points.length - 1].epoch
  const yMax = niceMax(Math.max(...points.flatMap((p) => [p.train_loss, p.val_loss])))
  const X = (e: number) => L + ((e - 1) / Math.max(1, maxEpoch - 1)) * (W - L - R)
  const Y = (v: number) => T + (1 - v / yMax) * (H - T - B)
  const yTicks = Array.from({ length: Math.round(yMax / 0.005) + 1 }, (_, i) => i * 0.005)
  const xTicks = [1, ...Array.from({ length: Math.floor(maxEpoch / 5) }, (_, i) => (i + 1) * 5)]
  const path = (k: "train_loss" | "val_loss") =>
    points.map((p, i) => `${i ? "L" : "M"}${X(p.epoch).toFixed(1)},${Y(p[k]).toFixed(1)}`).join("")
  const last = points[points.length - 1]
  const best = points.find((p) => p.epoch === bestEpoch)

  const onMove = (e: MouseEvent<SVGRectElement>) => {
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect()
    const x = ((e.clientX - box.left) / box.width) * W
    const epoch = Math.round(1 + ((x - L) / (W - L - R)) * (maxEpoch - 1))
    setHover(points.find((p) => p.epoch === Math.min(maxEpoch, Math.max(1, epoch))) ?? null)
  }

  // 끝점 라벨이 겹치지 않도록 최소 간격 유지
  let yTrain = Y(last.train_loss)
  let yVal = Y(last.val_loss)
  if (Math.abs(yTrain - yVal) < 12) {
    const mid = (yTrain + yVal) / 2
    const sign = yTrain < yVal ? -1 : 1
    yTrain = mid + sign * 6
    yVal = mid - sign * 6
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="에폭별 학습·검증 손실 그래프">
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={Y(t)} y2={Y(t)} stroke={INK.grid} />
            <text x={L - 6} y={Y(t) + 3} textAnchor="end" fontSize="10" fill={INK.secondary}>
              {t === 0 ? "0" : t.toFixed(3)}
            </text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={INK.axis} />
        {xTicks.map((e) => (
          <text key={e} x={X(e)} y={H - B + 14} textAnchor="middle" fontSize="10" fill={INK.secondary}>
            {e}
          </text>
        ))}
        <text x={(L + W - R) / 2} y={H - 3} textAnchor="middle" fontSize="10" fill={INK.secondary}>
          에폭
        </text>

        {best && (
          <g>
            <line x1={X(best.epoch)} x2={X(best.epoch)} y1={T} y2={H - B} stroke={INK.muted} strokeDasharray="3 3" />
            <text x={X(best.epoch) - 4} y={T + 9} textAnchor="end" fontSize="10" fontWeight="600" fill={INK.primary}>
              best · {best.epoch}에폭
            </text>
          </g>
        )}

        <path d={path("train_loss")} fill="none" stroke={SERIES.train} strokeWidth="2" strokeLinejoin="round" />
        <path d={path("val_loss")} fill="none" stroke={SERIES.val} strokeWidth="2" strokeLinejoin="round" />

        {best && (
          <circle cx={X(best.epoch)} cy={Y(best.val_loss)} r="5" fill={SERIES.val} stroke="#fff" strokeWidth="2" />
        )}

        {/* 끝점 직접 라벨 */}
        <text x={W - R + 6} y={yTrain + 3} fontSize="10" fontWeight="600" fill={INK.primary}>학습</text>
        <text x={W - R + 6} y={yVal + 3} fontSize="10" fontWeight="600" fill={INK.primary}>검증</text>

        {hover && (
          <g pointerEvents="none">
            <line x1={X(hover.epoch)} x2={X(hover.epoch)} y1={T} y2={H - B} stroke={INK.secondary} />
            <circle cx={X(hover.epoch)} cy={Y(hover.train_loss)} r="4" fill={SERIES.train} stroke="#fff" strokeWidth="2" />
            <circle cx={X(hover.epoch)} cy={Y(hover.val_loss)} r="4" fill={SERIES.val} stroke="#fff" strokeWidth="2" />
          </g>
        )}
        <rect
          x={L}
          y={T}
          width={W - L - R}
          height={H - T - B}
          fill="transparent"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[120px] rounded-lg border border-line bg-white px-3 py-2 text-[11px] shadow-md"
          style={{
            left: `${(X(hover.epoch) / W) * 100}%`,
            transform: X(hover.epoch) > W / 2 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
          }}
        >
          <p className="font-bold text-navy-900">{hover.epoch}에폭</p>
          <p className="mt-1 flex items-center gap-1.5 text-slate-600">
            <span className="h-0.5 w-3 rounded" style={{ background: SERIES.train }} />
            학습 <b className="ml-auto pl-2 tabular-nums text-navy-900">{loss(hover.train_loss)}</b>
          </p>
          <p className="flex items-center gap-1.5 text-slate-600">
            <span className="h-0.5 w-3 rounded" style={{ background: SERIES.val }} />
            검증 <b className="ml-auto pl-2 tabular-nums text-navy-900">{loss(hover.val_loss)}</b>
          </p>
        </div>
      )}
    </div>
  )
}

export default function LearningCurveChart() {
  const { data } = useModelEvaluation()
  const lc = data?.learning_curve

  return (
    <Card title="학습 곡선" note="(에폭별 손실 · MSE)" badge={lc?.epochs ? `${lc.epochs} 에폭` : undefined}>
      <ModelState>
        {({ learning_curve: c }) =>
          c.points?.length ? (
            <>
              <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded" style={{ background: SERIES.train }} />
                  학습 손실 {c.train_period && <span className="text-slate-400">({c.train_period})</span>}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded" style={{ background: SERIES.val }} />
                  검증 손실 {c.val_period && <span className="text-slate-400">({c.val_period})</span>}
                </span>
              </div>
              <CurveSvg points={c.points} bestEpoch={c.best?.epoch} />
              {c.best && (
                <p className="mt-2 rounded-lg bg-brand-soft px-3 py-2 text-[11px] font-semibold text-navy-900">
                  최저 검증 손실 {loss(c.best.val_loss)} ({c.best.epoch}에폭) — 이 시점 모델로 test 평가
                </p>
              )}
            </>
          ) : (
            <p className="py-10 text-center text-xs text-slate-500">학습 곡선 데이터가 없습니다</p>
          )
        }
      </ModelState>
    </Card>
  )
}
