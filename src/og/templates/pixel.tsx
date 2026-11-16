import { caps, ditherPath, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fit } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, mix, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
const P = 10
/* ─────────────────────────── 22 · Pixel ─────────────────────────── */

function ridge(seed: number, base: number, amp: number, step: number) {
  const rand = rng(seed)
  let d = `M0 ${H}`
  let y = base
  for (let x = 0; x <= W; x += step) {
    y = Math.max(base - amp, Math.min(base + amp * 0.3, y + (rand() - 0.5) * amp * 0.7))
    const sy = Math.round(y / P) * P
    d += `L${x} ${sy}L${x + step} ${sy}`
  }
  return `${d}L${W} ${H}Z`
}

function Pixel({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const seed = hash(c.name || 'pixel')
  const horizon = 430
  const sky = (lo: number, hi: number) => (_u: number, v: number) => (v < lo ? 0 : v > hi ? 1 : (v - lo) / (hi - lo))
  const sun = (u: number, v: number) => {
    const d = Math.hypot((u - 0.5) * (W / horizon), v - 0.98)
    return d < 0.42 ? 1 : 0
  }
  const head = fit(caps(c.headline), { font: f.display, maxWidth: 1000, maxLines: 2, max: 64 * s, min: 24, lineHeight: 1.2 })
  const hy = 170
  return (
    <Frame background={t.background}>
      <path d={ditherPath({ x: 0, y: 0, w: W, h: horizon, cell: P, dot: 1, f: sky(0.48, 1.08) })} fill={mix(t.primary, t.background, 0.35)} />
      <path d={ditherPath({ x: 0, y: 0, w: W, h: horizon, cell: P, dot: 1, f: sky(0.7, 1.3) })} fill={t.primary} />
      <path d={ditherPath({ x: 0, y: 0, w: W, h: horizon, cell: P, dot: 1, f: (u, v) => sun(u, v) * (v > 0.62 ? 1 : 0) })} fill={t.accent} />
      {[0.74, 0.82, 0.9].map((v, i) => (
        <rect key={i} x={0} y={Math.round((horizon * v) / P) * P} width={W} height={P * (i + 1) * 0.5 > P ? P : P / 2 + i * 2} fill={mix(t.primary, t.background, 0.35)} />
      ))}
      <path d={ridge(seed, 380, 70, 40)} fill={mix(t.background, t.primary, 0.25)} />
      <path d={ridge(seed + 7, 420, 40, 30)} fill={mix(t.background, '#000000', 0.25)} />
      <rect x={0} y={horizon} width={W} height={H - horizon} fill={mix(t.background, '#000000', 0.45)} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = horizon + 8 + i * i * 6
        return <rect key={i} x={0} y={Math.round(y / 2) * 2} width={W} height={2} fill={t.primary} opacity={0.5} />
      })}
      {Array.from({ length: 13 }, (_, i) => {
        const x = W / 2 + (i - 6) * 70
        return <line key={i} x1={W / 2 + (i - 6) * 20} y1={horizon} x2={x + (x - W / 2) * 1.6} y2={H} stroke={t.primary} strokeOpacity={0.5} strokeWidth={2} />
      })}
      {o.showBrand ? <Text x={W / 2} y={84} anchor="middle" lines={caps(c.name)} font={f.body} size={18} tracking={0.2} fill={t.text} /> : null}
      <Text x={W / 2 + 5} y={hy + 5} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={1.2} fill={mix(t.background, '#000000', 0.3)} />
      <Text x={W / 2} y={hy} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={1.2} fill={t.text} />
      {o.showMeta ? <Text x={W / 2} y={H - 40} anchor="middle" lines={caps(join(['Press start', c.badge, c.domain], '   -   '))} font={f.body} size={16} tracking={0.12} fill={t.text} opacity={0.85} /> : null}
    </Frame>
  )
}

export const pixel: TemplateDef = {
  id: 'pixel',
  number: 22,
  name: 'Pixel',
  collection: 'experimental',
  description: 'A 16-bit title screen: a dithered pixel sunset, stepped mountains and a neon grid under pixel type.',
  fonts: {
    display: { family: 'Silkscreen', weight: 700 },
    body: { family: 'Silkscreen', weight: 400 },
  },
  theme: { primary: '#ff4fa3', accent: '#ffd23f', background: '#1a0b3a', text: '#fff6e5' },
  limits: { headline: 36 },
  uses: ['badge'],
  render: Pixel,
}

/** <PixelImage /> renders the pixel template as an SVG (1200×630). */
export function PixelImage(props: OgImageProps) {
  return <OgImage template={pixel} {...props} />
}
