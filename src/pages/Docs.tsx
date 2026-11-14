import type { ReactNode } from 'react'
import { CodeBlock } from '../components/Code'
import { cn } from '../components/ui'
import { href } from '../lib/router'
import { installCommand, REGISTRY_URL, REPO_URL, SITE_URL } from '../lib/site'
import { COLLECTIONS } from '../og/core/types'
import { TEMPLATES } from '../og/templates'

const PAGES = [
  { id: '', label: 'Getting started' },
  { id: 'studio', label: 'Studio guide' },
  { id: 'react', label: 'React installation' },
  { id: 'nextjs', label: 'Next.js OG routes' },
  { id: 'exports', label: 'Exports' },
  { id: 'templates', label: 'Template reference' },
  { id: 'architecture', label: 'How rendering works' },
  { id: 'deploy', label: 'GitHub Pages' },
]

function H1({ children }: { children: ReactNode }) {
  return <h1 className="font-display text-[clamp(40px,5vw,60px)] leading-[0.98] tracking-[-0.015em] text-ink">{children}</h1>
}
function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mt-12 mb-3 text-[20px] font-semibold tracking-[-0.015em] text-ink">
      {children}
    </h2>
  )
}
function P({ children }: { children: ReactNode }) {
  return <p className="my-3 max-w-[68ch] text-[15px] leading-[1.7] text-ink-2">{children}</p>
}
function C({ children }: { children: ReactNode }) {
  return <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[12.5px] text-ink">{children}</code>
}
function UL({ children }: { children: ReactNode }) {
  return <ul className="my-3 grid max-w-[68ch] list-disc gap-1.5 pl-5 text-[15px] leading-[1.65] text-ink-2 marker:text-ink-3">{children}</ul>
}
function Note({ children }: { children: ReactNode }) {
  return <div className="my-5 max-w-[68ch] rounded-lg border-l-2 border-accent bg-paper-2/70 px-4 py-3 text-[14px] leading-relaxed text-ink-2">{children}</div>
}

function GettingStarted() {
  return (
    <>
      <H1>Getting started</H1>
      <P>
        opengraphcn is a set of 30 Open Graph image templates written as small React components that render SVG. Use them three ways: design in the <a className="text-ink underline decoration-line-strong underline-offset-2" href={href('/studio')}>Studio</a> and download a PNG; install a template into your app with the shadcn CLI; or generate images on the server in a Next.js route.
      </P>
      <H2>Install a template</H2>
      <P>Templates are published as a shadcn-compatible registry. Each template pulls in the shared core (types, font metrics, text layout and primitives) — nothing else.</P>
      <CodeBlock lang="bash" code={installCommand('monograph')} />
      <P>
        Files land in <C>components/opengraphcn/</C>. The only runtime dependency is React. Then render it anywhere:
      </P>
      <CodeBlock
        code={`import { MonographImage } from '@/components/opengraphcn/templates/monograph'

export default function Page() {
  return <MonographImage content={{ name: 'Acme', headline: 'Build something remarkable.' }} />
}`}
      />
      <H2>Run the site locally</H2>
      <CodeBlock lang="bash" code={`git clone ${REPO_URL}\ncd opengraphcn\nnpm install\nnpm run dev`} />
    </>
  )
}

function StudioGuide() {
  return (
    <>
      <H1>Studio guide</H1>
      <P>The Studio is a static, client-side editor. Nothing you type or upload leaves your browser unless you import from GitHub (which calls the public GitHub API).</P>
      <H2>Layout</H2>
      <UL>
        <li>
          <b className="text-ink">Left</b> — search and browse templates by collection. Thumbnails render your own content, so you see the real result before switching.
        </li>
        <li>
          <b className="text-ink">Center</b> — the live 1200×630 canvas with zoom, fit-to-screen and an actual-size preview.
        </li>
        <li>
          <b className="text-ink">Right</b> — Content, Style, Brand and Export tabs. On mobile the template browser becomes a tab.
        </li>
      </UL>
      <H2>Editing</H2>
      <UL>
        <li>Switching templates keeps your content. Colors reset to the new template’s palette unless “Keep my colors” is on.</li>
        <li>Headline and description show recommended lengths. Longer text never overflows — layouts shrink the type, then clamp with an ellipsis.</li>
        <li>Undo/redo with ⌘Z / ⇧⌘Z (typing is grouped into single steps). Reset returns to defaults and can itself be undone.</li>
        <li>Upload a logo, favicon, product screenshot or avatar. Images are downscaled to ≤1400px and embedded into exports.</li>
      </UL>
      <H2>Saving and sharing</H2>
      <UL>
        <li>Drafts autosave to local storage. ⌘S saves a named design you can restore from the folder icon.</li>
        <li>“Copy share link” encodes the configuration into the URL. Uploaded images are left out to keep links short.</li>
        <li>JSON export contains the complete, versioned configuration and restores exactly via “Import JSON”.</li>
      </UL>
      <H2>Import from GitHub</H2>
      <P>
        Paste any public repository URL. opengraphcn fetches <C>api.github.com/repos/:owner/:repo</C> anonymously and fills in name, owner, description, language, stars, forks and homepage. If GitHub’s anonymous limit (60 requests/hour per IP) is reached, the dialog says when to retry. Missing values stay empty — numbers are never invented.
      </P>
    </>
  )
}

function ReactInstall() {
  return (
    <>
      <H1>React installation</H1>
      <P>
        Requires a project configured for the shadcn CLI (a <C>components.json</C> with an <C>@/</C> alias). Run <C>npx shadcn@latest init</C> first if you don’t have one.
      </P>
      <CodeBlock lang="bash" code={`${installCommand('terminal')}\n${installCommand('launch')}`} />
      <H2>What gets installed</H2>
      <CodeBlock
        lang="bash"
        code={`# components/opengraphcn/
#   core/      types, fonts (metrics), text layout, primitives, kit, render, export
#   templates/ terminal.tsx, launch.tsx …`}
      />
      <H2>Props</H2>
      <CodeBlock
        code={`<TerminalImage
  content={{ name, headline, description, domain, author, category, badge, date }}
  theme={{ primary, accent, background, text }}   // any subset, hex colors
  options={{ scale: 1, showBrand: true, showMeta: true, displayFont: 'Fraunces' }}
  assets={{ logo, favicon, screenshot, avatar }}    // data: URLs or same-origin URLs
  className="w-full h-auto"
/>`}
      />
      <H2>Fonts</H2>
      <P>
        Templates reference OFL fonts published by Fontsource (Instrument Serif, Fraunces, Geist, JetBrains Mono…). Layout does not depend on them being loaded — line breaks are computed from bundled metrics — but to see the right glyphs in the browser, load the families the template uses, e.g. <C>npm i @fontsource/jetbrains-mono</C> and import the weights listed in the template’s <C>fonts</C> field.
      </P>
      <H2>Client-side PNG</H2>
      <CodeBlock
        code={`import { renderPng, download } from '@/components/opengraphcn/core/export'
import { TerminalImage } from '@/components/opengraphcn/templates/terminal'

const blob = await renderPng(<TerminalImage content={{ name: 'Acme' }} />)
download(blob, 'og.png')`}
      />
    </>
  )
}

function NextGuide() {
  return (
    <>
      <H1>Next.js OG routes</H1>
      <P>
        <C>next/og</C> (Satori) can’t render SVG <C>&lt;text&gt;</C>, filters or patterns, so opengraphcn ships its own tiny server renderer: it renders the same SVG as the Studio, converts text to glyph outlines with fontkit (fonts fetched once from the Fontsource CDN as TTF and cached), and rasterizes with resvg. The output matches the browser.
      </P>
      <CodeBlock lang="bash" code={`npx shadcn@latest add ${REGISTRY_URL}/monograph.json ${REGISTRY_URL}/server.json`} />
      <P>
        Keep the native module external in <C>next.config.ts</C>:
      </P>
      <CodeBlock
        code={`import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['@resvg/resvg-js'],
}
export default config`}
      />
      <H2>app/opengraph-image.tsx</H2>
      <CodeBlock
        code={`import { monograph } from '@/components/opengraphcn/templates/monograph'
import { renderOgPng } from '@/components/opengraphcn/server/render'

export const runtime = 'nodejs'
export const alt = 'Acme — Build something remarkable.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const png = await renderOgPng(monograph, {
    content: { name: 'Acme', headline: 'Build something remarkable.' },
  })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}`}
      />
      <H2>Dynamic routes</H2>
      <CodeBlock
        code={`// app/blog/[slug]/opengraph-image.tsx
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug)
  const png = await renderOgPng(monograph, { content: { name: 'Blog', headline: post.title, date: post.date } })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}`}
      />
      <Note>
        The renderer needs the Node.js runtime (resvg is a native addon), not the Edge runtime. Remote images in <C>assets</C> are fetched and inlined at render time; uploaded Studio images should be saved under <C>public/</C> and referenced by absolute URL.
      </Note>
    </>
  )
}

function ExportsDoc() {
  return (
    <>
      <H1>Exports</H1>
      <H2>PNG</H2>
      <P>
        The template is rendered to a standalone SVG string (React’s static renderer), every font face it uses is embedded as a base64 <C>@font-face</C>, remote images are inlined, and the SVG is drawn onto a 1200×630 canvas (or 2400×1260 for @2x). The result is a real PNG with no transparent edges and no screenshot of the interface.
      </P>
      <H2>SVG</H2>
      <P>The same standalone SVG, downloaded directly. Fonts and images are embedded, so the file renders correctly in browsers and design tools without network access.</P>
      <H2>React source</H2>
      <P>A component that imports the installed template and passes your exact content, colors and options. Uploaded images become file paths with a note telling you where to save them.</P>
      <H2>Next.js source</H2>
      <P>
        An <C>app/opengraph-image.tsx</C> using <C>renderOgPng</C>, with install instructions in the header comment.
      </P>
      <H2>JSON</H2>
      <CodeBlock
        lang="json"
        code={`{
  "version": 1,
  "template": "monograph",
  "content": { "name": "Acme", "headline": "Build something remarkable.", "...": "..." },
  "theme": { "accent": "#e5481f" },
  "assets": {},
  "options": { "scale": 1, "showBrand": true, "showMeta": true }
}`}
      />
    </>
  )
}

function TemplateReference() {
  return (
    <>
      <H1>Template reference</H1>
      <P>
        Every template accepts the same props. Install any of them with <C>{`${REGISTRY_URL}/<id>.json`}</C>.
      </P>
      {COLLECTIONS.map((c) => (
        <div key={c.id}>
          <H2>
            {c.letter} · {c.label}
          </H2>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="bg-paper-2/60 font-mono text-[11px] uppercase tracking-wide text-ink-3">
                <tr>
                  <th className="px-3 py-2 font-normal">#</th>
                  <th className="px-3 py-2 font-normal">id</th>
                  <th className="px-3 py-2 font-normal">Typefaces</th>
                  <th className="px-3 py-2 font-normal">Uses</th>
                </tr>
              </thead>
              <tbody>
                {TEMPLATES.filter((t) => t.collection === c.id).map((t) => (
                  <tr key={t.id} className="border-t border-line">
                    <td className="px-3 py-2 font-mono text-ink-3">{String(t.number).padStart(2, '0')}</td>
                    <td className="px-3 py-2">
                      <a href={href(`/templates/${t.id}`)} className="font-mono text-ink underline decoration-line-strong underline-offset-2">
                        {t.id}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-ink-2">{[...new Set(Object.values(t.fonts).map((f) => f.family))].join(', ')}</td>
                    <td className="px-3 py-2 text-ink-2">{(t.uses ?? []).join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  )
}

function Architecture() {
  return (
    <>
      <H1>How rendering works</H1>
      <UL>
        <li>
          <b className="text-ink">One element tree.</b> A template is a function from props to an <C>&lt;svg&gt;</C>. The Studio preview, gallery thumbnails, PNG/SVG exports and the Next.js route all render that same tree.
        </li>
        <li>
          <b className="text-ink">Deterministic text.</b> Advance widths for every face are precomputed at build time (<C>scripts/build-metrics.mjs</C>). <C>fit()</C> finds the largest size where text fits the template’s safe area without breaking words, then clamps with an ellipsis — identical in every environment.
        </li>
        <li>
          <b className="text-ink">Browser export.</b> SVG + embedded woff2 fonts → <C>&lt;img&gt;</C> → canvas → PNG. Uploaded images are data URLs, so the canvas is never tainted.
        </li>
        <li>
          <b className="text-ink">Server export.</b> Text is outlined into paths with fontkit, then resvg rasterizes. No headless browser and no font-name matching.
        </li>
      </UL>
    </>
  )
}

function Deploy() {
  return (
    <>
      <H1>GitHub Pages</H1>
      <P>The site is fully static: Vite build, hash routing, no server. The registry JSON lives next to the site under /r/.</P>
      <CodeBlock lang="bash" code={`npm run build      # builds registry + site into dist/\nnpm run preview`} />
      <H2>Base path</H2>
      <P>
        Production builds use <C>/opengraphcn/</C> as the base. For a fork or custom domain set <C>BASE_PATH</C>, e.g. <C>BASE_PATH=/ npm run build</C>, and update <C>src/lib/site.ts</C> so the registry URLs point at your deployment.
      </P>
      <H2>Workflow</H2>
      <P>
        <C>.github/workflows/deploy.yml</C> installs, type-checks, tests, builds and publishes <C>dist/</C> with <C>actions/deploy-pages</C> on every push to <C>main</C>. In the repository settings, set Pages → Source to “GitHub Actions”.
      </P>
      <P>
        Live site: <a className="text-ink underline decoration-line-strong underline-offset-2" href={SITE_URL}>{SITE_URL}</a>
      </P>
    </>
  )
}

const CONTENT: Record<string, () => ReactNode> = {
  '': GettingStarted,
  studio: StudioGuide,
  react: ReactInstall,
  nextjs: NextGuide,
  exports: ExportsDoc,
  templates: TemplateReference,
  architecture: Architecture,
  deploy: Deploy,
}

export function Docs({ page }: { page: string }) {
  const Page = CONTENT[page] ?? GettingStarted
  return (
    <main className="mx-auto grid max-w-[1240px] gap-10 px-4 pt-10 pb-24 sm:px-6 md:grid-cols-[200px_1fr]">
      <nav aria-label="Documentation" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:sticky md:top-24 md:mx-0 md:grid md:content-start md:self-start md:px-0">
        <p className="hidden pb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3 md:block">Documentation</p>
        {PAGES.map((p) => (
          <a key={p.id} href={href(p.id ? `/docs/${p.id}` : '/docs')} className={cn('shrink-0 rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors', page === p.id ? 'bg-paper-2 font-medium text-ink' : 'text-ink-2 hover:text-ink')}>
            {p.label}
          </a>
        ))}
      </nav>
      <article className="min-w-0">
        <Page />
      </article>
    </main>
  )
}
