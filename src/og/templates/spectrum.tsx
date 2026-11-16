import { Beam, Brand } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fit } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 15 · Spectrum ─────────────────────────── */

function Spectrum({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const r = fit(c.headline, { font: f.display, maxWidth: 1000, maxLines: 2, max: 76 * o.scale, min: 34, lineHeight: 1.04, tracking: -0.04 })
  const y0 = 300 - (r.lines.length - 1) * r.size * 0.52 + r.size * 0.35
  return (
    <Frame background={t.background}>
      <Beam uid={uid} id="a" x={-200} y={380} w={1700} h={180} angle={-14} color={t.primary} />
      <Beam uid={uid} id="b" x={-200} y={470} w={1700} h={110} angle={-9} color={mix(t.primary, t.accent, 0.5)} opacity={0.8} blur={12} />
      <Beam uid={uid} id="c" x={300} y={120} w={1400} h={70} angle={-22} color={t.accent} opacity={0.35} blur={24} />
      <rect x={0} y={0} width={W} height={630} fill={t.background} opacity={0.18} />
      {o.showBrand ? <Brand x={W / 2} y={92} size={40} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} anchor="middle" /> : null}
      <Text x={W / 2} y={y0} anchor="middle" lines={r.lines} font={f.display} size={r.size} lh={1.04} tracking={-0.04} fill={t.text} />
    </Frame>
  )
}

export const spectrum: TemplateDef = {
  id: 'spectrum',
  number: 15,
  name: 'Spectrum',
  collection: 'abstract',
  description: 'Glossy light beams cut across a dark ground behind a centred logo and headline.',
  fonts: {
    display: { family: 'Inter Tight', weight: 600 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#3d6bff', accent: '#a35cff', background: '#05060c', text: '#ffffff' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Spectrum,
}

/** <SpectrumImage /> renders the spectrum template as an SVG (1200×630). */
export function SpectrumImage(props: OgImageProps) {
  return <OgImage template={spectrum} {...props} />
}
