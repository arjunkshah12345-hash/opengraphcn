import { blockTop, join, slugify, Spans } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 06 · Terminal ─────────────────────────── */

function Terminal({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const wx = 56
  const wy = 46
  const ww = W - 2 * wx
  const wh = H - 2 * wy
  const win = mix(t.background, '#ffffff', 0.045)
  const dim = mix(t.text, t.background, 0.5)
  const slug = slugify(c.name)
  const x = wx + 44
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: ww - 110, maxLines: 3, max: 76 * s, min: 34, lineHeight: 1.08, tracking: -0.03, top: 232, maxHeight: 210 })
  const lastW = measure(head.lines[head.lines.length - 1] ?? '', f.display, head.size, -0.03)
  const descY = head.last + Math.max(58, head.size * 0.9)
  const statusY = wy + wh - 40
  return (
    <Frame background={t.background}>
      <defs>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.15" r="0.75">
          <stop offset="0" stopColor={t.accent} stopOpacity={0.22} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-glow)`} />
      <rect x={wx} y={wy} width={ww} height={wh} rx={14} fill={win} stroke="#ffffff" strokeOpacity={0.09} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={wx + 28 + i * 22} cy={wy + 24} r={6.5} fill="#ffffff" fillOpacity={0.13} />
      ))}
      <Text x={W / 2} y={wy + 29} anchor="middle" lines={`~/${slug} — zsh — 120×32`} font={f.mono} size={13} fill={dim} />
      <line x1={wx} x2={wx + ww} y1={wy + 48} y2={wy + 48} stroke="#ffffff" strokeOpacity={0.07} />
      <Spans
        x={x}
        y={wy + 104}
        size={22}
        font={f.mono}
        fill={t.text}
        parts={[
          { text: '› ', fill: t.accent, font: f.bold },
          { text: `~/${slug}`, fill: t.primary },
          { text: ' on ', fill: dim },
          { text: 'main ', fill: t.accent },
          { text: ellipsize(`npx create-${slug}@latest`, f.mono, 22, ww - 110 - measure(`› ~/${slug} on main `, f.mono, 22)), fill: t.text },
        ]}
      />
      <Text x={x} y={wy + 142} lines={ellipsize(`  resolved ${c.domain}  ·  ready in 0.4s`, f.mono, 18, ww - 110)} font={f.mono} size={18} fill={dim} />
      <Text x={x - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <rect x={x + lastW + head.size * 0.12} y={head.last - vmetrics(f.display, head.size).cap} width={head.size * 0.52} height={vmetrics(f.display, head.size).cap * 1.12} fill={t.accent} />
      {c.description && descY < statusY - 20 ? (
        <Text x={x} y={descY} lines={ellipsize(`# ${c.description}`, f.mono, 21, ww - 110)} font={f.mono} size={21} fill={dim} />
      ) : null}
      <rect x={wx + 1} y={statusY} width={ww - 2} height={39} fill={t.accent} fillOpacity={0.12} />
      <rect x={wx + 1} y={statusY} width={108} height={39} fill={t.accent} />
      <Text x={wx + 55} y={statusY + 25} anchor="middle" lines="NORMAL" font={f.bold} size={14} tracking={0.08} fill={t.background} />
      {o.showBrand ? <Text x={wx + 128} y={statusY + 25} lines={c.name} font={f.bold} size={14} fill={t.text} /> : null}
      {o.showMeta ? (
        <Text x={wx + ww - 22} y={statusY + 25} anchor="end" lines={join([c.badge, c.domain, c.date, 'utf-8'], '   ')} font={f.mono} size={14} fill={t.text} opacity={0.75} />
      ) : null}
    </Frame>
  )
}

export const terminal: TemplateDef = {
  id: 'terminal',
  number: 6,
  name: 'Terminal',
  collection: 'developer',
  description: 'A calm terminal window: real prompt, install command, block cursor and a vim-style status line.',
  fonts: {
    display: { family: 'JetBrains Mono', weight: 700 },
    mono: { family: 'JetBrains Mono', weight: 400 },
    bold: { family: 'JetBrains Mono', weight: 700 },
  },
  theme: { primary: '#8fb8ff', accent: '#7ee0a0', background: '#0b0c0c', text: '#ecebe6' },
  limits: { headline: 48, description: 70 },
  uses: ['badge', 'date'],
  render: Terminal,
}

/** <TerminalImage /> renders the terminal template as an SVG (1200×630). */
export function TerminalImage(props: OgImageProps) {
  return <OgImage template={terminal} {...props} />
}
