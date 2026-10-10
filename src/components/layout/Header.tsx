import Icon from "@/components/common/Icon"

export default function Header() {
  return (
    <header className="bg-navy-900 text-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand">
            <Icon name="route" className="size-6" />
          </div>
          <div className="border-r border-white/25 pr-4">
            <p className="text-lg font-bold leading-tight">폴라리스</p>
            <p className="text-[10px] text-slate-300">북극 항로 분석</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-bold leading-tight">
              북극 해빙 변화 분석 서비스
            </p>
            <p className="text-xs text-slate-300">
              데이터로 보는, 더 가까워지는 북극
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
