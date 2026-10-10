import { memo, useEffect, useRef, type CSSProperties } from "react"
import type { Variable } from "@/utils/types"
import { drawMap } from "@/utils/mapRenderer"

interface MapCanvasProps {
  variable: Variable
  year: number
  month: number
  size: number
  className?: string
  style?: CSSProperties
  label: string
}

function MapCanvas({
  variable,
  year,
  month,
  size,
  className,
  style,
  label,
}: MapCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) drawMap(ref.current, { variable, year, month })
  }, [variable, year, month])

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={className}
      style={style}
      role="img"
      aria-label={label}
    />
  )
}

export default memo(MapCanvas)
