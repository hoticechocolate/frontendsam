export const YEAR_MIN = 2015
export const YEAR_MAX = 2025

export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

export const PLAYBACK_SPEEDS = [
  { value: 500, label: "0.5초" },
  { value: 1000, label: "1초" },
  { value: 2000, label: "2초" },
] as const
