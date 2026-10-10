import Card from "@/components/common/Card"
import Spinner from "@/components/common/Spinner"
import { useIceAreaSeries } from "@/hooks/useMapData"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import type { IceAreaPoint } from "@/utils/types"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"
import { decreaseRate, formatArea } from "@/utils/formatters"

const W = 360
const H = 230
const L = 36
const R = 14
const T = 14
const B = 34
const X_TICKS = [1989, 1995, 2000, 2005, 2010, 2015, 2020, 2025]

function TrendSvg({
  month,
  year,
  series,
}: {
  month: number
  year: number
  series: IceAreaPoint[]
}) {
  const maxA = Math.ceil(Math.max(...series.map((s) => s.area)) / 2) * 2
  const X = (y: number) =>
    L + ((y - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (W - L - R)
  const Y = (a: number) => T + (1 - a / maxA) * (H - T - B)
  const yTicks = [0, 1, 2, 3, 4].map((i) => (maxA / 4) * i)
  const sel = series.find((s) => s.year === year) ?? series[series.length - 1]
  const decrease = decreaseRate(series[0].area, series[series.length - 1].area)
  const calloutLeft = Math.min(80, Math.max(20, (X(sel.year) / W) * 100))

  return (
    <>
      <div className="relative mt-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`${month}월 해빙 면적 변화 그래프`}
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={L}
                x2={W - R}
                y1={Y(t)}
                y2={Y(t)}
                stroke="#e3e9f3"
                strokeWidth="1"
              />
              <text
                x={L - 6}
                y={Y(t) + 3}
                textAnchor="end"
                fontSize="9"
                fill="#475569"
              >
                {Number.isInteger(t) ? t : t.toFixed(1)}
              </text>
            </g>
          ))}
          <line x1={L} x2={L} y1={T} y2={H - B} stroke="#94a3b8" />
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="#94a3b8" />
          {X_TICKS.map((y) => (
            <text
              key={y}
              x={X(y)}
              y={H - B + 14}
              textAnchor="middle"
              fontSize="9"
              fill="#475569"
            >
              {y}
            </text>
          ))}
          <text
            x={(L + W - R) / 2}
            y={H - 4}
            textAnchor="middle"
            fontSize="9"
            fill="#475569"
          >
            연도
          </text>
          <polyline
            points={series.map((s) => `${X(s.year)},${Y(s.area)}`).join(" ")}
            fill="none"
            stroke="#1769e0"
            strokeWidth="1.6"
          />
          {series.map((s) => (
            <circle
              key={s.year}
              cx={X(s.year)}
              cy={Y(s.area)}
              r="1.8"
              fill="#1769e0"
            />
          ))}
          <circle
            cx={X(sel.year)}
            cy={Y(sel.area)}
            r="5"
            fill="#1769e0"
            stroke="#fff"
            strokeWidth="2"
          />
        </svg>
        <div
          className="pointer-events-none absolute whitespace-nowrap rounded-lg border border-brand/30 bg-brand-soft px-2 py-1 text-[10px] font-semibold leading-tight text-navy-900"
          style={{
            left: `${calloutLeft}%`,
            top: `${(Y(sel.area) / H) * 100}%`,
            transform: "translate(-50%, -150%)",
          }}
        >
          {sel.year}년 {formatArea(sel.area)}
        </div>
      </div>
      <p className="mt-2 rounded-lg bg-brand-soft px-3 py-2 text-[11px] font-semibold text-navy-900">
        {month}월 해빙 면적 약 {decrease}% 감소 ({YEAR_MIN}년 대비)
      </p>
    </>
  )
}

export default function IceAreaTrendChart() {
  const month = useDashboardStore((s) => s.month)
  const year = useDashboardStore((s) => s.year)
  const { data, loading } = useIceAreaSeries(month)

  return (
    <Card title={`해빙 면적 추세 (${month}월)`}>
      <p className="text-[11px] text-slate-500">해빙 면적 (백만 km²)</p>
      {loading || !data ? (
        <Spinner />
      ) : (
        <TrendSvg month={month} year={year} series={data} />
      )}
    </Card>
  )
}
