import { ArrowRight, ArrowUpRight, Braces, FileCode2, FileImage, PenTool, Terminal as TerminalIcon } from 'lucide-react'
import { Github } from '../components/icons'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { CodeBlock } from '../components/Code'
import { OgFrame, OgPreview } from '../components/OgPreview'
import { Button, CopyButton, Input, LinkButton, cn } from '../components/ui'
import { defaultConfig } from '../lib/config'
import { href } from '../lib/router'
import { installCommand, REGISTRY_URL, REPO_URL } from '../lib/site'
import { COLLECTIONS, type Collection, type OgConfig } from '../og/core/types'
import { getTemplate, TEMPLATES } from '../og/templates'

const STYLES: { label: string; template: string }[] = [
  { label: 'Editorial', template: 'monograph' },
  { label: 'Developer', template: 'terminal' },
  { label: 'Abstract', template: 'atmosphere' },
  { label: 'Minimal', template: 'nothing' },
  { label: 'Experimental', template: 'brutalist' },
  { label: 'Product', template: 'launch' },
]

const FLAGSHIPS = ['monograph', 'terminal', 'nocturne', 'mono', 'dither', 'launch']
const CYCLE_MS = 3600

function SectionHead({ index, kicker, title, children }: { index: string; kicker: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          {kicker}
        </p>
        <h2 className="max-w-3xl font-display text-[clamp(36px,4.6vw,60px)] leading-[0.98] tracking-[-0.015em] text-ink">{title}</h2>
      </div>
      {children}
    </div>
  )
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const [style, setStyle] = useState(0)
  const [auto, setAuto] = useState(true)
  const [name, setName] = useState('Acme')
  const [headline, setHeadline] = useState('Build something remarkable.')

  useEffect(() => {
    if (!auto) return
    const t = window.setInterval(() => setStyle((s) => (s + 1) % STYLES.length), CYCLE_MS)
    return () => clearInterval(t)
  }, [auto])

  const config = useMemo<OgConfig>(() => {
    const c = defaultConfig(STYLES[style].template)
    c.content = { ...c.content, name: name || 'Acme', headline: headline || 'Build something remarkable.' }
    return c
  }, [style, name, headline])
  const tpl = getTemplate(config.template)

  return (
    <section className="relative">
      <div className="paper-grid pointer-events-none absolute inset-x-0 top-0 h-[520px] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-60" />
      <div className="relative mx-auto max-w-[1240px] px-4 pt-14 sm:px-6 md:pt-20">
        <p className="mb-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
          <span className="size-1.5 rounded-full bg-accent" />
          Open source <span className="text-ink-3">/</span> React <span className="text-ink-3">/</span> OG images
        </p>
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-14">
          <h1 className="font-display text-[clamp(52px,8.2vw,112px)] leading-[0.9] tracking-[-0.025em] text-ink">
            Every link deserves a better <em className="text-accent">first impression.</em>
          </h1>
          <div className="grid gap-6 pb-2">
            <p className="max-w-md text-[17px] leading-relaxed text-ink-2">30 beautifully crafted Open Graph templates. Customize anything, export in seconds, and install directly into your app.</p>
            <div className="flex flex-wrap gap-2.5">
              <LinkButton href={href('/templates')} variant="primary" size="lg">
                Explore templates <ArrowRight />
              </LinkButton>
              <LinkButton href={href('/studio')} variant="outline" size="lg">
                Open Studio
              </LinkButton>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-16" onMouseEnter={() => setAuto(false)}>
          <OgFrame className="relative">
            <div className="flex h-10 items-center justify-between border-b border-line bg-paper px-4 font-mono text-[11.5px] text-ink-3">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent" />
                {name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'acme'}.dev
              </span>
              <span className="hidden sm:inline">
                {String(tpl.number).padStart(2, '0')} {tpl.name} — 1200 × 630
              </span>
            </div>
            <div className="relative aspect-[1200/630] w-full overflow-hidden bg-paper-2">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={config.template}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <OgPreview config={config} id={`hero-${config.template}`} />
                </motion.div>
              </AnimatePresence>
            </div>
          </OgFrame>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div role="tablist" aria-label="Card style" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {STYLES.map((s, i) => (
                <button
                  key={s.label}
                  role="tab"
                  aria-selected={style === i}
                  onClick={() => {
                    setAuto(false)
                    setStyle(i)
                  }}
                  className={cn(
                    'relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-md px-3.5 text-[13.5px] font-medium transition-colors duration-200',
                    style === i ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2 hover:text-ink',
                  )}
                >
                  <span className={cn('font-mono text-[10.5px]', style === i ? 'text-paper/50' : 'text-ink-3')}>0{i + 1}</span>
                  {s.label}
                  {style === i && auto ? <span key={`p${style}`} className="absolute bottom-0 left-0 h-[2px] bg-accent" style={{ animation: `hero-progress ${CYCLE_MS}ms linear forwards` }} /> : null}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input aria-label="Project name" value={name} onChange={(e) => (setAuto(false), setName(e.target.value))} className="w-28 bg-paper" maxLength={24} />
              <Input aria-label="Headline" value={headline} onChange={(e) => (setAuto(false), setHeadline(e.target.value))} className="w-full bg-paper lg:w-72" maxLength={70} />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes hero-progress{from{width:0}to{width:100%}}`}</style>
    </section>
  )
}

/* ───────────────────────── Featured ───────────────────────── */

function TemplateTile({ id, large }: { id: string; large?: boolean }) {
  const t = getTemplate(id)
  const cfg = useMemo(() => defaultConfig(id), [id])
  const col = COLLECTIONS.find((c) => c.id === t.collection)!
  return (
    <a href={href(`/templates/${id}`)} className="group block">
      <OgFrame className="transition-[transform,box-shadow] duration-300 ease-out-quart group-hover:-translate-y-1">
        <OgPreview config={cfg} id={`tile-${id}-${large ? 'l' : 's'}`} />
      </OgFrame>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-[14px] font-medium text-ink">
          <span className="mr-2 font-mono text-[11px] text-ink-3">{String(t.number).padStart(2, '0')}</span>
          {t.name}
        </p>
        <p className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3 transition-colors group-hover:text-accent">
          {col.label}
          <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </p>
      </div>
      {large ? <p className="mt-1 max-w-md text-[13px] leading-snug text-ink-2">{t.description}</p> : null}
    </a>
  )
}

function Featured() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6">
      <SectionHead index="01" kicker="Flagships" title="Six directions. One per collection.">
        <LinkButton href={href('/templates')} variant="ghost">
          All 30 templates <ArrowRight />
        </LinkButton>
      </SectionHead>
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {FLAGSHIPS.map((id) => (
          <TemplateTile key={id} id={id} large />
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Library ───────────────────────── */

function Library() {
  const [col, setCol] = useState<Collection | 'all'>('all')
  const list = TEMPLATES.filter((t) => col === 'all' || t.collection === col)
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6">
      <SectionHead index="02" kicker="The library" title={<>Thirty templates, thirty different ideas — not thirty colour swaps.</>} />
      <div className="no-scrollbar -mx-4 mb-8 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {[{ id: 'all' as const, label: 'All', letter: '∗' }, ...COLLECTIONS].map((c) => (
          <button
            key={c.id}
            onClick={() => setCol(c.id)}
            className={cn('flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-colors', col === c.id ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink-2 hover:text-ink')}
          >
            {c.label}
            <span className={cn('font-mono text-[10.5px]', col === c.id ? 'text-paper/55' : 'text-ink-3')}>{c.id === 'all' ? 30 : 5}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 md:grid-cols-3 lg:grid-cols-5">
        {list.map((t) => (
          <TemplateTile key={t.id} id={t.id} />
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Live customization ───────────────────────── */

const SWATCHES = ['#e3241b', '#ff7a1a', '#1f7a5a', '#2b4bd8', '#111111', '#c2185b']
const FONTS = ['Inter Tight', 'Instrument Serif', 'Unbounded', 'Space Grotesk', 'Bodoni Moda']

function Customize() {
  const [accent, setAccent] = useState(SWATCHES[0])
  const [font, setFont] = useState(FONTS[0])
  const [scale, setScale] = useState(1)
  const [name, setName] = useState('Northwind')
  const cfg = useMemo<OgConfig>(() => {
    const c = defaultConfig('modernist')
    c.content = { ...c.content, name, headline: 'Ship the boring parts faster.', description: 'Infrastructure primitives for teams that would rather be building product.', category: 'Developer tools', domain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'northwind'}.dev` }
    c.theme = { accent }
    c.options = { ...c.options, displayFont: font === 'Inter Tight' ? undefined : font, scale }
    return c
  }, [accent, font, scale, name])
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6">
      <SectionHead index="03" kicker="Live editing" title="Change anything. Watch the card follow." />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <OgFrame className="self-start">
          <OgPreview config={cfg} id="customize" />
        </OgFrame>
        <div className="grid content-start gap-6 rounded-[10px] border border-line p-5">
          <div className="grid gap-2">
            <p className="text-[12px] font-medium text-ink-2">Project name</p>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={22} />
          </div>
          <div className="grid gap-2">
            <p className="text-[12px] font-medium text-ink-2">Accent</p>
            <div className="flex gap-2">
              {SWATCHES.map((s) => (
                <button key={s} aria-label={`Accent ${s}`} onClick={() => setAccent(s)} className={cn('size-8 rounded-full ring-offset-2 ring-offset-paper transition-[box-shadow,transform] hover:scale-105', accent === s && 'ring-2 ring-ink')} style={{ background: s }} />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-[12px] font-medium text-ink-2">Display typeface</p>
            <div className="flex flex-wrap gap-1.5">
              {FONTS.map((f) => (
                <button key={f} onClick={() => setFont(f)} className={cn('h-8 rounded-md border px-2.5 text-[13px] transition-colors', font === f ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink-2 hover:text-ink')} style={{ fontFamily: `'${f}'` }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <p className="flex justify-between text-[12px] font-medium text-ink-2">
              Type scale <span className="font-mono text-ink-3">{scale.toFixed(2)}×</span>
            </p>
            <input type="range" min={0.8} max={1.2} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
          </div>
          <LinkButton href={href('/studio?t=modernist')} variant="primary" className="mt-1">
            Continue in Studio <ArrowRight />
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Export & integrate ───────────────────────── */

const EXPORTS = [
  { icon: FileImage, name: 'PNG', body: 'Exactly 1200×630 (or 2×), rendered from SVG in your browser with embedded fonts.' },
  { icon: PenTool, name: 'SVG', body: 'Standalone vector file with fonts and images inlined. Opens anywhere.' },
  { icon: FileCode2, name: 'React', body: 'A typed component that renders the same card from props.' },
  { icon: TerminalIcon, name: 'Next.js', body: 'An opengraph-image.tsx route rendering the identical SVG with resvg.' },
  { icon: Braces, name: 'JSON', body: 'The complete, versioned configuration. Import it to restore a design.' },
]

const NEXT_SNIPPET = `// app/opengraph-image.tsx
import { monograph } from '@/components/opengraphcn/templates/monograph'
import { renderOgPng } from '@/components/opengraphcn/server/render'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const png = await renderOgPng(monograph, {
    content: { name: 'Acme', headline: 'Build something remarkable.' },
  })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}`

const REACT_SNIPPET = `import { MonographImage } from '@/components/opengraphcn/templates/monograph'

export function Preview() {
  return (
    <MonographImage
      content={{ name: 'Acme', headline: 'Build something remarkable.' }}
      theme={{ accent: '#e5481f' }}
    />
  )
}`

function Exports() {
  const [tab, setTab] = useState<'react' | 'next'>('next')
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6">
      <SectionHead index="04" kicker="Export & integrate" title="From the Studio to production, without a screenshot." />
      <div className="grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {EXPORTS.map((e) => (
          <div key={e.name} className="grid content-start gap-3 bg-paper p-5">
            <e.icon className="size-5 text-accent" strokeWidth={1.6} />
            <p className="font-medium text-ink">{e.name}</p>
            <p className="text-[13px] leading-relaxed text-ink-2">{e.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid content-start gap-4 pt-2">
          <p className="max-w-md text-[15px] leading-relaxed text-ink-2">
            Every template is plain React that renders SVG. The browser, the PNG exporter and the Next.js route all draw from the same element tree, so what you design is what ships.
          </p>
          <p className="max-w-md text-[13px] leading-relaxed text-ink-3">
            Text layout uses precomputed font metrics, so line breaks are identical everywhere. On the server, glyphs are outlined with fontkit and rasterized by resvg — no headless browser, no font name guessing.
          </p>
        </div>
        <div>
          <div className="mb-2 flex gap-1">
            {(['next', 'react'] as const).map((k) => (
              <Button key={k} size="sm" variant={tab === k ? 'primary' : 'ghost'} onClick={() => setTab(k)}>
                {k === 'next' ? 'Next.js route' : 'React component'}
              </Button>
            ))}
          </div>
          <CodeBlock code={tab === 'next' ? NEXT_SNIPPET : REACT_SNIPPET} />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Install ───────────────────────── */

function Install() {
  const cmd = installCommand('monograph')
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6">
      <SectionHead index="05" kicker="Install" title="One command. Only the template you need." />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { n: '1', h: 'Add a template', b: 'The shadcn CLI copies the template and the small shared core into your project.' },
          { n: '2', h: 'Render it', b: 'Use the component anywhere React runs — it is just an <svg>.' },
          { n: '3', h: 'Ship the image', b: 'Add the server renderer for a Next.js opengraph-image route.' },
        ].map((s) => (
          <div key={s.n} className="rounded-[10px] border border-line p-5">
            <p className="font-display text-[40px] leading-none text-accent">{s.n}</p>
            <p className="mt-4 font-medium text-ink">{s.h}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{s.b}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3 overflow-hidden rounded-[10px] bg-ink py-3 pr-3 pl-5 text-paper">
        <span className="font-mono text-[12px] text-paper/40">$</span>
        <code className="no-scrollbar flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">{cmd}</code>
        <CopyButton text={cmd} variant="ghost" className="text-paper/70 hover:bg-paper/10 hover:text-paper" />
      </div>
      <p className="mt-3 text-[12.5px] text-ink-3">
        Registry: <a className="underline decoration-line-strong underline-offset-2 hover:text-ink" href={`${REGISTRY_URL}/registry.json`} target="_blank" rel="noreferrer">{REGISTRY_URL}/registry.json</a> · swap <span className="font-mono">monograph</span> for any template id.
      </p>
    </section>
  )
}

/* ───────────────────────── Open source ───────────────────────── */

function OpenSource() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-28 sm:px-6">
      <div className="relative overflow-hidden rounded-[14px] bg-ink px-6 py-16 text-paper sm:px-12">
        <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-accent/90 blur-[2px]" />
        <p className="relative font-mono text-[11px] uppercase tracking-[0.16em] text-paper/50">06 — Open source</p>
        <h2 className="relative mt-5 max-w-3xl font-display text-[clamp(40px,5.4vw,76px)] leading-[0.95] tracking-[-0.02em]">
          MIT licensed. Fork it, theme it, <em>ship it.</em>
        </h2>
        <p className="relative mt-5 max-w-lg text-[15px] leading-relaxed text-paper/65">Templates are small, readable React files. Add your own, improve the renderer, or open an issue with a design you want to see.</p>
        <div className="relative mt-8 flex flex-wrap gap-2.5">
          <LinkButton href={REPO_URL} external variant="accent" size="lg">
            <Github /> Star on GitHub
          </LinkButton>
          <LinkButton href={href('/docs')} size="lg" className="bg-paper/10 text-paper hover:bg-paper/15">
            Read the docs
          </LinkButton>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  return (
    <main>
      <Hero />
      <Featured />
      <Library />
      <Customize />
      <Exports />
      <Install />
      <OpenSource />
    </main>
  )
}
