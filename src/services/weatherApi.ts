import type { IceAreaPoint } from "@/utils/types"
import { YEAR_MAX, YEAR_MIN } from "@/utils/constants"
import { iceArea } from "@/utils/mapRenderer"

// 실시간 연동 전까지 정적 샘플 모델을 반환. 연동 시 api.get(`/ice-area?month=${month}`)로 교체
export async function fetchIceAreaSeries(month: number): Promise<IceAreaPoint[]> {
  return Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => ({
    year: YEAR_MIN + i,
    area: iceArea(YEAR_MIN + i, month),
  }))
}
