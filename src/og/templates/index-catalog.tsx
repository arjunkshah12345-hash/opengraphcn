import type { ReactElement } from 'react'
import { blockTop, caps } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 17 · Index ─────────────────────────── */

function Index({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 64
  const s = o.scale
  const vx = 340
  const vw = W - M - vx
  const gray = mix(t.text, t.background, 0.55)
  const rows: { n: string; k: string; h: number; node: (y: number) => ReactElement }[] = []
  if (o.showBrand)
    rows.push({ n: '01', k: 'Project', h: 64, node: (y) => <Text x={vx} y={y + 40} lines={fitLine(c.name, f.label, 26, 16, vw).text} font={f.label} size={26} tracking={-0.02} fill={t.text} /> })
  const head = blockTop(c.headline, { font: f.display, maxWidth: vw, maxLines: 3, max: 62 * s, min: 28, lineHeight: 1.06, tracking: -0.03, top: 0, maxHeight: 200 })
  rows.push({ n: '02', k: 'Headline', h: head.last - head.y + head.size * 0.24 + 56 + head.y, node: (y) => <Text x={vx - 2} y={y + 28 + head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} /> })
  const desc = blockTop(c.description, { font: f.body, maxWidth: vw - 80, maxLines: 2, max: 19, min: 15, lineHeight: 1.4, top: 0 })
  if (c.description) rows.push({ n: '03', k: 'Summary', h: desc.last + 44, node: (y) => <Text x={vx} y={y + 24 + desc.y} lines={desc.lines} font={f.body} size={desc.size} lh={desc.lh} fill={t.text} opacity={0.7} /> })
  if (o.showMeta && c.domain) rows.push({ n: '04', k: 'Location', h: 58, node: (y) => <Text x={vx} y={y + 36} lines={c.domain} font={f.mono} size={17} fill={t.text} /> })
  const total = rows.reduce((a, r) => a + r.h, 0)
  let y = 100 + Math.max(16, (H - 150 - total) / 2)
  return (
    <Frame background={t.background}>
      <Text x={M} y={76} lines="Index" font={f.label} size={16} fill={t.text} />
      <Text x={vx} y={76} lines={caps(c.category)} font={f.mono} size={12} tracking={0.12} fill={gray} />
      {o.showMeta ? <Text x={W - M} y={76} anchor="end" lines={c.date} font={f.mono} size={13} fill={gray} /> : null}
      <line x1={M} x2={W - M} y1={100} y2={100} stroke={t.text} strokeWidth={1.4} />
      {rows.map((r) => {
        const top = y
        y += r.h
        return (
          <g key={r.n}>
            <Text x={M} y={top + 36} lines={r.n} font={f.mono} size={13} fill={r.k === 'Headline' ? t.accent : gray} />
            {r.k === 'Headline' ? <rect x={M + 30} y={top + 27} width={8} height={8} fill={t.accent} /> : null}
            <Text x={M + 74} y={top + 36} lines={caps(r.k)} font={f.mono} size={12} tracking={0.12} fill={gray} />
            {r.node(top)}
            <line x1={M} x2={W - M} y1={y} y2={y} stroke={t.text} strokeOpacity={0.18} />
          </g>
        )
      })}
      {c.badge ? <Text x={W - M} y={H - 36} anchor="end" lines={c.badge} font={f.mono} size={12} fill={gray} /> : null}
    </Frame>
  )
}

export const index: TemplateDef = {
  id: 'index',
  number: 17,
  name: 'Index',
  collection: 'minimal',
  description: 'A catalogue entry: numbered rows, fine rules, monospaced labels and a clear typographic hierarchy.',
  fonts: {
    display: { family: 'Geist', weight: 500 },
    label: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#111111', accent: '#2f54eb', background: '#f5f4f0', text: '#111111' },
  limits: { headline: 60, description: 110 },
  uses: ['category', 'date', 'badge'],
  render: Index,
}

/** <IndexImage /> renders the index template as an SVG (1200×630). */
export function IndexImage(props: OgImageProps) {
  return <OgImage template={index} {...props} />
}
