// Dev helper: node scripts/shots.mjs <baseUrl> <outDir> [width] [height] route1 route2 ...
import { chromium } from 'playwright'
import fs from 'node:fs'
const [base, out, w = '1440', h = '900', ...routes] = process.argv.slice(2)
fs.mkdirSync(out, { recursive: true })
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 })
const errors = []
p.on('pageerror', (e) => errors.push(e.message))
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
for (const r of routes) {
  const [route, full] = r.split('!')
  await p.goto(base + '#' + route, { waitUntil: 'networkidle' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(1200)
  const name = (route.replace(/[^a-z0-9]+/gi, '_') || 'home') + `_${w}`
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: full === 'full' })
}
console.log('errors:', errors.length ? errors : 'none')
await b.close()
