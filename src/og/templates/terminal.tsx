import { Blob, Mark, slugify, Spans, type Span } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { balance, ellipsize, fit, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 06 · Terminal ─────────────────────────── */

function Terminal({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const r = fit(c.headline, { font: f.display, maxWidth: 940, maxLines: 2, max: 80 * o.scale, min: 36, lineHeight: 1.04, tracking: -0.025 })
  const lines = r.truncated ? r.lines : balance(c.headline, f.display, r.size, 940, -0.025)
  const hy = 210 - (lines.length - 1) * r.size * 0.5
  const wx = 210
  const wy = 340
  const ww = W - wx * 2
  const slug = slugify(c.name)
  const dim = mix(t.text, t.background, 0.55)
  const cs = 21
  const maxW = ww - 80
  const rows: Span[][] = [
    [{ text: '$ ', fill: t.accent }, { text: ellipsize(`npx ${slug}@latest init`, f.mono, cs, maxW), fill: t.text }],
    [{ text: ellipsize(`  Created ${slug}.config.ts`, f.mono, cs, maxW), fill: dim }],
    ...(c.domain ? [[{ text: ellipsize(`  Docs  https://${c.domain}`, f.mono, cs, maxW), fill: dim }]] : []),
    [{ text: '$ ', fill: t.accent }, { text: '_', fill: t.text }],
  ]
  const tabs = ['zsh', slug]
  return (
    <Frame background={t.background}>
      <Blob uid={uid} id="g" cx={W / 2} cy={wy + 40} rx={420} ry={110} fill={t.text} blur={90} opacity={0.12} />
      {o.showBrand ? <Mark x={W / 2 - 22} y={56} size={44} assets={assets} name={c.name} uid={uid} fill="#ffffff" color={t.background} font={f.label} shape="rounded" /> : null}
      <Text x={W / 2} y={hy + r.size * 0.36} anchor="middle" lines={lines} font={f.display} size={r.size} lh={1.04} tracking={-0.025} fill={t.text} />
      <rect x={wx} y={wy} width={ww} height={H} rx={16} fill={mix(t.background, '#ffffff', 0.04)} stroke="#ffffff" strokeOpacity={0.12} />
      <line x1={wx} x2={wx + ww} y1={wy + 44} y2={wy + 44} stroke="#ffffff" strokeOpacity={0.08} />
      {tabs.map((tb, i) => {
        const x0 = wx + 18 + i * 92
        return (
          <g key={tb}>
            {i === 0 ? <rect x={x0 - 8} y={wy + 10} width={measure(tb, f.mono, 13) + 16} height={24} rx={6} fill="#ffffff" fillOpacity={0.07} /> : null}
            <Text x={x0} y={wy + 27} lines={ellipsize(tb, f.mono, 13, 80)} font={f.mono} size={13} fill={t.text} opacity={i === 0 ? 0.9 : 0.4} />
          </g>
        )
      })}
      {rows.map((parts, i) => (
        <Spans key={i} x={wx + 34} y={wy + 96 + i * 40} size={cs} font={f.mono} fill={t.text} parts={parts} />
      ))}
    </Frame>
  )
}

export const terminal: TemplateDef = {
  id: 'terminal',
  number: 6,
  name: 'Terminal',
  collection: 'developer',
  description: 'For developer tools: a centred serif headline above a softly lit terminal that bleeds off the bottom.',
  fonts: {
    display: { family: 'Newsreader', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#ffffff', accent: '#7ee2b8', background: '#000000', text: '#f2f2f2' },
  limits: { headline: 50 },
  uses: ['logo'],
  render: Terminal,
}

/** <TerminalImage /> renders the terminal template as an SVG (1200×630). */
export function TerminalImage(props: OgImageProps) {
  return <OgImage template={terminal} {...props} />
}
