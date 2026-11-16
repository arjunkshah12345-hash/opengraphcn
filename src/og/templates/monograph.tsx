import { blockBottom, Brand } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 01 · Monograph ─────────────────────────── */

function Monograph({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 84
  const head = blockBottom(c.headline, { font: f.display, maxWidth: 940, maxLines: 3, max: 132 * o.scale, min: 52, lineHeight: 0.96, tracking: -0.02, bottom: 532, maxHeight: 360 })
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.05} blend="screen" />
      {o.showBrand ? <Brand x={M} y={70} size={38} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} shape="circle" /> : null}
      <Text x={M - 6} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
    </Frame>
  )
}

export const monograph: TemplateDef = {
  id: 'monograph',
  number: 1,
  name: 'Monograph',
  collection: 'editorial',
  description: 'Quiet and confident: your logo and a large serif headline on near-black, nothing else.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400 },
    label: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#f3f2ef', accent: '#f3f2ef', background: '#0e0e10', text: '#f3f2ef' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Monograph,
}

/** <MonographImage /> renders the monograph template as an SVG (1200×630). */
export function MonographImage(props: OgImageProps) {
  return <OgImage template={monograph} {...props} />
}
