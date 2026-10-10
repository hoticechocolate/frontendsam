import ColorBar from "@/components/common/ColorBar"
import Icon from "@/components/common/Icon"
import type { Variable } from "@/utils/types"
import { VARIABLES, jetGradient } from "@/utils/colorScales"

export default function MapLegend({ variable }: { variable: Variable }) {
  const meta = VARIABLES[variable]

  return (
    <aside className="rounded-xl border border-white/15 bg-navy-900/60 p-4">
      <p className="text-sm font-bold">{meta.label}</p>
      <div className="mt-3 flex gap-3">
        <ColorBar gradient={jetGradient} ticks={meta.ticks} height="h-40" />
        {meta.unit !== "%" && (
          <span className="self-end text-[11px] text-slate-400">
            ({meta.unit})
          </span>
        )}
      </div>
      <ul className="mt-4 space-y-3 text-xs text-slate-200">
        <li className="flex items-center gap-3">
          <span className="w-8 shrink-0 border-t-2 border-dashed border-white" />
          관측 사상 최대 해빙 범위(기준선)
        </li>
        <li className="flex items-center gap-3">
          <span className="w-8 shrink-0 border-t-2 border-red-500" />
          해당 연월 해빙 경계 15%
        </li>
      </ul>
      <div className="mt-4 flex gap-2 rounded-lg border border-white/15 bg-white/5 p-3 text-[11px] leading-relaxed text-slate-300">
        <Icon name="info" className="mt-0.5 size-4 shrink-0" />
        해빙 농도(%)가 15% 이상인 지역의 경계를 나타냅니다.
      </div>
    </aside>
  )
}
