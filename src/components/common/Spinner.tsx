export default function Spinner({ label = "불러오는 중" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-10 text-xs text-slate-500"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-brand" />
      {label}
    </div>
  )
}
