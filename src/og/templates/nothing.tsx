import { blockBottom } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 16 · Nothing ─────────────────────────── */

function Nothing({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 96
  const s = o.scale
  const head = blockBottom(c.headline, { font: f.display, maxWidth: 820, maxLines: 3, max: 60 * s, min: 32, lineHeight: 1.1, tracking: -0.028, bottom: 452, maxHeight: 260 })
  const nameW = measure(c.name, f.label, 17, -0.01)
  return (
    <Frame background={t.background}>
      {o.showBrand ? (
        <g>
          <Text x={M} y={104} lines={c.name} font={f.label} size={17} tracking={-0.01} fill={t.text} />
          <circle cx={M + nameW + 8} cy={99} r={3.2} fill={t.accent} />
        </g>
      ) : null}
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.028} fill={t.text} />
      <Text x={M} y={528} lines={ellipsize(c.description, f.body, 19, 640)} font={f.body} size={19} fill={t.text} opacity={0.45} />
      {o.showMeta ? <Text x={W - M} y={528} anchor="end" lines={c.domain} font={f.body} size={19} fill={t.text} opacity={0.45} /> : null}
    </Frame>
  )
}

export const nothing: TemplateDef = {
  id: 'nothing',
  number: 16,
  name: 'Nothing',
  collection: 'minimal',
  description: 'An almost empty white canvas, one precisely set headline and a single point of colour.',
  fonts: {
    display: { family: 'Hanken Grotesk', weight: 500 },
    label: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
  },
  theme: { primary: '#0a0a0a', accent: '#ff3d00', background: '#ffffff', text: '#0a0a0a' },
  limits: { headline: 70, description: 70 },
  render: Nothing,
}

/** <NothingImage /> renders the nothing template as an SVG (1200×630). */
export function NothingImage(props: OgImageProps) {
  return <OgImage template={nothing} {...props} />
}
