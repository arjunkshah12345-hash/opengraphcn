import { AccentTail, BlockText, blockBottom, blockTop, caps, join, Mark } from '../core/kit'
import { Frame, Grain, Img, Text } from '../core/primitives'
import { fitLine, measure, vmetrics, wrapVariable } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, mix, rng } from '../core/utils'

const W = 1200
const H = 630

/* ─────────────────────────── 01 · Monograph ─────────────────────────── */

function Monograph({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 76
  const s = o.scale
  const desc = c.description
    ? blockBottom(c.description, { font: f.body, maxWidth: 640, maxLines: 2, max: 28, min: 20, lineHeight: 1.32, bottom: 522 })
    : null
  const top = 176
  const limit = desc ? desc.y - desc.size - 44 : 520
  const head = blockTop(c.headline, {
    font: f.display,
    maxWidth: 1048,
    maxLines: 3,
    max: 134 * s,
    min: 52,
    lineHeight: 0.98,
    tracking: -0.022,
    top,
    maxHeight: limit - top,
  })
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.07} />
      {o.showBrand ? (
        <g>
          <rect x={M} y={70} width={11} height={11} fill={t.accent} />
          <Text x={M + 24} y={81} lines={caps(c.name)} font={f.label} size={14} tracking={0.22} fill={t.text} />
        </g>
      ) : null}
      {o.showMeta ? <Text x={W - M} y={81} anchor="end" lines={caps(join(['No. 01', c.date], '   —   '))} font={f.label} size={13} tracking={0.2} fill={t.text} opacity={0.6} /> : null}
      <line x1={M} x2={W - M} y1={110} y2={110} stroke={t.text} strokeOpacity={0.22} />
      <AccentTail x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.022} fill={t.text} tail={t.accent} />
      {desc ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} /> : null}
      <line x1={M} x2={W - M} y1={560} y2={560} stroke={t.text} strokeOpacity={0.22} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={592} lines={caps(c.domain)} font={f.label} size={13} tracking={0.2} fill={t.text} />
          <Text x={W / 2} y={592} anchor="middle" lines={caps(c.category)} font={f.label} size={13} tracking={0.2} fill={t.text} opacity={0.55} />
          <Text x={W - M} y={592} anchor="end" lines={caps(c.author ? `By ${c.author}` : '')} font={f.label} size={13} tracking={0.2} fill={t.text} opacity={0.55} />
        </g>
      ) : null}
    </Frame>
  )
}

export const monograph: TemplateDef = {
  id: 'monograph',
  number: 1,
  name: 'Monograph',
  collection: 'editorial',
  description: 'Large serif headline on warm ivory with issue numbering, fine rules and editorial metadata.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Newsreader', weight: 400, style: 'italic' },
  },
  theme: { primary: '#1b1a17', accent: '#d9481f', background: '#f3eee4', text: '#1b1a17' },
  limits: { headline: 60, description: 120 },
  uses: ['date', 'category', 'author'],
  render: Monograph,
}

/* ─────────────────────────── 02 · The Journal ─────────────────────────── */

function Journal({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const ink = t.text
  const mast = fitLine(c.name || 'The Journal', f.mast, 84, 40, 860)
  const colX = 832
  const colW = W - M - colX
  const head = blockTop(c.headline, { font: f.display, maxWidth: 712, maxLines: 4, max: 78 * s, min: 38, lineHeight: 1.0, tracking: -0.012, top: 222, maxHeight: 268 })
  const bylineY = Math.min(head.bottom + 34, 548)
  // drop-cap paragraph
  const text = c.description.trim()
  const letter = text.slice(0, 1)
  const rest = text.slice(1)
  const bodySize = 19
  const dropSize = 70
  const dropW = letter ? measure(letter, f.display, dropSize) + 10 : 0
  const lines = rest ? wrapVariable(rest, f.body, bodySize, (i) => (i < 2 ? colW - dropW : colW), 9) : []
  const bodyTop = 262
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.06} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={46} lines="VOL. I — NO. 1" font={f.label} size={12} tracking={0.18} fill={ink} />
          <Text x={W / 2} y={46} anchor="middle" lines={caps(c.date)} font={f.label} size={12} tracking={0.18} fill={ink} />
          <Text x={W - M} y={46} anchor="end" lines={caps(c.domain)} font={f.label} size={12} tracking={0.18} fill={ink} />
        </g>
      ) : null}
      <line x1={M} x2={W - M} y1={60} y2={60} stroke={ink} strokeWidth={0.8} />
      {o.showBrand ? <Text x={W / 2} y={132} anchor="middle" lines={mast.text} font={f.mast} size={mast.size} fill={ink} /> : null}
      <line x1={M} x2={W - M} y1={152} y2={152} stroke={ink} strokeWidth={2.4} />
      <line x1={M} x2={W - M} y1={157.5} y2={157.5} stroke={ink} strokeWidth={0.8} />
      <Text x={M} y={180} lines={caps(c.category)} font={f.label} size={12} tracking={0.18} fill={t.accent} />
      {[-18, 0, 18].map((d) => (
        <rect key={d} x={W / 2 + d - 3} y={172} width={6} height={6} transform={`rotate(45 ${W / 2 + d} 175)`} fill={ink} opacity={0.55} />
      ))}
      <Text x={W - M} y={180} anchor="end" lines={caps(c.badge)} font={f.label} size={12} tracking={0.18} fill={ink} />
      <line x1={M} x2={W - M} y1={194} y2={194} stroke={ink} strokeWidth={0.8} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.012} fill={ink} />
      {c.author ? <Text x={M} y={bylineY} lines={`By ${c.author}`} font={f.bodyItalic} size={21} fill={ink} opacity={0.75} /> : null}
      <line x1={804} x2={804} y1={214} y2={562} stroke={ink} strokeWidth={0.8} />
      <Text x={colX} y={236} lines={caps('The brief')} font={f.label} size={11} tracking={0.2} fill={t.accent} />
      {letter ? <Text x={colX - 2} y={bodyTop + dropSize * 0.62} lines={letter} font={f.display} size={dropSize} fill={ink} /> : null}
      <Text x={colX} y={bodyTop + 12} lines={lines.slice(0, 2)} font={f.body} size={bodySize} lh={1.42} fill={ink} transform={`translate(${dropW} 0)`} />
      <Text x={colX} y={bodyTop + 12 + 2 * bodySize * 1.42} lines={lines.slice(2)} font={f.body} size={bodySize} lh={1.42} fill={ink} />
      <line x1={M} x2={W - M} y1={574} y2={574} stroke={ink} strokeWidth={0.8} />
      <Text x={M} y={600} lines={`Continued at ${c.domain}`} font={f.body} size={16} fill={ink} opacity={0.7} />
      <Text x={W - M} y={600} anchor="end" lines="PAGE A1" font={f.label} size={12} tracking={0.18} fill={ink} opacity={0.7} />
    </Frame>
  )
}

export const journal: TemplateDef = {
  id: 'journal',
  number: 2,
  name: 'The Journal',
  collection: 'editorial',
  description: 'A broadsheet front page: blackletter masthead, column rules, drop cap and a Bodoni headline.',
  fonts: {
    display: { family: 'Bodoni Moda', weight: 800 },
    mast: { family: 'UnifrakturMaguntia', weight: 400 },
    body: { family: 'Newsreader', weight: 400 },
    bodyItalic: { family: 'Newsreader', weight: 400, style: 'italic' },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#141414', accent: '#9b1c1c', background: '#f2ede1', text: '#141414' },
  limits: { headline: 70, description: 220 },
  uses: ['date', 'category', 'badge', 'author'],
  render: Journal,
}

/* ─────────────────────────── 03 · Modernist ─────────────────────────── */

function Modernist({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 64
  const s = o.scale
  const col = (W - 2 * M) / 6
  const x2 = M + col * 2
  const desc = c.description ? blockBottom(c.description, { font: f.body, maxWidth: 520, maxLines: 3, max: 21, min: 17, lineHeight: 1.36, bottom: 566 }) : null
  const top = 136
  const head = blockTop(c.headline, {
    font: f.display,
    maxWidth: W - M - x2,
    maxLines: 4,
    max: 98 * s,
    min: 44,
    lineHeight: 0.96,
    tracking: -0.045,
    top,
    maxHeight: (desc ? desc.y - desc.size - 48 : 560) - top,
  })
  const meta = [
    ['Project', c.name],
    ['Category', c.category],
    ['Date', c.date],
    ['Domain', c.domain],
  ].filter(([, v]) => v)
  return (
    <Frame background={t.background}>
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={M + i * col} x2={M + i * col} y1={0} y2={H} stroke={t.text} strokeOpacity={0.07} />
      ))}
      <line x1={0} x2={W} y1={96} y2={96} stroke={t.text} strokeOpacity={0.07} />
      <rect x={M} y={64} width={col * 2 - 24} height={14} fill={t.accent} />
      <circle cx={W - M - 58} cy={H - 64 - 58} r={58} fill={t.accent} />
      {o.showBrand ? <Text x={M} y={156} lines={c.name} font={f.display} size={24} tracking={-0.02} fill={t.text} /> : null}
      <Text x={M} y={184} lines={c.badge} font={f.body} size={15} fill={t.text} opacity={0.5} />
      <Text x={x2 - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.045} fill={t.text} />
      {desc ? <BlockText b={desc} x={x2} font={f.body} fill={t.text} opacity={0.8} /> : null}
      {o.showMeta
        ? meta.map(([k, v], i) => {
            const y = 566 - (meta.length - 1 - i) * 54
            return (
              <g key={k}>
                <Text x={M} y={y - 22} lines={caps(k)} font={f.body} size={11} tracking={0.16} fill={t.text} opacity={0.45} />
                <Text x={M} y={y} lines={fitLine(v, f.label, 18, 12, col * 2 - 40).text} font={f.label} size={18} fill={t.text} />
              </g>
            )
          })
        : null}
    </Frame>
  )
}

export const modernist: TemplateDef = {
  id: 'modernist',
  number: 3,
  name: 'Modernist',
  collection: 'editorial',
  description: 'Swiss six-column grid, heavy grotesk headline, red signal shapes and a structured metadata stack.',
  fonts: {
    display: { family: 'Inter Tight', weight: 800 },
    label: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#111111', accent: '#e3241b', background: '#eeece6', text: '#111111' },
  limits: { headline: 60, description: 140 },
  uses: ['date', 'category', 'badge'],
  render: Modernist,
}

/* ─────────────────────────── 04 · Type Study ─────────────────────────── */

function TypeStudy({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const M = 64
  const word = (c.name || 'Aa').trim()
  const unit = measure(word, f.display, 1, -0.04)
  const size = Math.min(1380 / Math.max(unit, 0.1), 600)
  const cap = vmetrics(f.display, size).cap
  const base = H + size * 0.1
  const lettersTop = base - cap
  const top = 132
  const head = blockTop(c.headline, { font: f.italic, maxWidth: 760, maxLines: 3, max: 66 * o.scale, min: 30, lineHeight: 1.04, tracking: -0.01, top, maxHeight: Math.max(60, lettersTop - 44 - top) })
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 250, maxLines: 6, max: 15, min: 12, lineHeight: 1.5, top: 140 })
  const fam = `${f.display.family} ${f.display.weight}`
  return (
    <Frame background={t.background}>
      <Text x={M - 24} y={base - 16} lines={word} font={f.display} size={size} tracking={-0.04} fill="none" stroke={t.accent} strokeWidth={2} opacity={0.9} />
      <Text x={M - 10} y={base} lines={word} font={f.display} size={size} tracking={-0.04} fill={t.text} />
      <Text x={M} y={70} lines={caps(join(['Specimen', o.showBrand ? c.name : ''], ' — '))} font={f.mono} size={13} tracking={0.12} fill={t.text} />
      <Text x={W - M} y={70} anchor="end" lines={caps(fam)} font={f.mono} size={13} tracking={0.12} fill={t.text} opacity={0.6} />
      <line x1={M} x2={W - M} y1={90} y2={90} stroke={t.text} strokeOpacity={0.3} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.italic} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      {o.showMeta ? <BlockText b={desc} x={W - M - 250} font={f.mono} fill={t.text} opacity={0.7} /> : null}
      {o.showMeta ? <Text x={W - M} y={Math.min(desc.bottom + 70, lettersTop - 20)} anchor="end" lines="Aa" font={f.display} size={56} fill={t.accent} /> : null}
    </Frame>
  )
}

export const typeStudy: TemplateDef = {
  id: 'type-study',
  number: 4,
  name: 'Type Study',
  collection: 'editorial',
  description: 'Your project name as an oversized, cropped specimen with an offset outline and italic headline.',
  fonts: {
    display: { family: 'Fraunces', weight: 900 },
    italic: { family: 'Fraunces', weight: 300, style: 'italic' },
    mono: { family: 'IBM Plex Mono', weight: 400 },
  },
  theme: { primary: '#efe8da', accent: '#ff6a3d', background: '#16140f', text: '#efe8da' },
  limits: { headline: 60, description: 110 },
  render: TypeStudy,
}

/* ─────────────────────────── 05 · The Cover ─────────────────────────── */

function Barcode({ x, y, w, h, seed, fill }: { x: number; y: number; w: number; h: number; seed: string; fill: string }) {
  const rand = rng(hash(seed))
  const bars: { x: number; w: number }[] = []
  let cx = 0
  while (cx < w) {
    const bw = [1.5, 1.5, 3, 4.5][Math.floor(rand() * 4)]
    if (rand() > 0.35) bars.push({ x: cx, w: bw })
    cx += bw + [1.5, 3][Math.floor(rand() * 2)]
  }
  return (
    <g>
      {bars.map((b, i) => (
        <rect key={i} x={x + b.x} y={y} width={b.w} height={h} fill={fill} />
      ))}
    </g>
  )
}

function Cover({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 56
  const px = 712
  const s = o.scale
  const mast = fitLine(c.name || 'Cover', f.display, 156, 60, px - M - 28, -0.045)
  const head = blockTop(c.headline, { font: f.italic, maxWidth: px - M - 60, maxLines: 3, max: 62 * s, min: 32, lineHeight: 1.02, tracking: -0.015, top: 228, maxHeight: 200 })
  const desc = blockTop(c.description, { font: f.label, maxWidth: px - M - 120, maxLines: 3, max: 19, min: 15, lineHeight: 1.4, top: head.bottom + 26 })
  const img = assets.screenshot || assets.logo
  const initial = (c.name || 'A').trim().slice(0, 1)
  const cs = mix(t.primary, t.background, 0.0)
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.06} />
      <rect x={px} y={0} width={W - px} height={H} fill={cs} />
      {img ? (
        <Img href={img} x={px} y={0} w={W - px} h={H} uid={uid} fit={assets.screenshot ? 'cover' : 'contain'} />
      ) : (
        <g>
          <clipPath id={`${uid}-panel`}>
            <rect x={px} y={0} width={W - px} height={H} />
          </clipPath>
          <g clipPath={`url(#${uid}-panel)`}>
            {[300, 240, 180].map((r, i) => (
              <circle key={r} cx={px + 300} cy={300} r={r} fill="none" stroke={t.accent} strokeOpacity={0.5 - i * 0.12} strokeWidth={1.4} />
            ))}
            <Text x={px + 290} y={560} anchor="middle" lines={initial} font={f.italic} size={720} fill={t.background} opacity={0.94} />
            <circle cx={px + 392} cy={176} r={44} fill={t.accent} />
          </g>
        </g>
      )}
      <Text x={M} y={56} lines={caps(join([`The ${c.category || 'New'} Issue`, c.date], '   ·   '))} font={f.label2} size={13} tracking={0.24} fill={t.text} />
      {o.showBrand ? <Text x={M - 6} y={182} lines={mast.text} font={f.display} size={mast.size} tracking={-0.045} fill={t.text} /> : null}
      <line x1={M} x2={px - 36} y1={202} y2={202} stroke={t.text} strokeWidth={1} />
      <Text x={M} y={head.y} lines={head.lines} font={f.italic} size={head.size} lh={head.lh} tracking={-0.015} fill={t.text} />
      <BlockText b={desc} x={M} font={f.label} fill={t.text} opacity={0.75} />
      {c.badge ? (
        <g>
          <circle cx={px} cy={486} r={66} fill={t.accent} />
          <Text x={px} y={474} anchor="middle" lines="NEW" font={f.label2} size={13} tracking={0.22} fill={t.background} />
          <Text x={px} y={512} anchor="middle" lines={fitLine(c.badge, f.display, 34, 16, 104).text} font={f.display} size={fitLine(c.badge, f.display, 34, 16, 104).size} fill={t.background} />
        </g>
      ) : null}
      {o.showMeta ? (
        <g>
          <rect x={M - 8} y={530} width={168} height={70} fill={t.background} />
          <Barcode x={M} y={540} w={150} h={42} seed={c.name + c.domain} fill={t.text} />
          <Text x={M} y={596} lines={c.domain} font={f.label} size={11} tracking={0.3} fill={t.text} />
        </g>
      ) : null}
    </Frame>
  )
}

export const cover: TemplateDef = {
  id: 'cover',
  number: 5,
  name: 'The Cover',
  collection: 'editorial',
  description: 'Magazine cover: towering Didone masthead, italic cover line, sticker badge and a barcode.',
  fonts: {
    display: { family: 'Bodoni Moda', weight: 800 },
    italic: { family: 'Bodoni Moda', weight: 500, style: 'italic' },
    label: { family: 'Hanken Grotesk', weight: 400 },
    label2: { family: 'Hanken Grotesk', weight: 700 },
  },
  theme: { primary: '#1d2b4f', accent: '#e4442b', background: '#efe8dc', text: '#121212' },
  limits: { headline: 60, description: 120 },
  uses: ['screenshot', 'logo', 'badge', 'category', 'date'],
  render: Cover,
}

export const editorial = [monograph, journal, modernist, typeStudy, cover]
