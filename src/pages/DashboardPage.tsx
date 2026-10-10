import MainLayout from "@/components/layout/MainLayout"
import SwipeCompare from "@/components/comparison/SwipeCompare"
import MonthSelector from "@/components/controls/MonthSelector"
import VariableSelector from "@/components/controls/VariableSelector"
import MapViewer from "@/components/mapViewer/MapViewer"
// 새로 추가될 미래 예측 컴포넌트 임포트 (경로는 프로젝트 구조에 맞게 수정 필요)
import FuturePredictionViewer from "@/components/mapViewer/FuturePredictionViewer" 
import LearningCurveChart from "@/components/model/LearningCurveChart"
import MetricsBarChart from "@/components/model/MetricsBarChart"
import ConfusionMatrixCard from "@/components/model/ConfusionMatrixCard"
import ModelInfoCard from "@/components/model/ModelInfoCard"

export default function DashboardPage() {
  return (
    <MainLayout>
      {/* 1. 타이틀 및 헤더 영역 */}
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-navy-900">
            북극 해빙 현황
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            위성 관측과 예측 모델을 활용한 북극권 통합 모니터링
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
          <span className="size-2 rounded-full bg-brand shadow-[0_0_0_3px_rgba(23,105,224,.15)]" />
          실시간 데이터 · 2025년 9월 18일 14:32 세계협정시
        </div>
      </div>

      {/* 2. 컨트롤 영역 (카드 스타일로 병합) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="w-full lg:w-auto">
          <VariableSelector />
        </div>
        <div className="w-full flex-1">
          <MonthSelector />
        </div>
      </div>

      {/* 3. 메인 지도 영역 (관측 지도 6 : 예측 지도 4) */}
      <div className="grid gap-4 xl:grid-cols-[calc(50%+100px)_minmax(0,1fr)]">
        <MapViewer />
        <FuturePredictionViewer />
      </div>

      {/* 4. 모델 학습 곡선 6 : 두 연도 비교 4 */}
      <div className="grid gap-4 xl:grid-cols-[6fr_4fr]">
        <LearningCurveChart />
        <SwipeCompare />
      </div>

      {/* 5. 모델 평가 (model_evaluation 테이블) */}
      <div className="grid gap-4 lg:grid-cols-3">
        <MetricsBarChart />
        <ConfusionMatrixCard />
        <ModelInfoCard />
      </div>
    </MainLayout>
  )
}