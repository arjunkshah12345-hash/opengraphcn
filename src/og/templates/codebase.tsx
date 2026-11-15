import { BlockText, blockTop, Blob, Mark, slugify, Spans, type Span } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 07 · Codebase ─────────────────────────── */

function Codebase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const split = 548
  const head = blockTop(c.headline, { font: f.display, maxWidth: split - M - 24, maxLines: 4, max: 66 * s, min: 32, lineHeight: 1.04, tracking: -0.035, top: 196, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: split - M - 40, maxLines: 3, max: 20, min: 15, lineHeight: 1.45, top: head.bottom + 24 })
  // editor window
  const ex = 600
  const ew = W - ex - 48
  const panel = mix(t.background, '#ffffff', 0.04)
  const dim = mix(t.text, t.background, 0.55)
  const faint = mix(t.text, t.background, 0.75)
  const slug = slugify(c.name)
  const code = 18
  const cx = ex + 62
  const maxW = ew - 86
  const str = (v: string, pre: number) => `'${ellipsize(v, f.mono, code, Math.max(60, maxW - pre))}'`
  const prop = (k: string, v: string): Span[] => {
    const pre = measure(`  ${k}: `, f.mono, code)
    return [{ text: `  ${k}: `, fill: t.text }, { text: str(v, pre + 20), fill: t.accent }, { text: ',', fill: dim }]
  }
  const rows: Span[][] = [
    [{ text: 'import ', fill: t.primary }, { text: '{ defineProject } ', fill: t.text }, { text: 'from ', fill: t.primary }, { text: `'${ellipsize(slug, f.mono, code, Math.max(40, maxW - measure('import { defineProject } from \'\'', f.mono, code)))}'`, fill: t.accent }],
    [],
    [{ text: 'export default ', fill: t.primary }, { text: 'defineProject', fill: '#f0c674' }, { text: '({', fill: dim }],
    prop('name', c.name),
    ...(c.description ? [prop('description', c.description)] : []),
    ...(c.domain ? [prop('homepage', `https://${c.domain}`)] : []),
    ...(c.author ? [prop('author', c.author)] : []),
    ...(c.badge ? [prop('version', c.badge.replace(/^v/i, ''))] : []),
    [{ text: '})', fill: dim }],
  ]
  const eh = 44 + 52 + (rows.length - 1) * 34 + 44
  const ey = Math.round((H - eh) / 2)
  return (
    <Frame background={t.background}>
      <Blob uid={uid} id="a" cx={ex + ew * 0.6} cy={ey + 40} rx={300} ry={160} fill={t.primary} blur={90} opacity={0.35} />
      <Blob uid={uid} id="b" cx={ex + 60} cy={ey + eh} rx={220} ry={140} fill={t.accent} blur={90} opacity={0.18} />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={84} size={40} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="rounded" />
          <Text x={M + 56} y={111} lines={c.name} font={f.display} size={22} tracking={-0.02} fill={t.text} />
        </g>
      ) : null}
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      {desc.bottom < 560 ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.55} /> : null}
      {o.showMeta && c.domain ? <Text x={M} y={572} lines={c.domain} font={f.mono} size={15} fill={t.text} opacity={0.45} /> : null}

      <rect x={ex} y={ey} width={ew} height={eh} rx={14} fill={panel} stroke="#ffffff" strokeOpacity={0.1} />
      <path d={`M${ex} ${ey + 14} a14 14 0 0 1 14 -14 h${ew - 28} a14 14 0 0 1 14 14 v30 h-${ew} z`} fill="#ffffff" fillOpacity={0.03} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={ex + 24 + i * 18} cy={ey + 22} r={5.5} fill="#ffffff" fillOpacity={0.14} />
      ))}
      <rect x={ex + 92} y={ey + 8} width={measure(`${slug}.config.ts`, f.mono, 13) + 28} height={36} rx={7} fill="#ffffff" fillOpacity={0.06} />
      <Text x={ex + 106} y={ey + 31} lines={`${slug}.config.ts`} font={f.mono} size={13} fill={t.text} opacity={0.85} />
      <line x1={ex} x2={ex + ew} y1={ey + 44} y2={ey + 44} stroke="#ffffff" strokeOpacity={0.08} />
      {rows.map((parts, i) => {
        const y = ey + 96 + i * 34
        return (
          <g key={i}>
            <Text x={ex + 38} y={y} anchor="end" lines={String(i + 1)} font={f.mono} size={14} fill={faint} />
            {parts.length ? <Spans x={cx} y={y} size={code} font={f.mono} fill={t.text} parts={parts} /> : null}
          </g>
        )
      })}
      <rect x={cx + measure('})', f.mono, code) + 4} y={ey + 96 + (rows.length - 1) * 34 - 16} width={2} height={21} fill={t.accent} />
    </Frame>
  )
}

export const codebase: TemplateDef = {
  id: 'codebase',
  number: 7,
  name: 'Codebase',
  collection: 'developer',
  description: 'A clean grotesk headline beside an editor window with your project as a typed config file.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#8f9bff', accent: '#7ee2b8', background: '#09090b', text: '#f4f4f5' },
  limits: { headline: 60, description: 110 },
  uses: ['logo', 'author', 'badge'],
  render: Codebase,
}

/** <CodebaseImage /> renders the codebase template as an SVG (1200×630). */
export function CodebaseImage(props: OgImageProps) {
  return <OgImage template={codebase} {...props} />
}
