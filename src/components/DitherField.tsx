import { useEffect, useRef } from 'react'
import { cn } from './ui'

// A live, ordered-dither field drawn on a tiny canvas (one pixel per cell), scaled up with
// `image-rendering: pixelated` and cut into dots by a CSS mask. Pauses offscreen, honours
// reduced motion, and leans toward the pointer.

const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57,
  25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64)

export type FieldVariant = 'horizon' | 'aurora' | 'tide'

type RGB = [number, number, number]
const RAMP: RGB[] = [
  [96, 112, 255],
  [150, 120, 255],
  [255, 128, 206],
  [255, 182, 118],
]

function ramp(t: number, out: RGB) {
  const x = Math.min(0.999, Math.max(0, t)) * (RAMP.length - 1)
  const i = Math.floor(x)
  const f = x - i
  const a = RAMP[i]
  const b = RAMP[i + 1]
  out[0] = a[0] + (b[0] - a[0]) * f
  out[1] = a[1] + (b[1] - a[1]) * f
  out[2] = a[2] + (b[2] - a[2]) * f
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function field(variant: FieldVariant, u: number, v: number, t: number, aspect: number) {
  if (variant === 'horizon') {
    const x = u * 2 - 1
    const crest = 0.86 - 0.12 * (1 - x * x) + 0.018 * Math.sin(u * 7 + t * 0.7) + 0.012 * Math.sin(u * 19 - t * 1.1)
    const d = v - crest
    const band = Math.exp(-((d / 0.028) ** 2)) * 1.05
    const below = d > 0 ? Math.exp(-d / 0.07) * (0.55 + 0.25 * Math.sin(u * 11 + v * 23 - t * 1.4)) : 0
    const above = d < 0 ? Math.exp(d / 0.035) * 0.35 : 0
    return band + below + above
  }
  if (variant === 'tide') {
    const w = Math.sin(u * 5 * aspect + t * 0.5) * 0.08 + Math.sin(u * 13 - t * 0.8) * 0.03
    const d = v - (0.74 + w)
    return d > 0 ? Math.exp(-d / 0.14) * (0.75 + 0.25 * Math.sin(u * 30 + t)) : Math.exp(d / 0.03) * 0.6
  }
  // aurora: drifting soft blobs
  let s = 0
  for (let k = 0; k < 3; k++) {
    const cx = 0.5 + 0.38 * Math.sin(t * (0.13 + k * 0.05) + k * 2.1)
    const cy = 0.55 + 0.3 * Math.cos(t * (0.11 + k * 0.04) + k * 1.3)
    const dx = (u - cx) * aspect
    const dy = v - cy
    s += Math.exp(-(dx * dx + dy * dy) / (0.09 + 0.04 * k))
  }
  return s * 0.75
}

export function DitherField({ variant = 'horizon', cell = 6, className, stars = true, interactive = true, colorShift = 0 }: { variant?: FieldVariant; cell?: number; className?: string; stars?: boolean; interactive?: boolean; colorShift?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let img: ImageData | null = null
    let raf = 0
    let visible = true
    let last = 0
    const pointer = { x: -1, y: -1, k: 0 }
    const rgb: RGB = [0, 0, 0]
    const t0 = performance.now()

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = Math.max(8, Math.ceil(r.width / cell))
      h = Math.max(8, Math.ceil(r.height / cell))
      canvas.width = w
      canvas.height = h
      img = ctx.createImageData(w, h)
    }

    const draw = (now: number) => {
      if (!img) return
      const t = (now - t0) / 1000
      const data = img.data
      const aspect = w / h
      const light = !document.documentElement.classList.contains('dark')
      pointer.k += ((pointer.x >= 0 ? 1 : 0) - pointer.k) * 0.08
      for (let y = 0; y < h; y++) {
        const v = y / h
        for (let x = 0; x < w; x++) {
          const u = x / w
          let f = field(variant, u, v, t, aspect)
          if (interactive && pointer.k > 0.01) {
            const dx = (u - pointer.x) * aspect
            const dy = v - pointer.y
            f += pointer.k * 0.65 * Math.exp(-(dx * dx + dy * dy) / 0.012)
          }
          const i = (y * w + x) * 4
          const threshold = BAYER[(y & 7) * 8 + (x & 7)]
          if (f > threshold) {
            ramp((u + colorShift + 0.08 * Math.sin(t * 0.3 + v * 3)) % 1, rgb)
            const hot = Math.min(1, Math.max(0, f - 0.9) * 1.6)
            data[i] = rgb[0] + (255 - rgb[0]) * hot
            data[i + 1] = rgb[1] + (255 - rgb[1]) * hot
            data[i + 2] = rgb[2] + (255 - rgb[2]) * hot
            data[i + 3] = light ? 235 : 255
          } else if (stars && v < 0.8) {
            const r = hash(x, y)
            const edge = Math.abs(u * 2 - 1)
            if (r < 0.0026 * (0.15 + edge * edge * 1.4)) {
              const tw = 0.5 + 0.5 * Math.sin(t * (1 + r * 400) + r * 1000)
              ramp(0.05 + r * 60, rgb)
              data[i] = rgb[0]
              data[i + 1] = rgb[1]
              data[i + 2] = rgb[2]
              data[i + 3] = tw > 0.35 ? 200 * tw : 0
            } else data[i + 3] = 0
          } else data[i + 3] = 0
        }
      }
      ctx.putImageData(img, 0, 0)
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || now - last < 33) return
      last = now
      draw(now)
    }

    resize()
    draw(t0 + 4000)
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      if (x < 0 || x > 1 || y < 0 || y > 1) pointer.x = -1
      else {
        pointer.x = x
        pointer.y = y
      }
    }
    if (!reduce) {
      raf = requestAnimationFrame(loop)
      if (interactive) window.addEventListener('pointermove', onMove, { passive: true })
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [variant, cell, stars, interactive, colorShift])

  return <canvas ref={ref} aria-hidden className={cn('dither-mask pointer-events-none block h-full w-full', className)} style={{ ['--cell' as string]: `${cell}px` }} />
}
