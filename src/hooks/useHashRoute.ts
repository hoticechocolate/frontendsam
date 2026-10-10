import { useEffect, useState } from "react"

// 주소 해시(#/model)로 페이지를 구분 — 라이브러리·Vercel 설정 없이 새로고침/뒤로가기 동작
export type Route = "dashboard" | "model"

export const ROUTES: { id: Route; hash: string; label: string; desc: string }[] = [
  { id: "dashboard", hash: "#/", label: "해빙 대시보드", desc: "관측·예측 지도와 연도 비교" },
  { id: "model", hash: "#/model", label: "모델 성능", desc: "학습 곡선·분류 성능·혼동 행렬" },
]

const fromHash = (hash: string): Route => (hash.startsWith("#/model") ? "model" : "dashboard")

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => fromHash(window.location.hash))

  useEffect(() => {
    const onChange = () => {
      setRoute(fromHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  return route
}
