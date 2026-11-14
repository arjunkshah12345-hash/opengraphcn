import { blockTop, caps } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { fitLine, measure, wrapVariable } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 02 · The Journal ─────────────────────────── */

function Journal({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const ink = t.text
  const mast = fitLine(c.name || 'The Journal', f.mast, 84, 40, 860)
  const colX = 832
  const colW = W - M - colX
  const head = blockTop(c.headline, { font: f.display, maxWidth: 712, maxLines: 4, max: 78 * s, min: 38, lineHeight: 1.0, tracking: -0.012, top: 222, maxHeight: 268 })
  const bylineY = Math.min(head.bottom + 34, 548)
  // drop-cap paragraph
  const text = c.description.trim()
  const letter = text.slice(0, 1)
  const rest = text.slice(1)
  const bodySize = 19
  const dropSize = 70
  const dropW = letter ? measure(letter, f.display, dropSize) + 10 : 0
  const lines = rest ? wrapVariable(rest, f.body, bodySize, (i) => (i < 2 ? colW - dropW : colW), 9) : []
  const bodyTop = 262
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.06} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={46} lines="VOL. I — NO. 1" font={f.label} size={12} tracking={0.18} fill={ink} />
          <Text x={W / 2} y={46} anchor="middle" lines={caps(c.date)} font={f.label} size={12} tracking={0.18} fill={ink} />
          <Text x={W - M} y={46} anchor="end" lines={caps(c.domain)} font={f.label} size={12} tracking={0.18} fill={ink} />
        </g>
      ) : null}
      <line x1={M} x2={W - M} y1={60} y2={60} stroke={ink} strokeWidth={0.8} />
      {o.showBrand ? <Text x={W / 2} y={132} anchor="middle" lines={mast.text} font={f.mast} size={mast.size} fill={ink} /> : null}
      <line x1={M} x2={W - M} y1={152} y2={152} stroke={ink} strokeWidth={2.4} />
      <line x1={M} x2={W - M} y1={157.5} y2={157.5} stroke={ink} strokeWidth={0.8} />
      <Text x={M} y={180} lines={caps(c.category)} font={f.label} size={12} tracking={0.18} fill={t.accent} />
      {[-18, 0, 18].map((d) => (
        <rect key={d} x={W / 2 + d - 3} y={172} width={6} height={6} transform={`rotate(45 ${W / 2 + d} 175)`} fill={ink} opacity={0.55} />
      ))}
      <Text x={W - M} y={180} anchor="end" lines={caps(c.badge)} font={f.label} size={12} tracking={0.18} fill={ink} />
      <line x1={M} x2={W - M} y1={194} y2={194} stroke={ink} strokeWidth={0.8} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.012} fill={ink} />
      {c.author ? <Text x={M} y={bylineY} lines={`By ${c.author}`} font={f.bodyItalic} size={21} fill={ink} opacity={0.75} /> : null}
      <line x1={804} x2={804} y1={214} y2={562} stroke={ink} strokeWidth={0.8} />
      <Text x={colX} y={236} lines={caps('The brief')} font={f.label} size={11} tracking={0.2} fill={t.accent} />
      {letter ? <Text x={colX - 2} y={bodyTop + dropSize * 0.62} lines={letter} font={f.display} size={dropSize} fill={ink} /> : null}
      <Text x={colX} y={bodyTop + 12} lines={lines.slice(0, 2)} font={f.body} size={bodySize} lh={1.42} fill={ink} transform={`translate(${dropW} 0)`} />
      <Text x={colX} y={bodyTop + 12 + 2 * bodySize * 1.42} lines={lines.slice(2)} font={f.body} size={bodySize} lh={1.42} fill={ink} />
      <line x1={M} x2={W - M} y1={574} y2={574} stroke={ink} strokeWidth={0.8} />
      <Text x={M} y={600} lines={`Continued at ${c.domain}`} font={f.body} size={16} fill={ink} opacity={0.7} />
      <Text x={W - M} y={600} anchor="end" lines="PAGE A1" font={f.label} size={12} tracking={0.18} fill={ink} opacity={0.7} />
    </Frame>
  )
}

export const journal: TemplateDef = {
  id: 'journal',
  number: 2,
  name: 'The Journal',
  collection: 'editorial',
  description: 'A broadsheet front page: blackletter masthead, column rules, drop cap and a Bodoni headline.',
  fonts: {
    display: { family: 'Bodoni Moda', weight: 800 },
    mast: { family: 'UnifrakturMaguntia', weight: 400 },
    body: { family: 'Newsreader', weight: 400 },
    bodyItalic: { family: 'Newsreader', weight: 400, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#141414', accent: '#9b1c1c', background: '#f2ede1', text: '#141414' },
  limits: { headline: 70, description: 220 },
  uses: ['date', 'category', 'badge', 'author'],
  render: Journal,
}

/** <JournalImage /> renders the journal template as an SVG (1200×630). */
export function JournalImage(props: OgImageProps) {
  return <OgImage template={journal} {...props} />
}
