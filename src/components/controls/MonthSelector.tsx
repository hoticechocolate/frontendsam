import { useDashboardStore } from "@/hooks/useDashboardStore"

export default function MonthSelector() {
  const month = useDashboardStore((s) => s.month)
  const setMonth = useDashboardStore((s) => s.setMonth)

  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="flex flex-col gap-2">
      {/* 💡 relative를 추가하여 내부의 슬라이딩 박스가 기준을 잡을 수 있게 합니다 */}
      <div className="relative flex w-full rounded-lg bg-slate-100 p-1" role="group">
        
        {/* 💡 부드럽게 이동하는 하이라이트 배경 (흰색 박스) */}
        <div
          className="absolute bottom-1 top-1 rounded-md bg-white shadow-sm transition-transform duration-300 ease-out"
          style={{
            width: 'calc((100% - 0.5rem) / 12)', // 좌우 패딩(0.5rem)을 제외한 영역의 1/12 크기
            left: '0.25rem', // 부모의 p-1 (4px) 시작점
            transform: `translateX(${(month - 1) * 100}%)`, // 선택된 월에 맞춰 자신의 너비만큼 X축 이동
          }}
        />

        {/* 버튼 영역 */}
        {months.map((m) => {
          const isActive = month === m

          return (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(m)}
              // 💡 relative와 z-10을 주어 글자가 흰색 배경(하이라이트) 위로 올라오게 합니다.
              // 개별 버튼이 갖던 bg-white 클래스는 제거했습니다.
              className={`relative z-10 flex-1 rounded-md py-2.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                isActive
                  ? "text-brand" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {m}월
            </button>
          )
        })}
      </div>
    </div>
  )
}