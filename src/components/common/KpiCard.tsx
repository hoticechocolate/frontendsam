import Icon, { type IconName } from "./Icon"

interface KpiCardProps {
  label: string
  value: string
  detail: string
  icon: IconName
  accent?: boolean
  warning?: boolean
}

export default function KpiCard({
  label,
  value,
  detail,
  icon,
  accent = false,
  warning = false,
}: KpiCardProps) {
  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 ${
        warning
          ? "border-amber-200 bg-amber-50"
          : accent
            ? "border-brand/25 bg-brand-soft"
            : "border-line bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold tracking-wide text-slate-500">
            {label}
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <p
              className={`text-2xl font-bold tracking-tight ${
                warning ? "text-amber-900" : "text-navy-900"
              }`}
            >
              {value}
            </p>
            <span
              className={`text-xs font-semibold ${
                warning ? "text-amber-700" : "text-brand"
              }`}
            >
              {detail}
            </span>
          </div>
        </div>
        <div
          className={`grid size-9 shrink-0 place-items-center rounded-xl ${
            warning
              ? "bg-amber-100 text-amber-700"
              : accent
                ? "bg-brand text-white"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          <Icon name={icon} className="size-[18px]" />
        </div>
      </div>
    </div>
  )
}
