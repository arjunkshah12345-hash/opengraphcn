import { BlockText, blockCenter, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 11 · Atmosphere ─────────────────────────── */

function Atmosphere({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const c3 = hueShift(t.primary, 38)
  const c4 = hueShift(t.accent, -50)
  const head = blockCenter(c.headline, { font: f.display, maxWidth: 960, maxLines: 3, max: 92 * s, min: 40, lineHeight: 1.0, tracking: -0.025, center: 292, maxHeight: 300 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 640, maxLines: 2, max: 22, min: 17, lineHeight: 1.4, top: head.bottom + 30 })
  return (
    <Frame background={t.background}>
      <defs>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={95} />
        </filter>
        <radialGradient id={`${uid}-veil`} cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor={t.background} stopOpacity={0.55} />
          <stop offset="1" stopColor={t.background} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g filter={`url(#${uid}-blur)`}>
        <circle cx={230} cy={120} r={290} fill={t.primary} />
        <circle cx={1000} cy={110} r={270} fill={t.accent} />
        <circle cx={860} cy={600} r={300} fill={c3} />
        <circle cx={170} cy={640} r={250} fill={c4} />
      </g>
      <rect width={W} height={H} fill={`url(#${uid}-veil)`} />
      <Grain uid={uid} opacity={0.16} blend="overlay" freq={0.75} />
      {o.showBrand ? <Text x={W / 2} y={84} anchor="middle" lines={caps(c.name)} font={f.label} size={14} tracking={0.3} fill={t.text} /> : null}
      <Text x={W / 2} y={head.y} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.025} fill={t.text} />
      <BlockText b={desc} x={W / 2} anchor="middle" font={f.body} fill={t.text} opacity={0.75} />
      {o.showMeta ? <Text x={W / 2} y={H - 64} anchor="middle" lines={caps(join([c.domain, c.date], '   ·   '))} font={f.label} size={12} tracking={0.24} fill={t.text} opacity={0.7} /> : null}
    </Frame>
  )
}

export const atmosphere: TemplateDef = {
  id: 'atmosphere',
  number: 11,
  name: 'Atmosphere',
  collection: 'abstract',
  description: 'Soft, blurred colour fields with grain and a centred, softly weighted serif headline.',
  fonts: {
    display: { family: 'Fraunces', weight: 300 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#ff8f6b', accent: '#7fb0ff', background: '#f3eee8', text: '#1d1a17' },
  limits: { headline: 64, description: 110 },
  uses: ['date'],
  render: Atmosphere,
}

/** <AtmosphereImage /> renders the atmosphere template as an SVG (1200×630). */
export function AtmosphereImage(props: OgImageProps) {
  return <OgImage template={atmosphere} {...props} />
}
