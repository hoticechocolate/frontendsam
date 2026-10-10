import Card from "@/components/common/Card"
import ColorBar from "@/components/common/ColorBar"
import MapView from "@/components/mapViewer/MapView"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { VARIABLES, VARIABLE_KEYS, jetGradient } from "@/utils/colorScales"
import { formatYearMonth } from "@/utils/formatters"

export default function TripleView() {
  const month = useDashboardStore((s) => s.month)
  const year = useDashboardStore((s) => s.year)

  return (
    <Card
      title="3변수 나란히 보기"
      note="(같은 연월 기준)"
      badge={formatYearMonth(year, month)}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {VARIABLE_KEYS.map((key) => {
          const meta = VARIABLES[key]
          return (
            <div
              key={key}
              className="rounded-xl border border-line bg-slate-50/70 p-3"
            >
              <p className="mb-2 text-xs font-bold text-navy-900">
                {meta.label}
              </p>
              <div className="flex items-center gap-2">
                <MapView
                  variable={key}
                  year={year}
                  month={month}
                  size={160}
                  className="aspect-square min-w-0 flex-1"
                  label={`${meta.label} 축소 지도`}
                />
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <ColorBar
                    gradient={jetGradient}
                    ticks={meta.ticks}
                    height="h-24"
                  />
                  <span className="text-[10px]">({meta.unit})</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
