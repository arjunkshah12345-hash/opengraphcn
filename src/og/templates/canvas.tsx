import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Img, Text } from '../core/primitives'
import { ellipsize } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 18 · Canvas ─────────────────────────── */

function Canvas({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const art = { x: 96, y: 76, w: 372, h: 478 }
  const img = assets.screenshot || assets.logo
  const lx = 540
  const lw = W - 96 - lx
  const head = blockTop(c.headline, { font: f.display, maxWidth: lw, maxLines: 3, max: 74 * s, min: 32, lineHeight: 1.02, tracking: -0.02, top: 200, maxHeight: 220 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: lw - 80, maxLines: 3, max: 17, min: 14, lineHeight: 1.5, top: head.bottom + 40 })
  return (
    <Frame background={t.background}>
      <defs>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={14} />
        </filter>
        <clipPath id={`${uid}-art`}>
          <rect x={art.x} y={art.y} width={art.w} height={art.h} />
        </clipPath>
      </defs>
      <rect x={art.x + 10} y={art.y + 26} width={art.w - 20} height={art.h} fill="#000000" opacity={0.16} filter={`url(#${uid}-shadow)`} />
      <rect x={art.x - 12} y={art.y - 12} width={art.w + 24} height={art.h + 24} fill={mix(t.background, '#ffffff', 0.7)} />
      {img ? (
        <Img href={img} x={art.x} y={art.y} w={art.w} h={art.h} uid={uid} fit={assets.screenshot ? 'cover' : 'contain'} />
      ) : (
        <g clipPath={`url(#${uid}-art)`}>
          <rect x={art.x} y={art.y} width={art.w} height={art.h} fill={mix(t.primary, '#000000', 0.15)} />
          <g filter={`url(#${uid}-soft)`}>
            <rect x={art.x + 26} y={art.y + 30} width={art.w - 52} height={art.h * 0.5} fill={t.accent} />
            <rect x={art.x + 26} y={art.y + art.h * 0.5 + 56} width={art.w - 52} height={art.h * 0.36} fill={mix(t.accent, t.primary, 0.55)} />
          </g>
        </g>
      )}
      {o.showBrand ? <Text x={lx} y={134} lines={c.name} font={f.label} size={22} fill={t.text} /> : null}
      {o.showMeta ? <Text x={lx} y={162} lines={join([c.author && `By ${c.author}`, c.date], ', ')} font={f.body} size={16} fill={t.text} opacity={0.6} /> : null}
      <Text x={lx - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
      <BlockText b={desc} x={lx} font={f.body} fill={t.text} opacity={0.72} />
      <line x1={lx} x2={lx + 40} y1={520} y2={520} stroke={t.text} />
      {o.showMeta ? <Text x={lx} y={550} lines={ellipsize(caps(join([c.category, c.domain && `Collection of ${c.domain}`], '   ·   ')), f.label, 13, lw, 0.16)} font={f.label} size={13} tracking={0.16} fill={t.text} opacity={0.65} /> : null}
    </Frame>
  )
}

export const canvas: TemplateDef = {
  id: 'canvas',
  number: 18,
  name: 'Canvas',
  collection: 'minimal',
  description: 'A gallery wall: a framed work (your image or a colour-field painting) beside a museum label.',
  fonts: {
    display: { family: 'Newsreader', weight: 400, style: 'italic' },
    label: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
  },
  theme: { primary: '#3a1714', accent: '#e8592b', background: '#ebe7df', text: '#1c1b19' },
  limits: { headline: 50, description: 120 },
  uses: ['screenshot', 'logo', 'author', 'date', 'category'],
  render: Canvas,
}

/** <CanvasImage /> renders the canvas template as an SVG (1200×630). */
export function CanvasImage(props: OgImageProps) {
  return <OgImage template={canvas} {...props} />
}
