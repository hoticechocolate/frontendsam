import { useState, useEffect, useRef, useCallback } from "react"
import { useDashboardStore } from "@/hooks/useDashboardStore"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"

export function usePlayback(defaultSpeed = 500) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(defaultSpeed)

  const year = useDashboardStore((s) => s.year)
  const setYear = useDashboardStore((s) => s.setYear)

  // 타이머 안에서 최신 연도 값을 참조하기 위한 useRef
  const yearRef = useRef(year)
  yearRef.current = year

  const play = useCallback(() => setPlaying(true), [])
  const pause = useCallback(() => setPlaying(false), [])

  useEffect(() => {
    // 일시정지 상태면 타이머 실행 안 함
    if (!playing) return

    const interval = setInterval(() => {
      if (yearRef.current >= YEAR_MAX) {
        // 끝 연도에 도달하면 다시 처음 연도(YEAR_MIN)로 되돌아가서 반복
        setYear(YEAR_MIN) 
      } else {
        // 다음 연도로 1년 증가
        setYear(yearRef.current + 1)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [playing, speed, setYear])

  return { playing, speed, play, pause, setSpeed }
}