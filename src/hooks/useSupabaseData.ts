import { useEffect, useState } from "react"
import {
  fetchLatestModelEvaluation,
  fetchSicMaps,
  storageUrl,
  supabaseEnabled,
  type MapKind,
  type ModelEvaluationRow,
  type SicMapRow,
} from "@/services/supabase"

// 앱 전체에서 한 번만 불러오도록 모듈 단위로 캐시
let sicMapsPromise: Promise<Map<string, SicMapRow>> | null = null
let evaluationPromise: Promise<ModelEvaluationRow | null> | null = null

const key = (year: number, month: number) => `${year}-${month}`

function loadSicMaps() {
  sicMapsPromise ??= fetchSicMaps()
    .then((rows) => new Map(rows.map((r) => [key(r.year, r.month), r])))
    .catch((e) => {
      console.error(e)
      return new Map<string, SicMapRow>()
    })
  return sicMapsPromise
}

function loadEvaluation() {
  evaluationPromise ??= fetchLatestModelEvaluation().catch((e) => {
    console.error(e)
    return null
  })
  return evaluationPromise
}

export function useSicMaps() {
  const [maps, setMaps] = useState<Map<string, SicMapRow> | null>(null)
  useEffect(() => {
    if (!supabaseEnabled) return
    let alive = true
    loadSicMaps().then((m) => alive && setMaps(m))
    return () => {
      alive = false
    }
  }, [])
  return { maps, loading: supabaseEnabled && maps === null }
}

// 특정 연·월의 관측/예측/오차 이미지 URL
export function useSicMapUrl(year: number, month: number, kind: MapKind = "observed") {
  const { maps, loading } = useSicMaps()
  const row = maps?.get(key(year, month))
  return { url: storageUrl(row?.[`${kind}_path`]), loading }
}

export function useModelEvaluation() {
  const [data, setData] = useState<ModelEvaluationRow | null | undefined>(undefined)
  useEffect(() => {
    if (!supabaseEnabled) return
    let alive = true
    loadEvaluation().then((d) => alive && setData(d))
    return () => {
      alive = false
    }
  }, [])
  return { data: data ?? null, loading: supabaseEnabled && data === undefined }
}
