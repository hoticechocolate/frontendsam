import { useState } from "react"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { useModelEvaluation, useSicMapUrl } from "@/hooks/useSupabaseData"
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber"
import { supabaseEnabled, type MapKind } from "@/services/supabase"
import { formatYearMonth } from "@/utils/formatters"

const TABS: { kind: Exclude<MapKind, "observed">; label: string }[] = [
  { kind: "predicted", label: "예측" },
  { kind: "error", label: "오차" },
]

const pct = (v?: number) => (v == null ? "–" : `${(v * 100).toFixed(1)}%`)

export default function FuturePredictionViewer() {
  const year = useDashboardStore((s) => s.year)
  const month = useDashboardStore((s) => s.month)
  const [kind, setKind] = useState<Exclude<MapKind, "observed">>("predicted")
  const { url, loading } = useSicMapUrl(year, month, kind)
  const { data: evaluation } = useModelEvaluation()
  const [failedUrl, setFailedUrl] = useState<string>()

  const testPeriod = evaluation?.classification_metrics.test_period
  // 선택한 연·월의 test 성능 (binary_ice_metrics 월별 CSV). test 기간 밖이면 전체 test 성능을 보여준다
  const monthly = evaluation?.monthly_metrics?.find((m) => m.year === year && m.month === month)
  const metrics = monthly ?? evaluation?.classification_metrics.metrics

  const f1 = useAnimatedNumber(metrics?.f1)
  const accuracy = useAnimatedNumber(metrics?.accuracy)
  const precision = useAnimatedNumber(metrics?.precision)
  const recall = useAnimatedNumber(metrics?.recall)

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl bg-white text-navy-900 border border-line">
      {/* 1. 상단 헤더 영역 */}
      <div className="flex min-h-[76px] items-center justify-between gap-3 bg-navy-900 px-5 py-4 text-white">
        <div>
          <h2 className="text-base font-bold text-white">CNN 해빙 예측</h2>
          <p className="mt-1 text-xs text-slate-300">
            {formatYearMonth(year, month)} · 관측 지도와 같은 연월
          </p>
        </div>

        <div
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px]"
          title={monthly ? `${formatYearMonth(year, month)} test F1` : `test 전체 F1 (${testPeriod ?? ""})`}
        >
          <span className="text-slate-300">{monthly ? `${month}월 F1` : "모델 F1"}</span>
          <span className="w-11 text-right font-bold tabular-nums text-white">{pct(f1)}</span>
        </div>
      </div>

      {/* 예측 / 오차 전환 */}
      <div className="px-5 pt-4">
        <div className="inline-flex rounded-lg border border-line bg-slate-50 p-0.5" role="group">
          {TABS.map((t) => (
            <button
              key={t.kind}
              type="button"
              onClick={() => setKind(t.kind)}
              aria-pressed={kind === t.kind}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                kind === t.kind ? "bg-brand text-white" : "text-slate-500 hover:text-navy-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 메인 이미지 뷰어 영역 */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="relative mx-auto aspect-square w-[88%] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
              <p className="text-xs">예측 지도를 불러오는 중...</p>
            </div>
          ) : url && failedUrl !== url ? (
            <img
              src={url}
              alt={`${formatYearMonth(year, month)} 해빙 ${kind === "predicted" ? "예측" : "오차"} 지도`}
              className="absolute inset-0 w-full h-full object-contain "
              onError={() => setFailedUrl(url)}
            />
          ) : (
            <p className="text-xs text-slate-500">
              {supabaseEnabled
                ? `${formatYearMonth(year, month)} ${kind === "predicted" ? "예측" : "오차"} 지도가 없습니다`
                : "frontendsam/.env 에 Supabase 정보를 넣어주세요"}
            </p>
          )}
        </div>
      </div>

      {/* 3. 하단 모델 성능 영역 */}
      <div className="flex flex-col justify-center h-[88px] px-5 border-t border-line bg-slate-50">
        <p className="text-[10px] font-bold text-brand mb-1">
          MODEL EVALUATION ·{" "}
          {monthly
            ? `${year}년 ${month}월`
            : `TEST 전체${testPeriod ? ` ${testPeriod}` : ""} (해당 월은 test 기간 밖)`}
        </p>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>정확도 <b className="inline-block w-11 tabular-nums text-navy-900">{pct(accuracy)}</b></span>
          <span>정밀도 <b className="inline-block w-11 tabular-nums text-navy-900">{pct(precision)}</b></span>
          <span>재현율 <b className="inline-block w-11 tabular-nums text-navy-900">{pct(recall)}</b></span>
        </div>
      </div>
    </section>
  )
}
