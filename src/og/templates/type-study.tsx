import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 04 · Type Study ─────────────────────────── */

function TypeStudy({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 64
  const word = (c.name || 'Aa').trim()
  const unit = measure(word, f.display, 1, -0.04)
  const size = Math.min(1380 / Math.max(unit, 0.1), 600)
  const cap = vmetrics(f.display, size).cap
  const base = H + size * 0.1
  const lettersTop = base - cap
  const top = 132
  const head = blockTop(c.headline, { font: f.italic, maxWidth: 760, maxLines: 3, max: 66 * o.scale, min: 30, lineHeight: 1.04, tracking: -0.01, top, maxHeight: Math.max(60, lettersTop - 44 - top) })
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 250, maxLines: 6, max: 15, min: 12, lineHeight: 1.5, top: 140 })
  const fam = `${f.display.family} ${f.display.weight}`
  return (
    <Frame background={t.background}>
      <Text x={M - 24} y={base - 16} lines={word} font={f.display} size={size} tracking={-0.04} fill="none" stroke={t.accent} strokeWidth={2} opacity={0.9} />
      <Text x={M - 10} y={base} lines={word} font={f.display} size={size} tracking={-0.04} fill={t.text} />
      <Text x={M} y={70} lines={caps(join(['Specimen', o.showBrand ? c.name : ''], ' — '))} font={f.mono} size={13} tracking={0.12} fill={t.text} />
      <Text x={W - M} y={70} anchor="end" lines={caps(fam)} font={f.mono} size={13} tracking={0.12} fill={t.text} opacity={0.6} />
      <line x1={M} x2={W - M} y1={90} y2={90} stroke={t.text} strokeOpacity={0.3} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.italic} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      {o.showMeta ? <BlockText b={desc} x={W - M - 250} font={f.mono} fill={t.text} opacity={0.7} /> : null}
      {o.showMeta ? <Text x={W - M} y={Math.min(desc.bottom + 70, lettersTop - 20)} anchor="end" lines="Aa" font={f.display} size={56} fill={t.accent} /> : null}
    </Frame>
  )
}

export const typeStudy: TemplateDef = {
  id: 'type-study',
  number: 4,
  name: 'Type Study',
  collection: 'editorial',
  description: 'Your project name as an oversized, cropped specimen with an offset outline and italic headline.',
  fonts: {
    display: { family: 'Fraunces', weight: 900 },
    italic: { family: 'Fraunces', weight: 300, style: 'italic' },
    mono: { family: 'IBM Plex Mono', weight: 400 },
  },
  theme: { primary: '#efe8da', accent: '#ff6a3d', background: '#16140f', text: '#efe8da' },
  limits: { headline: 60, description: 110 },
  render: TypeStudy,
}

/** <TypeStudyImage /> renders the typeStudy template as an SVG (1200×630). */
export function TypeStudyImage(props: OgImageProps) {
  return <OgImage template={typeStudy} {...props} />
}
