import { Img, Frame, Text } from '../core/primitives'
import { balance, fit, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { initials } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 02 · The Journal ─────────────────────────── */

function Journal({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const r = fit(c.headline, { font: f.display, maxWidth: 1000, maxLines: 2, max: 92 * o.scale, min: 40, lineHeight: 1.0, tracking: -0.02 })
  const lines = r.truncated ? r.lines : balance(c.headline, f.display, r.size, 1000, -0.02)
  const y0 = 430 - (lines.length - 1) * r.size * 0.5
  const letter = initials(c.name).slice(0, 1) || 'A'
  const gs = 250
  const gy = 300 - (lines.length - 1) * r.size * 0.5
  const logo = assets.logo || assets.favicon
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.accent} />
          <stop offset="0.55" stopColor={t.primary} />
          <stop offset="1" stopColor="#2f54ff" />
        </linearGradient>
        <filter id={`${uid}-sh`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      {o.showBrand ? (
        logo ? (
          <Img href={logo} x={W / 2 - 90} y={gy - 200} w={180} h={180} r={40} uid={uid} fit="contain" />
        ) : (
          <g>
            <Text x={W / 2} y={gy + 6} anchor="middle" lines={letter} font={f.glyph} size={gs} fill={t.primary} opacity={0.45} filter={`url(#${uid}-sh)`} />
            <Text x={W / 2} y={gy} anchor="middle" lines={letter} font={f.glyph} size={gs} fill={`url(#${uid}-g)`} stroke="#ffffff" strokeWidth={13} strokeLinejoin="round" style={{ paintOrder: 'stroke' }} />
          </g>
        )
      ) : null}
      <Text x={W / 2} y={y0 + vmetrics(f.display, r.size).cap * 0.5} anchor="middle" lines={lines} font={f.display} size={r.size} lh={1.0} tracking={-0.02} fill={t.text} />
    </Frame>
  )
}

export const journal: TemplateDef = {
  id: 'journal',
  number: 2,
  name: 'The Journal',
  collection: 'editorial',
  description: 'A letter to your readers: a glossy outlined monogram above a centred serif headline on black.',
  fonts: {
    display: { family: 'Newsreader', weight: 400 },
    glyph: { family: 'Inter Tight', weight: 800 },
  },
  theme: { primary: '#ff3d6e', accent: '#ff9a3d', background: '#000000', text: '#f5f3ee' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Journal,
}

/** <JournalImage /> renders the journal template as an SVG (1200×630). */
export function JournalImage(props: OgImageProps) {
  return <OgImage template={journal} {...props} />
}
