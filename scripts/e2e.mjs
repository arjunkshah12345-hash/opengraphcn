// End-to-end checks against the production build (npm run build first).
// - every route renders without console errors
// - Studio "Export PNG" downloads a real 1200×630 PNG for every template
// - SVG export is well-formed XML
// - browser PNG matches the server (resvg) render within a small tolerance
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const PORT = 4179
const BASE = `http://localhost:${PORT}/opengraphcn/`
const OUT = 'test-output/e2e'
fs.mkdirSync(OUT, { recursive: true })
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))

const ids = [...fs.readFileSync('src/og/templates/index.ts', 'utf8').matchAll(/from '\.\/([\w-]+)'/g)].map((m) => m[1].replace('index-catalog', 'index'))
const failures = []
const browser = await chromium.launch()
try {
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  for (const route of ['/', '/templates', '/templates/dither', '/studio', '/docs', '/docs/nextjs', '/docs/templates', '/demo']) {
    await page.goto(`${BASE}#${route}`, { waitUntil: 'networkidle' })
    if (!(await page.locator('svg[viewBox="0 0 1200 630"]').count()) && !route.startsWith('/docs')) failures.push(`${route}: no OG svg rendered`)
  }
  if (errors.length) failures.push(`console errors: ${errors.join(' | ')}`)

  let maxDiff = 0
  for (const id of ids) {
    await page.goto(`${BASE}#/studio?t=${id}`, { waitUntil: 'networkidle' })
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export PNG' }).first().click()])
    const file = `${OUT}/${id}.png`
    await dl.saveAs(file)
    const buf = fs.readFileSync(file)
    const sig = buf.subarray(0, 8).toString('hex') === '89504e470d0a1a0a'
    const w = buf.readUInt32BE(16)
    const h = buf.readUInt32BE(20)
    if (!sig || w !== 1200 || h !== 630) failures.push(`${id}: bad PNG (${w}×${h})`)
    // compare with the resvg render produced by the vitest suite
    const ref = fs.readdirSync('test-output').find((f) => f.endsWith(`-${id}-default.png`))
    if (ref) {
      const diff = await page.evaluate(
        async ([a, b]) => {
          const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src })
          const [ia, ib] = await Promise.all([load(a), load(b)])
          const c = document.createElement('canvas'); c.width = 300; c.height = 158
          const x = c.getContext('2d')
          x.drawImage(ia, 0, 0, 300, 158); const da = x.getImageData(0, 0, 300, 158).data
          x.drawImage(ib, 0, 0, 300, 158); const db = x.getImageData(0, 0, 300, 158).data
          let s = 0
          for (let i = 0; i < da.length; i += 4) s += (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3
          return s / (da.length / 4) / 255
        },
        [`data:image/png;base64,${buf.toString('base64')}`, `data:image/png;base64,${fs.readFileSync(`test-output/${ref}`).toString('base64')}`],
      )
      maxDiff = Math.max(maxDiff, diff)
      console.log(`${id.padEnd(14)} png ok  browser↔resvg mean diff ${(diff * 100).toFixed(2)}%`)
      if (diff > 0.06) failures.push(`${id}: browser export differs from server render by ${(diff * 100).toFixed(1)}%`)
    }
  }

  // SVG export
  await page.goto(`${BASE}#/studio?t=journal`, { waitUntil: 'networkidle' })
  await page.getByRole('tab', { name: 'Export' }).click()
  const [svgDl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'SVG', exact: true }).click()])
  await svgDl.saveAs(`${OUT}/journal.svg`)
  const svg = fs.readFileSync(`${OUT}/journal.svg`, 'utf8')
  const ok = await page.evaluate((s) => !new DOMParser().parseFromString(s, 'image/svg+xml').querySelector('parsererror'), svg)
  if (!ok) failures.push('SVG export is not well-formed XML')
  if (!svg.includes('@font-face')) failures.push('SVG export has no embedded fonts')
  console.log(`svg export: ${(svg.length / 1024).toFixed(0)} KB, well-formed=${ok}, fonts=${svg.match(/@font-face/g)?.length ?? 0}`)
  console.log(`max browser↔resvg diff: ${(maxDiff * 100).toFixed(2)}%`)
} finally {
  await browser.close()
  server.kill()
}
if (failures.length) {
  console.error('\nFAILURES:\n' + failures.join('\n'))
  process.exit(1)
}
console.log('\nall e2e checks passed')
