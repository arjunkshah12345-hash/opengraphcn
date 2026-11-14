import { describe, expect, it } from 'vitest'
import { TEMPLATES } from '../src/og/templates'
import { renderTextSvg, renderTextSvgReact } from './helpers/node-render'

const norm = (s: string) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/<(\w+)([^<>]*)><\/\1>/g, '<$1$2/>')

describe('renderToSvgString (RSC-safe serializer) matches react-dom/server', () => {
  for (const t of TEMPLATES) {
    it(t.id, () => {
      const props = { content: { name: 'A & B "quoted" <x>', headline: "It's — fine." }, assets: { logo: 'data:image/png;base64,AAAA' } }
      expect(norm(renderTextSvg(t, props))).toBe(norm(renderTextSvgReact(t, props)))
    })
  }
})
