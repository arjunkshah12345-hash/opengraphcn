import type { ReactElement } from 'react'
import { fontUrl, FONT_FACES } from './fonts'
import { renderToSvgString } from './markup'
import { OG_HEIGHT, OG_WIDTH } from './types'

// Browser export pipeline: React SVG -> standalone SVG string (fonts + images embedded)
// -> <img> -> <canvas> -> PNG. No screenshots, no DOM cloning, no tainted canvases.

export type FontResolver = (face: { family: string; weight: number; style: string; slug: string }) => string

/** default: Fontsource CDN (CORS-enabled) */
export const cdnFonts: FontResolver = (face) => fontUrl({ slug: face.slug, weight: face.weight, style: face.style as 'normal' | 'italic' })

const fontCache = new Map<string, Promise<string>>()

async function toDataUrl(url: string, mime?: string): Promise<string> {
  const res = await fetch(url, { mode: 'cors' })
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`)
  const buf = await res.arrayBuffer()
  const type = mime ?? res.headers.get('content-type') ?? 'application/octet-stream'
  return `data:${type};base64,${bufferToBase64(buf)}`
}

function bufferToBase64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  return btoa(bin)
}

function decodeEntities(s: string) {
  return s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
}

/** faces referenced by <text> elements in an SVG string */
export function usedFaces(svg: string) {
  const seen = new Map<string, { family: string; weight: number; style: string; slug: string }>()
  for (const m of svg.matchAll(/<text\b[^>]*>/g)) {
    const tag = decodeEntities(m[0])
    const family = /font-family="'?([^"']+)'?"/.exec(tag)?.[1]
    if (!family) continue
    const weight = Number(/font-weight="(\d+)"/.exec(tag)?.[1] ?? 400)
    const style = /font-style="(\w+)"/.exec(tag)?.[1] ?? 'normal'
    const face = FONT_FACES.find((f) => f.family === family && f.weight === weight && f.style === style)
    if (face) seen.set(`${family}|${weight}|${style}`, face)
  }
  return [...seen.values()]
}

export interface SvgExportOptions {
  fonts?: FontResolver
  /** embed fonts as base64 @font-face (default true) */
  embedFonts?: boolean
}

/** render an <OgImage/> element into a fully self-contained SVG document */
export async function renderSvg(element: ReactElement, opts: SvgExportOptions = {}): Promise<string> {
  let svg = renderToSvgString(element)
  // strip interactive attributes that make no sense in a file
  svg = svg.replace(/^<svg[^>]*>/, (tag) => tag.replace(/ (class|role|aria-label|style)="[^"]*"/g, ''))
  if (!svg.includes('xmlns:xlink')) svg = svg.replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')

  // inline remote images so the SVG is portable and the canvas stays untainted
  const remote = [...new Set([...svg.matchAll(/href="(https?:[^"]+)"/g)].map((m) => decodeEntities(m[1])))]
  for (const url of remote) {
    try {
      const data = await toDataUrl(url)
      svg = svg.split(`href="${url.replace(/&/g, '&amp;')}"`).join(`href="${data}"`)
    } catch {
      svg = svg.split(`href="${url.replace(/&/g, '&amp;')}"`).join('href=""')
    }
  }

  if (opts.embedFonts !== false) {
    const resolve = opts.fonts ?? cdnFonts
    const css: string[] = []
    for (const face of usedFaces(svg)) {
      const url = resolve(face)
      const key = url
      if (!fontCache.has(key)) fontCache.set(key, toDataUrl(url, 'font/woff2'))
      try {
        const data = await fontCache.get(key)!
        css.push(`@font-face{font-family:'${face.family}';font-weight:${face.weight};font-style:${face.style};src:url(${data}) format('woff2');}`)
      } catch {
        fontCache.delete(key)
      }
    }
    if (css.length) svg = svg.replace(/(<svg[^>]*>)/, `$1<defs><style>${css.join('')}</style></defs>`)
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'sync'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not rasterize SVG'))
    img.src = src
  })
}

/** rasterize a standalone SVG string to a PNG blob at exactly width×height (× scale) */
export async function svgToPng(svg: string, scale = 1): Promise<Blob> {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = OG_WIDTH * scale
    canvas.height = OG_HEIGHT * scale
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    // Some engines finish decoding embedded fonts a tick after onload — draw twice.
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    await new Promise((r) => setTimeout(r, 60))
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png'))
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function renderPng(element: ReactElement, opts: SvgExportOptions & { scale?: number } = {}) {
  return svgToPng(await renderSvg(element, opts), opts.scale ?? 1)
}

export function download(data: Blob | string, filename: string, type = 'application/octet-stream') {
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
