import { blockBottom, Guides, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, r2, rng } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 10 · System ─────────────────────────── */

function bars(seed: number, x0: number, x1: number) {
  const rand = rng(seed)
  let d = ''
  let x = x0
  while (x < x1) {
    const block = 8 + Math.floor(rand() * 18)
    const top = 40 + rand() * 200
    const bottom = H - 40 - rand() * 200
    for (let i = 0; i < block && x < x1; i++) {
      const w = rand() < 0.2 ? 3 : 1.5
      if (rand() > 0.25) {
        const y0 = top + rand() * 30
        const y1 = rand() < 0.5 ? bottom - rand() * 120 : bottom
        d += `M${r2(x)} ${r2(y0)}h${w}V${r2(y1)}h-${w}z`
      }
      x += w + 3 + rand() * 3
    }
    x += 10 + rand() * 30
  }
  return d
}

function System({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const split = 780
  const head = blockBottom(c.headline, { font: f.display, maxWidth: split - M - 40, maxLines: 3, max: 72 * o.scale, min: 34, lineHeight: 1.04, tracking: -0.04, bottom: 540, maxHeight: 300 })
  return (
    <Frame background={t.background}>
      <path d={bars(hash(c.name || 'system'), split + 20, W)} fill={t.text} opacity={0.85} />
      <Guides xs={[split]} ys={[150, 480]} stroke={t.text} opacity={0.2} cross={false} />
      <path d={`M${split + 210} 150 m-12 0 h24 m-12 -12 v24`} stroke={t.text} strokeWidth={1.4} />
      {o.showBrand ? <Mark x={M} y={70} size={46} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="square" /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
    </Frame>
  )
}

export const system: TemplateDef = {
  id: 'system',
  number: 10,
  name: 'System',
  collection: 'developer',
  description: 'An SDK release card: a bold headline bottom-left and a generated field of signal bars on graphite.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
  },
  theme: { primary: '#ededed', accent: '#ededed', background: '#111111', text: '#ededed' },
  limits: { headline: 40 },
  uses: ['logo'],
  render: System,
}

/** <SystemImage /> renders the system template as an SVG (1200×630). */
export function SystemImage(props: OgImageProps) {
  return <OgImage template={system} {...props} />
}
