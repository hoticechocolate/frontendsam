import MainLayout from "@/components/layout/MainLayout"
import LearningCurveChart from "@/components/model/LearningCurveChart"
import MetricsBarChart from "@/components/model/MetricsBarChart"
import ConfusionMatrixCard from "@/components/model/ConfusionMatrixCard"
import ModelInfoCard from "@/components/model/ModelInfoCard"

export default function ModelPerformancePage() {
  return (
    <MainLayout>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-navy-900">모델 성능</h1>
        <p className="mt-1 text-xs text-slate-500">
          CNN 해빙 예측 모델의 학습 과정과 test 기간 얼음/바다 판별 성능
        </p>
      </div>

      {/* 1. 학습 곡선 — 한 행 전체 */}
      <LearningCurveChart />

      {/* 2. 왼쪽: 혼동 행렬 / 오른쪽: 분류 성능 위, 모델 정보 아래 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ConfusionMatrixCard />
        <div className="flex flex-col gap-4">
          <MetricsBarChart />
          <ModelInfoCard />
        </div>
      </div>
    </MainLayout>
  )
}
