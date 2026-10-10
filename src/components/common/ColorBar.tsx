interface ColorBarProps {
  gradient: string
  ticks: number[]
  height?: string
}

export default function ColorBar({
  gradient,
  ticks,
  height = "h-28",
}: ColorBarProps) {
  return (
    <div className="flex items-stretch gap-1.5">
      <div
        className={`w-2.5 shrink-0 rounded-sm ${height}`}
        style={{ backgroundImage: gradient }}
      />
      <div className={`flex flex-col justify-between text-[10px] ${height}`}>
        {ticks.map((t) => (
          <span key={t} className="leading-none">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
