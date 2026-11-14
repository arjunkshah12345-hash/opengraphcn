// Dev helper: node scripts/contact-sheet.mjs <filter> <out.png> [cols]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
const [filter = '', outFile = 'test-output/_sheet.png', cols = '3'] = process.argv.slice(2)
const dir = path.resolve('test-output')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png') && !f.startsWith('_') && f.includes(filter)).sort()
const html = `<body style="margin:0;background:#888;display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px">${files
  .map((f) => `<div style="font:11px sans-serif;color:#fff"><img src="file://${dir}/${f}" style="width:100%;display:block"/>${f}</div>`)
  .join('')}</body>`
fs.writeFileSync('/tmp/_sheet.html', html)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(cols) * 600, height: 400 } })
await p.goto('file:///tmp/_sheet.html')
await p.waitForTimeout(300)
await p.screenshot({ path: outFile, fullPage: true })
await b.close()
console.log(files.length, 'images ->', outFile)
