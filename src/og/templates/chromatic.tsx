import { Blob, blockTop, Brand, Guides } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 13 · Chromatic ─────────────────────────── */

function Chromatic({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const M = 96
  const head = blockTop(c.headline, { font: f.display, maxWidth: 760, maxLines: 3, max: 76 * o.scale, min: 34, lineHeight: 1.04, tracking: -0.04, top: 110, maxHeight: 260 })
  const desc = c.description ? blockTop(c.description, { font: f.body, maxWidth: 620, maxLines: 2, max: 26, min: 18, lineHeight: 1.4, top: head.bottom + 20 }) : null
  return (
    <Frame background={t.background}>
      <Blob uid={uid} id="a" cx={200} cy={700} rx={420} ry={200} fill={t.primary} blur={90} />
      <Blob uid={uid} id="b" cx={640} cy={720} rx={360} ry={180} fill={t.accent} blur={90} />
      <Blob uid={uid} id="c" cx={1080} cy={690} rx={360} ry={210} fill={hueShift(t.primary, 120)} blur={90} />
      <Blob uid={uid} id="d" cx={1200} cy={0} rx={300} ry={200} fill={hueShift(t.accent, -60)} blur={110} opacity={0.5} />
      <Guides xs={[48, 1152]} ys={[48, 582]} stroke={t.text} opacity={0.1} />
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      {desc && desc.bottom < 470 ? <Text x={M} y={desc.y} lines={desc.lines} font={f.body} size={desc.size} lh={desc.lh} fill={t.text} opacity={0.55} /> : null}
      {o.showBrand ? <Brand x={M} y={490} size={44} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} /> : null}
    </Frame>
  )
}

export const chromatic: TemplateDef = {
  id: 'chromatic',
  number: 13,
  name: 'Chromatic',
  collection: 'abstract',
  description: 'Bright and friendly: an iridescent glow rising from the bottom edge of a white card with hairline guides.',
  fonts: {
    display: { family: 'Inter Tight', weight: 500 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#ff8ad8', accent: '#7cc8ff', background: '#ffffff', text: '#0b0b0f' },
  limits: { headline: 50, description: 90 },
  uses: ['logo'],
  render: Chromatic,
}

/** <ChromaticImage /> renders the chromatic template as an SVG (1200×630). */
export function ChromaticImage(props: OgImageProps) {
  return <OgImage template={chromatic} {...props} />
}
