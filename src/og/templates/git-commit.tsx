import { blockBottom, Brand, caps } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 08 · Git Commit ─────────────────────────── */

function IsoCard({ x, y, label, sub, t, f, glow }: { x: number; y: number; label: string; sub: string; t: TemplateProps['theme']; f: TemplateProps['fonts']; glow: string }) {
  const w = 300
  const h = 120
  return (
    <g transform={`matrix(0.866 0.5 -0.866 0.5 ${x} ${y})`}>
      <rect x={6} y={10} width={w} height={h} rx={14} fill="#000000" opacity={0.35} />
      <rect x={0} y={0} width={w} height={h} rx={14} fill={mix(t.background, '#ffffff', 0.06)} stroke={mix(t.background, '#ffffff', 0.18)} />
      <circle cx={30} cy={36} r={7} fill={glow} />
      <Text x={48} y={43} lines={ellipsize(label, f.body, 20, w - 70)} font={f.body} size={20} fill={t.text} />
      <Text x={26} y={90} lines={ellipsize(sub, f.mono, 13, w - 50)} font={f.mono} size={13} fill={t.text} opacity={0.45} />
    </g>
  )
}

function GitCommit({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const head = blockBottom(caps(c.headline), { font: f.display, maxWidth: 560, maxLines: 4, max: 64 * o.scale, min: 30, lineHeight: 1.02, tracking: -0.01, bottom: 548, maxHeight: 330 })
  const cards = [
    { x: 760, y: 70, label: c.name || 'app', sub: c.domain || 'production' },
    { x: 1010, y: 250, label: c.category || 'service', sub: c.badge || 'deployed' },
    { x: 760, y: 380, label: 'main', sub: c.date || 'latest' },
  ]
  return (
    <Frame background={t.background}>
      <defs>
        <radialGradient id={`${uid}-glow`} cx="0.72" cy="0.45" r="0.6">
          <stop offset="0" stopColor={t.accent} stopOpacity={0.22} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1200} height={630} fill={`url(#${uid}-glow)`} />
      <path d="M 790 230 C 900 300, 980 300, 1010 330 M 1010 400 C 960 470, 880 470, 800 520" fill="none" stroke={t.accent} strokeWidth={2} strokeDasharray="6 8" strokeOpacity={0.8} />
      {cards.map((cd, i) => (
        <IsoCard key={i} {...cd} t={t} f={f} glow={i === 1 ? t.primary : t.accent} />
      ))}
      {o.showBrand ? <Brand x={M} y={66} size={38} assets={assets} name={c.name} uid={uid} font={f.body} fill={t.text} bg={t.background} shape="circle" /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
    </Frame>
  )
}

export const gitCommit: TemplateDef = {
  id: 'git-commit',
  number: 8,
  name: 'Git Commit',
  collection: 'developer',
  description: 'Infrastructure energy: bold capitals beside isometric service cards wired together on deep indigo.',
  fonts: {
    display: { family: 'Inter Tight', weight: 800 },
    body: { family: 'Inter Tight', weight: 500 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#ff5c7a', accent: '#a78bfa', background: '#13111c', text: '#ffffff' },
  limits: { headline: 40 },
  uses: ['logo', 'category', 'badge', 'date'],
  render: GitCommit,
}

/** <GitCommitImage /> renders the gitCommit template as an SVG (1200×630). */
export function GitCommitImage(props: OgImageProps) {
  return <OgImage template={gitCommit} {...props} />
}
