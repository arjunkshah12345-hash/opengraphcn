import { blockTop, caps, join, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 29 · Founder ─────────────────────────── */

function Founder({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 80
  const s = o.scale
  const who = c.author || c.name
  const quote = blockTop(c.headline, { font: f.display, maxWidth: W - M * 2 - 110, maxLines: 4, max: 76 * s, min: 32, lineHeight: 1.06, tracking: -0.02, top: 232, maxHeight: 240 })
  const role = fitLine(join([c.category, o.showBrand ? c.name : ''], ', '), f.body, 20, 14, 600)
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.07} />
      <Text x={M - 12} y={400} lines="“" font={f.display} size={240} fill={t.accent} />
      <Text x={M + 92} y={quote.y} lines={quote.lines} font={f.display} size={quote.size} lh={quote.lh} tracking={-0.02} fill={t.text} />
      <line x1={M} x2={W - M} y1={500} y2={500} stroke={t.text} strokeOpacity={0.15} />
      <Mark x={M} y={524} size={60} assets={{ logo: assets.avatar || assets.logo }} name={who} uid={uid} fill={t.accent} color={t.background} font={f.label} shape="circle" />
      <Text x={M + 80} y={550} lines={who} font={f.label} size={22} fill={t.text} />
      <Text x={M + 80} y={578} lines={role.text} font={f.body} size={role.size} fill={t.text} opacity={0.6} />
      {o.showMeta ? <Text x={W - M} y={566} anchor="end" lines={caps(c.domain)} font={f.label} size={14} tracking={0.14} fill={t.text} opacity={0.55} /> : null}
    </Frame>
  )
}

export const founder: TemplateDef = {
  id: 'founder',
  number: 29,
  name: 'Founder',
  collection: 'product',
  description: 'A pull quote: your headline in a large italic serif with a hanging quotation mark and the author beneath.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Inter Tight', weight: 400 },
  },
  theme: { primary: '#1d1a16', accent: '#e2502c', background: '#efe8dc', text: '#1d1a16' },
  limits: { headline: 90, description: 100 },
  uses: ['avatar', 'logo', 'author', 'category'],
  render: Founder,
}

/** <FounderImage /> renders the founder template as an SVG (1200×630). */
export function FounderImage(props: OgImageProps) {
  return <OgImage template={founder} {...props} />
}
