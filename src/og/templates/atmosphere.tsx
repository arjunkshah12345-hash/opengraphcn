import { BlockText, blockBottom, Blob, caps, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 11 · Atmosphere ─────────────────────────── */

function Atmosphere({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const M = 72
  const s = o.scale
  const desc = c.description ? blockBottom(c.description, { font: f.body, maxWidth: 560, maxLines: 2, max: 22, min: 16, lineHeight: 1.4, bottom: 560 }) : null
  const bottom = desc ? desc.y - desc.size - 30 : 560
  const head = blockBottom(c.headline, { font: f.display, maxWidth: 960, maxLines: 3, max: 112 * s, min: 44, lineHeight: 0.98, tracking: -0.03, bottom, maxHeight: bottom - 150 })
  return (
    <Frame background={t.background}>
      <Blob uid={uid} id="a" cx={980} cy={90} rx={360} ry={260} fill={t.accent} blur={110} opacity={0.95} />
      <Blob uid={uid} id="b" cx={640} cy={340} rx={260} ry={200} fill={hueShift(t.accent, 60)} blur={120} opacity={0.75} />
      <Blob uid={uid} id="c" cx={1120} cy={560} rx={300} ry={200} fill={t.primary} blur={110} opacity={0.9} />
      <Blob uid={uid} id="d" cx={160} cy={-40} rx={260} ry={160} fill={hueShift(t.primary, -40)} blur={110} opacity={0.35} />
      <Grain uid={uid} opacity={0.16} freq={0.75} blend="overlay" />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={62} size={34} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.label} shape="circle" />
          <Text x={M + 48} y={85} lines={c.name} font={f.label} size={20} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      {o.showMeta ? <Text x={W - M} y={85} anchor="end" lines={caps(c.date)} font={f.label} size={14} tracking={0.14} fill={t.text} opacity={0.7} /> : null}
      <Text x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      {desc ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} /> : null}
    </Frame>
  )
}

export const atmosphere: TemplateDef = {
  id: 'atmosphere',
  number: 11,
  name: 'Atmosphere',
  collection: 'abstract',
  description: 'A deep, grainy mesh gradient at dusk with a light serif headline anchored bottom-left.',
  fonts: {
    display: { family: 'Fraunces', weight: 300 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#ff6b4a', accent: '#6f63ff', background: '#0b0910', text: '#fbf7f2' },
  limits: { headline: 60, description: 110 },
  uses: ['date', 'logo'],
  render: Atmosphere,
}

/** <AtmosphereImage /> renders the atmosphere template as an SVG (1200×630). */
export function AtmosphereImage(props: OgImageProps) {
  return <OgImage template={atmosphere} {...props} />
}
