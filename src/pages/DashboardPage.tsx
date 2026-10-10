import MainLayout from "@/components/layout/MainLayout"
import SwipeCompare from "@/components/comparison/SwipeCompare"
import MonthControlBar from "@/components/controls/MonthControlBar"
import MapViewer from "@/components/mapViewer/MapViewer"
// 새로 추가될 미래 예측 컴포넌트 임포트 (경로는 프로젝트 구조에 맞게 수정 필요)
import FuturePredictionViewer from "@/components/mapViewer/FuturePredictionViewer" 

// 메인 2열 레이아웃: 왼쪽(지도 뷰어) = 50% + 100px, 오른쪽 = 나머지
const COLS = "xl:grid-cols-[calc(50%+100px)_minmax(0,1fr)]"

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
      {/* 월 선택 — 위쪽에선 카드, 스크롤하면 상단 고정 바 + 아코디언 */}
      <MonthControlBar />

      {/* 3. 메인 지도 영역 — 아래 행들도 같은 열 경계(COLS)를 써서 세로로 정렬 */}
      <div className={`grid gap-4 ${COLS}`}>
        <MapViewer />
        <FuturePredictionViewer />
      </div>

      {/* 4. 두 연도 비교 (모델 성능 카드는 '모델 성능' 페이지로 이동) */}
      <SwipeCompare />
    </MainLayout>
  )
}