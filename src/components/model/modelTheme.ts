// 모델 평가 차트 공통 색상·포맷
// 계열 색은 dataviz 기본 팔레트 1·2번 슬롯 (색약 대비 검증 통과)
export const SERIES = {
  train: "#2a78d6", // 학습 손실
  val: "#eb6834", // 검증 손실
} as const

export const INK = {
  primary: "#0a1c42",
  secondary: "#475569",
  muted: "#94a3b8",
  grid: "#e3e9f3",
  axis: "#94a3b8",
} as const

export const pct = (v: number | undefined, digits = 1) =>
  v == null ? "–" : `${(v * 100).toFixed(digits)}%`

export const loss = (v: number) => v.toFixed(5)

export const count = (v: number) => v.toLocaleString("ko-KR")
