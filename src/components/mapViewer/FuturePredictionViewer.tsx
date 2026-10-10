import { useState, useEffect } from "react"

export default function FuturePredictionViewer() {
  // 💡 [BACKEND 연동 준비] 백엔드에서 받아올 데이터를 저장할 상태들입니다.
  const [predictionData, setPredictionData] = useState({
    imageUrl: "",
    confidence: "87.4%",
    insightTitle: "",
    insightDesc: ""
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 💡 [BACKEND 연동 준비] 데이터를 불러오는 함수입니다.
    const fetchPredictionData = async () => {
      setIsLoading(true)
      try {
        // ---------------------------------------------------------
        // 🚀 나중에 실제 API를 연결할 때는 아래 주석을 풀고 사용하세요.
        // const response = await fetch("https://api.your-backend.com/v1/predict/2026");
        // const data = await response.json();
        // setPredictionData({
        //   imageUrl: data.image_url,
        //   confidence: data.confidence_score,
        //   insightTitle: data.insight_title,
        //   insightDesc: data.insight_description
        // });
        // ---------------------------------------------------------

        // 📌 현재는 프론트엔드 UI 확인을 위한 임시(Mock) 데이터를 세팅합니다.
        // 아래 setTimeout은 서버에서 데이터를 가져오는 로딩 시간을 흉내낸 것입니다.
        setTimeout(() => {
          setPredictionData({
            // 여기에 원하시는 임시 사진의 경로를 넣어주세요! (예: public/assets/ 폴더 기준)
            imageUrl: "src/assets/glacier-2005-01.png", 
            confidence: "87.4%",
            insightTitle: "바렌츠해 중심 해빙 감소 예상",
            insightDesc: "해수면 온도 상승 영향으로 전년 동월 대비 4.2% 감소할 전망입니다."
          })
          setIsLoading(false)
        }, 500) // 0.5초 딜레이

      } catch (error) {
        console.error("백엔드에서 예측 데이터를 가져오는데 실패했습니다:", error)
        setIsLoading(false)
      }
    }

    fetchPredictionData()
  }, []) // 컴포넌트가 처음 화면에 나타날 때 한 번만 실행됨

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl bg-navy-950 text-white shadow-lg border border-slate-800">
      
      {/* 1. 상단 헤더 영역 */}
      <div className="flex items-start justify-between px-5 pt-5 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">미래 해빙 변화 예측</h2>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400">
              NEW
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            CNN 기반 2026년 해빙 농도 예측
          </p>
        </div>
        
        {/* 모델 신뢰도 뱃지 */}
        <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-[11px]">
          <span className="text-slate-300">모델 신뢰도</span>
          <span className="font-bold text-sky-400">{predictionData.confidence}</span>
        </div>
      </div>

      {/* 2. 메인 이미지 뷰어 영역 (수정된 코드) */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* 💡 왼쪽 MapViewer와 완벽히 동일한 컨테이너(aspect-square w-[88%])를 추가합니다 */}
        <div className="relative mx-auto aspect-square w-[88%] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <div className="size-8 animate-spin rounded-full border-4 border-slate-700 border-t-brand" />
              <p className="text-xs">AI 예측 모델 구동 중...</p>
            </div>
          ) : (
            <img 
              src={predictionData.imageUrl} 
              alt="2026년 미래 해빙 예측 지도" 
              // 💡 이미지가 컨테이너에 꽉 차도록 w-full h-full 로 변경합니다
              className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x400.png?text=Image+Not+Found";
              }}
            />
          )}
        </div>
      </div>

      {/* 3. 하단 인사이트(분석 결과) 영역 */}
      <div className="flex flex-col justify-center h-[88px] px-5 border-t border-slate-800 bg-navy-900/50">
        <p className="text-[10px] font-bold text-sky-400 mb-1">
          MODEL INSIGHT
        </p>
        <h3 className="text-sm font-bold text-white">
          {predictionData.insightTitle}
        </h3>
        <p className="mt-1 text-xs text-slate-400 truncate">
          {predictionData.insightDesc}
        </p>
      </div>
      
    </section>
  )
}