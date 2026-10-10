import { useState, type CSSProperties } from "react"
import type { Variable } from "@/utils/types"
import { getMapImage } from "@/utils/mapImages"
import { useSicMapUrl } from "@/hooks/useSupabaseData"
import type { MapKind } from "@/services/supabase"
import MapCanvas from "./MapCanvas"

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

// 이미지 우선순위: assets/maps 로컬 사진 → Supabase(sic_maps 테이블) → 원격 템플릿 → 샘플 Canvas 지도
export default function MapView({ kind = "observed", ...props }: MapViewProps) {
  const local = kind === "observed" ? getMapImage(props.variable, props.year, props.month) : undefined
  const remote = useSicMapUrl(props.year, props.month, kind)
  const useSupabase = props.variable === "sic"
  const src = useSupabase ? (localOnly(local) ?? remote.url ?? local) : local
  const [failedSrc, setFailedSrc] = useState<string>()

  // Supabase 목록을 불러오는 동안은 Canvas 대신 빈 영역을 보여 깜빡임을 줄인다
  if (useSupabase && !localOnly(local) && remote.loading) {
    return <div className={props.className} style={props.style} aria-busy="true" />
  }
  if (!src || failedSrc === src) return <MapCanvas {...props} />
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
