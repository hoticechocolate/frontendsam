import type { DrawMapOptions, RGB } from "@/utils/types"
import { clamp01, colorAt } from "./colorScales"
import { YEAR_MAX, YEAR_MIN } from "./constants"

function hash(ix: number, iy: number) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

function vnoise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const u = fx * fx * (3 - 2 * fx)
  const v = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

function fbm(x: number, y: number) {
  return (
    vnoise(x, y) * 0.55 +
    vnoise(x * 2.1 + 7, y * 2.1 + 3) * 0.3 +
    vnoise(x * 4.3 + 1, y * 4.3 + 9) * 0.15
  )
}

function edgeRadius(year: number, month: number) {
  const t = (year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)
  const s = (1 + Math.cos((2 * Math.PI * (month - 3)) / 12)) / 2
  const sep = 0.68 - 0.2 * t
  const mar = 0.88 - 0.05 * t
  return sep + (mar - sep) * s
}

// 정적 샘플 모델: 실제 관측 데이터 연동 시 services 계층으로 대체
export function iceArea(year: number, month: number) {
  const r = edgeRadius(year, month)
  const wiggle = 1 + (hash(year, month) - 0.5) * 0.07
  return 3.52 * Math.pow(r / 0.48, 2) * wiggle
}

function sicAt(nx: number, ny: number, r: number, edge: number) {
  const th = Math.atan2(ny, nx)
  const wob = (fbm(Math.cos(th) * 1.6 + 4, Math.sin(th) * 1.6 + 4) - 0.5) * 0.34
  const patch = fbm(nx * 5 + 12, ny * 5 + 12) - 0.5
  return clamp01((edge + wob + 0.08 - r) / 0.2 + patch * 0.7)
}

function isLand(nx: number, ny: number, r: number) {
  if (r < 0.55) return false
  return fbm(nx * 2.4 + 30, ny * 2.4 + 30) > 0.6 - (r - 0.55) * 0.9
}

const LAND: RGB = [44, 58, 80]
const RED: RGB = [230, 40, 50]
const WHITE: RGB = [255, 255, 255]

export function drawMap(
  canvas: HTMLCanvasElement,
  { variable, year, month }: DrawMapOptions,
) {
  const size = canvas.width
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const img = ctx.createImageData(size, size)
  const d = img.data
  const edge = edgeRadius(year, month)
  const baseEdge = edgeRadius(YEAR_MIN, month) + 0.04
  const t = (year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)
  const season = Math.cos((2 * Math.PI * (month - 7)) / 12)

  const n = size * size
  const sic = new Float32Array(n)
  const base = new Float32Array(n)
  const land = new Uint8Array(n)
  const inDisc = new Uint8Array(n)
  const thick = size >= 300

  const put = (x: number, y: number, c: RGB) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const j = (y * size + x) * 4
    d[j] = c[0]
    d[j + 1] = c[1]
    d[j + 2] = c[2]
    d[j + 3] = 255
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1
      const ny = ((y + 0.5) / size) * 2 - 1
      const r = Math.hypot(nx, ny)
      if (r > 1) continue
      const i = y * size + x
      inDisc[i] = 1
      const l = isLand(nx, ny, r)
      land[i] = l ? 1 : 0
      if (!l) {
        sic[i] = sicAt(nx, ny, r, edge)
        base[i] = sicAt(nx, ny, r, baseEdge)
      }
      let c: RGB
      if (variable === "sic") {
        if (l) c = LAND
        else {
          c = colorAt(sic[i] * 0.88)
          const w = clamp01((sic[i] - 0.9) / 0.1)
          if (w > 0)
            c = [
              c[0] + (232 - c[0]) * w,
              c[1] + (244 - c[1]) * w,
              c[2] + (250 - c[2]) * w,
            ]
        }
      } else if (variable === "tos") {
        if (l) c = LAND
        else {
          const T =
            28 * Math.pow(r, 1.3) * (0.75 + 0.25 * season) +
            t * 1.5 +
            (fbm(nx * 4 + 50, ny * 4 + 50) - 0.5) * 5
          c = colorAt(T / 30)
        }
      } else {
        const T =
          -32 +
          40 * Math.pow(r, 1.2) +
          season * 8 +
          t * 2 +
          (fbm(nx * 3 + 80, ny * 3 + 80) - 0.5) * 8
        c = colorAt((T + 30) / 40)
        if (l) c = [c[0] * 0.8, c[1] * 0.8, c[2] * 0.85]
      }
      const j = i * 4
      d[j] = c[0]
      d[j + 1] = c[1]
      d[j + 2] = c[2]
      d[j + 3] = 255
    }
  }

  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const i = y * size + x
      if (!inDisc[i] || land[i]) continue
      for (const k of [i + 1, i + size]) {
        if (!inDisc[k] || land[k]) continue
        if (sic[i] >= 0.15 !== sic[k] >= 0.15) {
          put(x, y, RED)
          if (thick) {
            put(x + 1, y, RED)
            put(x, y + 1, RED)
          }
        }
        if (base[i] >= 0.15 !== base[k] >= 0.15 && ((x + y) >> 3) % 2 === 0) {
          put(x, y, WHITE)
          if (thick) put(x + 1, y, WHITE)
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  const c = size / 2
  ctx.save()
  ctx.beginPath()
  ctx.arc(c, c, c, 0, Math.PI * 2)
  ctx.clip()
  ctx.strokeStyle = "rgba(255,255,255,0.14)"
  ctx.lineWidth = 1
  for (const f of [0.33, 0.66]) {
    ctx.beginPath()
    ctx.arc(c, c, c * f, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.moveTo(c, 0)
  ctx.lineTo(c, size)
  ctx.moveTo(0, c)
  ctx.lineTo(size, c)
  ctx.stroke()
  ctx.restore()
  ctx.strokeStyle = "rgba(255,255,255,0.25)"
  ctx.beginPath()
  ctx.arc(c, c, c - 0.5, 0, Math.PI * 2)
  ctx.stroke()
}
