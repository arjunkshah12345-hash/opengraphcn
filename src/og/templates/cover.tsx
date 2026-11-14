import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Img, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, mix, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 05 · The Cover ─────────────────────────── */

function Barcode({ x, y, w, h, seed, fill }: { x: number; y: number; w: number; h: number; seed: string; fill: string }) {
  const rand = rng(hash(seed))
  const bars: { x: number; w: number }[] = []
  let cx = 0
  while (cx < w) {
    const bw = [1.5, 1.5, 3, 4.5][Math.floor(rand() * 4)]
    if (rand() > 0.35) bars.push({ x: cx, w: bw })
    cx += bw + [1.5, 3][Math.floor(rand() * 2)]
  }
  return (
    <g>
      {bars.map((b, i) => (
        <rect key={i} x={x + b.x} y={y} width={b.w} height={h} fill={fill} />
      ))}
    </g>
  )
}

function Cover({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 56
  const px = 712
  const s = o.scale
  const mast = fitLine(c.name || 'Cover', f.display, 156, 60, px - M - 28, -0.045)
  const head = blockTop(c.headline, { font: f.italic, maxWidth: px - M - 60, maxLines: 3, max: 62 * s, min: 32, lineHeight: 1.02, tracking: -0.015, top: 228, maxHeight: 200 })
  const desc = blockTop(c.description, { font: f.label, maxWidth: px - M - 120, maxLines: 3, max: 19, min: 15, lineHeight: 1.4, top: head.bottom + 26 })
  const img = assets.screenshot || assets.logo
  const initial = (c.name || 'A').trim().slice(0, 1)
  const cs = mix(t.primary, t.background, 0.0)
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.06} />
      <rect x={px} y={0} width={W - px} height={H} fill={cs} />
      {img ? (
        <Img href={img} x={px} y={0} w={W - px} h={H} uid={uid} fit={assets.screenshot ? 'cover' : 'contain'} />
      ) : (
        <g>
          <clipPath id={`${uid}-panel`}>
            <rect x={px} y={0} width={W - px} height={H} />
          </clipPath>
          <g clipPath={`url(#${uid}-panel)`}>
            {[300, 240, 180].map((r, i) => (
              <circle key={r} cx={px + 300} cy={300} r={r} fill="none" stroke={t.accent} strokeOpacity={0.5 - i * 0.12} strokeWidth={1.4} />
            ))}
            <Text x={px + 290} y={560} anchor="middle" lines={initial} font={f.italic} size={720} fill={t.background} opacity={0.94} />
            <circle cx={px + 392} cy={176} r={44} fill={t.accent} />
          </g>
        </g>
      )}
      <Text x={M} y={56} lines={caps(join([`The ${c.category || 'New'} Issue`, c.date], '   ·   '))} font={f.label2} size={13} tracking={0.24} fill={t.text} />
      {o.showBrand ? <Text x={M - 6} y={182} lines={mast.text} font={f.display} size={mast.size} tracking={-0.045} fill={t.text} /> : null}
      <line x1={M} x2={px - 36} y1={202} y2={202} stroke={t.text} strokeWidth={1} />
      <Text x={M} y={head.y} lines={head.lines} font={f.italic} size={head.size} lh={head.lh} tracking={-0.015} fill={t.text} />
      <BlockText b={desc} x={M} font={f.label} fill={t.text} opacity={0.75} />
      {c.badge ? (
        <g>
          <circle cx={px} cy={486} r={66} fill={t.accent} />
          <Text x={px} y={474} anchor="middle" lines="NEW" font={f.label2} size={13} tracking={0.22} fill={t.background} />
          <Text x={px} y={512} anchor="middle" lines={fitLine(c.badge, f.display, 34, 16, 104).text} font={f.display} size={fitLine(c.badge, f.display, 34, 16, 104).size} fill={t.background} />
        </g>
      ) : null}
      {o.showMeta ? (
        <g>
          <rect x={M - 8} y={530} width={168} height={70} fill={t.background} />
          <Barcode x={M} y={540} w={150} h={42} seed={c.name + c.domain} fill={t.text} />
          <Text x={M} y={596} lines={c.domain} font={f.label} size={11} tracking={0.3} fill={t.text} />
        </g>
      ) : null}
    </Frame>
  )
}

export const cover: TemplateDef = {
  id: 'cover',
  number: 5,
  name: 'The Cover',
  collection: 'editorial',
  description: 'Magazine cover: towering Didone masthead, italic cover line, sticker badge and a barcode.',
  fonts: {
    display: { family: 'Bodoni Moda', weight: 800 },
    italic: { family: 'Bodoni Moda', weight: 500, style: 'italic' },
    label: { family: 'Hanken Grotesk', weight: 400 },
    label2: { family: 'Hanken Grotesk', weight: 700 },
  },
  theme: { primary: '#1d2b4f', accent: '#e4442b', background: '#efe8dc', text: '#121212' },
  limits: { headline: 60, description: 120 },
  uses: ['screenshot', 'logo', 'badge', 'category', 'date'],
  render: Cover,
}

/** <CoverImage /> renders the cover template as an SVG (1200×630). */
export function CoverImage(props: OgImageProps) {
  return <OgImage template={cover} {...props} />
}
