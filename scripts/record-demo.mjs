// Records the 30-second launch demo: node scripts/record-demo.mjs [baseUrl]
import { chromium } from 'playwright'
import fs from 'node:fs'
const base = process.argv[2] ?? 'http://localhost:5181/'
fs.mkdirSync('test-output/demo', { recursive: true })
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, recordVideo: { dir: 'test-output/demo', size: { width: 1440, height: 900 } } })
const p = await ctx.newPage()
await p.goto(base + '#/demo', { waitUntil: 'networkidle' })
await p.evaluate(() => document.fonts.ready)
await p.waitForTimeout(800)
const dl = p.waitForEvent('download', { timeout: 40000 })
await p.getByRole('button', { name: /Autoplay/ }).click()
for (const t of [2, 7, 13, 18, 24, 29.5]) {
  await p.waitForTimeout(t * 1000 - (globalThis.__last ?? 0))
  globalThis.__last = t * 1000
  await p.screenshot({ path: `test-output/demo/t${String(t).replace('.', '_')}.png` })
}
const d = await dl
await d.saveAs('test-output/demo/exported.png')
console.log('exported', d.suggestedFilename())
await ctx.close()
await b.close()
