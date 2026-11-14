import { BlockText, blockTop, caps } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, r2, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 14 · Nocturne ─────────────────────────── */

function Nocturne({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const cx = 880
  const cy = 300
  const rand = rng(hash(c.name || 'night'))
  const stars = Array.from({ length: 46 }, () => ({ x: rand() * W, y: rand() * 470, r: 0.5 + rand() * 1.1, o: 0.2 + rand() * 0.6 }))
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 84 * s, min: 38, lineHeight: 0.98, tracking: -0.01, top: 150, maxHeight: 270 })
  const desc = blockTop(c.description, { font: f.italic, maxWidth: 500, maxLines: 2, max: 26, min: 19, lineHeight: 1.3, top: head.bottom + 28 })
  return (
    <Frame background={t.background}>
      <defs>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={t.accent} stopOpacity={0.55} />
          <stop offset="0.35" stopColor={t.accent} stopOpacity={0.18} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={t.accent} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0.2} />
        </linearGradient>
        <linearGradient id={`${uid}-horizon`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={t.accent} stopOpacity={0} />
          <stop offset="0.6" stopColor={t.accent} stopOpacity={0.7} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {stars.map((st, i) => (
        <circle key={i} cx={r2(st.x)} cy={r2(st.y)} r={r2(st.r)} fill={t.text} opacity={r2(st.o)} />
      ))}
      <circle cx={cx} cy={cy} r={380} fill={`url(#${uid}-halo)`} />
      <circle cx={cx} cy={cy} r={168} fill="none" stroke={t.accent} strokeWidth={16} opacity={0.6} filter={`url(#${uid}-glow)`} />
      <circle cx={cx} cy={cy} r={166} fill={t.background} />
      <circle cx={cx} cy={cy} r={167} fill="none" stroke={`url(#${uid}-ring)`} strokeWidth={2.5} />
      <circle cx={cx - 112} cy={cy - 118} r={5} fill="#ffffff" filter={`url(#${uid}-glow)`} />
      <circle cx={cx - 112} cy={cy - 118} r={2.6} fill="#ffffff" />
      <rect x={0} y={516} width={W} height={1} fill={`url(#${uid}-horizon)`} />
      {o.showBrand ? <Text x={76} y={88} lines={caps(c.name)} font={f.mono} size={13} tracking={0.32} fill={t.text} opacity={0.75} /> : null}
      <Text x={72} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      <BlockText b={desc} x={76} font={f.italic} fill={t.text} opacity={0.62} />
      {o.showMeta ? (
        <g>
          <Text x={76} y={H - 62} lines={caps(c.domain)} font={f.mono} size={12} tracking={0.28} fill={t.text} opacity={0.6} />
          <Text x={W - 76} y={H - 62} anchor="end" lines={caps(c.date)} font={f.mono} size={12} tracking={0.28} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
    </Frame>
  )
}

export const nocturne: TemplateDef = {
  id: 'nocturne',
  number: 14,
  name: 'Nocturne',
  collection: 'abstract',
  description: 'Near-black night with a luminous eclipse, faint stars and a refined Garamond headline.',
  fonts: {
    display: { family: 'Cormorant Garamond', weight: 400 },
    italic: { family: 'Cormorant Garamond', weight: 400, style: 'italic' },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#ecebe6', accent: '#f1c27d', background: '#06070a', text: '#efece4' },
  limits: { headline: 60, description: 100 },
  uses: ['date'],
  render: Nocturne,
}

/** <NocturneImage /> renders the nocturne template as an SVG (1200×630). */
export function NocturneImage(props: OgImageProps) {
  return <OgImage template={nocturne} {...props} />
}
