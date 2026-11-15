import { Arrow, BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 10 · System ─────────────────────────── */

function System({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 470, maxLines: 4, max: 70 * s, min: 30, lineHeight: 1.0, tracking: -0.04, top: 132, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 440, maxLines: 3, max: 20, min: 16, lineHeight: 1.42, top: head.bottom + 24 })
  const line = mix(t.text, t.background, 0.55)
  type N = { x: number; y: number; w: number; h: number; label: string; sub?: string; core?: boolean }
  const core: N = { x: 790, y: 262, w: 236, h: 96, label: c.name, sub: c.badge, core: true }
  const nodes: N[] = [
    { x: 600, y: 120, w: 150, h: 56, label: 'client', sub: 'browser' },
    { x: 600, y: 452, w: 150, h: 56, label: 'edge', sub: 'cdn' },
    { x: 980, y: 104, w: 168, h: 56, label: 'api', sub: c.domain || 'https' },
    { x: 1000, y: 470, w: 148, h: 56, label: 'store', sub: 'kv' },
  ]
  const conn = [
    `M 675 176 L 675 310 L 790 310`,
    `M 675 452 L 675 334 L 790 334`,
    `M 1064 160 L 1064 262`,
    `M 1074 470 L 1074 358`,
  ]
  const labels = [
    { x: 686, y: 248, t: 'https' },
    { x: 686, y: 412, t: 'cache' },
    { x: 1074, y: 220, t: 'rpc' },
    { x: 1084, y: 424, t: 'write' },
  ]
  return (
    <Frame background={t.background}>
      <defs>
        <pattern id={`${uid}-dots`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={1.2} cy={1.2} r={1.2} fill={t.text} fillOpacity={0.14} />
        </pattern>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={line} />
        </marker>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-dots)`} />
      <Text x={M} y={76} lines={caps(join(['System', o.showBrand ? c.name : '', 'v' === c.badge ? '' : c.badge], ' / '))} font={f.mono} size={13} tracking={0.12} fill={t.text} opacity={0.7} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} />
      {o.showMeta ? <Text x={M} y={H - 56} lines={join([c.domain, c.category], '  ·  ')} font={f.mono} size={14} fill={t.text} opacity={0.6} /> : null}
      {conn.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={line} strokeWidth={1.6} markerEnd={`url(#${uid}-arrow)`} strokeDasharray={i === 1 ? '5 5' : undefined} />
      ))}
      {labels.map((l) => (
        <Text key={l.t} x={l.x} y={l.y} lines={l.t} font={f.mono} size={12} fill={t.text} opacity={0.6} />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={10} fill={t.background} stroke={t.text} strokeOpacity={0.35} strokeWidth={1.2} />
          <circle cx={n.x + 18} cy={n.y + n.h / 2} r={4} fill={t.text} fillOpacity={0.35} />
          <Text x={n.x + 32} y={n.y + 25} lines={n.label} font={f.monoBold} size={14} fill={t.text} />
          <Text x={n.x + 32} y={n.y + 43} lines={ellipsize(n.sub ?? '', f.mono, 12, n.w - 44)} font={f.mono} size={12} fill={t.text} opacity={0.55} />
        </g>
      ))}
      <rect x={core.x + 6} y={core.y + 8} width={core.w} height={core.h} rx={14} fill={t.accent} fillOpacity={0.25} />
      <rect x={core.x} y={core.y} width={core.w} height={core.h} rx={14} fill={t.primary} />
      <circle cx={core.x + 26} cy={core.y + 32} r={6} fill={t.accent} />
      <circle cx={core.x + 26} cy={core.y + 32} r={12} fill={t.accent} fillOpacity={0.25} />
      <Text x={core.x + 46} y={core.y + 40} lines={fitLine(core.label, f.display, 26, 14, core.w - 64).text} font={f.display} size={fitLine(core.label, f.display, 26, 14, core.w - 64).size} tracking={-0.02} fill={t.background} />
      <Text x={core.x + 22} y={core.y + 74} lines={ellipsize(join(['service', core.sub], ' · '), f.mono, 13, core.w - 40)} font={f.mono} size={13} fill={t.background} opacity={0.7} />
      <Arrow x={core.x + core.w - 26} y={core.y + 70} size={14} stroke={t.accent} dir={-45} />
    </Frame>
  )
}

export const system: TemplateDef = {
  id: 'system',
  number: 10,
  name: 'System',
  collection: 'developer',
  description: 'Architecture-diagram language: dot grid, connected service nodes, arrows and technical labels.',
  fonts: {
    display: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
    monoBold: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#16171a', accent: '#ff5a36', background: '#f3f2ee', text: '#16171a' },
  limits: { headline: 56, description: 110 },
  uses: ['badge', 'category'],
  render: System,
}

/** <SystemImage /> renders the system template as an SVG (1200×630). */
export function SystemImage(props: OgImageProps) {
  return <OgImage template={system} {...props} />
}
