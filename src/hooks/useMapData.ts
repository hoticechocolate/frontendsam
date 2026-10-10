import { useEffect, useState } from "react"
import { fetchIceAreaSeries } from "@/services/weatherApi"
import type { IceAreaPoint } from "@/utils/types"

const cache = new Map<number, IceAreaPoint[]>()

export function useIceAreaSeries(month: number) {
  const [fetched, setFetched] = useState<{
    month: number
    data: IceAreaPoint[]
  } | null>(null)

  useEffect(() => {
    if (cache.has(month)) return
    let cancelled = false
    fetchIceAreaSeries(month).then((data) => {
      cache.set(month, data)
      if (!cancelled) setFetched({ month, data })
    })
    return () => {
      cancelled = true
    }
  }, [month])

  const data = cache.get(month) ?? (fetched?.month === month ? fetched.data : null)
  return { data, loading: data === null }
}
