import type { ReactNode } from 'react'
import { blockTop, join, Mark, Spans } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 07 · Codebase ─────────────────────────── */

function Codebase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const gutter = 92
  const x = gutter + 26
  const comment = mix(t.text, t.background, 0.52)
  const kw = t.primary
  const str = t.accent
  const numC = mix(t.text, t.background, 0.68)
  const s = o.scale
  const code = 21
  const step = 36
  const head = blockTop(c.headline, { font: f.display, maxWidth: W - x - 120, maxLines: 3, max: 70 * s, min: 32, lineHeight: 1.08, tracking: -0.03, top: 0 })
  const bigStep = head.size * 1.08
  type Row = { h: number; node: (y: number) => ReactNode }
  const rows: Row[] = []
  rows.push({ h: step, node: (y) => <Text x={x} y={y} lines="/**" font={f.mono} size={code} fill={comment} /> })
  head.lines.forEach((line) =>
    rows.push({
      h: bigStep,
      node: (y) => (
        <g>
          <Text x={x + 8} y={y} lines="*" font={f.mono} size={code} fill={comment} />
          <Text x={x + 40} y={y} lines={line} font={f.display} size={head.size} tracking={-0.03} fill={t.text} />
        </g>
      ),
    }),
  )
  rows.push({ h: step, node: (y) => <Text x={x + 8} y={y} lines="*/" font={f.mono} size={code} fill={comment} /> })
  const prop = (k: string, v: string) => (y: number) => (
    <Spans
      x={x}
      y={y}
      size={code}
      font={f.mono}
      fill={t.text}
      parts={[
        { text: `  ${k}: ` },
        { text: `"${ellipsize(v, f.mono, code, W - x - 220 - measure(`  ${k}: `, f.mono, code))}"`, fill: str },
        { text: ',', fill: comment },
      ]}
    />
  )
  rows.push({
    h: step,
    node: (y) => (
      <Spans x={x} y={y} size={code} font={f.mono} fill={t.text} parts={[{ text: 'export default ', fill: kw }, { text: 'defineProject' }, { text: '({', fill: comment }]} />
    ),
  })
  if (o.showBrand) rows.push({ h: step, node: prop('name', c.name) })
  if (c.description) rows.push({ h: step, node: prop('description', c.description) })
  if (o.showMeta && c.domain) rows.push({ h: step, node: prop('homepage', `https://${c.domain.replace(/^https?:\/\//, '')}`) })
  if (o.showMeta && c.author) rows.push({ h: step, node: prop('author', c.author) })
  if (o.showMeta && c.badge) rows.push({ h: step, node: prop('version', c.badge.replace(/^v/, '')) })
  rows.push({ h: step, node: (y) => <Text x={x} y={y} lines="})" font={f.mono} size={code} fill={comment} /> })

  const top = 116
  const bottom = H - 52
  let y = top
  const placed: { y: number; node: ReactNode; big: boolean }[] = []
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    y += i === 0 ? 0 : r.h
    if (y > bottom - 10 && i < rows.length - 1) continue
    placed.push({ y, node: r.node(y), big: r.h !== step })
  }
  // if the closing brace was dropped because space ran out, ensure last row is "})"
  return (
    <Frame background={t.background}>
      <rect x={0} y={0} width={W} height={60} fill={mix(t.background, t.text, 0.05)} />
      <rect x={0} y={0} width={210} height={60} fill={t.background} />
      <rect x={0} y={0} width={210} height={2.5} fill={t.accent} />
      <Text x={30} y={37} lines="README.md" font={f.ui} size={16} fill={t.text} />
      <Text x={240} y={37} lines="index.ts" font={f.ui} size={16} fill={comment} />
      <Text x={360} y={37} lines="package.json" font={f.ui} size={16} fill={comment} />
      {o.showBrand ? (
        <g>
          <Mark x={W - 64} y={16} size={28} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.ui} />
          <Text x={W - 78} y={36} anchor="end" lines={c.name} font={f.ui} size={16} fill={t.text} />
        </g>
      ) : null}
      <line x1={gutter} x2={gutter} y1={60} y2={H - 34} stroke={t.text} strokeOpacity={0.06} />
      {placed.map((p, i) => (
        <g key={i}>
          {p.big ? <rect x={gutter + 1} y={p.y - head.size * 0.86} width={W - gutter - 1} height={head.size * 1.08} fill={t.accent} fillOpacity={i === 1 ? 0.07 : 0} /> : null}
          <Text x={gutter - 26} y={p.y} anchor="end" lines={String(i + 1)} font={f.mono} size={15} fill={numC} />
          {p.node}
        </g>
      ))}
      <rect x={0} y={H - 34} width={W} height={34} fill={mix(t.background, t.text, 0.05)} />
      <Spans x={22} y={H - 12} size={13} font={f.mono} fill={comment} parts={[{ text: 'main', fill: t.text }, { text: `   ${c.category || 'TypeScript'}` }]} />
      <Text x={W - 22} y={H - 12} anchor="end" lines={join([o.showMeta ? c.domain : '', 'Ln 3, Col 28', 'UTF-8'], '   ')} font={f.mono} size={13} fill={comment} />
    </Frame>
  )
}

export const codebase: TemplateDef = {
  id: 'codebase',
  number: 7,
  name: 'Codebase',
  collection: 'developer',
  description: 'Your headline as a doc-comment in a light editor, with line numbers and a real config object.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    mono: { family: 'Geist Mono', weight: 400 },
    ui: { family: 'Geist', weight: 500 },
  },
  theme: { primary: '#1f6f5c', accent: '#c2410c', background: '#faf8f3', text: '#1c1b19' },
  limits: { headline: 56, description: 60 },
  uses: ['logo', 'author', 'badge', 'category'],
  render: Codebase,
}

/** <CodebaseImage /> renders the codebase template as an SVG (1200×630). */
export function CodebaseImage(props: OgImageProps) {
  return <OgImage template={codebase} {...props} />
}
