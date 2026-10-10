import { useEffect, useRef, useState } from "react"

// 값이 바뀌면 이전 값에서 새 값까지 짧게 숫자가 굴러가듯 변한다
export function useAnimatedNumber(target: number | undefined, duration = 450) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)

  useEffect(() => {
    if (target == null) {
      fromRef.current = undefined
      setValue(undefined)
      return
    }
    const from = fromRef.current
    // 처음 값이 들어올 때는 애니메이션 없이 바로 표시
    if (from == null || from === target) {
      fromRef.current = target
      setValue(target)
      return
    }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      fromRef.current = target
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (target - from) * eased
      fromRef.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // 탭이 백그라운드라 프레임이 멈춰도 최종 값은 반드시 반영
    const done = window.setTimeout(() => {
      cancelAnimationFrame(raf)
      fromRef.current = target
      setValue(target)
    }, duration + 80)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(done)
    }
  }, [target, duration])

  return value
}
