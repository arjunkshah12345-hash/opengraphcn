import { Blob, BlockText, blockTop, dotGridPath, Mark, Star } from '../core/kit'
import { Frame, Img, Text } from '../core/primitives'
import { ellipsize, fitLine, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { formatCount, LANGUAGE_COLORS, mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 30 · Repository ─────────────────────────── */

function ForkIcon({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s / 16})`} fill="none" stroke={fill} strokeWidth={1.6}>
      <circle cx={4} cy={3} r={2} />
      <circle cx={12} cy={3} r={2} />
      <circle cx={8} cy={13} r={2} />
      <path d="M4 5 v1.5 a2 2 0 0 0 2 2 h4 a2 2 0 0 0 2 -2 V5 M8 8.5 V11" />
    </g>
  )
}

function Repository({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const owner = c.owner ? `${c.owner}/` : ''
  const total = `${owner}${c.name}`
  const titleFit = fitLine(total, f.display, 72 * s, 30, 820, -0.035)
  const ownerW = measure(owner, f.light, titleFit.size, -0.03)
  const main = c.description || c.headline
  const desc = blockTop(main, { font: f.body, maxWidth: 800, maxLines: 3, max: 30, min: 20, lineHeight: 1.38, top: 214 })
  const langColor = (c.language && LANGUAGE_COLORS[c.language]) || t.accent
  const stats: { icon: 'star' | 'fork' | 'lang'; text: string; label?: string }[] = []
  if (c.stars != null) stats.push({ icon: 'star', text: formatCount(c.stars), label: c.stars === 1 ? 'star' : 'stars' })
  if (c.forks != null) stats.push({ icon: 'fork', text: formatCount(c.forks), label: c.forks === 1 ? 'fork' : 'forks' })
  if (c.language) stats.push({ icon: 'lang', text: c.language })
  if (!stats.length && c.category) stats.push({ icon: 'lang', text: c.category })
  let sx = M
  const photo = assets.avatar || assets.logo
  const gray = mix(t.text, t.background, 0.42)
  return (
    <Frame background={t.background}>
      <path d={dotGridPath({ x: 20, y: 20, w: W - 40, h: H - 60, gap: 22, size: 1.4 })} fill={t.text} opacity={0.08} />
      <Blob uid={uid} id="g" cx={W - 140} cy={60} rx={320} ry={220} fill={langColor} blur={110} opacity={0.32} />
      {titleFit.text === total && owner ? (
        <g>
          <Text x={M - 2} y={150} lines={owner} font={f.light} size={titleFit.size} tracking={-0.03} fill={gray} />
          <Text x={M - 2 + ownerW + titleFit.size * -0.03} y={150} lines={c.name} font={f.display} size={titleFit.size} tracking={-0.03} fill={t.text} />
        </g>
      ) : (
        <Text x={M - 2} y={150} lines={titleFit.text} font={f.display} size={titleFit.size} tracking={-0.03} fill={t.text} />
      )}
      <BlockText b={desc} x={M} font={f.body} fill={gray} />
      {photo ? (
        <Img href={photo} x={W - M - 128} y={78} w={128} h={128} r={24} uid={uid} />
      ) : (
        <Mark x={W - M - 128} y={78} size={128} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} />
      )}
      <g>
        {stats.map((st) => {
          const x0 = sx
          const tw = measure(st.text, f.stat, 22)
          const lw = st.label ? measure(` ${st.label}`, f.body, 22) : 0
          sx += 30 + tw + lw + 44
          return (
            <g key={st.icon + st.text}>
              {st.icon === 'star' ? <Star cx={x0 + 11} cy={H - 118} r={11} fill={gray} /> : null}
              {st.icon === 'fork' ? <ForkIcon x={x0} y={H - 129} s={22} fill={gray} /> : null}
              {st.icon === 'lang' ? <circle cx={x0 + 10} cy={H - 118} r={9} fill={langColor} /> : null}
              <Text x={x0 + 30} y={H - 110} lines={st.text} font={f.stat} size={22} fill={t.text} />
              {st.label ? <Text x={x0 + 30 + tw} y={H - 110} lines={` ${st.label}`} font={f.body} size={22} fill={gray} /> : null}
            </g>
          )
        })}
      </g>
      {o.showMeta && c.domain ? <Text x={W - M} y={H - 110} anchor="end" lines={ellipsize(c.domain, f.mono, 18, Math.max(120, W - M - sx))} font={f.mono} size={18} fill={gray} /> : null}
      <rect x={0} y={H - 8} width={W} height={8} fill={langColor} />
    </Frame>
  )
}

export const repository: TemplateDef = {
  id: 'repository',
  number: 30,
  name: 'Repository',
  collection: 'product',
  description: 'A repository card with owner/name, description and real metadata — stars, forks and language when known.',
  fonts: {
    display: { family: 'Geist', weight: 700 },
    light: { family: 'Geist', weight: 400 },
    body: { family: 'Geist', weight: 400 },
    stat: { family: 'Geist', weight: 600 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#e6edf3', accent: '#4c8dff', background: '#0a0c10', text: '#e6edf3' },
  limits: { headline: 80, description: 140 },
  uses: ['avatar', 'logo', 'stars', 'language', 'category'],
  render: Repository,
}

/** <RepositoryImage /> renders the repository template as an SVG (1200×630). */
export function RepositoryImage(props: OgImageProps) {
  return <OgImage template={repository} {...props} />
}
