import { useState, type CSSProperties } from "react"
import type { Variable } from "@/utils/types"
import { getMapImage } from "@/utils/mapImages"
import { useSicMapUrl } from "@/hooks/useSupabaseData"
import type { MapKind } from "@/services/supabase"

interface MapViewProps {
  variable: Variable
  year: number
  month: number
  size: number
  className?: string
  style?: CSSProperties
  label: string
  kind?: MapKind
}

// 이미지 우선순위: assets/maps 로컬 사진 → Supabase(sic_maps 테이블) → 원격 템플릿 (없으면 안내 문구)
export default function MapView({ kind = "observed", ...props }: MapViewProps) {
  const local = kind === "observed" ? getMapImage(props.variable, props.year, props.month) : undefined
  const remote = useSicMapUrl(props.year, props.month, kind)
  const useSupabase = props.variable === "sic"
  const src = useSupabase ? (localOnly(local) ?? remote.url ?? local) : local
  const [failedSrc, setFailedSrc] = useState<string>()

  // Supabase 목록을 불러오는 동안은 빈 영역
  if (useSupabase && !localOnly(local) && remote.loading) {
    return <div className={props.className} style={props.style} aria-busy="true" />
  }
  if (!src || failedSrc === src) {
    return (
      <div
        className={`${props.className ?? ""} grid place-items-center bg-slate-100 text-xs text-slate-500`}
        style={props.style}
        role="img"
        aria-label={`${props.label} (이미지 없음)`}
      >
        이미지가 없습니다
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={props.label}
      className={`${props.className ?? ""} object-contain`}
      style={props.style}
      draggable={false}
      onError={() => setFailedSrc(src)}
    />
  )
}

// getMapImage 결과 중 번들된 로컬 파일만 (원격 템플릿 URL 제외)
function localOnly(url: string | undefined) {
  return url && !/^https?:\/\//.test(url) ? url : undefined
}
