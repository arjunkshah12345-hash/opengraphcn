import fs from 'node:fs'
import path from 'node:path'
import * as fontkit from 'fontkit'
import { renderToStaticMarkup } from 'react-dom/server'
import { Resvg } from '@resvg/resvg-js'
import { FONT_FACES } from '../../src/og/core/fonts'
import { createOutliner, type FontkitLike } from '../../src/og/core/outline'
import { OgRenderMode } from '../../src/og/core/primitives'
import { OgImage, type OgImageProps } from '../../src/og/core/render'
import type { TemplateDef } from '../../src/og/core/types'

let outliner: ReturnType<typeof createOutliner> | null = null

export function getOutliner() {
  if (outliner) return outliner
  const fonts: Record<string, FontkitLike> = {}
  for (const f of FONT_FACES) {
    const file = path.resolve('node_modules/@fontsource', f.slug, 'files', `${f.slug}-latin-${f.weight}-${f.style}.woff2`)
    fonts[`${f.family}|${f.weight}|${f.style}`] = fontkit.create(fs.readFileSync(file)) as unknown as FontkitLike
  }
  outliner = createOutliner(fonts, fonts['Inter Tight|400|normal'])
  return outliner
}

export function renderOutlinedSvg(template: TemplateDef, props: OgImageProps = {}) {
  return renderToStaticMarkup(
    <OgRenderMode outline={getOutliner()}>
      <OgImage template={template} id="t" {...props} />
    </OgRenderMode>,
  )
}

export function renderTextSvg(template: TemplateDef, props: OgImageProps = {}) {
  return renderToStaticMarkup(<OgImage template={template} id="t" {...props} />)
}

export function rasterize(svg: string) {
  const r = new Resvg(svg, { fitTo: { mode: 'original' }, font: { loadSystemFonts: false } })
  const img = r.render()
  return { png: img.asPng(), width: img.width, height: img.height }
}
