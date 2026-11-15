import { BlockText, blockTop, Spans } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix, shortSha } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 08 · Git Commit ─────────────────────────── */

function GitCommit({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const x = 262
  const dim = mix(t.text, t.background, 0.5)
  const sha = shortSha(c.name + c.headline)
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: W - x - 80, maxLines: 3, max: 84 * s, min: 32, lineHeight: 1.0, tracking: -0.04, top: 262, maxHeight: 220 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: W - x - 120, maxLines: 2, max: 22, min: 17, lineHeight: 1.4, top: head.bottom + 22 })
  const mainX = 128
  const featX = 184
  const headY = 128
  const pills: { text: string; fill: boolean }[] = [{ text: 'HEAD -> main', fill: true }]
  if (c.badge) pills.push({ text: `tag: ${c.badge}`, fill: false })
  pills.push({ text: 'origin/main', fill: false })
  let px = x + measure(`commit ${sha}`, f.mono, 22) + 20
  return (
    <Frame background={t.background}>
      <line x1={mainX} x2={mainX} y1={0} y2={H} stroke={t.text} strokeOpacity={0.18} strokeWidth={3} />
      <path d={`M ${mainX} ${H - 40} C ${mainX} ${H - 110}, ${featX} ${H - 110}, ${featX} ${H - 170} L ${featX} ${headY + 120} C ${featX} ${headY + 60}, ${mainX} ${headY + 60}, ${mainX} ${headY}`} fill="none" stroke={t.primary} strokeWidth={3} strokeOpacity={0.85} />
      {[H - 40, 470, 350].map((y) => (
        <circle key={y} cx={mainX} cy={y} r={8} fill={t.background} stroke={t.text} strokeOpacity={0.45} strokeWidth={3} />
      ))}
      {[headY + 230, headY + 140].map((y) => (
        <circle key={y} cx={featX} cy={y} r={8} fill={t.background} stroke={t.primary} strokeWidth={3} />
      ))}
      <circle cx={mainX} cy={headY} r={22} fill={t.accent} fillOpacity={0.18} />
      <circle cx={mainX} cy={headY} r={11} fill={t.accent} />
      <Spans x={x} y={headY + 8} size={22} font={f.mono} fill={t.text} parts={[{ text: 'commit ', fill: dim }, { text: sha, fill: t.accent }]} />
      {pills.map((p) => {
        const pw = measure(p.text, f.mono, 15) + 24
        const node = (
          <g key={p.text}>
            <rect x={px} y={headY - 14} width={pw} height={30} rx={15} fill={p.fill ? t.accent : 'none'} stroke={p.fill ? 'none' : dim} strokeOpacity={0.6} />
            <Text x={px + 12} y={headY + 6} lines={p.text} font={f.mono} size={15} fill={p.fill ? t.background : t.text} />
          </g>
        )
        px += pw + 10
        return px - 10 > W - 40 ? null : node
      })}
      {o.showMeta ? (
        <g>
          <Spans x={x} y={headY + 56} size={18} font={f.mono} fill={t.text} parts={[{ text: 'Author: ', fill: dim }, { text: c.author || c.name }]} />
          <Spans x={x} y={headY + 86} size={18} font={f.mono} fill={t.text} parts={[{ text: 'Date:   ', fill: dim }, { text: c.date }]} />
        </g>
      ) : null}
      <Text x={x - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      <BlockText b={desc} x={x} font={f.body} fill={dim} />
      {o.showBrand ? (
        <Spans x={x} y={H - 44} size={16} font={f.mono} fill={dim} parts={[{ text: c.name, fill: t.text }, { text: c.domain ? `  ·  ${c.domain}` : '' }]} />
      ) : null}
    </Frame>
  )
}

export const gitCommit: TemplateDef = {
  id: 'git-commit',
  number: 8,
  name: 'Git Commit',
  collection: 'developer',
  description: 'A commit log entry with branch graph, ref labels, author line and your headline as the message.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#6ea8fe', accent: '#ffb547', background: '#0e0f11', text: '#ecebe7' },
  limits: { headline: 60, description: 100 },
  uses: ['author', 'date', 'badge'],
  render: GitCommit,
}

/** <GitCommitImage /> renders the gitCommit template as an SVG (1200×630). */
export function GitCommitImage(props: OgImageProps) {
  return <OgImage template={gitCommit} {...props} />
}
