import { useEffect, useRef, useState } from "react"
import { ROUTES, useHashRoute } from "@/hooks/useHashRoute"

// 헤더 오른쪽 상단 메뉴 버튼 + 페이지 선택 패널
export default function NavMenu() {
  const route = useHashRoute()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const current = ROUTES.find((r) => r.id === route)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span className="hidden sm:inline">{current?.label ?? "메뉴"}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white text-navy-900 shadow-xl"
        >
          <p className="bg-navy-900 px-4 py-2.5 text-xs font-bold text-white">메뉴 선택</p>
          <ul className="p-1.5">
            {ROUTES.map((r) => {
              const active = r.id === route
              return (
                <li key={r.id}>
                  <a
                    href={r.hash}
                    role="menuitem"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 ${
                      active ? "bg-brand-soft" : "hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      <span className={`block text-sm font-bold ${active ? "text-brand" : "text-navy-900"}`}>
                        {r.label}
                      </span>
                      <span className="block text-[11px] text-slate-500">{r.desc}</span>
                    </span>
                    {active && <span className="size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
