import type { Variable } from "@/utils/types"

const files = import.meta.glob<string>(
  "../assets/maps/**/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, query: "?url", import: "default" },
)

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]
const VARIABLES = ["sic", "tos", "tas"]
const remoteTemplate = import.meta.env.VITE_MAP_IMAGE_URL_TEMPLATE?.trim()
const remoteBaseUrl = import.meta.env.VITE_MAP_IMAGE_BASE_URL?.trim().replace(/\/+$/, "")
const remoteExtension =
  import.meta.env.VITE_MAP_IMAGE_EXTENSION?.trim().replace(/^\./, "") || "png"

function monthFromFolder(name: string) {
  const num = name.match(/^(\d{1,2})(?:\D|$)/)
  if (num && Number(num[1]) >= 1 && Number(num[1]) <= 12) return Number(num[1])
  const idx = MONTH_NAMES.findIndex((m) => name.toLowerCase().includes(m))
  return idx >= 0 ? idx + 1 : undefined
}

// 지원 경로 (assets/maps 기준, 변수 폴더가 없으면 sic으로 간주)
//  [변수]/[월폴더]/[연도 포함 파일명]   예) sic/09_september/2025.png
//  [월폴더]/[연도 포함 파일명]          예) 09_september/2025.png
//  [변수]/YYYY-MM.확장자                예) sic/2025-09.png
const images = new Map<string, string>()
for (const [path, url] of Object.entries(files)) {
  const parts = path.split("/assets/maps/")[1]?.split("/")
  if (!parts) continue
  const hasVariable = VARIABLES.includes(parts[0])
  const variable = hasVariable ? parts[0] : "sic"
  const rest = hasVariable ? parts.slice(1) : parts
  const file = rest[rest.length - 1]

  let year: number | undefined
  let month: number | undefined
  if (rest.length >= 2) {
    month = monthFromFolder(rest[rest.length - 2])
    year = Number(file.match(/(19|20)\d{2}/)?.[0])
  } else {
    const m = file.match(/^((?:19|20)\d{2})-(\d{1,2})\./)
    if (m) {
      year = Number(m[1])
      month = Number(m[2])
    }
  }
  if (year && month) images.set(`${variable}/${year}/${month}`, url)
}

function getRemoteMapImage(variable: Variable, year: number, month: number) {
  const values: Record<string, string> = {
    variable,
    year: String(year),
    month: String(month),
    month2: String(month).padStart(2, "0"),
    extension: remoteExtension,
  }

  if (remoteTemplate) {
    return remoteTemplate.replace(
      /\{(variable|year|month|month2|extension)\}/g,
      (_, key: string) => values[key],
    )
  }

  if (remoteBaseUrl) {
    return `${remoteBaseUrl}/${variable}/${values.month2}/${year}.${remoteExtension}`
  }
}

export function getMapImage(variable: Variable, year: number, month: number) {
  return (
    images.get(`${variable}/${year}/${month}`) ??
    getRemoteMapImage(variable, year, month)
  )
}
