import { BlockText, blockTop, Blob, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 13 · Chromatic ─────────────────────────── */

function Chromatic({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const M = 72
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 820, maxLines: 3, max: 78 * s, min: 34, lineHeight: 1.04, tracking: -0.035, top: 214, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 560, maxLines: 2, max: 21, min: 16, lineHeight: 1.42, top: head.bottom + 26 })
  const badgeW = c.badge ? measure(c.badge, f.label, 15) + 32 : 0
  return (
    <Frame background={t.background}>
      <Blob uid={uid} id="a" cx={1040} cy={120} rx={300} ry={230} fill={t.primary} blur={90} />
      <Blob uid={uid} id="b" cx={820} cy={520} rx={320} ry={190} fill={t.accent} blur={100} />
      <Blob uid={uid} id="c" cx={1180} cy={470} rx={200} ry={170} fill={hueShift(t.primary, 70)} blur={90} opacity={0.9} />
      <Blob uid={uid} id="d" cx={480} cy={-60} rx={300} ry={130} fill={hueShift(t.accent, -60)} blur={90} opacity={0.6} />
      <Grain uid={uid} opacity={0.12} freq={0.8} blend="multiply" />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={70} size={40} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="rounded" />
          <Text x={M + 54} y={97} lines={c.name} font={f.label} size={20} fill={t.text} />
        </g>
      ) : null}
      {o.showMeta && c.badge ? (
        <g>
          <rect x={W - M - badgeW} y={70} width={badgeW} height={40} rx={20} fill="#ffffff" fillOpacity={0.55} stroke="#ffffff" strokeOpacity={0.9} />
          <Text x={W - M - badgeW / 2} y={95} anchor="middle" lines={c.badge} font={f.label} size={15} fill={t.text} />
        </g>
      ) : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      {desc.bottom < 580 ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.68} /> : null}
    </Frame>
  )
}

export const chromatic: TemplateDef = {
  id: 'chromatic',
  number: 13,
  name: 'Chromatic',
  collection: 'abstract',
  description: 'A soft iridescent pastel field with a bold rounded headline in near-black.',
  fonts: {
    display: { family: 'Unbounded', weight: 600 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#ff9ad5', accent: '#8fe3ff', background: '#f3f1f7', text: '#121016' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge'],
  render: Chromatic,
}

/** <ChromaticImage /> renders the chromatic template as an SVG (1200×630). */
export function ChromaticImage(props: OgImageProps) {
  return <OgImage template={chromatic} {...props} />
}
