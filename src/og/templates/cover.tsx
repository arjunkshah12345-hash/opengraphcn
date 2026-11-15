import { balance, fit, vmetrics } from '../core/text'
import { caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 05 · Cover ─────────────────────────── */

function Cover({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const r = fit(c.headline, { font: f.display, maxWidth: 900, maxLines: 3, max: 96 * s, min: 40, lineHeight: 1.04, tracking: -0.015, maxHeight: 280 })
  const lines = r.truncated ? r.lines : balance(c.headline, f.display, r.size, 900, -0.015)
  const cap = vmetrics(f.display, r.size).cap
  const blockH = cap + (lines.length - 1) * r.size * 1.04
  const y0 = 300 - blockH / 2 + cap
  const last = y0 + (lines.length - 1) * r.size * 1.04
  const desc = c.description ? fit(c.description, { font: f.italic, maxWidth: 760, maxLines: 1, max: 26, min: 17 }) : null
  const orn = last + 52
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.09} blend="screen" />
      <rect x={30} y={30} width={W - 60} height={H - 60} fill="none" stroke={t.accent} strokeOpacity={0.7} />
      <rect x={40} y={40} width={W - 80} height={H - 80} fill="none" stroke={t.accent} strokeOpacity={0.3} />
      {o.showBrand ? <Text x={W / 2} y={104} anchor="middle" lines={caps(c.name)} font={f.label} size={15} tracking={0.42} fill={t.accent} /> : null}
      <Text x={W / 2} y={y0} anchor="middle" lines={lines} font={f.display} size={r.size} lh={1.04} tracking={-0.015} fill={t.text} />
      <g>
        <line x1={W / 2 - 90} x2={W / 2 - 14} y1={orn} y2={orn} stroke={t.accent} strokeOpacity={0.8} />
        <rect x={W / 2 - 5} y={orn - 5} width={10} height={10} fill={t.accent} transform={`rotate(45 ${W / 2} ${orn})`} />
        <line x1={W / 2 + 14} x2={W / 2 + 90} y1={orn} y2={orn} stroke={t.accent} strokeOpacity={0.8} />
      </g>
      {desc ? <Text x={W / 2} y={orn + 52} anchor="middle" lines={desc.lines} font={f.italic} size={desc.size} fill={t.text} opacity={0.72} /> : null}
      {o.showMeta ? <Text x={W / 2} y={548} anchor="middle" lines={caps(join([c.author, c.date], '   ·   '))} font={f.label} size={14} tracking={0.32} fill={t.text} opacity={0.75} /> : null}
    </Frame>
  )
}

export const cover: TemplateDef = {
  id: 'cover',
  number: 5,
  name: 'Cover',
  collection: 'editorial',
  description: 'A clothbound book cover: centred Bodoni on deep navy inside a double gold rule, with an ornament.',
  fonts: {
    display: { family: 'Bodoni Moda', weight: 500 },
    italic: { family: 'Bodoni Moda', weight: 500, style: 'italic' },
    label: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#f2e8d2', accent: '#d2ab62', background: '#101b2e', text: '#f2e8d2' },
  limits: { headline: 60, description: 90 },
  uses: ['author', 'date'],
  render: Cover,
}

/** <CoverImage /> renders the cover template as an SVG (1200×630). */
export function CoverImage(props: OgImageProps) {
  return <OgImage template={cover} {...props} />
}
