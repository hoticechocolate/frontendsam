import Card from "@/components/common/Card"
import routeMap from "@/assets/arcticRoute.svg"

export default function RouteInfo() {
  return (
    <Card title="북극항로 정보">
      <p className="text-sm font-bold text-navy-900">북극항로 개통 시기</p>
      <p className="mt-0.5 text-[11px] text-slate-500">
        부산항 → 베링해협 → 유럽
      </p>
      <div className="relative mt-2">
        <img
          src={routeMap}
          alt="부산항에서 베링해협을 거쳐 유럽으로 이어지는 북극항로"
          className="w-full"
        />
        <span className="absolute left-[10%] top-[82%] text-[10px] font-semibold text-navy-900">
          부산
        </span>
        <span className="absolute left-[32%] top-[26%] text-[10px] font-semibold text-navy-900">
          베링해협
        </span>
        <span className="absolute left-[80%] top-[86%] text-[10px] font-semibold text-navy-900">
          유럽
        </span>
        <span className="absolute left-[56%] top-[20%] text-[10px] font-semibold text-brand">
          북극항로 (약 10~15일 단축)
        </span>
      </div>
      <div className="mt-2 rounded-xl border border-line bg-slate-50 px-3 py-2.5">
        <p className="text-[11px] font-bold text-navy-900">예상 개통 시기</p>
        <p className="mt-0.5 text-xs font-bold text-navy-900">
          2040년대 이후{" "}
          <span className="font-medium text-slate-500">
            (기후 변화에 따라 변동 가능)
          </span>
        </p>
      </div>
    </Card>
  )
}
