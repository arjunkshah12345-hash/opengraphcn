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

/* ───────────── texture helpers (pure SVG, render the same in browsers and resvg) ───────────── */

const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64)

/** ordered (Bayer 8×8) dither threshold for a cell */
export function bayer(ix: number, iy: number) {
  return BAYER8[(iy & 7) * 8 + (ix & 7)]
}

/**
 * Path data for an ordered-dither field: one square per cell where `f(u, v)` (0–1, u/v across the
 * region) beats the Bayer threshold. One <path>, so even dense fields stay small.
 */
export function ditherPath({ x, y, w, h, cell, dot = 0.72, f }: { x: number; y: number; w: number; h: number; cell: number; dot?: number; f: (u: number, v: number) => number }) {
  const cols = Math.floor(w / cell)
  const rows = Math.floor(h / cell)
  // whole-pixel squares keep browsers and resvg from anti-aliasing the cell edges differently
  const s = Math.max(1, Math.round(cell * dot))
  const off = Math.floor((cell - s) / 2)
  let d = ''
  for (let iy = 0; iy < rows; iy++) {
    for (let ix = 0; ix < cols; ix++) {
      if (f((ix + 0.5) / cols, (iy + 0.5) / rows) > bayer(ix, iy)) {
        d += `M${Math.round((x + ix * cell + off) * 100) / 100} ${Math.round((y + iy * cell + off) * 100) / 100}h${s}v${s}h-${s}z`
      }
    }
  }
  return d
}

/** path data for a regular dot grid (tiny squares), used as a quiet background texture */
export function dotGridPath({ x, y, w, h, gap, size = 1.6 }: { x: number; y: number; w: number; h: number; gap: number; size?: number }) {
  let d = ''
  for (let iy = y; iy <= y + h; iy += gap) for (let ix = x; ix <= x + w; ix += gap) d += `M${ix} ${iy}h${size}v${size}h-${size}z`
  return d
}

/** a soft, blurred colour blob (for gradient meshes and glows) */
export function Blob({ uid, id, cx, cy, rx, ry = rx, fill, blur = 80, opacity = 1 }: { uid: string; id: string; cx: number; cy: number; rx: number; ry?: number; fill: string; blur?: number; opacity?: number }) {
  const fid = `${uid}-blob-${id}`
  return (
    <g>
      <filter id={fid} x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation={blur} />
      </filter>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} opacity={opacity} filter={`url(#${fid})`} />
    </g>
  )
}

/* ───────────── hero pieces ───────────── */

/** logo (uploaded or monogram) + project name, the lockup most cards lead with */
export function Brand({ x, y, size = 36, assets, name, uid, font, fill, bg, anchor = 'start', gap = 0.38, shape = 'rounded' }: { x: number; y: number; size?: number; assets: OgAssets; name: string; uid: string; font: FontRef; fill: string; bg: string; anchor?: 'start' | 'middle'; gap?: number; shape?: 'rounded' | 'circle' | 'square' }) {
  const fs = size * 0.72
  const tw = measure(name, font, fs, -0.02)
  const total = size + size * gap + tw
  const x0 = anchor === 'middle' ? x - total / 2 : x
  const cap = vmetrics(font, fs).cap
  return (
    <g>
      <Mark x={x0} y={y} size={size} assets={assets} name={name} uid={`${uid}-brand`} fill={fill} color={bg} font={font} shape={shape} />
      <Text x={x0 + size + size * gap} y={y + size / 2 + cap / 2} lines={name} font={font} size={fs} tracking={-0.02} fill={fill} />
    </g>
  )
}

/** hairline layout guides that run off the canvas, with small crosses where they meet (blueprint / docs look) */
export function Guides({ xs, ys, stroke, opacity = 0.14, cross = true }: { xs: number[]; ys: number[]; stroke: string; opacity?: number; cross?: boolean }) {
  return (
    <g stroke={stroke} strokeOpacity={opacity} strokeWidth={1}>
      {xs.map((x) => (
        <line key={`x${x}`} x1={x} x2={x} y1={0} y2={630} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={0} x2={1200} y1={y} y2={y} />
      ))}
      {cross
        ? xs.flatMap((x) =>
            ys.map((y) => (
              <path key={`c${x}-${y}`} d={`M${x - 7} ${y}h14M${x} ${y - 7}v14`} strokeOpacity={Math.min(1, opacity * 3)} />
            )),
          )
        : null}
    </g>
  )
}

/** a glossy 3D ring (torus seen at an angle), built from stacked gradient ellipses */
export function Torus({ uid, cx, cy, r, thick, tilt = 0.82, rot = -24, colors }: { uid: string; cx: number; cy: number; r: number; thick: number; tilt?: number; rot?: number; colors: [string, string, string] }) {
  const id = `${uid}-torus`
  const layers = 34
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors[2]} />
          <stop offset="0.45" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[0]} />
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={thick * 0.9} />
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={1.2} />
        </filter>
      </defs>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * tilt} fill="none" stroke={colors[1]} strokeWidth={thick * 1.2} opacity={0.45} filter={`url(#${id}-glow)`} />
      <g filter={`url(#${id}-soft)`}>
        {Array.from({ length: layers }, (_, i) => {
          const k = i / (layers - 1)
          const a = Math.cos(k * Math.PI)
          return <ellipse key={i} cx={cx} cy={cy - a * thick * 0.42} rx={r + Math.sin(k * Math.PI) * thick * 0.5} ry={(r + Math.sin(k * Math.PI) * thick * 0.5) * tilt} fill="none" stroke={`url(#${id}-g)`} strokeWidth={thick / layers + 2.2} opacity={0.18 + 0.82 * Math.sin(k * Math.PI) ** 0.6} />
        })}
      </g>
      <ellipse cx={cx} cy={cy - thick * 0.38} rx={r} ry={r * tilt} fill="none" stroke="#ffffff" strokeWidth={2.2} strokeOpacity={0.55} strokeDasharray={`${r * 1.3} ${r * 10}`} strokeDashoffset={r * 2.4} strokeLinecap="round" />
    </g>
  )
}

/** a silk ribbon: a bundle of hairline curves that twist between two paths */
export function ribbonPaths({ n = 60, from, to, ctrl1, ctrl2, spread = 120, twist = 1 }: { n?: number; from: [number, number]; to: [number, number]; ctrl1: [number, number]; ctrl2: [number, number]; spread?: number; twist?: number }) {
  const out: string[] = []
  const r = (v: number) => Math.round(v * 10) / 10
  for (let i = 0; i < n; i++) {
    const k = i / (n - 1) - 0.5
    const s1 = Math.sin(twist * Math.PI * 0.5) * spread * k
    const s2 = -spread * k * 1.2
    out.push(`M${r(from[0])} ${r(from[1] + spread * k * 0.3)}C${r(ctrl1[0] + s1 * 0.4)} ${r(ctrl1[1] + s1)} ${r(ctrl2[0] - s2 * 0.3)} ${r(ctrl2[1] + s2)} ${r(to[0])} ${r(to[1] + spread * k * 0.5)}`)
  }
  return out
}

/** a glossy diagonal light beam (glass bar catching light) */
export function Beam({ uid, id, x, y, w, h, angle, color, opacity = 1, blur = 18 }: { uid: string; id: string; x: number; y: number; w: number; h: number; angle: number; color: string; opacity?: number; blur?: number }) {
  const gid = `${uid}-beam-${id}`
  return (
    <g transform={`rotate(${angle} ${x + w / 2} ${y + h / 2})`} opacity={opacity}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.5" stopColor={color} />
          <stop offset="0.56" stopColor="#ffffff" stopOpacity={0.9} />
          <stop offset="0.62" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={`${gid}-f`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${gid})`} filter={`url(#${gid}-f)`} />
    </g>
  )
}
