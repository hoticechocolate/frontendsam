import { useState } from "react"
import Card from "@/components/common/Card"
import Icon from "@/components/common/Icon"
import MapView from "@/components/mapViewer/MapView"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"
import { decreaseRate, formatYearMonth } from "@/utils/formatters"
import { iceArea } from "@/utils/mapRenderer"

export default function SwipeCompare() {
  const month = useDashboardStore((s) => s.month)
  const [pos, setPos] = useState(50)
  const decrease = decreaseRate(
    iceArea(YEAR_MIN, month),
    iceArea(YEAR_MAX, month),
  )

  return (
    <Card title="두 연도 스와이프 비교">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-xl border border-line bg-white">
          <MapView
            variable="sic"
            year={YEAR_MIN}
            month={month}
            size={320}
            className="absolute inset-0 size-full"
            label={`${formatYearMonth(YEAR_MIN, month)} 해빙 농도`}
          />
          <MapView
            variable="sic"
            year={YEAR_MAX}
            month={month}
            size={320}
            className="absolute inset-0 size-full"
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            label={`${formatYearMonth(YEAR_MAX, month)} 해빙 농도`}
          />
          <span className="pointer-events-none absolute left-2 top-2 rounded-md bg-brand px-2 py-1 text-[11px] font-bold text-white">
            {formatYearMonth(YEAR_MIN, month)}
          </span>
          <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-navy-900 px-2 py-1 text-[11px] font-bold text-white">
            {formatYearMonth(YEAR_MAX, month)}
          </span>
          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-white"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-lg ring-2 ring-white">
              <Icon name="swap" className="size-4" />
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="비교 경계 위치"
            className="absolute inset-0 size-full cursor-ew-resize opacity-0"
          />
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-navy-900">변화 포인트</p>
          <ul className="mt-3 list-disc space-y-3 pl-4 text-xs leading-relaxed text-slate-600 marker:text-brand">
            <li>
              {YEAR_MIN}년 대비 {YEAR_MAX}년 {month}월 해빙 면적 약 {decrease}%
              감소
            </li>
            <li>여름철(9월) 해빙 후퇴가 가장 두드러짐</li>
            <li>북극 해수면 온도 상승과 기온 증가와의 상관관계 확인</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
