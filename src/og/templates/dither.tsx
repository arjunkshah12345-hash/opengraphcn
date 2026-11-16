import { BlockText, blockTop, Brand } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 23 · Dither ─────────────────────────── */

const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]

/** 1-bit ordered dither of a lit sphere + falloff halo, merged into one path of horizontal runs */
export function ditherSpherePath(cx: number, cy: number, R: number, cell: number, x0 = 0, x1 = W) {
  const L = [-0.55, -0.62, 0.56]
  const ln = Math.hypot(L[0], L[1], L[2])
  const l = L.map((v) => v / ln)
  let d = ''
  for (let j = 0; j * cell < H; j++) {
    let run = -1
    for (let i = Math.floor(x0 / cell); i * cell <= x1; i++) {
      const x = i * cell + cell / 2
      const y = j * cell + cell / 2
      const dx = (x - cx) / R
      const dy = (y - cy) / R
      const rr = dx * dx + dy * dy
      let v: number
      if (rr <= 1) {
        const nz = Math.sqrt(1 - rr)
        const lam = Math.max(0, dx * l[0] + dy * l[1] + nz * l[2])
        v = 0.04 + 0.96 * Math.pow(lam, 1.25)
      } else {
        const dist = Math.sqrt(rr) - 1
        v = Math.max(0, 0.16 - dist * 0.32)
        // contact shadow / floor
        const fy = (y - (cy + R * 0.98)) / (R * 0.18)
        const fx = (x - cx) / (R * 1.25)
        const floor = fx * fx + fy * fy
        if (floor < 1) v = Math.max(v, 0.22 * (1 - floor))
      }
      const on = x < x1 && v > (BAYER8[j % 8][i % 8] + 0.5) / 64
      if (on && run < 0) run = i
      if ((!on || x >= x1) && run >= 0) {
        d += `M${run * cell} ${j * cell}h${(i - run) * cell}v${cell}h-${(i - run) * cell}z`
        run = -1
      }
    }
    if (run >= 0) {
      const end = Math.floor(x1 / cell) + 1
      d += `M${run * cell} ${j * cell}h${(end - run) * cell}v${cell}h-${(end - run) * cell}z`
    }
  }
  return d
}

function Dither({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 66 * s, min: 32, lineHeight: 1.02, tracking: -0.035, top: 156, maxHeight: 270 })
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 480, maxLines: 3, max: 16, min: 13, lineHeight: 1.55, top: head.bottom + 28 })
  const d = ditherSpherePath(900, 300, 236, 6, 560, W)
  return (
    <Frame background={t.background}>
      <path d={d} fill={t.accent} shapeRendering="crispEdges" />
      {o.showBrand ? <Brand x={72} y={66} size={36} assets={assets} name={c.name} uid={uid} font={f.display} fill={t.text} bg={t.background} /> : null}
      <Text x={70} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      <BlockText b={desc} x={72} font={f.mono} fill={t.text} opacity={0.65} />
    </Frame>
  )
}

export const dither: TemplateDef = {
  id: 'dither',
  number: 23,
  name: 'Dither',
  collection: 'experimental',
  description: 'A procedurally lit sphere rendered with 8×8 ordered dithering, crisp 1-bit texture throughout.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    mono: { family: 'Geist Mono', weight: 400 },
    monoMed: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#f2eee6', accent: '#ff6b3d', background: '#0b0b0c', text: '#f2eee6' },
  limits: { headline: 56, description: 110 },
  uses: ['badge'],
  render: Dither,
}

/** <DitherImage /> renders the dither template as an SVG (1200×630). */
export function DitherImage(props: OgImageProps) {
  return <OgImage template={dither} {...props} />
}
