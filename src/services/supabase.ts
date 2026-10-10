// Supabase 연동 (REST 직접 호출 — 추가 패키지 없음)
// frontendsam/.env 에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 를 넣으면 활성화된다.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "")
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET?.trim() || "sic-images"

export const supabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY)

export type MapKind = "observed" | "predicted" | "error"

export interface SicMapRow {
  id: number
  year: number
  month: number
  observed_path: string | null
  predicted_path: string | null
  error_path: string | null
  created_at: string
}

export interface MonthlyMetric {
  year: number
  month: number
  f1: number
  accuracy: number
  precision: number
  recall: number
}

export interface ModelEvaluationRow {
  id: number
  experiment_id: string
  learning_curve: {
    loss?: string
    unit?: string
    train_period?: string
    val_period?: string
    epochs?: number
    batch_size?: number
    learning_rate?: number
    best?: { epoch: number; val_loss: number }
    points?: { epoch: number; train_loss: number; val_loss: number }[]
  }
  // binary_ice_metrics_test_monthly.csv 의 active_union_cnn_* (test 기간 2018-01~2025-12)
  monthly_metrics?: MonthlyMetric[] | null
  classification_metrics: {
    test_period?: string
    n_months?: number
    threshold?: number
    metrics?: { f1: number; accuracy: number; precision: number; recall: number }
    confusion_matrix?: {
      tp: number
      fn: number
      fp: number
      tn: number
      total?: number
      fp_fn_ratio?: number
    }
  }
  created_at: string
}

async function select<T>(table: string, query: string): Promise<T[]> {
  if (!supabaseEnabled) return []
  const headers: Record<string, string> = { apikey: SUPABASE_KEY! }
  // 예전 anon 키(JWT, eyJ…)만 Authorization 헤더에 넣는다. sb_publishable_ 키는 apikey 헤더만 사용
  if (SUPABASE_KEY!.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_KEY}`
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers })
  if (!res.ok) throw new Error(`Supabase ${table} 조회 실패: ${res.status} ${await res.text()}`)
  return res.json()
}

// 버킷 내 경로 → 공개 URL
export function storageUrl(path: string | null | undefined) {
  if (!path || !SUPABASE_URL) return undefined
  const encoded = path.split("/").map(encodeURIComponent).join("/")
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encoded}`
}

export const fetchSicMaps = () =>
  select<SicMapRow>("sic_maps", "select=*&order=year.asc,month.asc")

export const fetchLatestModelEvaluation = () =>
  select<ModelEvaluationRow>("model_evaluation", "select=*&order=created_at.desc&limit=1").then(
    (rows) => rows[0] ?? null,
  )
