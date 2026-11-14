import type { ReactNode } from 'react'
import { Arrow, BlockText, blockTop, caps, join, Mark, slugify, Spans } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, fitLine, measure, vmetrics } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix, shortSha } from '../core/utils'

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

/* ─────────────────────────── 07 · Codebase ─────────────────────────── */

function Codebase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const gutter = 92
  const x = gutter + 26
  const comment = mix(t.text, t.background, 0.52)
  const kw = t.primary
  const str = t.accent
  const numC = mix(t.text, t.background, 0.68)
  const s = o.scale
  const code = 21
  const step = 36
  const head = blockTop(c.headline, { font: f.display, maxWidth: W - x - 120, maxLines: 3, max: 70 * s, min: 32, lineHeight: 1.08, tracking: -0.03, top: 0 })
  const bigStep = head.size * 1.08
  type Row = { h: number; node: (y: number) => ReactNode }
  const rows: Row[] = []
  rows.push({ h: step, node: (y) => <Text x={x} y={y} lines="/**" font={f.mono} size={code} fill={comment} /> })
  head.lines.forEach((line) =>
    rows.push({
      h: bigStep,
      node: (y) => (
        <g>
          <Text x={x + 8} y={y} lines="*" font={f.mono} size={code} fill={comment} />
          <Text x={x + 40} y={y} lines={line} font={f.display} size={head.size} tracking={-0.03} fill={t.text} />
        </g>
      ),
    }),
  )
  rows.push({ h: step, node: (y) => <Text x={x + 8} y={y} lines="*/" font={f.mono} size={code} fill={comment} /> })
  const prop = (k: string, v: string) => (y: number) => (
    <Spans
      x={x}
      y={y}
      size={code}
      font={f.mono}
      fill={t.text}
      parts={[
        { text: `  ${k}: ` },
        { text: `"${ellipsize(v, f.mono, code, W - x - 220 - measure(`  ${k}: `, f.mono, code))}"`, fill: str },
        { text: ',', fill: comment },
      ]}
    />
  )
  rows.push({
    h: step,
    node: (y) => (
      <Spans x={x} y={y} size={code} font={f.mono} fill={t.text} parts={[{ text: 'export default ', fill: kw }, { text: 'defineProject' }, { text: '({', fill: comment }]} />
    ),
  })
  if (o.showBrand) rows.push({ h: step, node: prop('name', c.name) })
  if (c.description) rows.push({ h: step, node: prop('description', c.description) })
  if (o.showMeta && c.domain) rows.push({ h: step, node: prop('homepage', `https://${c.domain.replace(/^https?:\/\//, '')}`) })
  if (o.showMeta && c.author) rows.push({ h: step, node: prop('author', c.author) })
  if (o.showMeta && c.badge) rows.push({ h: step, node: prop('version', c.badge.replace(/^v/, '')) })
  rows.push({ h: step, node: (y) => <Text x={x} y={y} lines="})" font={f.mono} size={code} fill={comment} /> })

  const top = 116
  const bottom = H - 52
  let y = top
  const placed: { y: number; node: ReactNode; big: boolean }[] = []
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]
    y += i === 0 ? 0 : r.h
    if (y > bottom - 10 && i < rows.length - 1) continue
    placed.push({ y, node: r.node(y), big: r.h !== step })
  }
  // if the closing brace was dropped because space ran out, ensure last row is "})"
  return (
    <Frame background={t.background}>
      <rect x={0} y={0} width={W} height={60} fill={mix(t.background, t.text, 0.05)} />
      <rect x={0} y={0} width={210} height={60} fill={t.background} />
      <rect x={0} y={0} width={210} height={2.5} fill={t.accent} />
      <Text x={30} y={37} lines="README.md" font={f.ui} size={16} fill={t.text} />
      <Text x={240} y={37} lines="index.ts" font={f.ui} size={16} fill={comment} />
      <Text x={360} y={37} lines="package.json" font={f.ui} size={16} fill={comment} />
      {o.showBrand ? (
        <g>
          <Mark x={W - 64} y={16} size={28} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.ui} />
          <Text x={W - 78} y={36} anchor="end" lines={c.name} font={f.ui} size={16} fill={t.text} />
        </g>
      ) : null}
      <line x1={gutter} x2={gutter} y1={60} y2={H - 34} stroke={t.text} strokeOpacity={0.06} />
      {placed.map((p, i) => (
        <g key={i}>
          {p.big ? <rect x={gutter + 1} y={p.y - head.size * 0.86} width={W - gutter - 1} height={head.size * 1.08} fill={t.accent} fillOpacity={i === 1 ? 0.07 : 0} /> : null}
          <Text x={gutter - 26} y={p.y} anchor="end" lines={String(i + 1)} font={f.mono} size={15} fill={numC} />
          {p.node}
        </g>
      ))}
      <rect x={0} y={H - 34} width={W} height={34} fill={mix(t.background, t.text, 0.05)} />
      <Spans x={22} y={H - 12} size={13} font={f.mono} fill={comment} parts={[{ text: 'main', fill: t.text }, { text: `   ${c.category || 'TypeScript'}` }]} />
      <Text x={W - 22} y={H - 12} anchor="end" lines={join([o.showMeta ? c.domain : '', 'Ln 3, Col 28', 'UTF-8'], '   ')} font={f.mono} size={13} fill={comment} />
    </Frame>
  )
}

export const codebase: TemplateDef = {
  id: 'codebase',
  number: 7,
  name: 'Codebase',
  collection: 'developer',
  description: 'Your headline as a doc-comment in a light editor, with line numbers and a real config object.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    mono: { family: 'Geist Mono', weight: 400 },
    ui: { family: 'Geist', weight: 500 },
  },
  theme: { primary: '#1f6f5c', accent: '#c2410c', background: '#faf8f3', text: '#1c1b19' },
  limits: { headline: 56, description: 60 },
  uses: ['logo', 'author', 'badge', 'category'],
  render: Codebase,
}

/* ─────────────────────────── 08 · Git Commit ─────────────────────────── */

function GitCommit({ content: c, theme: t, options: o, fonts: f }: TemplateProps) {
  const x = 262
  const dim = mix(t.text, t.background, 0.5)
  const sha = shortSha(c.name + c.headline)
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: W - x - 80, maxLines: 3, max: 66 * s, min: 32, lineHeight: 1.04, tracking: -0.035, top: 268, maxHeight: 200 })
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
      <Text x={x - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
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

/* ─────────────────────────── 09 · Blueprint ─────────────────────────── */

function Blueprint({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const ink = t.text
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 620, maxLines: 3, max: 66 * s, min: 32, lineHeight: 1.04, tracking: -0.02, top: 112, maxHeight: 220 })
  const dimY = head.bottom + 30
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 560, maxLines: 3, max: 17, min: 14, lineHeight: 1.5, top: dimY + 44 })
  const cx = 940
  const cy = 236
  const tb = { x: 742, y: 452, w: 1200 - 742 - 48, h: 130 }
  const cell = (x: number, y: number, label: string, value: string, wv: number) => (
    <g>
      <Text x={x + 10} y={y + 17} lines={label} font={f.mono} size={10} tracking={0.12} fill={ink} opacity={0.6} />
      <Text x={x + 10} y={y + 37} lines={fitLine(value || '—', f.monoBold, 15, 10, wv - 20).text} font={f.monoBold} size={fitLine(value || '—', f.monoBold, 15, 10, wv - 20).size} fill={ink} />
    </g>
  )
  return (
    <Frame background={t.background}>
      <defs>
        <pattern id={`${uid}-minor`} width={24} height={24} patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke={ink} strokeOpacity={0.07} strokeWidth={1} />
        </pattern>
        <pattern id={`${uid}-major`} width={120} height={120} patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" stroke={ink} strokeOpacity={0.16} strokeWidth={1} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-minor)`} />
      <rect width={W} height={H} fill={`url(#${uid}-major)`} />
      <rect x={24} y={24} width={W - 48} height={H - 48} fill="none" stroke={ink} strokeWidth={2} />
      <rect x={32} y={32} width={W - 64} height={H - 64} fill="none" stroke={ink} strokeOpacity={0.5} strokeWidth={0.8} />
      {Array.from({ length: 8 }, (_, i) => (
        <Text key={i} x={32 + ((W - 64) / 8) * (i + 0.5)} y={30 - 10} anchor="middle" lines={String(i + 1)} font={f.mono} size={10} fill={ink} opacity={0.6} />
      ))}
      {['A', 'B', 'C', 'D'].map((l, i) => (
        <Text key={l} x={12} y={32 + ((H - 64) / 4) * (i + 0.5) + 4} anchor="middle" lines={l} font={f.mono} size={10} fill={ink} opacity={0.6} />
      ))}
      <Text x={88} y={84} lines={caps(join(['Drawing', o.showBrand ? c.name : '', c.category], '  /  '))} font={f.mono} size={12} tracking={0.14} fill={t.accent} />
      <Text x={86} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={ink} />
      <g stroke={t.accent} strokeWidth={1.2}>
        <line x1={88} x2={88 + head.width} y1={dimY} y2={dimY} />
        <line x1={88} x2={88} y1={dimY - 9} y2={dimY + 9} />
        <line x1={88 + head.width} x2={88 + head.width} y1={dimY - 9} y2={dimY + 9} />
      </g>
      <rect x={88 + head.width / 2 - 44} y={dimY - 11} width={88} height={22} fill={t.background} />
      <Text x={88 + head.width / 2} y={dimY + 5} anchor="middle" lines={`${Math.round(head.width)} PX`} font={f.mono} size={12} tracking={0.08} fill={t.accent} />
      <BlockText b={desc} x={88} font={f.mono} fill={ink} opacity={0.85} />
      <g fill="none" stroke={ink}>
        <circle cx={cx} cy={cy} r={124} strokeWidth={1.6} />
        <circle cx={cx} cy={cy} r={62} strokeWidth={1} strokeDasharray="6 6" />
        <rect x={cx - 88} y={cy - 88} width={176} height={176} strokeWidth={1} strokeOpacity={0.6} transform={`rotate(45 ${cx} ${cy})`} />
        <line x1={cx - 160} x2={cx + 160} y1={cy} y2={cy} strokeWidth={0.8} strokeDasharray="14 4 2 4" strokeOpacity={0.7} />
        <line x1={cx} x2={cx} y1={cy - 160} y2={cy + 160} strokeWidth={0.8} strokeDasharray="14 4 2 4" strokeOpacity={0.7} />
      </g>
      <g stroke={t.accent} strokeWidth={1.2} fill="none">
        <line x1={cx} y1={cy} x2={cx + 124 * Math.cos(-0.7)} y2={cy + 124 * Math.sin(-0.7)} />
        <line x1={cx - 124} x2={cx + 124} y1={cy - 150} y2={cy - 150} />
        <line x1={cx - 124} x2={cx - 124} y1={cy - 158} y2={cy - 142} />
        <line x1={cx + 124} x2={cx + 124} y1={cy - 158} y2={cy - 142} />
      </g>
      <rect x={cx - 30} y={cy - 161} width={60} height={22} fill={t.background} />
      <Text x={cx} y={cy - 145} anchor="middle" lines="Ø 248" font={f.mono} size={12} fill={t.accent} />
      <Text x={cx + 64} y={cy - 64} lines="R 124" font={f.mono} size={12} fill={t.accent} />
      <circle cx={cx} cy={cy} r={4} fill={t.accent} />
      <g>
        <rect x={tb.x} y={tb.y} width={tb.w} height={tb.h} fill={t.background} stroke={ink} strokeWidth={1.6} />
        <line x1={tb.x} x2={tb.x + tb.w} y1={tb.y + 44} y2={tb.y + 44} stroke={ink} strokeWidth={0.8} />
        <line x1={tb.x} x2={tb.x + tb.w} y1={tb.y + 88} y2={tb.y + 88} stroke={ink} strokeWidth={0.8} />
        <line x1={tb.x + tb.w / 2} x2={tb.x + tb.w / 2} y1={tb.y + 44} y2={tb.y + 88} stroke={ink} strokeWidth={0.8} />
        {[1, 2].map((i) => (
          <line key={i} x1={tb.x + (tb.w / 3) * i} x2={tb.x + (tb.w / 3) * i} y1={tb.y + 88} y2={tb.y + tb.h} stroke={ink} strokeWidth={0.8} />
        ))}
        {cell(tb.x, tb.y, 'PROJECT', o.showBrand ? c.name : c.domain, tb.w)}
        {cell(tb.x, tb.y + 44, 'DRAWN BY', c.author, tb.w / 2)}
        {cell(tb.x + tb.w / 2, tb.y + 44, 'DATE', c.date, tb.w / 2)}
        {cell(tb.x, tb.y + 88, 'SHEET', '01 / 01', tb.w / 3)}
        {cell(tb.x + tb.w / 3, tb.y + 88, 'SCALE', '1 : 1', tb.w / 3)}
        {cell(tb.x + (2 * tb.w) / 3, tb.y + 88, 'REV', c.badge, tb.w / 3)}
      </g>
      {o.showMeta ? <Text x={88} y={H - 62} lines={caps(c.domain)} font={f.mono} size={12} tracking={0.16} fill={ink} opacity={0.7} /> : null}
    </Frame>
  )
}

export const blueprint: TemplateDef = {
  id: 'blueprint',
  number: 9,
  name: 'Blueprint',
  collection: 'developer',
  description: 'Drafting sheet with grid, zone markers, a dimensioned headline, schematic and a title block.',
  fonts: {
    display: { family: 'Space Grotesk', weight: 500 },
    mono: { family: 'IBM Plex Mono', weight: 400 },
    monoBold: { family: 'IBM Plex Mono', weight: 600 },
  },
  theme: { primary: '#ffffff', accent: '#ffd36b', background: '#1b4c8c', text: '#f4f7ff' },
  limits: { headline: 56, description: 120 },
  uses: ['author', 'date', 'badge', 'category'],
  render: Blueprint,
}

/* ─────────────────────────── 10 · System ─────────────────────────── */

function System({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 470, maxLines: 4, max: 60 * s, min: 30, lineHeight: 1.02, tracking: -0.035, top: 132, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 440, maxLines: 3, max: 20, min: 16, lineHeight: 1.42, top: head.bottom + 24 })
  const line = mix(t.text, t.background, 0.55)
  type N = { x: number; y: number; w: number; h: number; label: string; sub?: string; core?: boolean }
  const core: N = { x: 790, y: 262, w: 236, h: 96, label: c.name, sub: c.badge, core: true }
  const nodes: N[] = [
    { x: 600, y: 120, w: 150, h: 56, label: 'client', sub: 'browser' },
    { x: 600, y: 452, w: 150, h: 56, label: 'edge', sub: 'cdn' },
    { x: 980, y: 104, w: 168, h: 56, label: 'api', sub: c.domain || 'https' },
    { x: 1000, y: 470, w: 148, h: 56, label: 'store', sub: 'kv' },
  ]
  const conn = [
    `M 675 176 L 675 310 L 790 310`,
    `M 675 452 L 675 334 L 790 334`,
    `M 1064 160 L 1064 262`,
    `M 1074 470 L 1074 358`,
  ]
  const labels = [
    { x: 686, y: 248, t: 'https' },
    { x: 686, y: 412, t: 'cache' },
    { x: 1074, y: 220, t: 'rpc' },
    { x: 1084, y: 424, t: 'write' },
  ]
  return (
    <Frame background={t.background}>
      <defs>
        <pattern id={`${uid}-dots`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={1.2} cy={1.2} r={1.2} fill={t.text} fillOpacity={0.14} />
        </pattern>
        <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={8} markerHeight={8} orient="auto-start-reverse">
          <path d="M 0 1 L 9 5 L 0 9 z" fill={line} />
        </marker>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-dots)`} />
      <Text x={M} y={76} lines={caps(join(['System', o.showBrand ? c.name : '', 'v' === c.badge ? '' : c.badge], ' / '))} font={f.mono} size={13} tracking={0.12} fill={t.text} opacity={0.7} />
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.035} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.72} />
      {o.showMeta ? <Text x={M} y={H - 56} lines={join([c.domain, c.category], '  ·  ')} font={f.mono} size={14} fill={t.text} opacity={0.6} /> : null}
      {conn.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={line} strokeWidth={1.6} markerEnd={`url(#${uid}-arrow)`} strokeDasharray={i === 1 ? '5 5' : undefined} />
      ))}
      {labels.map((l) => (
        <Text key={l.t} x={l.x} y={l.y} lines={l.t} font={f.mono} size={12} fill={t.text} opacity={0.6} />
      ))}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={10} fill={t.background} stroke={t.text} strokeOpacity={0.35} strokeWidth={1.2} />
          <circle cx={n.x + 18} cy={n.y + n.h / 2} r={4} fill={t.text} fillOpacity={0.35} />
          <Text x={n.x + 32} y={n.y + 25} lines={n.label} font={f.monoBold} size={14} fill={t.text} />
          <Text x={n.x + 32} y={n.y + 43} lines={ellipsize(n.sub ?? '', f.mono, 12, n.w - 44)} font={f.mono} size={12} fill={t.text} opacity={0.55} />
        </g>
      ))}
      <rect x={core.x + 6} y={core.y + 8} width={core.w} height={core.h} rx={14} fill={t.accent} fillOpacity={0.25} />
      <rect x={core.x} y={core.y} width={core.w} height={core.h} rx={14} fill={t.primary} />
      <circle cx={core.x + 26} cy={core.y + 32} r={6} fill={t.accent} />
      <circle cx={core.x + 26} cy={core.y + 32} r={12} fill={t.accent} fillOpacity={0.25} />
      <Text x={core.x + 46} y={core.y + 40} lines={fitLine(core.label, f.display, 26, 14, core.w - 64).text} font={f.display} size={fitLine(core.label, f.display, 26, 14, core.w - 64).size} tracking={-0.02} fill={t.background} />
      <Text x={core.x + 22} y={core.y + 74} lines={ellipsize(join(['service', core.sub], ' · '), f.mono, 13, core.w - 40)} font={f.mono} size={13} fill={t.background} opacity={0.7} />
      <Arrow x={core.x + core.w - 26} y={core.y + 70} size={14} stroke={t.accent} dir={-45} />
    </Frame>
  )
}

export const system: TemplateDef = {
  id: 'system',
  number: 10,
  name: 'System',
  collection: 'developer',
  description: 'Architecture-diagram language: dot grid, connected service nodes, arrows and technical labels.',
  fonts: {
    display: { family: 'Hanken Grotesk', weight: 700 },
    body: { family: 'Hanken Grotesk', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
    monoBold: { family: 'Geist Mono', weight: 500 },
  },
  theme: { primary: '#16171a', accent: '#ff5a36', background: '#f3f2ee', text: '#16171a' },
  limits: { headline: 56, description: 110 },
  uses: ['badge', 'category'],
  render: System,
}

export const developer = [terminal, codebase, gitCommit, blueprint, system]
