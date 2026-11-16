import { Brand, Guides } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { balance, fit, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 19 · Mono ─────────────────────────── */

function Mono({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const r = fit(c.headline, { font: f.display, maxWidth: 920, maxLines: 2, max: 84 * o.scale, min: 36, lineHeight: 1.04, tracking: -0.045 })
  const lines = r.truncated ? r.lines : balance(c.headline, f.display, r.size, 920, -0.045)
  const d = c.description ? fit(c.description, { font: f.body, maxWidth: 760, maxLines: 2, max: 28, min: 18, lineHeight: 1.4 }) : null
  const cap = vmetrics(f.display, r.size).cap
  const blockH = cap + (lines.length - 1) * r.size * 1.04 + (d ? 40 + d.lines.length * d.size * 1.4 : 0)
  const y0 = 340 - blockH / 2 + cap
  const dy = y0 + (lines.length - 1) * r.size * 1.04 + 40 + (d ? d.size : 0)
  return (
    <Frame background={t.background}>
      <Guides xs={[64, W - 64]} ys={[64, 566]} stroke={t.text} opacity={0.08} />
      {o.showBrand ? <Brand x={W / 2} y={100} size={36} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} anchor="middle" /> : null}
      <Text x={W / 2} y={y0 + 20} anchor="middle" lines={lines} font={f.display} size={r.size} lh={1.04} tracking={-0.045} fill={t.text} />
      {d ? <Text x={W / 2} y={dy + 20} anchor="middle" lines={d.lines} font={f.body} size={d.size} lh={1.4} fill={t.text} opacity={0.5} /> : null}
    </Frame>
  )
}

export const mono: TemplateDef = {
  id: 'mono',
  number: 19,
  name: 'Mono',
  collection: 'minimal',
  description: 'Clean light card: logo on top, a tight centred headline and a soft grey line inside faint guides.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    label: { family: 'Geist', weight: 500 },
  },
  theme: { primary: '#0a0a0a', accent: '#0a0a0a', background: '#fafafa', text: '#0a0a0a' },
  limits: { headline: 50, description: 100 },
  uses: ['logo'],
  render: Mono,
}

/** <MonoImage /> renders the mono template as an SVG (1200×630). */
export function MonoImage(props: OgImageProps) {
  return <OgImage template={mono} {...props} />
}
