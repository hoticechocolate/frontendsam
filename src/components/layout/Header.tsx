import { useState } from "react"
import localLogo from "@/assets/logo.png"
import { storageUrl } from "@/services/supabase"
import NavMenu from "./NavMenu"

// 로고: Supabase Storage(sic-images/logo.png) 우선, 실패하면 로컬 파일
const remoteLogo = storageUrl("logo.png")

export default function Header() {
  const [useLocal, setUseLocal] = useState(!remoteLogo)
  const src = useLocal ? localLogo : remoteLogo!

  return (
    <header className="bg-navy-900 text-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1">
            <img
              src={src}
              alt="폴라리스 로고"
              className={useLocal ? "size-full object-contain" : "size-full object-cover"}
              // Supabase 원본은 여백이 넓은 세로 이미지라 곰·눈송이 부분만 보이도록 확대
              style={useLocal ? undefined : { objectPosition: "50% 29%", transform: "scale(1.7)" }}
              onError={() => setUseLocal(true)}
            />
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
        <NavMenu />
      </div>
    </header>
  )
}
