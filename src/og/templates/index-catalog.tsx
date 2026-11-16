import { caps, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { ellipsize, fitLine, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 17 · Index ─────────────────────────── */

function Index({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const name = fitLine(caps(c.name || ' '), f.display, 112 * o.scale, 40, 760, 0.02)
  const ms = Math.round(name.size * 1.05)
  const gap = name.size * 0.32
  const nw = measure(name.text, f.display, name.size, 0.02)
  const x0 = W / 2 - (ms + gap + nw) / 2
  const cy = 300
  const cap = vmetrics(f.display, name.size).cap
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.06} blend="screen" />
      <Mark x={x0} y={cy - ms / 2} size={ms} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="rounded" />
      <Text x={x0 + ms + gap} y={cy + cap / 2} lines={name.text} font={f.display} size={name.size} tracking={0.02} fill={t.text} />
      {c.headline ? <Text x={W / 2} y={500} anchor="middle" lines={ellipsize(c.headline, f.body, 26, 900)} font={f.body} size={26} fill={t.text} opacity={0.5} /> : null}
    </Frame>
  )
}

export const index: TemplateDef = {
  id: 'index',
  number: 17,
  name: 'Index',
  collection: 'minimal',
  description: 'All brand: a big centred logo and wordmark on warm black, with one quiet line beneath.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
  },
  theme: { primary: '#edecec', accent: '#edecec', background: '#14120b', text: '#edecec' },
  limits: { headline: 60 },
  uses: ['logo'],
  render: Index,
}

/** <IndexImage /> renders the index template as an SVG (1200×630). */
export function IndexImage(props: OgImageProps) {
  return <OgImage template={index} {...props} />
}
