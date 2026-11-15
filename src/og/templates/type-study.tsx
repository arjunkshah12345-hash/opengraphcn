import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 04 · Type Study ─────────────────────────── */

function TypeStudy({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const split = 640
  const glyph = 'Ag'
  const gs = 330
  const vm = vmetrics(f.specimen, gs)
  const base = 440
  const gw = measure(glyph, f.specimen, gs, -0.04)
  const gx = split + 60 + (W - split - 60 - gw) / 2
  const guides: [string, number][] = [
    ['cap', base - vm.cap],
    ['x-height', base - vm.cap * 0.68],
    ['baseline', base],
  ]
  const head = blockTop(c.headline, { font: f.display, maxWidth: split - M - 40, maxLines: 4, max: 74 * s, min: 34, lineHeight: 1.02, tracking: -0.02, top: 196, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: split - M - 60, maxLines: 2, max: 19, min: 15, lineHeight: 1.45, top: head.bottom + 26 })
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.08} blend="screen" />
      <rect x={split} y={0} width={W - split} height={630} fill={t.text} opacity={0.035} />
      {guides.map(([k, y]) => (
        <g key={k}>
          <line x1={split} x2={W} y1={y} y2={y} stroke={t.accent} strokeOpacity={0.55} strokeDasharray="2 5" />
          <Text x={split + 24} y={y - 8} lines={k} font={f.mono} size={12} fill={t.accent} opacity={0.85} />
        </g>
      ))}
      <Text x={gx} y={base} lines={glyph} font={f.specimen} size={gs} tracking={-0.04} fill={t.text} />
      <Text x={M} y={110} lines={caps(join(['Specimen', o.showBrand ? c.name : ''], '  /  '))} font={f.mono} size={14} tracking={0.1} fill={t.accent} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
      {desc.bottom < 520 ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.6} /> : null}
      <line x1={M} x2={split - 40} y1={548} y2={548} stroke={t.text} strokeOpacity={0.18} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={584} lines={`${f.specimen.family} ${f.specimen.weight}`} font={f.mono} size={14} fill={t.text} opacity={0.7} />
          <Text x={split - 40} y={584} anchor="end" lines={c.domain} font={f.mono} size={14} fill={t.text} opacity={0.45} />
          <Text x={split + 28} y={584} lines="A B C D E F G H I J K L M — 0 1 2 3 4 5 6 7 8 9" font={f.mono} size={13} tracking={0.04} fill={t.text} opacity={0.4} />
        </g>
      ) : null}
    </Frame>
  )
}

export const typeStudy: TemplateDef = {
  id: 'type-study',
  number: 4,
  name: 'Type Study',
  collection: 'editorial',
  description: 'A type specimen sheet: a giant display glyph measured against cap, x-height and baseline guides.',
  fonts: {
    display: { family: 'Fraunces', weight: 300, style: 'italic' },
    specimen: { family: 'Fraunces', weight: 900 },
    body: { family: 'Inter Tight', weight: 400 },
    mono: { family: 'JetBrains Mono', weight: 500 },
  },
  theme: { primary: '#ede6da', accent: '#ff7a45', background: '#141312', text: '#ede6da' },
  limits: { headline: 60, description: 110 },
  render: TypeStudy,
}

/** <TypeStudyImage /> renders the type study template as an SVG (1200×630). */
export function TypeStudyImage(props: OgImageProps) {
  return <OgImage template={typeStudy} {...props} />
}
