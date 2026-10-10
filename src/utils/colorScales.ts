import type { RGB } from "@/utils/types"
import type { Variable, VariableMeta } from "@/utils/types"

const JET: [number, RGB][] = [
  [0, [8, 16, 110]],
  [0.2, [20, 90, 240]],
  [0.4, [20, 215, 220]],
  [0.55, [110, 230, 90]],
  [0.7, [240, 235, 40]],
  [0.85, [255, 140, 30]],
  [1, [225, 35, 35]],
]

export const jetGradient = `linear-gradient(to top, ${JET.map(
  ([p, c]) => `rgb(${c.join(",")}) ${p * 100}%`,
).join(", ")})`

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// 0~1 정규화 값을 범례 색상으로 변환
export function colorAt(v: number): RGB {
  const t = clamp01(v)
  for (let i = 1; i < JET.length; i++) {
    if (t <= JET[i][0]) {
      const [p0, c0] = JET[i - 1]
      const [p1, c1] = JET[i]
      const k = (t - p0) / (p1 - p0)
      return [
        c0[0] + (c1[0] - c0[0]) * k,
        c0[1] + (c1[1] - c0[1]) * k,
        c0[2] + (c1[2] - c0[2]) * k,
      ]
    }
  }
  return JET[JET.length - 1][1]
}

export const VARIABLES: Record<Variable, VariableMeta> = {
  sic: {
    label: "해빙 농도 (SIC)",
    short: "SIC",
    unit: "%",
    ticks: [100, 80, 60, 40, 20, 0],
  },
  tos: {
    label: "해수면 온도 (TOS)",
    short: "TOS",
    unit: "°C",
    ticks: [30, 20, 10, 0],
  },
  tas: {
    label: "지표 기온 (TAS)",
    short: "TAS",
    unit: "°C",
    ticks: [10, 0, -10, -20, -30],
  },
}

export const VARIABLE_KEYS = Object.keys(VARIABLES) as Variable[]
