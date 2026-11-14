import { FONT_FACES, FONT_METRICS, METRIC_CHARS } from './fonts'
import type { FontRef } from './types'

// Deterministic text layout from precomputed advance widths. Identical results in the
// browser, in Node, and inside installed components — no canvas or DOM needed.

const INDEX = new Map<number, number>()
METRIC_CHARS.forEach((cp, i) => INDEX.set(cp, i))

/** nearest available face for a family/weight/style */
export function resolveFace(font: FontRef): Required<FontRef> {
  const style = font.style ?? 'normal'
  const faces = FONT_FACES.filter((f) => f.family === font.family)
  if (!faces.length) return { family: 'Inter Tight', weight: 400, style: 'normal' }
  const sameStyle = faces.filter((f) => f.style === style)
  const pool = sameStyle.length ? sameStyle : faces
  let best = pool[0]
  for (const f of pool) if (Math.abs(f.weight - font.weight) < Math.abs(best.weight - font.weight)) best = f
  return { family: best.family, weight: best.weight, style: best.style }
}

export function faceKey(font: FontRef) {
  const f = resolveFace(font)
  return `${f.family}|${f.weight}|${f.style}`
}

function table(font: FontRef) {
  return FONT_METRICS[faceKey(font)] ?? FONT_METRICS['Inter Tight|400|normal']
}

/** width in px of a single line */
export function measure(text: string, font: FontRef, size: number, tracking = 0): number {
  const t = table(font)
  let units = 0
  let n = 0
  for (const ch of text) {
    const i = INDEX.get(ch.codePointAt(0)!)
    let w = i === undefined ? -1 : t.a[i]
    if (w < 0) w = 560 // unknown glyph: average-ish advance
    units += w
    n++
  }
  return (units / 1000) * size + tracking * size * Math.max(0, n - 1)
}

export interface VMetrics {
  ascent: number
  descent: number
  cap: number
  xHeight: number
}
export function vmetrics(font: FontRef, size: number): VMetrics {
  const t = table(font)
  return { ascent: (t.asc / 1000) * size, descent: (Math.abs(t.dsc) / 1000) * size, cap: (t.cap / 1000) * size, xHeight: (t.xh / 1000) * size }
}

function breakWord(word: string, font: FontRef, size: number, maxWidth: number, tracking: number): string[] {
  const parts: string[] = []
  let cur = ''
  for (const ch of word) {
    if (cur && measure(cur + ch, font, size, tracking) > maxWidth) {
      parts.push(cur)
      cur = ch
    } else cur += ch
  }
  if (cur) parts.push(cur)
  return parts
}

/** greedy word wrap; respects explicit newlines, hard-breaks words longer than a line */
export function wrap(text: string, font: FontRef, size: number, maxWidth: number, tracking = 0): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    const words = para.split(/\s+/).filter(Boolean)
    if (!words.length) {
      out.push('')
      continue
    }
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (measure(candidate, font, size, tracking) <= maxWidth) {
        line = candidate
        continue
      }
      if (line) out.push(line)
      if (measure(word, font, size, tracking) > maxWidth) {
        const pieces = breakWord(word, font, size, maxWidth, tracking)
        out.push(...pieces.slice(0, -1))
        line = pieces[pieces.length - 1]
      } else line = word
    }
    if (line) out.push(line)
  }
  return out
}

export function ellipsize(text: string, font: FontRef, size: number, maxWidth: number, tracking = 0): string {
  if (measure(text, font, size, tracking) <= maxWidth) return text
  let t = text
  while (t.length > 1 && measure(t.trimEnd() + '…', font, size, tracking) > maxWidth) t = t.slice(0, -1)
  return t.trimEnd() + '…'
}

export interface FitOptions {
  font: FontRef
  maxWidth: number
  maxLines: number
  /** largest font size to try */
  max: number
  /** smallest font size allowed; below that the text is truncated with an ellipsis */
  min: number
  tracking?: number
  /** line-height multiple, used with maxHeight */
  lineHeight?: number
  maxHeight?: number
  step?: number
}

export interface FitResult {
  size: number
  lines: string[]
  truncated: boolean
  /** total block height using lineHeight */
  height: number
  width: number
}

/** largest size at which `text` fits in maxLines (and maxHeight); clamps with ellipsis at min */
export function fit(text: string, o: FitOptions): FitResult {
  const tracking = o.tracking ?? 0
  const lh = o.lineHeight ?? 1.1
  const step = o.step ?? Math.max(1, Math.round(o.max / 40))
  const clean = text.trim() || ' '
  const words = clean.split(/\s+/)
  for (let size = o.max; size >= o.min; size -= step) {
    // never hard-break a word while we can still shrink
    if (size - step >= o.min && words.some((wd) => measure(wd, o.font, size, tracking) > o.maxWidth)) continue
    const lines = wrap(clean, o.font, size, o.maxWidth, tracking)
    const height = lines.length * size * lh
    if (lines.length <= o.maxLines && (!o.maxHeight || height <= o.maxHeight)) {
      return { size, lines, truncated: false, height, width: Math.max(...lines.map((l) => measure(l, o.font, size, tracking))) }
    }
  }
  const size = o.min
  let maxLines = o.maxLines
  if (o.maxHeight) maxLines = Math.max(1, Math.min(maxLines, Math.floor(o.maxHeight / (size * lh))))
  const all = wrap(clean, o.font, size, o.maxWidth, tracking)
  const lines = all.slice(0, maxLines)
  if (all.length > maxLines) lines[maxLines - 1] = ellipsize(lines[maxLines - 1] + ' ' + all[maxLines], o.font, size, o.maxWidth, tracking)
  return {
    size,
    lines,
    truncated: all.length > maxLines,
    height: lines.length * size * lh,
    width: Math.max(...lines.map((l) => measure(l, o.font, size, tracking))),
  }
}

/** fit a single line by shrinking, then ellipsize */
export function fitLine(text: string, font: FontRef, max: number, min: number, maxWidth: number, tracking = 0) {
  let size = max
  while (size > min && measure(text, font, size, tracking) > maxWidth) size -= 1
  return { size, text: ellipsize(text, font, size, maxWidth, tracking) }
}

/** balance lines so the last line isn't a lonely word: shrink maxWidth while line count stays */
export function balance(text: string, font: FontRef, size: number, maxWidth: number, tracking = 0): string[] {
  const base = wrap(text, font, size, maxWidth, tracking)
  if (base.length < 2) return base
  let lo = maxWidth * 0.5
  let hi = maxWidth
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2
    if (wrap(text, font, size, mid, tracking).length > base.length) lo = mid
    else hi = mid
  }
  return wrap(text, font, size, hi, tracking)
}

/** wrap with a per-line max width (e.g. lines beside a drop cap); stops at maxLines with an ellipsis */
export function wrapVariable(text: string, font: FontRef, size: number, widthAt: (line: number) => number, maxLines: number, tracking = 0): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  let i = 0
  while (i < words.length) {
    const candidate = line ? `${line} ${words[i]}` : words[i]
    if (measure(candidate, font, size, tracking) <= widthAt(lines.length) || !line) {
      line = candidate
      i++
    } else {
      lines.push(line)
      line = ''
    }
  }
  if (line) lines.push(line)
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines)
    kept[maxLines - 1] = ellipsize(kept[maxLines - 1] + ' ' + lines[maxLines], font, size, widthAt(maxLines - 1), tracking)
    return kept
  }
  return lines
}
