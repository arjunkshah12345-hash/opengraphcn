import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { TEMPLATES } from '../src/og/templates'
import { OG_HEIGHT, OG_WIDTH } from '../src/og/core/types'
import { rasterize, renderOutlinedSvg, renderTextSvg } from './helpers/node-render'

const LONG = {
  name: 'Supercalifragilistic Labs',
  headline: 'An unreasonably long headline that keeps going to test how every template wraps, fits and clamps its text safely',
  description:
    'A very long description that goes on and on, explaining in exhaustive detail what this project does, why it exists and who it is for, far beyond what fits.',
  domain: 'supercalifragilistic-labs.example.com',
  author: 'Maximiliana Featherstonehaugh',
  category: 'Developer infrastructure',
  badge: 'v12.4.0-beta',
  date: 'September 30, 2026',
}
const SHORT = { name: 'Io', headline: 'Hi.', description: 'Tiny.', domain: 'io.sh', author: 'J', category: 'AI', badge: 'v1', date: '2026' }

const REPO = { name: 'opengraphcn', owner: 'octo-org', description: 'Beautiful Open Graph images for every link.', stars: 12840, forks: 312, language: 'TypeScript', domain: 'opengraphcn.dev' }

const out = 'test-output'
fs.mkdirSync(out, { recursive: true })

describe('templates render', () => {
  it('has unique ids and numbers', () => {
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(TEMPLATES.length)
    expect(new Set(TEMPLATES.map((t) => t.number)).size).toBe(TEMPLATES.length)
  })
  for (const t of TEMPLATES) {
    for (const [label, content] of [['default', undefined], ['long', LONG], ['short', SHORT], ['repo', REPO]] as const) {
      it(`${t.id} (${label}) renders 1200×630 PNG via resvg`, () => {
        const svg = renderOutlinedSvg(t, { content })
        expect(svg.startsWith('<svg')).toBe(true)
        const { png, width, height } = rasterize(svg)
        expect(width).toBe(OG_WIDTH)
        expect(height).toBe(OG_HEIGHT)
        fs.writeFileSync(`${out}/${String(t.number).padStart(2, '0')}-${t.id}-${label}.png`, png)
      })
    }
    it(`${t.id} text-mode SVG is well-formed`, () => {
      const svg = renderTextSvg(t)
      expect(svg).toMatch(/^<svg[^>]+viewBox="0 0 1200 630"/)
      expect(svg).not.toContain('NaN')
      expect(svg).not.toContain('undefined')
    })
  }
})
