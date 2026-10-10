import type { ReactNode } from "react"

interface ToggleButtonProps {
  active: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}

export default function ToggleButton({
  active,
  onClick,
  children,
  className = "",
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-white text-navy-900 hover:bg-brand-soft"
      } ${className}`}
    >
      {children}
    </button>
  )
}
