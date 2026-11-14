import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 22 · Pixel ─────────────────────────── */

function sprite(seed: string, n = 7) {
  const rand = rng(hash(seed || 'pixel'))
  const half = Math.ceil(n / 2)
  const grid: boolean[][] = []
  for (let y = 0; y < n; y++) {
    const row: boolean[] = []
    for (let x = 0; x < half; x++) row.push(rand() > 0.48)
    grid.push([...row, ...row.slice(0, n - half).reverse()])
  }
  return grid
}

function Pixel({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const grid = sprite(c.name)
  const cell = 22
  const sx = W - 72 - 7 * cell
  const sy = 78
  const head = blockTop(caps(c.headline), { font: f.display, maxWidth: 760, maxLines: 4, max: 58 * s, min: 26, lineHeight: 1.12, top: 168, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 720, maxLines: 2, max: 18, min: 14, lineHeight: 1.6, top: head.bottom + 30 })
  const blocks = 28
  return (
    <Frame background={t.background}>
      <defs>
        <pattern id={`${uid}-scan`} width={4} height={4} patternUnits="userSpaceOnUse">
          <rect width={4} height={2} fill="#000000" fillOpacity={0.22} />
        </pattern>
      </defs>
      {Array.from({ length: Math.floor(W / 16) }, (_, i) => (
        <g key={i} fill={t.primary} opacity={i % 2 ? 0.25 : 0.55}>
          <rect x={i * 16 + 4} y={20} width={8} height={8} />
          <rect x={i * 16 + 4} y={H - 28} width={8} height={8} />
        </g>
      ))}
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <g key={`${x}-${y}`}>
              <rect x={sx + x * cell + 6} y={sy + y * cell + 6} width={cell} height={cell} fill={t.primary} />
              <rect x={sx + x * cell} y={sy + y * cell} width={cell} height={cell} fill={t.accent} />
            </g>
          ) : null,
        ),
      )}
      {o.showBrand ? <Text x={72} y={100} lines={caps(`${c.name}`)} font={f.display} size={22} fill={t.accent} /> : null}
      {o.showMeta ? <Text x={72} y={128} lines={caps(join(['LVL ' + (c.badge || '1'), c.category], '  ·  '))} font={f.body} size={14} fill={t.primary} /> : null}
      <Text x={72} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} fill={t.text} />
      <BlockText b={desc} x={72} font={f.body} fill={t.text} opacity={0.7} />
      {Array.from({ length: blocks }, (_, i) => (
        <rect key={i} x={72 + i * 20} y={530} width={16} height={22} fill={i < 19 ? t.accent : t.text} fillOpacity={i < 19 ? 1 : 0.15} />
      ))}
      <Text x={72 + blocks * 20 + 18} y={549} lines="PRESS START" font={f.display} size={18} fill={t.text} />
      {o.showMeta ? <Text x={W - 72} y={549} anchor="end" lines={ellipsize(caps(c.domain), f.body, 16, W - 72 - (72 + blocks * 20 + 18 + measure('PRESS START', f.display, 18)) - 32)} font={f.body} size={16} fill={t.primary} /> : null}
      <rect width={W} height={H} fill={`url(#${uid}-scan)`} />
    </Frame>
  )
}

export const pixel: TemplateDef = {
  id: 'pixel',
  number: 22,
  name: 'Pixel',
  collection: 'experimental',
  description: 'A generated pixel sprite from your project name, pixel type, a segmented bar and scanlines.',
  fonts: {
    display: { family: 'Silkscreen', weight: 700 },
    body: { family: 'Silkscreen', weight: 400 },
  },
  theme: { primary: '#4cc9f0', accent: '#ffd23f', background: '#0f1116', text: '#f4f1e8' },
  limits: { headline: 44, description: 80 },
  uses: ['badge', 'category'],
  render: Pixel,
}

/** <PixelImage /> renders the pixel template as an SVG (1200×630). */
export function PixelImage(props: OgImageProps) {
  return <OgImage template={pixel} {...props} />
}
