import { create } from "zustand"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"

interface DashboardState {
  month: number
  year: number
  playing: boolean
  speed: number
  setMonth: (month: number) => void
  setYear: (year: number) => void
  stepMonth: (delta: number) => void
  advanceMonth: () => void
  play: () => void
  pause: () => void
  setSpeed: (speed: number) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  month: 9,
  year: YEAR_MAX,
  playing: false,
  speed: 500,
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),
  stepMonth: (delta) =>
    set((s) => {
      const currentIndex = (s.year - YEAR_MIN) * 12 + (s.month - 1)
      const lastIndex = (YEAR_MAX - YEAR_MIN + 1) * 12 - 1
      const nextIndex = Math.min(lastIndex, Math.max(0, currentIndex + delta))

      return {
        year: YEAR_MIN + Math.floor(nextIndex / 12),
        month: (nextIndex % 12) + 1,
      }
    }),
  advanceMonth: () =>
    set((s) => {
      if (s.year === YEAR_MAX && s.month === 12) {
        return { year: YEAR_MIN, month: 1 }
      }
      if (s.month === 12) {
        return { year: s.year + 1, month: 1 }
      }
      return { month: s.month + 1 }
    }),
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  setSpeed: (speed) => set({ speed }),
}))
