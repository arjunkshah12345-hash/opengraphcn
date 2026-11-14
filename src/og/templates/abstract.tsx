import { BlockText, blockCenter, blockTop, blockBottom, caps, join, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { ellipsize } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { hash, hueShift, mix, r2, rng } from '../core/utils'

const W = 1200
const H = 630

/** smooth closed/open path through points using Catmull-Rom → cubic Bézier */
function smooth(points: [number, number][], closed = false) {
  const p = closed ? [points[points.length - 1], ...points, points[0], points[1]] : [points[0], ...points, points[points.length - 1]]
  let d = `M ${r2(p[1][0])} ${r2(p[1][1])}`
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1]
    const [x1, y1] = p[i]
    const [x2, y2] = p[i + 1]
    const [x3, y3] = p[i + 2]
    d += ` C ${r2(x1 + (x2 - x0) / 6)} ${r2(y1 + (y2 - y0) / 6)}, ${r2(x2 - (x3 - x1) / 6)} ${r2(y2 - (y3 - y1) / 6)}, ${r2(x2)} ${r2(y2)}`
  }
  return closed ? d + ' Z' : d
}

/* ─────────────────────────── 11 · Atmosphere ─────────────────────────── */

function Atmosphere({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const c3 = hueShift(t.primary, 38)
  const c4 = hueShift(t.accent, -50)
  const head = blockCenter(c.headline, { font: f.display, maxWidth: 960, maxLines: 3, max: 92 * s, min: 40, lineHeight: 1.0, tracking: -0.025, center: 292, maxHeight: 300 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 640, maxLines: 2, max: 22, min: 17, lineHeight: 1.4, top: head.bottom + 30 })
  return (
    <Frame background={t.background}>
      <defs>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={95} />
        </filter>
        <radialGradient id={`${uid}-veil`} cx="0.5" cy="0.5" r="0.55">
          <stop offset="0" stopColor={t.background} stopOpacity={0.55} />
          <stop offset="1" stopColor={t.background} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g filter={`url(#${uid}-blur)`}>
        <circle cx={230} cy={120} r={290} fill={t.primary} />
        <circle cx={1000} cy={110} r={270} fill={t.accent} />
        <circle cx={860} cy={600} r={300} fill={c3} />
        <circle cx={170} cy={640} r={250} fill={c4} />
      </g>
      <rect width={W} height={H} fill={`url(#${uid}-veil)`} />
      <Grain uid={uid} opacity={0.16} blend="overlay" freq={0.75} />
      {o.showBrand ? <Text x={W / 2} y={84} anchor="middle" lines={caps(c.name)} font={f.label} size={14} tracking={0.3} fill={t.text} /> : null}
      <Text x={W / 2} y={head.y} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.025} fill={t.text} />
      <BlockText b={desc} x={W / 2} anchor="middle" font={f.body} fill={t.text} opacity={0.75} />
      {o.showMeta ? <Text x={W / 2} y={H - 64} anchor="middle" lines={caps(join([c.domain, c.date], '   ·   '))} font={f.label} size={12} tracking={0.24} fill={t.text} opacity={0.7} /> : null}
    </Frame>
  )
}

export const atmosphere: TemplateDef = {
  id: 'atmosphere',
  number: 11,
  name: 'Atmosphere',
  collection: 'abstract',
  description: 'Soft, blurred colour fields with grain and a centred, softly weighted serif headline.',
  fonts: {
    display: { family: 'Fraunces', weight: 300 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 500 },
  },
  theme: { primary: '#ff8f6b', accent: '#7fb0ff', background: '#f3eee8', text: '#1d1a17' },
  limits: { headline: 64, description: 110 },
  uses: ['date'],
  render: Atmosphere,
}

/* ─────────────────────────── 12 · Liquid ─────────────────────────── */

function Liquid({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const cols = [mix(t.primary, t.background, 0.45), t.primary, mix(t.primary, t.accent, 0.5), t.accent, mix(t.accent, '#ffffff', 0.35)]
  const ribbons = cols.map((col, k) => {
    const pts1: [number, number][] = []
    const pts2: [number, number][] = []
    for (let x = -60; x <= W + 60; x += 60) {
      const base = 650 - k * 40 - Math.max(0, x - 520) * 0.5
      const y1 = base + 26 * Math.sin(x / 170 + k * 1.3)
      const th = 64 + 34 * Math.sin(x / 230 + k)
      pts1.push([x, y1])
      pts2.push([x, y1 + th])
    }
    const top = smooth(pts1)
    const bottomPts = [...pts2].reverse()
    const bot = smooth(bottomPts).replace(/^M/, 'L')
    return { d: `${top} ${bot} Z`, hl: top, col, k }
  })
  const head = blockTop(c.headline, { font: f.display, maxWidth: 680, maxLines: 3, max: 76 * s, min: 34, lineHeight: 1.0, tracking: -0.03, top: 128, maxHeight: 190 })
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 560, maxLines: 2, max: 17, min: 14, lineHeight: 1.5, top: head.bottom + 26 })
  return (
    <Frame background={t.background}>
      <defs>
        {ribbons.map((r) => (
          <linearGradient key={r.k} id={`${uid}-r${r.k}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={r.col} stopOpacity={0.2} />
            <stop offset="0.55" stopColor={r.col} />
            <stop offset="1" stopColor={mix(r.col, '#ffffff', 0.25)} />
          </linearGradient>
        ))}
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={2} />
        </filter>
      </defs>
      {ribbons.map((r) => (
        <g key={r.k}>
          <path d={r.d} fill={`url(#${uid}-r${r.k})`} opacity={0.92} />
          <path d={r.hl} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1.4} filter={`url(#${uid}-soft)`} transform="translate(0 6)" />
        </g>
      ))}
      <Grain uid={uid} opacity={0.12} blend="overlay" />
      {o.showBrand ? <Text x={72} y={84} lines={caps(c.name)} font={f.mono} size={14} tracking={0.2} fill={t.text} /> : null}
      <Text x={70} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <BlockText b={desc} x={72} font={f.mono} fill={t.text} opacity={0.7} />
      {o.showMeta ? <Text x={W - 72} y={84} anchor="end" lines={caps(c.domain)} font={f.mono} size={14} tracking={0.2} fill={t.text} opacity={0.7} /> : null}
    </Frame>
  )
}

export const liquid: TemplateDef = {
  id: 'liquid',
  number: 12,
  name: 'Liquid',
  collection: 'abstract',
  description: 'Flowing, layered ribbons of colour with glossy highlights rising across a deep ground.',
  fonts: {
    display: { family: 'Syne', weight: 700 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#1fc8a9', accent: '#d7f36b', background: '#061716', text: '#f2fbf6' },
  limits: { headline: 56, description: 110 },
  render: Liquid,
}

/* ─────────────────────────── 13 · Chromatic ─────────────────────────── */

function Chromatic({ content: c, theme: t, options: o, fonts: f, uid, assets }: TemplateProps) {
  const s = o.scale
  const irid = [t.primary, hueShift(t.primary, 70), t.accent, hueShift(t.accent, 80), hueShift(t.primary, -60)]
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 56 * s, min: 28, lineHeight: 1.08, tracking: -0.03, top: 150, maxHeight: 280 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 470, maxLines: 3, max: 19, min: 15, lineHeight: 1.45, top: head.bottom + 26 })
  return (
    <Frame background={t.background}>
      <defs>
        <linearGradient id={`${uid}-irid`} x1="0" y1="0" x2="1" y2="1">
          {irid.map((col, i) => (
            <stop key={i} offset={i / (irid.length - 1)} stopColor={col} />
          ))}
        </linearGradient>
        <linearGradient id={`${uid}-irid2`} x1="1" y1="0" x2="0" y2="1">
          {[...irid].reverse().map((col, i) => (
            <stop key={i} offset={i / (irid.length - 1)} stopColor={col} />
          ))}
        </linearGradient>
        <radialGradient id={`${uid}-sphere`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor={irid[1]} />
          <stop offset="0.75" stopColor={irid[3]} />
          <stop offset="1" stopColor={irid[4]} />
        </radialGradient>
        <filter id={`${uid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
        <filter id={`${uid}-bloom`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={60} />
        </filter>
      </defs>
      <g filter={`url(#${uid}-bloom)`} opacity={0.55}>
        <circle cx={930} cy={300} r={240} fill={`url(#${uid}-irid)`} />
      </g>
      <circle cx={930} cy={300} r={196} fill="none" stroke={`url(#${uid}-irid)`} strokeWidth={110} />
      <circle cx={930} cy={300} r={196} fill="none" stroke={`url(#${uid}-irid2)`} strokeWidth={110} opacity={0.5} style={{ mixBlendMode: 'screen' }} />
      <ellipse cx={850} cy={150} rx={120} ry={26} fill="#ffffff" opacity={0.75} filter={`url(#${uid}-blur)`} transform="rotate(-28 850 150)" />
      <circle cx={930} cy={300} r={141} fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={1.5} />
      <circle cx={930} cy={300} r={251} fill="none" stroke="#ffffff" strokeOpacity={0.4} strokeWidth={1.5} />
      <circle cx={700} cy={500} r={78} fill={`url(#${uid}-sphere)`} />
      <ellipse cx={680} cy={474} rx={26} ry={14} fill="#ffffff" opacity={0.8} filter={`url(#${uid}-blur)`} />
      <Grain uid={uid} opacity={0.1} blend="overlay" />
      {o.showBrand ? (
        <g>
          <Mark x={72} y={60} size={34} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="circle" />
          <Text x={118} y={84} lines={c.name} font={f.display} size={18} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      <Text x={70} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.03} fill={t.text} />
      <BlockText b={desc} x={72} font={f.body} fill={t.text} opacity={0.7} />
      {o.showMeta ? <Text x={72} y={H - 60} lines={join([c.domain, c.badge], '   ·   ')} font={f.body} size={15} fill={t.text} opacity={0.6} /> : null}
    </Frame>
  )
}

export const chromatic: TemplateDef = {
  id: 'chromatic',
  number: 13,
  name: 'Chromatic',
  collection: 'abstract',
  description: 'An iridescent ring and pearl sphere with specular highlights on a cool pearl ground.',
  fonts: {
    display: { family: 'Unbounded', weight: 600 },
    body: { family: 'Inter Tight', weight: 400 },
  },
  theme: { primary: '#ff8fd0', accent: '#8fe7ff', background: '#ebe9f0', text: '#141218' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge'],
  render: Chromatic,
}

/* ─────────────────────────── 14 · Nocturne ─────────────────────────── */

function Nocturne({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const cx = 880
  const cy = 300
  const rand = rng(hash(c.name || 'night'))
  const stars = Array.from({ length: 46 }, () => ({ x: rand() * W, y: rand() * 470, r: 0.5 + rand() * 1.1, o: 0.2 + rand() * 0.6 }))
  const head = blockTop(c.headline, { font: f.display, maxWidth: 560, maxLines: 4, max: 84 * s, min: 38, lineHeight: 0.98, tracking: -0.01, top: 150, maxHeight: 270 })
  const desc = blockTop(c.description, { font: f.italic, maxWidth: 500, maxLines: 2, max: 26, min: 19, lineHeight: 1.3, top: head.bottom + 28 })
  return (
    <Frame background={t.background}>
      <defs>
        <radialGradient id={`${uid}-halo`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={t.accent} stopOpacity={0.55} />
          <stop offset="0.35" stopColor={t.accent} stopOpacity={0.18} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor={t.accent} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0.2} />
        </linearGradient>
        <linearGradient id={`${uid}-horizon`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={t.accent} stopOpacity={0} />
          <stop offset="0.6" stopColor={t.accent} stopOpacity={0.7} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {stars.map((st, i) => (
        <circle key={i} cx={r2(st.x)} cy={r2(st.y)} r={r2(st.r)} fill={t.text} opacity={r2(st.o)} />
      ))}
      <circle cx={cx} cy={cy} r={380} fill={`url(#${uid}-halo)`} />
      <circle cx={cx} cy={cy} r={168} fill="none" stroke={t.accent} strokeWidth={16} opacity={0.6} filter={`url(#${uid}-glow)`} />
      <circle cx={cx} cy={cy} r={166} fill={t.background} />
      <circle cx={cx} cy={cy} r={167} fill="none" stroke={`url(#${uid}-ring)`} strokeWidth={2.5} />
      <circle cx={cx - 112} cy={cy - 118} r={5} fill="#ffffff" filter={`url(#${uid}-glow)`} />
      <circle cx={cx - 112} cy={cy - 118} r={2.6} fill="#ffffff" />
      <rect x={0} y={516} width={W} height={1} fill={`url(#${uid}-horizon)`} />
      {o.showBrand ? <Text x={76} y={88} lines={caps(c.name)} font={f.mono} size={13} tracking={0.32} fill={t.text} opacity={0.75} /> : null}
      <Text x={72} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      <BlockText b={desc} x={76} font={f.italic} fill={t.text} opacity={0.62} />
      {o.showMeta ? (
        <g>
          <Text x={76} y={H - 62} lines={caps(c.domain)} font={f.mono} size={12} tracking={0.28} fill={t.text} opacity={0.6} />
          <Text x={W - 76} y={H - 62} anchor="end" lines={caps(c.date)} font={f.mono} size={12} tracking={0.28} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
    </Frame>
  )
}

export const nocturne: TemplateDef = {
  id: 'nocturne',
  number: 14,
  name: 'Nocturne',
  collection: 'abstract',
  description: 'Near-black night with a luminous eclipse, faint stars and a refined Garamond headline.',
  fonts: {
    display: { family: 'Cormorant Garamond', weight: 400 },
    italic: { family: 'Cormorant Garamond', weight: 400, style: 'italic' },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#ecebe6', accent: '#f1c27d', background: '#06070a', text: '#efece4' },
  limits: { headline: 60, description: 100 },
  uses: ['date'],
  render: Nocturne,
}

/* ─────────────────────────── 15 · Spectrum ─────────────────────────── */

function Spectrum({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const s = o.scale
  const rand = rng(hash('spectrum' + t.primary + t.accent))
  const bands: { x: number; w: number; a: string; b: string }[] = []
  let x = 0
  let i = 0
  while (x < W) {
    const bw = 40 + Math.floor(rand() * 120)
    const tt = i / 12
    const a = mix(hueShift(t.primary, tt * 70 - 20), t.accent, (Math.sin(i * 1.7) + 1) * 0.25)
    const b = mix(hueShift(t.accent, -tt * 60), t.background, 0.15 + rand() * 0.3)
    bands.push({ x, w: bw, a, b })
    x += bw
    i++
  }
  const text = caps(c.headline)
  const head = blockBottom(text, { font: f.display, maxWidth: W - 140, maxLines: 3, max: 150 * s, min: 56, lineHeight: 0.88, tracking: -0.01, bottom: H - 66, maxHeight: 400 })
  return (
    <Frame background={t.background}>
      <defs>
        {bands.map((b, k) => (
          <linearGradient key={k} id={`${uid}-b${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={b.a} />
            <stop offset="1" stopColor={b.b} />
          </linearGradient>
        ))}
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor={t.background} stopOpacity={0} />
          <stop offset="1" stopColor={t.background} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      {bands.map((b, k) => (
        <rect key={k} x={b.x} y={0} width={b.w + 1} height={H} fill={`url(#${uid}-b${k})`} />
      ))}
      {bands.map((b, k) => (k % 3 === 0 ? <line key={`l${k}`} x1={b.x} x2={b.x} y1={0} y2={H} stroke="#ffffff" strokeOpacity={0.25} /> : null))}
      <rect width={W} height={H} fill={`url(#${uid}-shade)`} />
      <Grain uid={uid} opacity={0.18} blend="overlay" />
      {o.showBrand ? <Text x={70} y={80} lines={caps(c.name)} font={f.mono} size={14} tracking={0.22} fill={t.text} /> : null}
      {o.showMeta ? <Text x={W - 70} y={80} anchor="end" lines={caps(join([c.badge, c.domain], '  /  '))} font={f.mono} size={14} tracking={0.22} fill={t.text} /> : null}
      <Text x={66} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      {c.description && head.y - head.size > 160 ? (
        <Text x={70} y={head.y - head.size - 10} lines={ellipsize(c.description, f.mono, 16, 620)} font={f.mono} size={16} fill={t.text} opacity={0.85} />
      ) : null}
    </Frame>
  )
}

export const spectrum: TemplateDef = {
  id: 'spectrum',
  number: 15,
  name: 'Spectrum',
  collection: 'abstract',
  description: 'Vertical bands of shifting colour with grain and a towering condensed headline.',
  fonts: {
    display: { family: 'Big Shoulders Display', weight: 900 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#ff5e3a', accent: '#5b6cff', background: '#121016', text: '#ffffff' },
  limits: { headline: 48, description: 80 },
  uses: ['badge'],
  render: Spectrum,
}

export const abstract = [atmosphere, liquid, chromatic, nocturne, spectrum]

