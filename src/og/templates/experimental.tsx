import { Arrow, BlockText, blockBottom, blockTop, caps, join } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { ellipsize, fitLine, measure, vmetrics, wrap } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, mix, r2, rng } from '../core/utils'

const W = 1200
const H = 630

/* ─────────────────────────── 21 · Brutalist ─────────────────────────── */

function Brutalist({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const head = blockTop(caps(c.headline), { font: f.display, maxWidth: W - 72, maxLines: 3, max: 196 * s, min: 64, lineHeight: 0.9, tracking: -0.005, top: 92, maxHeight: 400 })
  const box = { x: W - 380, y: H - 230, w: 380, h: 230 }
  const descLines = wrap(c.description, f.monoBold, 16, box.w - 56).slice(0, 5)
  return (
    <Frame background={t.background}>
      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={t.accent} />
      <Text x={box.x + 28} y={box.y + 46} lines={descLines} font={f.monoBold} size={16} lh={1.45} fill={t.text} />
      <Arrow x={box.x + 50} y={box.y + box.h - 40} size={40} stroke={t.text} width={4} dir={45} />
      <rect x={0} y={0} width={W} height={56} fill={t.text} />
      {o.showBrand ? <Text x={36} y={36} lines={`[${caps(c.name)}]`} font={f.monoBold} size={17} fill={t.background} /> : null}
      <Text x={W / 2} y={36} anchor="middle" lines={`/// ${caps(c.category)}`} font={f.monoBold} size={17} fill={t.background} />
      {o.showMeta ? <Text x={W - 36} y={36} anchor="end" lines={caps(c.date)} font={f.monoBold} size={17} fill={t.background} /> : null}
      <Text x={32} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.005} fill={t.text} />
      {o.showMeta ? (
        <g>
          <Text x={36} y={H - 44} lines={caps(c.domain)} font={f.monoBold} size={22} fill={t.text} />
          <rect x={36} y={H - 34} width={Math.min(measure(caps(c.domain), f.monoBold, 22), box.x - 80)} height={6} fill={t.text} />
        </g>
      ) : null}
    </Frame>
  )
}

export const brutalist: TemplateDef = {
  id: 'brutalist',
  number: 21,
  name: 'Brutalist',
  collection: 'experimental',
  description: 'Edge-to-edge condensed capitals, a raw black header bar and a signal-orange information block.',
  fonts: {
    display: { family: 'Anton', weight: 400 },
    monoBold: { family: 'JetBrains Mono', weight: 700 },
  },
  theme: { primary: '#0e0e0e', accent: '#ff3d00', background: '#efede8', text: '#0e0e0e' },
  limits: { headline: 40, description: 120 },
  uses: ['category', 'date'],
  render: Brutalist,
}

/* ─────────────────────────── 22 · Pixel ─────────────────────────── */

function sprite(seed: string, n = 7) {
  const rand = rng(hash(seed || 'pixel'))
  const half = Math.ceil(n / 2)
  const grid: boolean[][] = []
  for (let y = 0; y < n; y++) {
    const row: boolean[] = []
    for (let x = 0; x < half; x++) row.push(rand() > 0.48)
    grid.push([...row, ...row.slice(0, n - half).reverse()])
  }
  return grid
}

function Pixel({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const grid = sprite(c.name)
  const cell = 22
  const sx = W - 72 - 7 * cell
  const sy = 78
  const head = blockTop(caps(c.headline), { font: f.display, maxWidth: 760, maxLines: 4, max: 58 * s, min: 26, lineHeight: 1.12, top: 168, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 720, maxLines: 2, max: 18, min: 14, lineHeight: 1.6, top: head.bottom + 30 })
  const blocks = 28
  return (
    <Frame background={t.background}>
      <defs>
        <pattern id={`${uid}-scan`} width={4} height={4} patternUnits="userSpaceOnUse">
          <rect width={4} height={2} fill="#000000" fillOpacity={0.22} />
        </pattern>
      </defs>
      {Array.from({ length: Math.floor(W / 16) }, (_, i) => (
        <g key={i} fill={t.primary} opacity={i % 2 ? 0.25 : 0.55}>
          <rect x={i * 16 + 4} y={20} width={8} height={8} />
          <rect x={i * 16 + 4} y={H - 28} width={8} height={8} />
        </g>
      ))}
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? (
            <g key={`${x}-${y}`}>
              <rect x={sx + x * cell + 6} y={sy + y * cell + 6} width={cell} height={cell} fill={t.primary} />
              <rect x={sx + x * cell} y={sy + y * cell} width={cell} height={cell} fill={t.accent} />
            </g>
          ) : null,
        ),
      )}
      {o.showBrand ? <Text x={72} y={100} lines={caps(`${c.name}`)} font={f.display} size={22} fill={t.accent} /> : null}
      {o.showMeta ? <Text x={72} y={128} lines={caps(join(['LVL ' + (c.badge || '1'), c.category], '  ·  '))} font={f.body} size={14} fill={t.primary} /> : null}
      <Text x={72} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} fill={t.text} />
      <BlockText b={desc} x={72} font={f.body} fill={t.text} opacity={0.7} />
      {Array.from({ length: blocks }, (_, i) => (
        <rect key={i} x={72 + i * 20} y={530} width={16} height={22} fill={i < 19 ? t.accent : t.text} fillOpacity={i < 19 ? 1 : 0.15} />
      ))}
      <Text x={72 + blocks * 20 + 18} y={549} lines="PRESS START" font={f.display} size={18} fill={t.text} />
      {o.showMeta ? <Text x={W - 72} y={549} anchor="end" lines={ellipsize(caps(c.domain), f.body, 16, W - 72 - (72 + blocks * 20 + 18 + measure('PRESS START', f.display, 18)) - 32)} font={f.body} size={16} fill={t.primary} /> : null}
      <rect width={W} height={H} fill={`url(#${uid}-scan)`} />
    </Frame>
  )
}

export const pixel: TemplateDef = {
  id: 'pixel',
  number: 22,
  name: 'Pixel',
  collection: 'experimental',
  description: 'A generated pixel sprite from your project name, pixel type, a segmented bar and scanlines.',
  fonts: {
    display: { family: 'Silkscreen', weight: 700 },
    body: { family: 'Silkscreen', weight: 400 },
  },
  theme: { primary: '#4cc9f0', accent: '#ffd23f', background: '#0f1116', text: '#f4f1e8' },
  limits: { headline: 44, description: 80 },
  uses: ['badge', 'category'],
  render: Pixel,
}

/* ─────────────────────────── 23 · Dither ─────────────────────────── */

const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
]

/** 1-bit ordered dither of a lit sphere + falloff halo, merged into one path of horizontal runs */
export function ditherSpherePath(cx: number, cy: number, R: number, cell: number, x0 = 0, x1 = W) {
  const L = [-0.55, -0.62, 0.56]
  const ln = Math.hypot(L[0], L[1], L[2])
  const l = L.map((v) => v / ln)
  let d = ''
  for (let j = 0; j * cell < H; j++) {
    let run = -1
    for (let i = Math.floor(x0 / cell); i * cell <= x1; i++) {
      const x = i * cell + cell / 2
      const y = j * cell + cell / 2
      const dx = (x - cx) / R
      const dy = (y - cy) / R
      const rr = dx * dx + dy * dy
      let v: number
      if (rr <= 1) {
        const nz = Math.sqrt(1 - rr)
        const lam = Math.max(0, dx * l[0] + dy * l[1] + nz * l[2])
        v = 0.04 + 0.96 * Math.pow(lam, 1.25)
      } else {
        const dist = Math.sqrt(rr) - 1
        v = Math.max(0, 0.16 - dist * 0.32)
        // contact shadow / floor
        const fy = (y - (cy + R * 0.98)) / (R * 0.18)
        const fx = (x - cx) / (R * 1.25)
        const floor = fx * fx + fy * fy
        if (floor < 1) v = Math.max(v, 0.22 * (1 - floor))
      }
      const on = x < x1 && v > (BAYER8[j % 8][i % 8] + 0.5) / 64
      if (on && run < 0) run = i
      if ((!on || x >= x1) && run >= 0) {
        d += `M${run * cell} ${j * cell}h${(i - run) * cell}v${cell}h-${(i - run) * cell}z`
        run = -1
      }
    }
    if (run >= 0) {
      const end = Math.floor(x1 / cell) + 1
      d += `M${run * cell} ${j * cell}h${(end - run) * cell}v${cell}h-${(end - run) * cell}z`
    }
  }
  return d
}

function Dither({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 66 * s, min: 32, lineHeight: 1.02, tracking: -0.035, top: 156, maxHeight: 270 })
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 480, maxLines: 3, max: 16, min: 13, lineHeight: 1.55, top: head.bottom + 28 })
  const d = ditherSpherePath(900, 300, 236, 6, 560, W)
  return (
    <Frame background={t.background}>
      <path d={d} fill={t.accent} shapeRendering="crispEdges" />
      {o.showBrand ? <Text x={72} y={86} lines={caps(c.name)} font={f.monoMed} size={14} tracking={0.18} fill={t.text} /> : null}
      <Text x={72} y={112} lines="BAYER 8×8 · 1-BIT" font={f.mono} size={12} tracking={0.18} fill={t.text} opacity={0.45} />
      <Text x={70} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      <BlockText b={desc} x={72} font={f.mono} fill={t.text} opacity={0.65} />
      {o.showMeta ? <Text x={72} y={H - 60} lines={caps(join([c.domain, c.badge], '  ·  '))} font={f.monoMed} size={13} tracking={0.16} fill={t.text} opacity={0.8} /> : null}
    </Frame>
  )
}

export const dither: TemplateDef = {
  id: 'dither',
  number: 23,
  name: 'Dither',
  collection: 'experimental',
  description: 'A procedurally lit sphere rendered with 8×8 ordered dithering, crisp 1-bit texture throughout.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    mono: { family: 'Geist Mono', weight: 400 },
    monoMed: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#f2eee6', accent: '#ff6b3d', background: '#0b0b0c', text: '#f2eee6' },
  limits: { headline: 56, description: 110 },
  uses: ['badge'],
  render: Dither,
}

/* ─────────────────────────── 24 · Halftone ─────────────────────────── */

function halftonePath(cx: number, cy: number, R: number, step: number, angle: number, maxR: number) {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  let d = ''
  const ext = R + step * 2
  for (let v = -ext; v <= ext; v += step) {
    for (let u = -ext; u <= ext; u += step) {
      const x = cx + u * ca - v * sa
      const y = cy + u * sa + v * ca
      if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue
      const dist = Math.hypot(x - cx, y - cy) / R
      if (dist > 1) continue
      // light from upper-left: denser at lower-right like a printed sphere
      const shade = Math.min(1, Math.max(0, (1 - dist * dist) * 0.55 + ((x - cx) / R + (y - cy) / R) * 0.28 + 0.25))
      const r = maxR * Math.sqrt(shade)
      if (r < 0.6) continue
      d += `M${r2(x - r)} ${r2(y)}a${r2(r)} ${r2(r)} 0 1 0 ${r2(2 * r)} 0a${r2(r)} ${r2(r)} 0 1 0 ${r2(-2 * r)} 0`
    }
  }
  return d
}

function Halftone({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 620, maxLines: 4, max: 78 * s, min: 34, lineHeight: 0.98, tracking: -0.035, top: 150, maxHeight: 270 })
  const desc = blockTop(c.description, { font: f.italic, maxWidth: 520, maxLines: 2, max: 23, min: 18, lineHeight: 1.32, top: head.bottom + 26 })
  const big = halftonePath(900, 340, 252, 14, 0.26, 7.2)
  return (
    <Frame background={t.background}>
      <path d={big} fill={t.primary} transform="translate(10 7)" opacity={0.85} style={{ mixBlendMode: 'multiply' }} />
      <path d={big} fill={t.accent} style={{ mixBlendMode: 'multiply' }} />
      <circle cx={900} cy={340} r={252} fill="none" stroke={t.text} strokeOpacity={0.12} />
      <Grain uid={uid} opacity={0.08} />
      <line x1={M} x2={W - M} y1={102} y2={102} stroke={t.text} strokeWidth={1.5} />
      <line x1={M} x2={W - M} y1={H - 82} y2={H - 82} stroke={t.text} strokeWidth={1.5} />
      {o.showBrand ? <Text x={M} y={80} lines={caps(c.name)} font={f.mono} size={14} tracking={0.16} fill={t.text} /> : null}
      <Text x={W - M} y={80} anchor="end" lines={caps(join(['Print', c.category], ' / '))} font={f.mono} size={14} tracking={0.16} fill={t.text} />
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      <BlockText b={desc} x={M} font={f.italic} fill={t.text} opacity={0.8} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={H - 50} lines={caps(c.domain)} font={f.mono} size={13} tracking={0.16} fill={t.text} />
          <Text x={W - M} y={H - 50} anchor="end" lines={caps(c.date)} font={f.mono} size={13} tracking={0.16} fill={t.text} />
          {[t.accent, t.primary, t.text].map((col, i) => (
            <circle key={i} cx={W / 2 - 22 + i * 22} cy={H - 55} r={6} fill={col} />
          ))}
        </g>
      ) : null}
    </Frame>
  )
}

export const halftone: TemplateDef = {
  id: 'halftone',
  number: 24,
  name: 'Halftone',
  collection: 'experimental',
  description: 'Two misregistered halftone screens build a printed sphere inside a ruled editorial page.',
  fonts: {
    display: { family: 'Bricolage Grotesque', weight: 800 },
    italic: { family: 'Newsreader', weight: 400, style: 'italic' },
    mono: { family: 'IBM Plex Mono', weight: 500 },
  },
  theme: { primary: '#2552e0', accent: '#ff4a1c', background: '#f3ead8', text: '#161412' },
  limits: { headline: 56, description: 100 },
  uses: ['category', 'date'],
  render: Halftone,
}

/* ─────────────────────────── 25 · Poster ─────────────────────────── */

function Poster({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const s = o.scale
  const name = caps(c.name || 'Poster')
  const nameFit = fitLine(name, f.giant, 230, 60, H - 70, 0)
  const nameCap = vmetrics(f.giant, nameFit.size).cap
  const x0 = 250
  const head = blockTop(c.headline, { font: f.display, maxWidth: 600, maxLines: 4, max: 74 * s, min: 32, lineHeight: 1.0, tracking: -0.03, top: 112, maxHeight: 300 })
  const desc = blockBottom(c.description, { font: f.body, maxWidth: 420, maxLines: 3, max: 18, min: 14, lineHeight: 1.4, bottom: H - 60 })
  return (
    <Frame background={t.background}>
      <circle cx={1060} cy={0} r={250} fill={t.accent} />
      <rect x={810} y={360} width={170} height={170} fill={t.primary} transform="rotate(12 895 445)" />
      <circle cx={1090} cy={520} r={44} fill={t.text} />
      <path d={`M 700 630 A 130 130 0 0 1 960 630 Z`} fill={t.text} opacity={0.08} />
      <rect x={0} y={0} width={200} height={H} fill={t.text} />
      <Text x={0} y={0} lines={nameFit.text} font={f.giant} size={nameFit.size} fill={t.background} transform={`translate(${100 + nameCap / 2} ${H - 36}) rotate(-90)`} />
      <Text x={x0 - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <BlockText b={desc} x={x0} font={f.body} fill={t.text} opacity={0.8} />
      {o.showMeta ? (
        <g>
          <Text x={x0} y={70} lines={caps(join([c.category, c.date], '   ·   '))} font={f.body} size={13} tracking={0.14} fill={t.text} />
          <Text x={W - 56} y={H - 46} anchor="end" lines={ellipsize(caps(c.domain), f.body, 13, 300)} font={f.body} size={13} tracking={0.14} fill={t.text} />
        </g>
      ) : null}
      {c.badge ? (
        <g>
          <circle cx={1090} cy={520} r={44} fill={t.text} />
          <Text x={1090} y={526} anchor="middle" lines={fitLine(c.badge, f.display, 18, 10, 70).text} font={f.display} size={fitLine(c.badge, f.display, 18, 10, 70).size} fill={t.background} />
        </g>
      ) : null}
    </Frame>
  )
}

export const poster: TemplateDef = {
  id: 'poster',
  number: 25,
  name: 'Poster',
  collection: 'experimental',
  description: 'A gig-poster composition: vertical giant name, colliding primary shapes and an off-axis headline.',
  fonts: {
    display: { family: 'Syne', weight: 800 },
    giant: { family: 'Big Shoulders Display', weight: 900 },
    body: { family: 'Space Grotesk', weight: 500 },
  },
  theme: { primary: '#2c44d1', accent: '#ff5b1f', background: '#ece5d6', text: '#121212' },
  limits: { headline: 56, description: 100 },
  uses: ['badge', 'category', 'date'],
  render: Poster,
}

export const experimental = [brutalist, pixel, dither, halftone, poster]

