import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { jsonSource, nextSource, reactSource } from '../src/lib/codegen'
import { defaultConfig, normalizeConfig } from '../src/lib/config'
import { renderOgPng } from '../src/og/server/render'
import { TEMPLATES } from '../src/og/templates'

const dir = 'test-output/gen'

describe('code export', () => {
  it('generated React + Next.js sources type-check against the registry modules', () => {
    fs.rmSync(dir, { recursive: true, force: true })
    fs.mkdirSync(dir, { recursive: true })
    for (const t of TEMPLATES) {
      const cfg = defaultConfig(t.id)
      cfg.theme = { accent: '#ff0000' }
      cfg.options = { ...cfg.options, scale: 1.1, displayFont: 'Fraunces' }
      cfg.assets = { logo: 'data:image/png;base64,AAAA', screenshot: 'https://example.com/shot.png' }
      cfg.content = { ...cfg.content, stars: 42, owner: 'octo' }
      fs.writeFileSync(`${dir}/${t.id}.react.tsx`, reactSource(cfg))
      fs.writeFileSync(`${dir}/${t.id}.next.tsx`, nextSource(cfg))
    }
    fs.writeFileSync(
      `${dir}/tsconfig.json`,
      JSON.stringify({
        compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, lib: ['ES2023', 'DOM'], types: ['node'], baseUrl: '.', ignoreDeprecations: '6.0', paths: { '@/components/opengraphcn/*': ['../../src/og/*'] } },
        include: ['*.tsx'],
      }),
    )
    execFileSync('npx', ['tsc', '-p', `${dir}/tsconfig.json`], { stdio: 'pipe' })
  })

  it('JSON export round-trips through normalizeConfig', () => {
    const cfg = defaultConfig('dither')
    cfg.theme = { accent: '#123456' }
    cfg.content.headline = 'Round trip'
    const back = normalizeConfig(JSON.parse(jsonSource(cfg)))
    expect(back.template).toBe('dither')
    expect(back.theme.accent).toBe('#123456')
    expect(back.content.headline).toBe('Round trip')
  })

  it('server renderer (Next.js path) produces a 1200×630 PNG with CDN fonts', async () => {
    for (const id of ['monograph', 'terminal', 'announcement']) {
      const png = await renderOgPng(TEMPLATES.find((t) => t.id === id)!, { content: { name: 'Acme', headline: 'Server rendered.' } })
      const buf = Buffer.from(png)
      expect(buf.subarray(1, 4).toString()).toBe('PNG')
      expect(buf.readUInt32BE(16)).toBe(1200)
      expect(buf.readUInt32BE(20)).toBe(630)
      fs.writeFileSync(`test-output/server-${id}.png`, buf)
    }
  })
})
