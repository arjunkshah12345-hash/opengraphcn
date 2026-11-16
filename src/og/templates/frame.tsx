import { blockBottom, Brand, Arrow } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 20 · Frame ─────────────────────────── */

function FrameTpl({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const P = 28
  const x = P + 56
  const head = blockBottom(c.headline, { font: f.display, maxWidth: 880, maxLines: 3, max: 92 * o.scale, min: 38, lineHeight: 1.0, tracking: -0.045, bottom: H - P - 64, maxHeight: 340 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-card`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={mix(t.accent, '#ffffff', 0.12)} />
          <stop offset="1" stopColor={mix(t.accent, '#000000', 0.12)} />
        </linearGradient>
      </defs>
      <rect x={P} y={P} width={W - P * 2} height={H - P * 2} rx={28} fill={`url(#${uid}-card)`} />
      <Grain uid={uid} opacity={0.08} blend="overlay" />
      {o.showBrand ? <Brand x={x} y={P + 52} size={40} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.accent} /> : null}
      <Arrow x={W - P - 84} y={P + 72} size={40} stroke={t.text} dir={-45} width={3} />
      <Text x={x - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.045} fill={t.text} />
    </Frame>
  )
}

export const frame: TemplateDef = {
  id: 'frame',
  number: 20,
  name: 'Frame',
  collection: 'minimal',
  description: 'A bold colour card with rounded corners on a paper mat: logo, an arrow and a big white headline.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    label: { family: 'Geist', weight: 600 },
  },
  theme: { primary: '#ffffff', accent: '#ff4f1f', background: '#ece9e2', text: '#ffffff' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: FrameTpl,
}

/** <FrameImage /> renders the frame template as an SVG (1200×630). */
export function FrameImage(props: OgImageProps) {
  return <OgImage template={frame} {...props} />
}
