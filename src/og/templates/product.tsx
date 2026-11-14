import { Arrow, BlockText, blockCenter, blockTop, caps, join, Mark, Star } from '../core/kit'
import { Frame, Grain, Img, Text } from '../core/primitives'
import { ellipsize, fitLine, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { formatCount, initials, LANGUAGE_COLORS, mix } from '../core/utils'

const W = 1200
const H = 630

/* ─────────────────────────── 26 · Launch ─────────────────────────── */

function Launch({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const head = blockCenter(c.headline, { font: f.display, maxWidth: 980, maxLines: 2, max: 84 * s, min: 40, lineHeight: 1.02, tracking: -0.045, center: 318, maxHeight: 200 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 720, maxLines: 2, max: 22, min: 17, lineHeight: 1.4, top: head.bottom + 26 })
  const pill = join(['NEW', c.badge], '  ·  ')
  const pw = measure(pill, f.mono, 13, 0.08) + 34
  const nameW = measure(c.name, f.brand, 22, -0.02)
  const brandW = 40 + 12 + nameW
  const vpY = 330
  const floor = Array.from({ length: 21 }, (_, i) => -1200 + i * 180)
  const horiz = [450, 478, 514, 560, 618]
  const dw = measure(c.domain, f.mono, 16)
  return (
    <Frame background={t.background}>
      <defs>
        <radialGradient id={`${uid}-spot`} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor={t.accent} stopOpacity={0.42} />
          <stop offset="0.45" stopColor={t.accent} stopOpacity={0.08} />
          <stop offset="1" stopColor={t.accent} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="420" x2="0" y2="630" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={t.text} stopOpacity={0} />
          <stop offset="1" stopColor={t.text} stopOpacity={0.22} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-spot)`} />
      <g stroke={`url(#${uid}-floor)`} strokeWidth={1}>
        {floor.map((x) => (
          <line key={x} x1={600 + (x - 600) * 0.12} y1={vpY + 90} x2={x + 600} y2={H} />
        ))}
        {horiz.map((y) => (
          <line key={y} x1={0} x2={W} y1={y} y2={y} />
        ))}
      </g>
      <Grain uid={uid} opacity={0.08} blend="screen" />
      {o.showBrand ? (
        <g>
          <Mark x={W / 2 - brandW / 2} y={78} size={40} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.brand} />
          <Text x={W / 2 - brandW / 2 + 52} y={106} lines={c.name} font={f.brand} size={22} tracking={-0.02} fill={t.text} />
        </g>
      ) : null}
      <rect x={W / 2 - pw / 2} y={150} width={pw} height={32} rx={16} fill={t.accent} fillOpacity={0.12} stroke={t.accent} strokeOpacity={0.55} />
      <Text x={W / 2} y={171} anchor="middle" lines={pill} font={f.mono} size={13} tracking={0.08} fill={t.accent} />
      <Text x={W / 2} y={head.y} anchor="middle" lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.045} fill={t.text} />
      <BlockText b={desc} x={W / 2} anchor="middle" font={f.body} fill={t.text} opacity={0.62} />
      {o.showMeta ? (
        <g>
          <Text x={W / 2 - 12} y={H - 62} anchor="middle" lines={c.domain} font={f.mono} size={16} fill={t.text} />
          <Arrow x={W / 2 - 12 + dw / 2 + 16} y={H - 67} size={12} stroke={t.accent} dir={-45} />
        </g>
      ) : null}
    </Frame>
  )
}

export const launch: TemplateDef = {
  id: 'launch',
  number: 26,
  name: 'Launch',
  collection: 'product',
  description: 'Launch-day card: spotlight, perspective floor, release pill, brand lock-up and a centred headline.',
  fonts: {
    display: { family: 'Geist', weight: 700 },
    brand: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#ffffff', accent: '#ff7a45', background: '#09090b', text: '#f6f5f2' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge'],
  render: Launch,
}

/* ─────────────────────────── 27 · Showcase ─────────────────────────── */

function Showcase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 420, maxLines: 4, max: 54 * s, min: 28, lineHeight: 1.04, tracking: -0.04, top: 176, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 400, maxLines: 3, max: 18, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  const bx = 548
  const by = 84
  const bw = 720
  const bh = 620
  const urlW = 300
  const inner = { x: bx, y: by + 46, w: bw, h: bh - 46 }
  const mini = blockTop(c.headline, { font: f.display, maxWidth: 520, maxLines: 2, max: 40, min: 22, lineHeight: 1.05, tracking: -0.04, top: inner.y + 120 })
  return (
    <Frame background={t.background}>
      <defs>
        <filter id={`${uid}-sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <clipPath id={`${uid}-win`}>
          <rect x={bx} y={by} width={bw} height={bh} rx={14} />
        </clipPath>
        <linearGradient id={`${uid}-card`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.accent} />
          <stop offset="1" stopColor={mix(t.accent, t.primary, 0.6)} />
        </linearGradient>
      </defs>
      <rect x={bx + 20} y={by + 36} width={bw} height={bh} rx={14} fill="#000000" opacity={0.18} filter={`url(#${uid}-sh)`} />
      <g clipPath={`url(#${uid}-win)`}>
        <rect x={bx} y={by} width={bw} height={bh} fill="#ffffff" />
        <rect x={bx} y={by} width={bw} height={46} fill={mix('#ffffff', t.text, 0.05)} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={bx + 24 + i * 18} cy={by + 23} r={5.5} fill={t.text} fillOpacity={0.16} />
        ))}
        <rect x={bx + bw / 2 - urlW / 2 - 60} y={by + 11} width={urlW} height={24} rx={12} fill={t.text} fillOpacity={0.06} />
        <Text x={bx + bw / 2 - 60} y={by + 28} anchor="middle" lines={ellipsize(c.domain, f.body, 13, urlW - 30)} font={f.body} size={13} fill={t.text} opacity={0.6} />
        {assets.screenshot ? (
          <image href={assets.screenshot} x={inner.x} y={inner.y} width={inner.w} height={inner.h} preserveAspectRatio="xMidYMin slice" />
        ) : (
          <g>
            <Mark x={inner.x + 36} y={inner.y + 30} size={26} assets={assets} name={c.name} uid={uid} fill={t.text} color="#ffffff" font={f.label} />
            <Text x={inner.x + 72} y={inner.y + 49} lines={ellipsize(c.name, f.label, 16, 200)} font={f.label} size={16} fill={t.text} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={inner.x + 330 + i * 70} y={inner.y + 39} width={46} height={8} rx={4} fill={t.text} fillOpacity={0.14} />
            ))}
            <Text x={inner.x + 36} y={mini.y} lines={mini.lines} font={f.display} size={mini.size} lh={mini.lh} tracking={-0.04} fill={t.text} />
            <rect x={inner.x + 36} y={mini.bottom + 22} width={128} height={38} rx={19} fill={t.accent} />
            <Text x={inner.x + 100} y={mini.bottom + 46} anchor="middle" lines="Get started" font={f.label} size={14} fill="#ffffff" />
            <rect x={inner.x + 176} y={mini.bottom + 22} width={110} height={38} rx={19} fill="none" stroke={t.text} strokeOpacity={0.2} />
            <Text x={inner.x + 231} y={mini.bottom + 46} anchor="middle" lines="Docs" font={f.label} size={14} fill={t.text} />
            <rect x={inner.x + 36} y={mini.bottom + 92} width={inner.w - 72} height={260} rx={12} fill={`url(#${uid}-card)`} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={inner.x + 64 + i * 200} y={mini.bottom + 124} width={176} height={110} rx={8} fill="#ffffff" fillOpacity={0.18 + i * 0.06} />
            ))}
          </g>
        )}
      </g>
      <rect x={bx} y={by} width={bw} height={bh} rx={14} fill="none" stroke={t.text} strokeOpacity={0.12} />
      {c.badge ? (
        <g>
          <rect x={M} y={100} width={measure(caps(c.badge), f.label, 12, 0.12) + 24} height={26} rx={13} fill={t.accent} fillOpacity={0.14} />
          <Text x={M + 12} y={117} lines={caps(c.badge)} font={f.label} size={12} tracking={0.12} fill={t.accent} />
        </g>
      ) : null}
      {o.showBrand ? <Text x={M} y={156} lines={c.name} font={f.label} size={20} tracking={-0.01} fill={t.text} opacity={0.65} /> : null}
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.68} />
      {o.showMeta ? <Text x={M} y={H - 52} lines={ellipsize(c.domain, f.label, 15, 420)} font={f.label} size={15} fill={t.text} /> : null}
    </Frame>
  )
}

export const showcase: TemplateDef = {
  id: 'showcase',
  number: 27,
  name: 'Showcase',
  collection: 'product',
  description: 'A browser window that bleeds off the canvas: your screenshot, or a live mini landing page.',
  fonts: {
    display: { family: 'Inter Tight', weight: 600 },
    label: { family: 'Inter Tight', weight: 500 },
    body: { family: 'Inter Tight', weight: 400 },
  },
  theme: { primary: '#1c2a4a', accent: '#f25a2a', background: '#f2f0eb', text: '#141414' },
  limits: { headline: 56, description: 110 },
  uses: ['screenshot', 'logo', 'badge'],
  render: Showcase,
}

/* ─────────────────────────── 28 · Announcement ─────────────────────────── */

function Announcement({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 740, maxLines: 3, max: 100 * s, min: 44, lineHeight: 0.98, tracking: -0.02, top: 176, maxHeight: 280 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 640, maxLines: 2, max: 21, min: 16, lineHeight: 1.4, top: head.bottom + 26 })
  const cx = 990
  const cy = 330
  const ticks = Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2)
  const badge = fitLine(c.badge || 'New', f.brand, 44, 18, 170, -0.03)
  const label = 'UPDATE'
  const lw = measure(label, f.mono, 12, 0.18) + 28
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.1} blend="overlay" />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={62} size={34} assets={assets} name={c.name} uid={uid} fill={t.accent} color={t.background} font={f.brand} shape="circle" />
          <Text x={M + 48} y={86} lines={c.name} font={f.brand} size={19} tracking={-0.01} fill={t.text} />
        </g>
      ) : null}
      <rect x={W - M - lw} y={64} width={lw} height={30} rx={15} fill="none" stroke={t.accent} />
      <Text x={W - M - lw / 2} y={84} anchor="middle" lines={label} font={f.mono} size={12} tracking={0.18} fill={t.accent} />
      <Text x={M - 4} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} />
      <g>
        {ticks.map((a, i) => (
          <line key={i} x1={cx + Math.cos(a) * 132} y1={cy + Math.sin(a) * 132} x2={cx + Math.cos(a) * (i % 4 ? 140 : 148)} y2={cy + Math.sin(a) * (i % 4 ? 140 : 148)} stroke={t.accent} strokeWidth={1.5} strokeOpacity={i % 4 ? 0.5 : 1} />
        ))}
        <circle cx={cx} cy={cy} r={118} fill={t.accent} />
        <circle cx={cx} cy={cy} r={106} fill="none" stroke={t.background} strokeOpacity={0.35} strokeDasharray="2 5" />
        <Text x={cx} y={cy - 36} anchor="middle" lines="RELEASED" font={f.mono} size={11} tracking={0.24} fill={t.background} />
        <Text x={cx} y={cy + vmetrics(f.brand, badge.size).cap / 2} anchor="middle" lines={badge.text} font={f.brand} size={badge.size} tracking={-0.03} fill={t.background} />
        <Text x={cx} y={cy + 52} anchor="middle" lines={fitLine(caps(c.date), f.mono, 12, 9, 150, 0.1).text} font={f.mono} size={12} tracking={0.1} fill={t.background} />
      </g>
      <line x1={M} x2={W - M} y1={H - 92} y2={H - 92} stroke={t.text} strokeOpacity={0.2} />
      {o.showMeta ? (
        <g>
          <Text x={M} y={H - 56} lines={c.domain} font={f.mono} size={14} fill={t.text} opacity={0.8} />
          <Text x={W - M} y={H - 56} anchor="end" lines={join([c.category, c.author], '  ·  ')} font={f.mono} size={14} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
    </Frame>
  )
}

export const announcement: TemplateDef = {
  id: 'announcement',
  number: 28,
  name: 'Announcement',
  collection: 'product',
  description: 'Product update with an italic serif headline and a ticked release seal carrying version and date.',
  fonts: {
    display: { family: 'Instrument Serif', weight: 400, style: 'italic' },
    brand: { family: 'Geist', weight: 600 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#f3eedf', accent: '#f2c14e', background: '#1d3a2e', text: '#f3eedf' },
  limits: { headline: 50, description: 100 },
  uses: ['logo', 'badge', 'date', 'category', 'author'],
  render: Announcement,
}

/* ─────────────────────────── 29 · Founder ─────────────────────────── */

function Founder({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const s = o.scale
  const ax = 240
  const ay = 300
  const ar = 136
  const x = 450
  const who = c.author || c.name
  const nameFit = fitLine(who, f.display, 68 * s, 34, W - x - 80, -0.03)
  const nameW = measure(nameFit.text, f.display, nameFit.size, -0.03)
  const head = blockTop(`“${c.headline}”`, { font: f.italic, maxWidth: W - x - 90, maxLines: 3, max: 38 * s, min: 22, lineHeight: 1.18, tracking: -0.01, top: 300, maxHeight: 150 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: W - x - 120, maxLines: 2, max: 18, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  const photo = assets.avatar || assets.logo
  const ul = `M ${x} 258 C ${x + nameW * 0.3} 248, ${x + nameW * 0.62} 266, ${x + Math.min(nameW, 520)} 252`
  return (
    <Frame background={t.background}>
      <Grain uid={uid} opacity={0.07} />
      <circle cx={ax + 14} cy={ay + 14} r={ar} fill="none" stroke={t.text} strokeWidth={1.4} />
      {photo ? (
        <Img href={photo} x={ax - ar} y={ay - ar} w={ar * 2} h={ar * 2} r={ar} uid={uid} />
      ) : (
        <g>
          <circle cx={ax} cy={ay} r={ar} fill={t.accent} />
          <Text x={ax} y={ay + vmetrics(f.display, 104).cap / 2} anchor="middle" lines={initials(who)} font={f.display} size={104} tracking={-0.04} fill={t.background} />
        </g>
      )}
      <Text x={x} y={170} lines={caps(join(['Founder', o.showBrand ? c.name : ''], '  ·  '))} font={f.label} size={13} tracking={0.22} fill={t.accent} />
      <Text x={x - 3} y={236} lines={nameFit.text} font={f.display} size={nameFit.size} tracking={-0.03} fill={t.text} />
      <path d={ul} fill="none" stroke={t.accent} strokeWidth={4} strokeLinecap="round" />
      <Text x={x - 10} y={head.y} lines={head.lines} font={f.italic} size={head.size} lh={head.lh} tracking={-0.01} fill={t.text} />
      <BlockText b={desc} x={x} font={f.body} fill={t.text} opacity={0.65} />
      {o.showMeta ? (
        <g>
          <line x1={x} x2={W - 80} y1={H - 92} y2={H - 92} stroke={t.text} strokeOpacity={0.2} />
          <Text x={x} y={H - 60} lines={c.domain} font={f.label} size={15} fill={t.text} />
          <Text x={W - 80} y={H - 60} anchor="end" lines={c.category} font={f.body} size={15} fill={t.text} opacity={0.6} />
        </g>
      ) : null}
    </Frame>
  )
}

export const founder: TemplateDef = {
  id: 'founder',
  number: 29,
  name: 'Founder',
  collection: 'product',
  description: 'A maker card: portrait (or monogram), name with a hand-drawn underline and a quoted tagline.',
  fonts: {
    display: { family: 'Fraunces', weight: 600 },
    italic: { family: 'Fraunces', weight: 300, style: 'italic' },
    label: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
  },
  theme: { primary: '#1d1915', accent: '#e2552b', background: '#efe6d8', text: '#1d1915' },
  limits: { headline: 80, description: 100 },
  uses: ['avatar', 'logo', 'author', 'category'],
  render: Founder,
}

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
  const titleFit = fitLine(total, f.display, 60 * s, 30, 820, -0.03)
  const ownerW = measure(owner, f.light, titleFit.size, -0.03)
  const main = c.description || c.headline
  const desc = blockTop(main, { font: f.body, maxWidth: 800, maxLines: 3, max: 28, min: 20, lineHeight: 1.38, top: 210 })
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
      <rect x={0} y={H - 18} width={W} height={18} fill={langColor} />
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
  theme: { primary: '#1f2328', accent: '#0969da', background: '#ffffff', text: '#1f2328' },
  limits: { headline: 80, description: 140 },
  uses: ['avatar', 'logo', 'stars', 'language', 'category'],
  render: Repository,
}

export const product = [launch, showcase, announcement, founder, repository]
