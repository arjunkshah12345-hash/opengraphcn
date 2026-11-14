import type { Outliner } from './primitives'

// Converts text to glyph outlines using fontkit fonts you load yourself (server side).
// Keeps this file free of a hard fontkit import so the core stays browser-light.

interface GlyphLike {
  advanceWidth: number
  path: { scale(x: number, y?: number): { translate(x: number, y: number): { toSVG(): string } } }
}
export interface FontkitLike {
  unitsPerEm: number
  glyphForCodePoint(cp: number): GlyphLike
  hasGlyphForCodePoint(cp: number): boolean
}

/** fonts: map of "Family|weight|style" -> fontkit font */
export function createOutliner(fonts: Record<string, FontkitLike>, fallback?: FontkitLike): Outliner {
  return ({ text, font, size, tracking, x, y }) => {
    const f = fonts[`${font.family}|${font.weight}|${font.style}`] ?? fallback
    if (!f) return ''
    const s = size / f.unitsPerEm
    let pen = x
    const parts: string[] = []
    for (const ch of text) {
      const cp = ch.codePointAt(0)!
      const src = f.hasGlyphForCodePoint(cp) ? f : (fallback ?? f)
      const glyph = src.glyphForCodePoint(cp)
      const gs = size / src.unitsPerEm
      const d = glyph.path.scale(gs, -gs).translate(pen, y).toSVG()
      if (d) parts.push(d)
      pen += glyph.advanceWidth * (src === f ? s : gs) + tracking * size
    }
    return parts.join('')
  }
}
