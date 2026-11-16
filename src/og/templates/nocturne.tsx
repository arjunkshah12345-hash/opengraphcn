import { Blob, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { balance, fit } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 14 · Nocturne ─────────────────────────── */

function Nocturne({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const cx = W / 2
  const base = 360
  const s = 150
  const tri = `M${cx} ${base - s * 1.1} L${cx + s * 0.95} ${base} L${cx - s * 0.95} ${base} Z`
  const r = fit(c.headline, { font: f.display, maxWidth: 900, maxLines: 2, max: 46 * o.scale, min: 24, lineHeight: 1.12, tracking: -0.025 })
  const lines = r.truncated ? r.lines : balance(c.headline, f.display, r.size, 900, -0.025)
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" />
          <stop offset="1" stopColor="#111111" />
        </linearGradient>
        <filter id={`${uid}-rim`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      <Blob uid={uid} id="halo" cx={cx} cy={base - 60} rx={240} ry={170} fill={t.accent} blur={80} opacity={0.18} />
      <Blob uid={uid} id="floor" cx={cx} cy={base + 6} rx={420} ry={26} fill="#ffffff" blur={22} opacity={0.75} />
      <path d={tri} fill="none" stroke={t.accent} strokeWidth={10} opacity={0.9} filter={`url(#${uid}-rim)`} />
      <path d={tri} fill={`url(#${uid}-face)`} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={1.4} />
      {o.showBrand && (assets.logo || assets.favicon) ? <Mark x={72} y={64} size={40} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} /> : null}
      <Text x={cx} y={486} anchor="middle" lines={lines} font={f.display} size={r.size} lh={1.12} tracking={-0.025} fill={t.text} />
      {o.showBrand ? <Text x={cx} y={486 + lines.length * r.size * 1.12 + 12} anchor="middle" lines={c.name} font={f.label} size={20} fill={t.text} opacity={0.5} /> : null}
    </Frame>
  )
}

export const nocturne: TemplateDef = {
  id: 'nocturne',
  number: 14,
  name: 'Nocturne',
  collection: 'abstract',
  description: 'A black prism lit from behind, glowing on black, with a short centred line beneath.',
  fonts: {
    display: { family: 'Geist', weight: 500 },
    label: { family: 'Geist', weight: 400 },
  },
  theme: { primary: '#ffffff', accent: '#e8e8e8', background: '#000000', text: '#ededed' },
  limits: { headline: 60 },
  uses: ['logo'],
  render: Nocturne,
}

/** <NocturneImage /> renders the nocturne template as an SVG (1200×630). */
export function NocturneImage(props: OgImageProps) {
  return <OgImage template={nocturne} {...props} />
}
