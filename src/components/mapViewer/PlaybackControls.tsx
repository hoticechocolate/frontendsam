import Icon from "@/components/common/Icon"
import { usePlayback } from "@/hooks/usePlayback"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { PLAYBACK_SPEEDS, YEAR_MAX, YEAR_MIN } from "@/utils/constants"

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"

export default function PlaybackControls() {
  const { playing, speed, play, pause, setSpeed } = usePlayback()
  const month = useDashboardStore((s) => s.month)
  const year = useDashboardStore((s) => s.year)
  const setYear = useDashboardStore((s) => s.setYear) // setMonth, stepMonth 제거

  // 타임라인 진행률(%) 계산 (연도 기준)
  const progress = ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100

  // 연도 이동 핸들러 (최소/최대 연도 범위를 벗어나지 않도록 제한)
  const handlePrevYear = () => setYear(Math.max(YEAR_MIN, year - 1))
  const handleNextYear = () => setYear(Math.min(YEAR_MAX, year + 1))

  return (
    <div className="flex items-center gap-3 h-[88px] px-4 border-t border-line bg-slate-50">
      <button
        type="button"
        onClick={playing ? pause : play}
        className={`flex w-28 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold ${focusRing} ${
          playing
            ? "border-brand bg-brand text-white"
            : "border-line bg-white text-navy-900 hover:bg-slate-100"
        }`}
      >
        <Icon name={playing ? "pause" : "play"} className="size-4" />
        {playing ? "일시정지" : "재생"}
      </button>

      <div className="flex items-center rounded-lg border border-line bg-white">
        <button
          type="button"
          aria-label="이전 연도"
          onClick={handlePrevYear}
          className={`grid size-9 place-items-center hover:bg-slate-100 ${focusRing}`}
        >
          <Icon name="left" className="size-4" />
        </button>
        <span className="w-24 text-center text-sm font-semibold tabular-nums">
          {year}.{String(month).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="다음 연도"
          onClick={handleNextYear}
          className={`grid size-9 place-items-center hover:bg-slate-100 ${focusRing}`}
        >
          <Icon name="right" className="size-4" />
        </button>
      </div>

      <div className="order-last min-w-[220px] flex-1 basis-full sm:order-none sm:basis-0">
        <input
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label="연도별 이미지 타임라인"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-sky-400"
          style={{
            background: `linear-gradient(to right, #38a1ff ${progress}%, #d5deec ${progress}%)`,
          }}
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>{YEAR_MIN}</span>
          <span>{YEAR_MAX}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[11px] text-slate-600">
        재생 속도
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="rounded bg-white px-1 py-0.5 text-xs font-semibold text-navy-900"
        >
          {PLAYBACK_SPEEDS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}