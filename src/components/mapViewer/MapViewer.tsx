import type { ReactNode } from "react"
import Icon from "@/components/common/Icon"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { VARIABLES } from "@/utils/colorScales"
import { formatYearMonth } from "@/utils/formatters"
import MapView from "./MapView"
import MapLegend from "./MapLegend"
import PlaybackControls from "./PlaybackControls"

function Compass({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  return (
    <span
      className={`pointer-events-none absolute text-[11px] font-semibold text-slate-500 ${className}`}
    >
      {children}
    </span>
  )
}

export default function MapViewer() {
  // 변수 선택 기능 제거 → 해빙 농도(SIC)만 표시
  const variable = "sic" as const
  const month = useDashboardStore((s) => s.month)
  const year = useDashboardStore((s) => s.year)
  const meta = VARIABLES[variable]

  return (
    <section className="flex flex-col h-full overflow-hidden rounded-2xl bg-white text-navy-900 border border-line">
      
      {/* ✅ 수정: 제목 영역을 flex로 바꾸고 뱃지를 헤더 우측으로 이동 */}
      <div className="flex min-h-[76px] items-center justify-between gap-3 bg-navy-900 px-5 py-4 text-white">
        <h2 className="text-base font-bold text-white">북극 해빙 지도 뷰어</h2>
        
        {/* 지도 위를 가리던 뱃지를 이쪽으로 깔끔하게 뺐습니다 */}
        <div className="flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5">
          <p className="text-sm font-bold text-white">{formatYearMonth(year, month)}</p>
          <div className="h-3 w-px bg-white/25" /> {/* 세로 얇은 구분선 */}
          <p className="flex items-center gap-1 text-[11px] text-slate-300">
            {meta.label}
            <Icon name="info" className="size-3.5" />
          </p>
        </div>
      </div>

      <div className="flex-1 grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_180px] items-center">
        <div className="relative mx-auto w-full max-w-[760px]">
          <div className="relative mx-auto aspect-square w-[88%]">
            <MapView
              variable={variable}
              year={year}
              month={month}
              size={720}
              className="size-full"
              label={`${formatYearMonth(year, month)} 북극 ${meta.label} 지도`}
            />
            <Compass className="left-1/2 -top-5 -translate-x-1/2">180°</Compass>
            <Compass className="left-1/2 -bottom-5 -translate-x-1/2">0°</Compass>
            <Compass className="-left-1 top-1/2 -translate-x-full -translate-y-1/2 sm:left-[3%] sm:translate-x-0">
              90°W
            </Compass>
            <Compass className="-right-1 top-1/2 translate-x-full -translate-y-1/2 sm:right-[3%] sm:translate-x-0">
              90°E
            </Compass>
            <Compass className="left-[10%] top-[28%] hidden sm:block">
              북아메리카
            </Compass>
            <Compass className="right-[8%] top-[34%] hidden sm:block">
              아시아
            </Compass>
            <Compass className="bottom-[8%] left-[56%] hidden sm:block">
              유럽
            </Compass>
          </div>
        </div>

        <MapLegend variable={variable} />
      </div>

      <PlaybackControls />
    </section>
  )
}
