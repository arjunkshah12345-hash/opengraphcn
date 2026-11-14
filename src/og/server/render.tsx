import { Resvg } from '@resvg/resvg-js'
import * as fontkit from 'fontkit'
import { FONT_FACES, fontUrl } from '../core/fonts'
import { createOutliner, type FontkitLike } from '../core/outline'
import { renderToSvgString } from '../core/markup'
import { OgImage, resolveFonts, type OgImageProps } from '../core/render'
import { resolveFace } from '../core/text'
import type { TemplateDef } from '../core/types'

// Server-side PNG rendering for Next.js routes (Node runtime) or any Node script.
// Same SVG as the browser; text is outlined with fontkit so resvg needs no fonts.

const fontCache = new Map<string, Promise<FontkitLike>>()

async function loadFace(family: string, weight: number, style: 'normal' | 'italic', slug: string): Promise<FontkitLike> {
  const key = `${family}|${weight}|${style}`
  if (!fontCache.has(key)) {
    fontCache.set(
      key,
      fetch(fontUrl({ slug, weight, style }, 'ttf')).then(async (res) => {
        if (!res.ok) throw new Error(`opengraphcn: could not load font ${key} (${res.status})`)
        return fontkit.create(Buffer.from(await res.arrayBuffer())) as unknown as FontkitLike
      }),
    )
  }
  return fontCache.get(key)!.catch((e) => {
    fontCache.delete(key)
    throw e
  })
}

async function inlineImages(assets: OgImageProps['assets'] = {}) {
  const out: Record<string, string | undefined> = {}
  for (const [k, v] of Object.entries(assets)) {
    if (!v || v.startsWith('data:')) {
      out[k] = v
      continue
    }
    const res = await fetch(v)
    if (!res.ok) throw new Error(`opengraphcn: could not fetch image ${v} (${res.status})`)
    const type = res.headers.get('content-type') ?? 'image/png'
    out[k] = `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`
  }
  return out
}

/** render a template to an SVG string with outlined text */
export async function renderOgSvg(template: TemplateDef, props: OgImageProps = {}) {
  const faces = Object.values(resolveFonts(template, props.options)).map((f) => resolveFace(f))
  const fonts: Record<string, FontkitLike> = {}
  await Promise.all(
    faces.map(async (f) => {
      const def = FONT_FACES.find((x) => x.family === f.family && x.weight === f.weight && x.style === f.style)
      if (def) fonts[`${f.family}|${f.weight}|${f.style}`] = await loadFace(f.family, f.weight, f.style, def.slug)
    }),
  )
  const assets = await inlineImages(props.assets)
  return renderToSvgString(<OgImage template={template} id="og" {...props} assets={assets} />, { outline: createOutliner(fonts, Object.values(fonts)[0]) })
}

/** render a template to a 1200×630 PNG (Uint8Array) */
export async function renderOgPng(template: TemplateDef, props: OgImageProps = {}, scale = 1): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await renderOgSvg(template, props)
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 * scale }, font: { loadSystemFonts: false } }).render().asPng()
  return Uint8Array.from(png)
}
