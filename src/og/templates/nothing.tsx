import { Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 16 · Nothing ─────────────────────────── */

function Nothing({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const word = fitLine(c.headline, f.display, 96 * o.scale, 36, 860, -0.035)
  const ms = Math.round(word.size * 0.9)
  const gap = word.size * 0.42
  const ww = measure(word.text, f.display, word.size, -0.035)
  const total = (o.showBrand ? ms + gap * 2 + 2 : 0) + ww
  const x0 = W / 2 - total / 2
  const cy = 315
  const cap = vmetrics(f.display, word.size).cap
  return (
    <Frame background={t.background}>
      {o.showBrand ? (
        <g>
          <Mark x={x0} y={cy - ms / 2} size={ms} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="circle" />
          <line x1={x0 + ms + gap} x2={x0 + ms + gap} y1={cy - ms * 0.55} y2={cy + ms * 0.55} stroke={t.text} strokeOpacity={0.3} strokeWidth={2} />
        </g>
      ) : null}
      <Text x={x0 + (o.showBrand ? ms + gap * 2 + 2 : 0)} y={cy + cap / 2} lines={word.text} font={f.display} size={word.size} tracking={-0.035} fill={t.text} />
    </Frame>
  )
}

export const nothing: TemplateDef = {
  id: 'nothing',
  number: 16,
  name: 'Nothing',
  collection: 'minimal',
  description: 'A changelog lockup: your mark, a hairline divider and one big line, centred on black.',
  fonts: {
    display: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#f7f8f8', accent: '#f7f8f8', background: '#08090a', text: '#f7f8f8' },
  limits: { headline: 24 },
  uses: ['logo'],
  render: Nothing,
}

/** <NothingImage /> renders the nothing template as an SVG (1200×630). */
export function NothingImage(props: OgImageProps) {
  return <OgImage template={nothing} {...props} />
}
