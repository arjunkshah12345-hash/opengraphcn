import { Beam, Brand, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 26 · Launch ─────────────────────────── */

function Launch({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const head = fitLine(c.headline, f.display, 58 * o.scale, 28, 1000, -0.035)
  const wx = 190
  const wy = 290
  const ww = W - wx * 2
  const panel = mix(t.background, '#ffffff', 0.07)
  const rows = [c.name, c.description, c.domain, c.category, c.badge].filter((v): v is string => !!v && !!v.trim()).slice(0, 4)
  return (
    <Frame background={t.background}>
      <Beam uid={uid} id="a" x={-300} y={250} w={1900} h={220} angle={-16} color={t.accent} opacity={0.9} blur={30} />
      <Beam uid={uid} id="b" x={-300} y={420} w={1900} h={120} angle={-10} color={mix(t.accent, '#ff9a6b', 0.4)} opacity={0.7} blur={20} />
      {o.showBrand ? <Brand x={W / 2} y={58} size={36} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} anchor="middle" /> : null}
      <Text x={W / 2} y={200} anchor="middle" lines={head.text} font={f.display} size={head.size} tracking={-0.035} fill={t.text} />
      <rect x={wx} y={wy} width={ww} height={H} rx={18} fill={panel} fillOpacity={0.92} stroke="#ffffff" strokeOpacity={0.14} />
      <Text x={wx + 32} y={wy + 46} lines={ellipsize(c.name ? `${c.name.toLowerCase()}` : 'search', f.body, 22, ww - 120)} font={f.body} size={22} fill={t.text} />
      <rect x={wx + 32 + Math.min(ww - 120, (c.name || 'search').length * 11.5) + 4} y={wy + 26} width={2} height={26} fill={t.accent} />
      <line x1={wx} x2={wx + ww} y1={wy + 74} y2={wy + 74} stroke="#ffffff" strokeOpacity={0.1} />
      <Text x={wx + 32} y={wy + 108} lines="Results" font={f.body} size={14} fill={t.text} opacity={0.45} />
      {rows.map((v, i) => {
        const y = wy + 124 + i * 54
        return (
          <g key={i}>
            {i === 0 ? <rect x={wx + 14} y={y} width={ww - 28} height={46} rx={10} fill="#ffffff" fillOpacity={0.08} /> : null}
            {i === 0 ? (
              <Mark x={wx + 28} y={y + 9} size={28} assets={assets} name={c.name} uid={`${uid}-r`} fill={t.accent} color="#ffffff" font={f.label} shape="rounded" />
            ) : (
              <rect x={wx + 28} y={y + 9} width={28} height={28} rx={7} fill="#ffffff" fillOpacity={0.1} />
            )}
            <Text x={wx + 72} y={y + 30} lines={ellipsize(v, f.body, 18, ww - 220)} font={f.body} size={18} fill={t.text} opacity={i === 0 ? 1 : 0.75} />
            {i === 0 ? <Text x={wx + ww - 30} y={y + 30} anchor="end" lines="Open" font={f.body} size={15} fill={t.text} opacity={0.5} /> : null}
          </g>
        )
      })}
    </Frame>
  )
}

export const launch: TemplateDef = {
  id: 'launch',
  number: 26,
  name: 'Launch',
  collection: 'product',
  description: 'A launcher-style card: logo and headline over red light beams, with a command palette rising from the bottom.',
  fonts: {
    display: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#ffffff', accent: '#ff3b47', background: '#0c0607', text: '#ffffff' },
  limits: { headline: 40 },
  uses: ['logo', 'category', 'badge'],
  render: Launch,
}

/** <LaunchImage /> renders the launch template as an SVG (1200×630). */
export function LaunchImage(props: OgImageProps) {
  return <OgImage template={launch} {...props} />
}
