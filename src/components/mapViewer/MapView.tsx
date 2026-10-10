import { useState, type CSSProperties } from "react"
import type { Variable } from "@/utils/types"
import { getMapImage } from "@/utils/mapImages"
import MapCanvas from "./MapCanvas"

interface MapViewProps {
  variable: Variable
  year: number
  month: number
  size: number
  className?: string
  style?: CSSProperties
  label: string
}

// assets/maps에 해당 변수·연월 사진이 있으면 사진을, 없으면 샘플 Canvas 지도를 표시
export default function MapView(props: MapViewProps) {
  const src = getMapImage(props.variable, props.year, props.month)
  const [failedSrc, setFailedSrc] = useState<string>()

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
