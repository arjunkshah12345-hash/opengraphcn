import { Arrow, BlockText, blockCenter, blockTop, join, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 26 · Launch ─────────────────────────── */

function Launch({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const head = blockCenter(c.headline, { font: f.display, maxWidth: 980, maxLines: 2, max: 84 * s, min: 40, lineHeight: 1.02, tracking: -0.045, center: 318, maxHeight: 200 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 720, maxLines: 2, max: 22, min: 17, lineHeight: 1.4, top: head.bottom + 26 })
  const pill = join(['NEW', c.badge], '  ·  ')
  const pw = measure(pill, f.mono, 13, 0.08) + 34
  const nameW = measure(c.name, f.brand, 22, -0.02)
  const brandW = 40 + 12 + nameW
  const vpY = 330
  const floor = Array.from({ length: 21 }, (_, i) => -1200 + i * 180)
  const horiz = [450, 478, 514, 560, 618]
  const dw = measure(c.domain, f.mono, 16)
  return (
    <Frame background={t.background}>
      <defs>
        <radialGradient id={`${uid}-spot`} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor={t.accent} stopOpacity={0.42} />
          <stop offset="0.45" stopColor={t.accent} stopOpacity={0.08} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="420" x2="0" y2="630" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={t.text} stopOpacity={0} />
          <stop offset="1" stopColor={t.text} stopOpacity={0.22} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-spot)`} />
      <g stroke={`url(#${uid}-floor)`} strokeWidth={1}>
        {floor.map((x) => (
          <line key={x} x1={600 + (x - 600) * 0.12} y1={vpY + 90} x2={x + 600} y2={H} />
        ))}
        {horiz.map((y) => (
          <line key={y} x1={0} x2={W} y1={y} y2={y} />
        ))}
      </g>
      <Grain uid={uid} opacity={0.08} blend="screen" />
      {o.showBrand ? (
        <g>
          <Mark x={W / 2 - brandW / 2} y={78} size={40} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.brand} />
          <Text x={W / 2 - brandW / 2 + 52} y={106} lines={c.name} font={f.brand} size={22} tracking={-0.02} fill={t.text} />
        </g>
      ) : null}
      <rect x={W / 2 - pw / 2} y={150} width={pw} height={32} rx={16} fill={t.accent} fillOpacity={0.12} stroke={t.accent} strokeOpacity={0.55} />
      <Text x={W / 2} y={171} anchor="middle" lines={pill} font={f.mono} size={13} tracking={0.08} fill={t.accent} />
      <Text x={W / 2} y={head.y} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.045} fill={t.text} />
      <BlockText b={desc} x={W / 2} anchor="middle" font={f.body} fill={t.text} opacity={0.62} />
      {o.showMeta ? (
        <g>
          <Text x={W / 2 - 12} y={H - 62} anchor="middle" lines={c.domain} font={f.mono} size={16} fill={t.text} />
          <Arrow x={W / 2 - 12 + dw / 2 + 16} y={H - 67} size={12} stroke={t.accent} dir={-45} />
        </g>
      ) : null}
    </Frame>
  )
}

export const launch: TemplateDef = {
  id: 'launch',
  number: 26,
  name: 'Launch',
  collection: 'product',
  description: 'Launch-day card: spotlight, perspective floor, release pill, brand lock-up and a centred headline.',
  fonts: {
    display: { family: 'Geist', weight: 700 },
    brand: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#ffffff', accent: '#ff7a45', background: '#09090b', text: '#f6f5f2' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge'],
  render: Launch,
}

/** <LaunchImage /> renders the launch template as an SVG (1200×630). */
export function LaunchImage(props: OgImageProps) {
  return <OgImage template={launch} {...props} />
}
