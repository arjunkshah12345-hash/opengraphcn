import type { ReactElement } from 'react'
import { BlockText, blockBottom, blockCenter, blockTop, caps, join } from '../core/kit'
import { Frame, Img, Text } from '../core/primitives'
import { ellipsize, fitLine, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'

const W = 1200
const H = 630

/* ─────────────────────────── 16 · Nothing ─────────────────────────── */

function Nothing({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 96
  const s = o.scale
  const head = blockBottom(c.headline, { font: f.display, maxWidth: 820, maxLines: 3, max: 60 * s, min: 32, lineHeight: 1.1, tracking: -0.028, bottom: 452, maxHeight: 260 })
  const nameW = measure(c.name, f.label, 17, -0.01)
  return (
    <Frame background={t.background}>
      {o.showBrand ? (
        <g>
          <Text x={M} y={104} lines={c.name} font={f.label} size={17} tracking={-0.01} fill={t.text} />
          <circle cx={M + nameW + 8} cy={99} r={3.2} fill={t.accent} />
        </g>
      ) : null}
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.028} fill={t.text} />
      <Text x={M} y={528} lines={ellipsize(c.description, f.body, 19, 640)} font={f.body} size={19} fill={t.text} opacity={0.45} />
      {o.showMeta ? <Text x={W - M} y={528} anchor="end" lines={c.domain} font={f.body} size={19} fill={t.text} opacity={0.45} /> : null}
    </Frame>
  )
}

export const nothing: TemplateDef = {
  id: 'nothing',
  number: 16,
  name: 'Nothing',
  collection: 'minimal',
  description: 'An almost empty white canvas, one precisely set headline and a single point of colour.',
  fonts: {
    display: { family: 'Hanken Grotesk', weight: 500 },
    label: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
  },
  theme: { primary: '#0a0a0a', accent: '#ff3d00', background: '#ffffff', text: '#0a0a0a' },
  limits: { headline: 70, description: 70 },
  render: Nothing,
}

/* ─────────────────────────── 17 · Index ─────────────────────────── */

function Index({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 64
  const s = o.scale
  const vx = 340
  const vw = W - M - vx
  const gray = mix(t.text, t.background, 0.55)
  const rows: { n: string; k: string; h: number; node: (y: number) => ReactElement }[] = []
  if (o.showBrand)
    rows.push({ n: '01', k: 'Project', h: 64, node: (y) => <Text x={vx} y={y + 40} lines={fitLine(c.name, f.label, 26, 16, vw).text} font={f.label} size={26} tracking={-0.02} fill={t.text} /> })
  const head = blockTop(c.headline, { font: f.display, maxWidth: vw, maxLines: 3, max: 62 * s, min: 28, lineHeight: 1.06, tracking: -0.03, top: 0, maxHeight: 200 })
  rows.push({ n: '02', k: 'Headline', h: head.last - head.y + head.size * 0.24 + 56 + head.y, node: (y) => <Text x={vx - 2} y={y + 28 + head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} /> })
  const desc = blockTop(c.description, { font: f.body, maxWidth: vw - 80, maxLines: 2, max: 19, min: 15, lineHeight: 1.4, top: 0 })
  if (c.description) rows.push({ n: '03', k: 'Summary', h: desc.last + 44, node: (y) => <Text x={vx} y={y + 24 + desc.y} lines={desc.lines} font={f.body} size={desc.size} lh={desc.lh} fill={t.text} opacity={0.7} /> })
  if (o.showMeta && c.domain) rows.push({ n: '04', k: 'Location', h: 58, node: (y) => <Text x={vx} y={y + 36} lines={c.domain} font={f.mono} size={17} fill={t.text} /> })
  const total = rows.reduce((a, r) => a + r.h, 0)
  let y = 100 + Math.max(16, (H - 150 - total) / 2)
  return (
    <Frame background={t.background}>
      <Text x={M} y={76} lines="Index" font={f.label} size={16} fill={t.text} />
      <Text x={vx} y={76} lines={caps(c.category)} font={f.mono} size={12} tracking={0.12} fill={gray} />
      {o.showMeta ? <Text x={W - M} y={76} anchor="end" lines={c.date} font={f.mono} size={13} fill={gray} /> : null}
      <line x1={M} x2={W - M} y1={100} y2={100} stroke={t.text} strokeWidth={1.4} />
      {rows.map((r) => {
        const top = y
        y += r.h
        return (
          <g key={r.n}>
            <Text x={M} y={top + 36} lines={r.n} font={f.mono} size={13} fill={r.k === 'Headline' ? t.accent : gray} />
            {r.k === 'Headline' ? <rect x={M + 30} y={top + 27} width={8} height={8} fill={t.accent} /> : null}
            <Text x={M + 74} y={top + 36} lines={caps(r.k)} font={f.mono} size={12} tracking={0.12} fill={gray} />
            {r.node(top)}
            <line x1={M} x2={W - M} y1={y} y2={y} stroke={t.text} strokeOpacity={0.18} />
          </g>
        )
      })}
      {c.badge ? <Text x={W - M} y={H - 36} anchor="end" lines={c.badge} font={f.mono} size={12} fill={gray} /> : null}
    </Frame>
  )
}

export const index: TemplateDef = {
  id: 'index',
  number: 17,
  name: 'Index',
  collection: 'minimal',
  description: 'A catalogue entry: numbered rows, fine rules, monospaced labels and a clear typographic hierarchy.',
  fonts: {
    display: { family: 'Geist', weight: 500 },
    label: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#111111', accent: '#2f54eb', background: '#f5f4f0', text: '#111111' },
  limits: { headline: 60, description: 110 },
  uses: ['category', 'date', 'badge'],
  render: Index,
}

/* ─────────────────────────── 18 · Canvas ─────────────────────────── */

function Canvas({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const art = { x: 104, y: 92, w: 330, h: 420 }
  const img = assets.screenshot || assets.logo
  const lx = 540
  const lw = W - 96 - lx
  const head = blockTop(c.headline, { font: f.display, maxWidth: lw, maxLines: 3, max: 64 * s, min: 32, lineHeight: 1.04, tracking: -0.015, top: 196, maxHeight: 200 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: lw - 80, maxLines: 3, max: 17, min: 14, lineHeight: 1.5, top: head.bottom + 40 })
  return (
    <Frame background={t.background}>
      <defs>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="160%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <clipPath id={`${uid}-art`}>
          <rect x={art.x} y={art.y} width={art.w} height={art.h} />
        </clipPath>
      </defs>
      <rect x={art.x + 10} y={art.y + 26} width={art.w - 20} height={art.h} fill="#000000" opacity={0.16} filter={`url(#${uid}-shadow)`} />
      <rect x={art.x - 12} y={art.y - 12} width={art.w + 24} height={art.h + 24} fill={mix(t.background, '#ffffff', 0.7)} />
      {img ? (
        <Img href={img} x={art.x} y={art.y} w={art.w} h={art.h} uid={uid} fit={assets.screenshot ? 'cover' : 'contain'} />
      ) : (
        <g clipPath={`url(#${uid}-art)`}>
          <rect x={art.x} y={art.y} width={art.w} height={art.h} fill={mix(t.primary, '#000000', 0.15)} />
          <g filter={`url(#${uid}-soft)`}>
            <rect x={art.x + 26} y={art.y + 30} width={art.w - 52} height={art.h * 0.5} fill={t.accent} />
            <rect x={art.x + 26} y={art.y + art.h * 0.5 + 56} width={art.w - 52} height={art.h * 0.36} fill={mix(t.accent, t.primary, 0.55)} />
          </g>
        </g>
      )}
      {o.showBrand ? <Text x={lx} y={134} lines={c.name} font={f.label} size={22} fill={t.text} /> : null}
      {o.showMeta ? <Text x={lx} y={162} lines={join([c.author && `By ${c.author}`, c.date], ', ')} font={f.body} size={16} fill={t.text} opacity={0.6} /> : null}
      <Text x={lx - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.015} fill={t.text} />
      <BlockText b={desc} x={lx} font={f.body} fill={t.text} opacity={0.72} />
      <line x1={lx} x2={lx + 40} y1={520} y2={520} stroke={t.text} />
      {o.showMeta ? <Text x={lx} y={550} lines={ellipsize(caps(join([c.category, c.domain && `Collection of ${c.domain}`], '   ·   ')), f.label, 11, lw, 0.2)} font={f.label} size={11} tracking={0.2} fill={t.text} opacity={0.65} /> : null}
    </Frame>
  )
}

export const canvas: TemplateDef = {
  id: 'canvas',
  number: 18,
  name: 'Canvas',
  collection: 'minimal',
  description: 'A gallery wall: a framed work (your image or a colour-field painting) beside a museum label.',
  fonts: {
    display: { family: 'Newsreader', weight: 400, style: 'italic' },
    label: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
  },
  theme: { primary: '#2d3a3a', accent: '#d9653b', background: '#f1eee8', text: '#1c1b19' },
  limits: { headline: 50, description: 120 },
  uses: ['screenshot', 'logo', 'author', 'date', 'category'],
  render: Canvas,
}

/* ─────────────────────────── 19 · Mono ─────────────────────────── */

function Mono({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 72
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 760, maxLines: 3, max: 80 * s, min: 36, lineHeight: 1.0, tracking: -0.04, top: 170, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 560, maxLines: 2, max: 21, min: 16, lineHeight: 1.4, top: head.bottom + 28 })
  const arcs = [360, 300, 240, 180, 120, 60]
  return (
    <Frame background={t.background}>
      {arcs.map((r, i) => (
        <circle key={r} cx={W} cy={H} r={r} fill={mix(t.background, t.primary, 0.12 + i * 0.16)} />
      ))}
      <line x1={M} x2={W - M} y1={118} y2={118} stroke={t.text} strokeOpacity={0.25} />
      {o.showBrand ? <Text x={M} y={92} lines={c.name} font={f.display} size={22} tracking={-0.02} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - M} y={92} anchor="end" lines={join([c.category, c.badge], '  /  ')} font={f.body} size={16} fill={t.text} opacity={0.7} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.75} />
      {o.showMeta ? <Text x={M} y={H - 64} lines={c.domain} font={f.medium} size={17} fill={t.text} /> : null}
    </Frame>
  )
}

export const mono: TemplateDef = {
  id: 'mono',
  number: 19,
  name: 'Mono',
  collection: 'minimal',
  description: 'One hue in disciplined tints: concentric quarter-circles, controlled weights and quiet alignment.',
  fonts: {
    display: { family: 'Space Grotesk', weight: 700 },
    medium: { family: 'Space Grotesk', weight: 500 },
    body: { family: 'Space Grotesk', weight: 400 },
  },
  theme: { primary: '#2b4bd8', accent: '#2b4bd8', background: '#e3e8fb', text: '#16287a' },
  limits: { headline: 60, description: 100 },
  uses: ['category', 'badge'],
  render: Mono,
}

/* ─────────────────────────── 20 · Frame ─────────────────────────── */

function FrameTpl({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const head = blockCenter(c.headline, { font: f.display, maxWidth: 860, maxLines: 3, max: 78 * s, min: 36, lineHeight: 1.02, tracking: -0.02, center: 286, maxHeight: 240 })
  const desc = blockTop(c.description, { font: f.italic, maxWidth: 680, maxLines: 2, max: 24, min: 18, lineHeight: 1.35, top: head.bottom + 50 })
  const corner = (x: number, y: number) => <rect key={`${x}-${y}`} x={x - 5} y={y - 5} width={10} height={10} fill={t.background} stroke={t.accent} strokeWidth={1.2} transform={`rotate(45 ${x} ${y})`} />
  return (
    <Frame background={t.background}>
      <rect x={28} y={28} width={W - 56} height={H - 56} fill="none" stroke={t.text} strokeWidth={1.4} />
      <rect x={40} y={40} width={W - 80} height={H - 80} fill="none" stroke={t.text} strokeOpacity={0.45} strokeWidth={0.8} />
      {[corner(40, 40), corner(W - 40, 40), corner(40, H - 40), corner(W - 40, H - 40)]}
      {o.showBrand ? <Text x={W / 2} y={112} anchor="middle" lines={caps(c.name)} font={f.label} size={13} tracking={0.34} fill={t.text} /> : null}
      <Text x={W / 2} y={head.y} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
      <line x1={W / 2 - 28} x2={W / 2 + 28} y1={head.bottom + 22} y2={head.bottom + 22} stroke={t.accent} strokeWidth={1.4} />
      <BlockText b={desc} x={W / 2} anchor="middle" font={f.italic} fill={t.text} opacity={0.7} />
      {o.showMeta ? <Text x={W / 2} y={H - 92} anchor="middle" lines={caps(join([c.domain, c.date], '   ·   '))} font={f.label} size={12} tracking={0.28} fill={t.text} opacity={0.65} /> : null}
    </Frame>
  )
}

export const frame: TemplateDef = {
  id: 'frame',
  number: 20,
  name: 'Frame',
  collection: 'minimal',
  description: 'A double-ruled frame with diamond corners around a centred, softly weighted serif headline.',
  fonts: {
    display: { family: 'Fraunces', weight: 300 },
    italic: { family: 'Fraunces', weight: 300, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#2b2620', accent: '#a0703f', background: '#f6f2ea', text: '#2b2620' },
  limits: { headline: 60, description: 110 },
  uses: ['date'],
  render: FrameTpl,
}

export const minimal = [nothing, index, canvas, mono, frame]
