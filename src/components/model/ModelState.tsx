import type { ReactNode } from "react"
import Spinner from "@/components/common/Spinner"
import { useModelEvaluation } from "@/hooks/useSupabaseData"
import { supabaseEnabled, type ModelEvaluationRow } from "@/services/supabase"

// model_evaluation 을 불러오는 동안·없을 때의 공통 처리
export default function ModelState({
  children,
}: {
  children: (data: ModelEvaluationRow) => ReactNode
}) {
  const { data, loading } = useModelEvaluation()
  if (!supabaseEnabled)
    return <Empty>frontendsam/.env 에 Supabase 정보를 넣어주세요</Empty>
  if (loading) return <Spinner label="모델 평가 불러오는 중" />
  if (!data) return <Empty>model_evaluation 테이블에 데이터가 없습니다</Empty>
  return <>{children(data)}</>
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-10 text-center text-xs text-slate-500">{children}</p>
}
