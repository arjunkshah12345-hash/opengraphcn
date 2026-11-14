import { BlockText, blockTop, caps, join, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { fitLine, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 28 · Announcement ─────────────────────────── */

function Announcement({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 740, maxLines: 3, max: 100 * s, min: 44, lineHeight: 0.98, tracking: -0.02, top: 176, maxHeight: 280 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 640, maxLines: 2, max: 21, min: 16, lineHeight: 1.4, top: head.bottom + 26 })
  const cx = 990
  const cy = 330
  const ticks = Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2)
  const badge = fitLine(c.badge || 'New', f.brand, 44, 18, 170, -0.03)
  const label = 'UPDATE'
  const lw = measure(label, f.mono, 12, 0.18) + 28
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.1} blend="overlay" />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={62} size={34} assets={assets} name={c.name} uid={uid} fill={t.accent} color={t.background} font={f.brand} shape="circle" />
          <Text x={M + 48} y={86} lines={c.name} font={f.brand} size={19} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      <rect x={W - M - lw} y={64} width={lw} height={30} rx={15} fill="none" stroke={t.accent} />
      <Text x={W - M - lw / 2} y={84} anchor="middle" lines={label} font={f.mono} size={12} tracking={0.18} fill={t.accent} />
      <Text x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} />
      <g>
        {ticks.map((a, i) => (
          <line key={i} x1={cx + Math.cos(a) * 132} y1={cy + Math.sin(a) * 132} x2={cx + Math.cos(a) * (i % 4 ? 140 : 148)} y2={cy + Math.sin(a) * (i % 4 ? 140 : 148)} stroke={t.accent} strokeWidth={1.5} strokeOpacity={i % 4 ? 0.5 : 1} />
        ))}
        <circle cx={cx} cy={cy} r={118} fill={t.accent} />
        <circle cx={cx} cy={cy} r={106} fill="none" stroke={t.background} strokeOpacity={0.35} strokeDasharray="2 5" />
        <Text x={cx} y={cy - 36} anchor="middle" lines="RELEASED" font={f.mono} size={11} tracking={0.24} fill={t.background} />
        <Text x={cx} y={cy + vmetrics(f.brand, badge.size).cap / 2} anchor="middle" lines={badge.text} font={f.brand} size={badge.size} tracking={-0.03} fill={t.background} />
        <Text x={cx} y={cy + 52} anchor="middle" lines={fitLine(caps(c.date), f.mono, 12, 9, 150, 0.1).text} font={f.mono} size={12} tracking={0.1} fill={t.background} />
      </g>
      <line x1={M} x2={W - M} y1={H - 92} y2={H - 92} stroke={t.text} strokeOpacity={0.2} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={H - 56} lines={c.domain} font={f.mono} size={14} fill={t.text} opacity={0.8} />
          <Text x={W - M} y={H - 56} anchor="end" lines={join([c.category, c.author], '  ·  ')} font={f.mono} size={14} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
    </Frame>
  )
}

export const announcement: TemplateDef = {
  id: 'announcement',
  number: 28,
  name: 'Announcement',
  collection: 'product',
  description: 'Product update with an italic serif headline and a ticked release seal carrying version and date.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400, style: 'italic' },
    brand: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#f3eedf', accent: '#f2c14e', background: '#1d3a2e', text: '#f3eedf' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge', 'date', 'category', 'author'],
  render: Announcement,
}

/** <AnnouncementImage /> renders the announcement template as an SVG (1200×630). */
export function AnnouncementImage(props: OgImageProps) {
  return <OgImage template={announcement} {...props} />
}
