import { BlockText, blockTop, caps, ditherPath, join, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 28 · Announcement ─────────────────────────── */

function Announcement({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const big = fitLine(c.badge || 'New', f.brand, 300, 72, 500, -0.06)
  const head = blockTop(c.headline, { font: f.display, maxWidth: 470, maxLines: 4, max: 52 * s, min: 26, lineHeight: 1.06, tracking: -0.03, top: 214, maxHeight: 230 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 440, maxLines: 3, max: 19, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  const field = ditherPath({ x: 600, y: 0, w: 600, h: H, cell: 10, f: (u, v) => Math.max(0, 1 - Math.hypot((u - 0.55) * 1.2, (v - 0.92) * 1.1) * 1.25) })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-heat`} x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0" stopColor={t.accent} />
          <stop offset="1" stopColor={t.primary} />
        </linearGradient>
      </defs>
      <path d={field} fill={`url(#${uid}-heat)`} opacity={0.9} />
      <Text x={W - M + 8} y={330 + big.size * 0.3} anchor="end" lines={big.text} font={f.brand} size={big.size} tracking={-0.06} fill={t.text} />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={66} size={34} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.brand} shape="rounded" />
          <Text x={M + 48} y={90} lines={c.name} font={f.brand} size={20} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      <Text x={M} y={176} lines={caps(join(['Now available', c.date], '  ·  '))} font={f.mono} size={14} tracking={0.14} fill={t.accent} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      {desc.bottom < 540 ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.6} /> : null}
      {o.showMeta ? <Text x={M} y={H - 56} lines={ellipsize(join([c.domain, c.category, c.author], '   ·   '), f.mono, 14, 500)} font={f.mono} size={14} fill={t.text} opacity={0.55} /> : null}
    </Frame>
  )
}

export const announcement: TemplateDef = {
  id: 'announcement',
  number: 28,
  name: 'Announcement',
  collection: 'product',
  description: 'A release card: your version number set huge over a dithered heat glow, with the headline beside it.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    brand: { family: 'Geist', weight: 700 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#ff4d2e', accent: '#ffb547', background: '#0c0a09', text: '#fafaf9' },
  limits: { headline: 60, description: 110 },
  uses: ['logo', 'badge', 'date', 'category', 'author'],
  render: Announcement,
}

/** <AnnouncementImage /> renders the announcement template as an SVG (1200×630). */
export function AnnouncementImage(props: OgImageProps) {
  return <OgImage template={announcement} {...props} />
}
