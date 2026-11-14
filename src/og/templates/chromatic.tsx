import { BlockText, blockTop, join, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hueShift } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const H = 630
/* ─────────────────────────── 13 · Chromatic ─────────────────────────── */

function Chromatic({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const s = o.scale
  const irid = [t.primary, hueShift(t.primary, 70), t.accent, hueShift(t.accent, 80), hueShift(t.primary, -60)]
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 56 * s, min: 28, lineHeight: 1.08, tracking: -0.03, top: 150, maxHeight: 280 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 470, maxLines: 3, max: 19, min: 15, lineHeight: 1.45, top: head.bottom + 26 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-irid`} x1="0" y1="0" x2="1" y2="1">
          {irid.map((col, i) => (
            <stop key={i} offset={i / (irid.length - 1)} stopColor={col} />
          ))}
        </linearGradient>
        <linearGradient id={`${uid}-irid2`} x1="1" y1="0" x2="0" y2="1">
          {[...irid].reverse().map((col, i) => (
            <stop key={i} offset={i / (irid.length - 1)} stopColor={col} />
          ))}
        </linearGradient>
        <radialGradient id={`${uid}-sphere`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor={irid[1]} />
          <stop offset="0.75" stopColor={irid[3]} />
          <stop offset="1" stopColor={irid[4]} />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
        <filter id={`${uid}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={60} />
        </filter>
      </defs>
      <g filter={`url(#${uid}-bloom)`} opacity={0.55}>
        <circle cx={930} cy={300} r={240} fill={`url(#${uid}-irid)`} />
      </g>
      <circle cx={930} cy={300} r={196} fill="none" stroke={`url(#${uid}-irid)`} strokeWidth={110} />
      <circle cx={930} cy={300} r={196} fill="none" stroke={`url(#${uid}-irid2)`} strokeWidth={110} opacity={0.5} style={{ mixBlendMode: 'screen' }} />
      <ellipse cx={850} cy={150} rx={120} ry={26} fill="#ffffff" opacity={0.75} filter={`url(#${uid}-blur)`} transform="rotate(-28 850 150)" />
      <circle cx={930} cy={300} r={141} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={1.5} />
      <circle cx={930} cy={300} r={251} fill="none" stroke="#ffffff" strokeOpacity={0.4} strokeWidth={1.5} />
      <circle cx={700} cy={500} r={78} fill={`url(#${uid}-sphere)`} />
      <ellipse cx={680} cy={474} rx={26} ry={14} fill="#ffffff" opacity={0.8} filter={`url(#${uid}-blur)`} />
      <Grain uid={uid} opacity={0.1} blend="overlay" />
      {o.showBrand ? (
        <g>
          <Mark x={72} y={60} size={34} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="circle" />
          <Text x={118} y={84} lines={c.name} font={f.display} size={18} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      <Text x={70} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <BlockText b={desc} x={72} font={f.body} fill={t.text} opacity={0.7} />
      {o.showMeta ? <Text x={72} y={H - 60} lines={join([c.domain, c.badge], '   ·   ')} font={f.body} size={15} fill={t.text} opacity={0.6} /> : null}
    </Frame>
  )
}

export const chromatic: TemplateDef = {
  id: 'chromatic',
  number: 13,
  name: 'Chromatic',
  collection: 'abstract',
  description: 'An iridescent ring and pearl sphere with specular highlights on a cool pearl ground.',
  fonts: {
    display: { family: 'Unbounded', weight: 600 },
    body: { family: 'Inter Tight', weight: 400 },
  },
  theme: { primary: '#ff8fd0', accent: '#8fe7ff', background: '#ebe9f0', text: '#141218' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge'],
  render: Chromatic,
}

/** <ChromaticImage /> renders the chromatic template as an SVG (1200×630). */
export function ChromaticImage(props: OgImageProps) {
  return <OgImage template={chromatic} {...props} />
}
