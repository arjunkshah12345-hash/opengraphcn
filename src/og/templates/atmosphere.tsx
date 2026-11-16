import { blockBottom, Blob, Brand, Torus } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 11 · Atmosphere ─────────────────────────── */

function Atmosphere({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const M = 72
  const head = blockBottom(c.headline, { font: f.display, maxWidth: 700, maxLines: 3, max: 64 * o.scale, min: 32, lineHeight: 1.06, tracking: -0.035, bottom: 548, maxHeight: 260 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-head`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={t.text} />
          <stop offset="1" stopColor={mix(t.text, t.primary, 0.55)} />
        </linearGradient>
      </defs>
      <Blob uid={uid} id="g" cx={860} cy={150} rx={360} ry={260} fill={t.primary} blur={120} opacity={0.35} />
      <Torus uid={uid} cx={880} cy={200} r={200} thick={64} tilt={0.62} rot={-28} colors={[mix(t.primary, '#000000', 0.55), t.primary, mix(t.accent, '#ffffff', 0.35)]} />
      {o.showBrand ? <Brand x={M} y={64} size={38} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} shape="circle" /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={`url(#${uid}-head)`} />
    </Frame>
  )
}

export const atmosphere: TemplateDef = {
  id: 'atmosphere',
  number: 11,
  name: 'Atmosphere',
  collection: 'abstract',
  description: 'A glossy 3D ring floating in deep blue light above a clean headline that fades into the accent.',
  fonts: {
    display: { family: 'Inter Tight', weight: 500 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#3b6cff', accent: '#5ea1ff', background: '#0b0d17', text: '#ffffff' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Atmosphere,
}

/** <AtmosphereImage /> renders the atmosphere template as an SVG (1200×630). */
export function AtmosphereImage(props: OgImageProps) {
  return <OgImage template={atmosphere} {...props} />
}
