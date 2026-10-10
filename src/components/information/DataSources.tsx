import Card from "@/components/common/Card"

const GLOSSARY: [string, string][] = [
  ["해빙 농도 (SIC)", "바다 표면의 얼음이 차지하는 비율(%)"],
  ["해수면 온도 (TOS)", "해수면의 온도(°C)"],
  ["지표 기온 (TAS)", "지표 근처의 기온(°C)"],
  ["관측 사상 최대 해빙 범위", "위성 관측 기간 중 가장 넓은 해빙 범위"],
  ["해빙 경계 15%", "해빙 농도가 15% 이상인 지역의 경계"],
]

export default function DataSources() {
  return (
    <Card title="데이터 출처 및 용어 설명">
      <div className="space-y-2 text-[11px] leading-relaxed text-slate-600">
        <div className="rounded-xl border border-line p-3">
          <p className="font-bold text-navy-900">데이터 출처</p>
          <p className="mt-1">
            <b className="text-navy-900">NSIDC</b> (National Snow and Ice Data
            Center)
          </p>
          <p className="text-slate-500">
            미국 콜로라도대학교에서 운영하는 북극 해빙 관측 데이터 센터
          </p>
          <p className="mt-1">
            <b className="text-navy-900">원본 데이터:</b> Sea Ice Concentration
            (SIC), 1989–2025
          </p>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="font-bold text-navy-900">주요 용어 설명</p>
          <dl className="mt-1 space-y-1">
            {GLOSSARY.map(([term, desc]) => (
              <div key={term} className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-navy-900">{term}</dt>
                <dd className="text-slate-500">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Card>
  )
}
