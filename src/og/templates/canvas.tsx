import { Brand } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 18 · Canvas ─────────────────────────── */

function split(text: string): [string, string] {
  const words = text.trim().split(/\s+/)
  if (words.length < 2) return [text.trim(), '']
  let best = 1
  let bestD = Infinity
  for (let i = 1; i < words.length; i++) {
    const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

function Canvas({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const [a, b] = split(c.headline)
  const fa = fitLine(a, f.display, 80 * o.scale, 30, 1040, -0.03)
  const fb = b ? fitLine(b, f.display, 80 * o.scale, 30, 1040, -0.03) : fa
  const size = Math.min(fa.size, fb.size)
  const la = fitLine(a, f.display, size, 30, 1040, -0.03)
  const lb = b ? fitLine(b, f.display, size, 30, 1040, -0.03) : null
  const y1 = lb ? 330 : 360
  return (
    <Frame background={t.background}>
      {o.showBrand ? <Brand x={W / 2} y={150} size={40} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} anchor="middle" /> : null}
      <Text x={W / 2} y={y1} anchor="middle" lines={la.text} font={f.display} size={size} tracking={-0.03} fill={t.text} />
      {lb ? <Text x={W / 2} y={y1 + size * 1.08} anchor="middle" lines={lb.text} font={f.display} size={size} tracking={-0.03} fill={t.accent} /> : null}
    </Frame>
  )
}

export const canvas: TemplateDef = {
  id: 'canvas',
  number: 18,
  name: 'Canvas',
  collection: 'minimal',
  description: 'Two-tone and centred: the first half of your headline in white, the second in your accent.',
  fonts: {
    display: { family: 'Geist', weight: 500 },
    label: { family: 'Geist', weight: 600 },
  },
  theme: { primary: '#ededed', accent: '#3ecf8e', background: '#1c1c1c', text: '#ededed' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Canvas,
}

/** <CanvasImage /> renders the canvas template as an SVG (1200×630). */
export function CanvasImage(props: OgImageProps) {
  return <OgImage template={canvas} {...props} />
}
