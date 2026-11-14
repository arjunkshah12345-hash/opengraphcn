import { FONT_FACES } from '../og/core/fonts'
import type { FontResolver } from '../og/core/export'
import { FONT_URLS } from './font-urls'

let registered = false

/** register every template face with the document (loaded lazily by the browser on first use) */
export function registerFonts() {
  if (registered || typeof document === 'undefined') return
  registered = true
  for (const f of FONT_FACES) {
    const url = FONT_URLS[`${f.family}|${f.weight}|${f.style}`]
    if (!url) continue
    const face = new FontFace(f.family, `url(${url}) format('woff2')`, { weight: String(f.weight), style: f.style, display: 'swap' })
    document.fonts.add(face)
  }
}

/** load all faces up-front (used before rasterizing previews) */
export async function loadFonts(families?: string[]) {
  registerFonts()
  const faces = [...document.fonts].filter((f) => !families || families.includes(f.family.replace(/"/g, '')))
  await Promise.allSettled(faces.map((f) => f.load()))
}

/** exports embed the same woff2 files the site already serves (same-origin, no CDN round-trip) */
export const siteFonts: FontResolver = (face) => new URL(FONT_URLS[`${face.family}|${face.weight}|${face.style}`], location.href).href
