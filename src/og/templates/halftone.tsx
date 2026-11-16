import { BlockText, blockTop, caps } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { r2 } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 24 · Halftone ─────────────────────────── */

function halftonePath(cx: number, cy: number, R: number, step: number, angle: number, maxR: number) {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  let d = ''
  const ext = R + step * 2
  for (let v = -ext; v <= ext; v += step) {
    for (let u = -ext; u <= ext; u += step) {
      const x = cx + u * ca - v * sa
      const y = cy + u * sa + v * ca
      if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue
      const dist = Math.hypot(x - cx, y - cy) / R
      if (dist > 1) continue
      // light from upper-left: denser at lower-right like a printed sphere
      const shade = Math.min(1, Math.max(0, (1 - dist * dist) * 0.55 + ((x - cx) / R + (y - cy) / R) * 0.28 + 0.25))
      const r = maxR * Math.sqrt(shade)
      if (r < 0.6) continue
      d += `M${r2(x - r)} ${r2(y)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0`
    }
  }
  return d
}

function Halftone({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 620, maxLines: 4, max: 78 * s, min: 34, lineHeight: 0.98, tracking: -0.035, top: 150, maxHeight: 270 })
  const desc = blockTop(c.description, { font: f.italic, maxWidth: 520, maxLines: 2, max: 23, min: 18, lineHeight: 1.32, top: head.bottom + 26 })
  const big = halftonePath(900, 340, 252, 14, 0.26, 7.2)
  return (
    <Frame background={t.background}>
      <path d={big} fill={t.primary} transform="translate(10 7)" opacity={0.85} style={{ mixBlendMode: 'multiply' }} />
      <path d={big} fill={t.accent} style={{ mixBlendMode: 'multiply' }} />
      <circle cx={900} cy={340} r={252} fill="none" stroke={t.text} strokeOpacity={0.12} />
      <Grain uid={uid} opacity={0.08} />
      <line x1={M} x2={W - M} y1={102} y2={102} stroke={t.text} strokeWidth={1.5} />
      <line x1={M} x2={W - M} y1={H - 82} y2={H - 82} stroke={t.text} strokeWidth={1.5} />
      {o.showBrand ? <Text x={M} y={80} lines={caps(c.name)} font={f.mono} size={14} tracking={0.16} fill={t.text} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      <BlockText b={desc} x={M} font={f.italic} fill={t.text} opacity={0.8} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={H - 50} lines={caps(c.domain)} font={f.mono} size={13} tracking={0.16} fill={t.text} />
        </g>
      ) : null}
    </Frame>
  )
}

export const halftone: TemplateDef = {
  id: 'halftone',
  number: 24,
  name: 'Halftone',
  collection: 'experimental',
  description: 'Two misregistered halftone screens build a printed sphere inside a ruled editorial page.',
  fonts: {
    display: { family: 'Bricolage Grotesque', weight: 800 },
    italic: { family: 'Newsreader', weight: 400, style: 'italic' },
    mono: { family: 'IBM Plex Mono', weight: 500 },
  },
  theme: { primary: '#2552e0', accent: '#ff4a1c', background: '#f3ead8', text: '#161412' },
  limits: { headline: 56, description: 100 },
  uses: ['category', 'date'],
  render: Halftone,
}

/** <HalftoneImage /> renders the halftone template as an SVG (1200×630). */
export function HalftoneImage(props: OgImageProps) {
  return <OgImage template={halftone} {...props} />
}
