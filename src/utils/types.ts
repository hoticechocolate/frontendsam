export type Variable = "sic" | "tos" | "tas"

export type StatisticsPeriod = "yearly" | "monthly"

export interface VariableMeta {
  label: string
  short: string
  unit: string
  ticks: number[]
}

export interface IceAreaPoint {
  year: number
  area: number
}

export type RGB = [number, number, number]

export interface DrawMapOptions {
  variable: Variable
  year: number
  month: number
}
