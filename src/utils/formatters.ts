export const formatYearMonth = (year: number, month: number) =>
  `${year}년 ${month}월`

export const formatArea = (area: number) => `${area.toFixed(2)} 백만 km²`

export const decreaseRate = (from: number, to: number) =>
  Math.round((1 - to / from) * 100)
