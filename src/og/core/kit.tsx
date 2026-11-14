import { Img, Text, type TextProps } from './primitives'
import { fit, measure, vmetrics, type FitOptions, type FitResult } from './text'
import type { FontRef, OgAssets } from './types'
import { initials } from './utils'

// Higher-level layout helpers shared by templates.

export interface Block extends FitResult {
  /** baseline of the first line */
  y: number
  /** baseline of the last line */
  last: number
  /** visual bottom (last baseline + descender allowance) */
  bottom: number
  lh: number
}

/** fit a block whose cap-height top sits at `top` */
export function blockTop(text: string, o: FitOptions & { top: number }): Block {
  const lh = o.lineHeight ?? 1.1
  const r = fit(text, o)
  const y = o.top + vmetrics(o.font, r.size).cap
  const last = y + (r.lines.length - 1) * r.size * lh
  return { ...r, y, last, bottom: last + r.size * 0.24, lh }
}

/** fit a block whose last baseline sits at `bottom` */
export function blockBottom(text: string, o: FitOptions & { bottom: number }): Block {
  const lh = o.lineHeight ?? 1.1
  const r = fit(text, o)
  const last = o.bottom
  const y = last - (r.lines.length - 1) * r.size * lh
  return { ...r, y, last, bottom: last + r.size * 0.24, lh }
}

/** fit a block vertically centred on `center` (cap-height to last baseline) */
export function blockCenter(text: string, o: FitOptions & { center: number }): Block {
  const lh = o.lineHeight ?? 1.1
  const r = fit(text, o)
  const cap = vmetrics(o.font, r.size).cap
  const h = cap + (r.lines.length - 1) * r.size * lh
  const y = o.center - h / 2 + cap
  const last = y + (r.lines.length - 1) * r.size * lh
  return { ...r, y, last, bottom: last + r.size * 0.24, lh }
}

/** render a Block with a Text element */
export function BlockText({ b, ...rest }: { b: Block } & Omit<TextProps, 'y' | 'lines' | 'size' | 'lh'>) {
  return <Text {...rest} y={b.y} lines={b.lines} size={b.size} lh={b.lh} />
}

/**
 * Text whose final punctuation mark (. ! ? …) is painted in an accent color —
 * a small editorial detail used by several templates.
 */
export function AccentTail({ tail, x, y, lines, font, size, lh = 1.1, tracking = 0, anchor = 'start', fill, ...rest }: TextProps & { tail: string }) {
  const list = typeof lines === 'string' ? [lines] : lines
  const lastLine = list[list.length - 1] ?? ''
  const m = /([.!?…]+)$/.exec(lastLine)
  if (!m) return <Text {...rest} x={x} y={y} lines={list} font={font} size={size} lh={lh} tracking={tracking} anchor={anchor} fill={fill} />
  const body = lastLine.slice(0, -m[1].length)
  const lastY = y + (list.length - 1) * size * lh
  const fullW = measure(lastLine, font, size, tracking)
  const startX = anchor === 'middle' ? x - fullW / 2 : anchor === 'end' ? x - fullW : x
  const bodyW = measure(body, font, size, tracking) + (body ? tracking * size : 0)
  return (
    <g>
      {list.length > 1 ? <Text {...rest} x={x} y={y} lines={list.slice(0, -1)} font={font} size={size} lh={lh} tracking={tracking} anchor={anchor} fill={fill} /> : null}
      {body ? <Text {...rest} x={startX} y={lastY} lines={body} font={font} size={size} tracking={tracking} fill={fill} /> : null}
      <Text {...rest} x={startX + bodyW} y={lastY} lines={m[1]} font={font} size={size} tracking={tracking} fill={tail} />
    </g>
  )
}

/** brand mark: uploaded logo, else a typographic monogram */
export function Mark({
  x,
  y,
  size,
  assets,
  name,
  uid,
  fill,
  color,
  font,
  shape = 'rounded',
  prefer = 'logo',
}: {
  x: number
  y: number
  size: number
  assets: OgAssets
  name: string
  uid: string
  fill: string
  color: string
  font: FontRef
  shape?: 'square' | 'rounded' | 'circle' | 'none'
  prefer?: 'logo' | 'favicon'
}) {
  const href = prefer === 'favicon' ? assets.favicon || assets.logo : assets.logo || assets.favicon
  const r = shape === 'circle' ? size / 2 : shape === 'rounded' ? size * 0.24 : 0
  if (href) return <Img href={href} x={x} y={y} w={size} h={size} r={r} uid={`${uid}-mark`} fit="contain" />
  const letter = initials(name).slice(0, 1)
  const fs = size * 0.56
  const cap = vmetrics(font, fs).cap
  return (
    <g>
      {shape !== 'none' ? <rect x={x} y={y} width={size} height={size} rx={r} fill={fill} /> : null}
      <Text x={x + size / 2} y={y + size / 2 + cap / 2} lines={letter} font={font} size={fs} fill={color} anchor="middle" />
    </g>
  )
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'
  )
}

export function join(parts: (string | undefined | null | false)[], sep = '  ·  ') {
  return parts.filter((p): p is string => !!p && !!p.trim()).join(sep)
}

export function caps(s: string) {
  return s.toUpperCase()
}

/** width helper re-exported for templates */
export const w = measure

export interface Span {
  text: string
  fill?: string
  font?: FontRef
  opacity?: number
}

/** inline run of differently-styled spans on one baseline */
export function Spans({ x, y, size, font, fill, parts, tracking = 0 }: { x: number; y: number; size: number; font: FontRef; fill: string; parts: Span[]; tracking?: number }) {
  let cx = x
  return (
    <g>
      {parts.map((p, i) => {
        const f = p.font ?? font
        const node = <Text key={i} x={cx} y={y} lines={p.text} font={f} size={size} tracking={tracking} fill={p.fill ?? fill} opacity={p.opacity} />
        cx += measure(p.text, f, size, tracking) + (p.text ? tracking * size : 0)
        return node
      })}
    </g>
  )
}

export function spansWidth(parts: Span[], font: FontRef, size: number, tracking = 0) {
  return parts.reduce((a, p) => a + measure(p.text, p.font ?? font, size, tracking) + (p.text ? tracking * size : 0), 0)
}

/** five-point star drawn as geometry (fonts rarely carry ★) */
export function Star({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.45 : r
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`)
  }
  return <polygon points={pts.join(' ')} fill={fill} />
}

/** arrow glyph drawn as strokes; dir in degrees (0 = right, -45 = up-right) */
export function Arrow({ x, y, size, stroke, dir = 0, width = 2 }: { x: number; y: number; size: number; stroke: string; dir?: number; width?: number }) {
  const h = size / 2
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir})`} stroke={stroke} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={-h} y1={0} x2={h} y2={0} />
      <polyline points={`${h * 0.15},${-h * 0.75} ${h},0 ${h * 0.15},${h * 0.75}`} />
    </g>
  )
}
