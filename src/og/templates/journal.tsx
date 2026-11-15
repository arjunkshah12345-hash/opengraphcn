import { BlockText, blockTop, caps, join, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
/* ─────────────────────────── 02 · The Journal ─────────────────────────── */

function Journal({ content: c, theme: t, assets, options: o, fonts: f, uid }: TemplateProps) {
  const M = 80
  const s = o.scale
  const split = 776
  const head = blockTop(c.headline, { font: f.display, maxWidth: split - M - 56, maxLines: 4, max: 92 * s, min: 40, lineHeight: 1.0, tracking: -0.028, top: 168, maxHeight: 330 })
  const dek = blockTop(c.description, { font: f.italic, maxWidth: W - M - split - 40, maxLines: 6, max: 27, min: 18, lineHeight: 1.32, top: 176, maxHeight: 220 })
  const who = c.author || c.name
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.05} />
      <rect x={0} y={0} width={W} height={8} fill={t.accent} />
      <Text x={M} y={104} lines={caps(join(['Essay', c.category], '  —  '))} font={f.label} size={14} tracking={0.18} fill={t.accent} />
      {o.showMeta && c.badge ? <Text x={W - M} y={104} anchor="end" lines={caps(c.badge)} font={f.label} size={14} tracking={0.18} fill={t.text} opacity={0.5} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.028} fill={t.text} />
      <line x1={split} x2={split} y1={150} y2={500} stroke={t.text} strokeOpacity={0.14} />
      <BlockText b={dek} x={split + 40} font={f.italic} fill={t.text} opacity={0.78} />
      {o.showMeta ? (
        <g>
          <Mark x={split + 40} y={436} size={52} assets={{ logo: assets.avatar }} name={who} uid={`${uid}-a`} fill={t.text} color={t.background} font={f.display} shape="circle" />
          <Text x={split + 108} y={458} lines={who} font={f.label} size={18} fill={t.text} />
          <Text x={split + 108} y={484} lines={c.date} font={f.italic} size={18} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
      <line x1={M} x2={W - M} y1={552} y2={552} stroke={t.text} strokeOpacity={0.9} strokeWidth={1.5} />
      {o.showBrand ? <Text x={M} y={592} lines={c.name} font={f.display} size={26} tracking={-0.02} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - M} y={590} anchor="end" lines={caps(c.domain)} font={f.label} size={13} tracking={0.18} fill={t.text} opacity={0.6} /> : null}
    </Frame>
  )
}

export const journal: TemplateDef = {
  id: 'journal',
  number: 2,
  name: 'The Journal',
  collection: 'editorial',
  description: 'A long-read layout: a bold serif headline beside an italic standfirst and a byline, under a red rule.',
  fonts: {
    display: { family: 'Newsreader', weight: 600 },
    italic: { family: 'Newsreader', weight: 400, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#141414', accent: '#c4271c', background: '#faf8f3', text: '#141414' },
  limits: { headline: 70, description: 140 },
  uses: ['date', 'category', 'badge', 'author', 'avatar'],
  render: Journal,
}

/** <JournalImage /> renders the journal template as an SVG (1200×630). */
export function JournalImage(props: OgImageProps) {
  return <OgImage template={journal} {...props} />
}
