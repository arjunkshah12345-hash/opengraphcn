import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Img, Text } from '../core/primitives'
import { fitLine, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { initials } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 29 · Founder ─────────────────────────── */

function Founder({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const ax = 240
  const ay = 300
  const ar = 136
  const x = 450
  const who = c.author || c.name
  const nameFit = fitLine(who, f.display, 68 * s, 34, W - x - 80, -0.03)
  const nameW = measure(nameFit.text, f.display, nameFit.size, -0.03)
  const head = blockTop(`“${c.headline}”`, { font: f.italic, maxWidth: W - x - 90, maxLines: 3, max: 38 * s, min: 22, lineHeight: 1.18, tracking: -0.01, top: 300, maxHeight: 150 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: W - x - 120, maxLines: 2, max: 18, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  const photo = assets.avatar || assets.logo
  const ul = `M ${x} 258 C ${x + nameW * 0.3} 248, ${x + nameW * 0.62} 266, ${x + Math.min(nameW, 520)} 252`
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.07} />
      <circle cx={ax + 14} cy={ay + 14} r={ar} fill="none" stroke={t.text} strokeWidth={1.4} />
      {photo ? (
        <Img href={photo} x={ax - ar} y={ay - ar} w={ar * 2} h={ar * 2} r={ar} uid={uid} />
      ) : (
        <g>
          <circle cx={ax} cy={ay} r={ar} fill={t.accent} />
          <Text x={ax} y={ay + vmetrics(f.display, 104).cap / 2} anchor="middle" lines={initials(who)} font={f.display} size={104} tracking={-0.04} fill={t.background} />
        </g>
      )}
      <Text x={x} y={170} lines={caps(join(['Founder', o.showBrand ? c.name : ''], '  ·  '))} font={f.label} size={13} tracking={0.22} fill={t.accent} />
      <Text x={x - 3} y={236} lines={nameFit.text} font={f.display} size={nameFit.size} tracking={-0.03} fill={t.text} />
      <path d={ul} fill="none" stroke={t.accent} strokeWidth={4} strokeLinecap="round" />
      <Text x={x - 10} y={head.y} lines={head.lines} font={f.italic} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      <BlockText b={desc} x={x} font={f.body} fill={t.text} opacity={0.65} />
      {o.showMeta ? (
        <g>
          <line x1={x} x2={W - 80} y1={H - 92} y2={H - 92} stroke={t.text} strokeOpacity={0.2} />
          <Text x={x} y={H - 60} lines={c.domain} font={f.label} size={15} fill={t.text} />
          <Text x={W - 80} y={H - 60} anchor="end" lines={c.category} font={f.body} size={15} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
    </Frame>
  )
}

export const founder: TemplateDef = {
  id: 'founder',
  number: 29,
  name: 'Founder',
  collection: 'product',
  description: 'A maker card: portrait (or monogram), name with a hand-drawn underline and a quoted tagline.',
  fonts: {
    display: { family: 'Fraunces', weight: 600 },
    italic: { family: 'Fraunces', weight: 300, style: 'italic' },
    label: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
  },
  theme: { primary: '#1d1915', accent: '#e2552b', background: '#efe6d8', text: '#1d1915' },
  limits: { headline: 80, description: 100 },
  uses: ['avatar', 'logo', 'author', 'category'],
  render: Founder,
}

/** <FounderImage /> renders the founder template as an SVG (1200×630). */
export function FounderImage(props: OgImageProps) {
  return <OgImage template={founder} {...props} />
}
