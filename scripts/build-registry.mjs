// Builds the shadcn-compatible registry into public/r/ (served by GitHub Pages at <site>/r/).
//   REGISTRY_URL=http://localhost:4173/r node scripts/build-registry.mjs   (for local install tests)
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const site = fs.readFileSync(path.join(ROOT, 'src/lib/site.ts'), 'utf8')
const owner = /GITHUB_OWNER = '([^']+)'/.exec(site)[1]
const repo = /REPO_NAME = '([^']+)'/.exec(site)[1]
const REG = (process.env.REGISTRY_URL ?? `https://${owner}.github.io/${repo}/r`).replace(/\/$/, '')
const OUT = path.join(ROOT, 'public/r')
fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const file = (src, target) => ({ path: src, type: 'registry:component', target, content: read(src) })

const coreFiles = fs
  .readdirSync(path.join(ROOT, 'src/og/core'))
  .filter((f) => /\.(ts|tsx)$/.test(f))
  .sort()
  .map((f) => file(`src/og/core/${f}`, `components/opengraphcn/core/${f}`))

const items = []
items.push({
  name: 'core',
  type: 'registry:component',
  title: 'opengraphcn core',
  description: 'Shared types, font metrics, deterministic text layout, SVG primitives and the browser PNG/SVG exporter.',
  dependencies: ['react-dom'],
  files: coreFiles,
})
items.push({
  name: 'server',
  type: 'registry:component',
  title: 'opengraphcn server renderer',
  description: 'renderOgPng / renderOgSvg for Next.js opengraph-image routes and Node scripts (fontkit + resvg).',
  dependencies: ['@resvg/resvg-js', 'fontkit'],
  devDependencies: ['@types/fontkit'],
  registryDependencies: [`${REG}/core.json`],
  files: [file('src/og/server/render.tsx', 'components/opengraphcn/server/render.tsx')],
})

const index = read('src/og/templates/index.ts')
const ids = [...index.matchAll(/from '\.\/([\w-]+)'/g)].map((m) => m[1])
const templateIds = []
for (const fileId of ids) {
  const src = `src/og/templates/${fileId}.tsx`
  const code = read(src)
  const id = /\n  id: '([\w-]+)'/.exec(code)[1]
  const name = /\n  name: '([^']+)'/.exec(code)[1]
  const description = /\n  description: '((?:[^'\\]|\\.)*)'/.exec(code)[1].replace(/\\'/g, "'")
  const collection = /\n  collection: '(\w+)'/.exec(code)[1]
  templateIds.push(id)
  items.push({
    name: id,
    type: 'registry:component',
    title: `${name} (opengraphcn)`,
    description,
    categories: ['og-image', collection],
    registryDependencies: [`${REG}/core.json`],
    files: [file(src, `components/opengraphcn/templates/${fileId}.tsx`)],
  })
}
items.push({
  name: 'all',
  type: 'registry:component',
  title: 'All opengraphcn templates',
  description: 'Every template plus the index that lists them.',
  registryDependencies: templateIds.map((id) => `${REG}/${id}.json`),
  files: [file('src/og/templates/index.ts', 'components/opengraphcn/templates/index.ts')],
})

for (const item of items) {
  fs.writeFileSync(path.join(OUT, `${item.name}.json`), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item }, null, 2))
}
const registry = {
  $schema: 'https://ui.shadcn.com/schema/registry.json',
  name: 'opengraphcn',
  homepage: REG.replace(/\/r$/, ''),
  items: items.map(({ files, ...rest }) => ({ ...rest, files: files.map(({ content, ...f }) => f) })),
}
fs.writeFileSync(path.join(OUT, 'registry.json'), JSON.stringify(registry, null, 2))
fs.writeFileSync(path.join(ROOT, 'registry.json'), JSON.stringify(registry, null, 2) + '\n')
console.log(`registry: ${items.length} items -> public/r (${REG})`)
