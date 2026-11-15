import { ArrowRight, ArrowUpRight, Braces, Check, ChevronRight, Copy, FileCode2, FileImage, PenTool, Terminal as TerminalIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CodeBlock } from '../components/Code'
import { DitherField } from '../components/DitherField'
import { Github } from '../components/icons'
import { OgPreview } from '../components/OgPreview'
import { copyText, cn, LinkButton } from '../components/ui'
import { componentName, templateFile } from '../lib/codegen'
import { defaultConfig } from '../lib/config'
import { href } from '../lib/router'
import { installCommand, REGISTRY_URL, REPO_URL } from '../lib/site'
import { COLLECTIONS, type OgConfig } from '../og/core/types'
import { getTemplate, TEMPLATES } from '../og/templates'

const STYLES: { label: string; template: string }[] = [
  { label: 'Editorial', template: 'monograph' },
  { label: 'Developer', template: 'terminal' },
  { label: 'Abstract', template: 'atmosphere' },
  { label: 'Minimal', template: 'nothing' },
  { label: 'Experimental', template: 'dither' },
  { label: 'Product', template: 'launch' },
]
const CYCLE_MS = 3800
const EASE = [0.16, 1, 0.3, 1] as const

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'acme'
}

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: EASE, delay }}>
      {children}
    </motion.div>
  )
}

function SectionHead({ title, children }: { title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Reveal className="mb-10 grid gap-5 md:mb-12 md:grid-cols-[1fr_minmax(0,400px)] md:items-end">
      <h2 className="text-[clamp(36px,4.8vw,60px)] leading-[1.02] font-semibold tracking-[-0.045em] text-ink">{title}</h2>
      {children ? <div className="text-[15px] leading-relaxed text-ink-2">{children}</div> : null}
    </Reveal>
  )
}

function MoreLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a href={to} className="group mt-3 inline-flex items-center gap-1 text-[14px] font-medium text-ink">
      {children}
      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}

function CopyPill({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  const t = useRef(0)
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true)
          clearTimeout(t.current)
          t.current = window.setTimeout(() => setDone(false), 1600)
        }
      }}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-paper-2/70 px-5 text-[15px] font-medium text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] backdrop-blur transition-colors hover:bg-paper-3"
    >
      {done ? <Check className="size-4 text-accent" /> : <Copy className="size-4 text-ink-2" />}
      {done ? 'Copied to clipboard' : label}
    </button>
  )
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const cmd = installCommand('monograph')
  return (
    <section className="relative isolate overflow-hidden">
      {/* gradients.sh-style glow + dithercn horizon */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_138_255/0.16),transparent)] dark:bg-[radial-gradient(closest-side,rgb(124_138_255/0.14),transparent)]" />
        <div className="absolute inset-0">
          <DitherField variant="horizon" cell={6} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[max(100svh,760px)] max-w-[1200px] flex-col items-center px-5 pt-36 pb-56 text-center sm:pt-44">
        <motion.a
          href={href('/templates')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-7 inline-flex h-8 items-center gap-2 rounded-full bg-paper-2/70 pr-3 pl-1 text-[13px] text-ink-2 shadow-[inset_0_0_0_1px_var(--line-strong)] backdrop-blur transition-colors hover:text-ink"
        >
          <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] text-accent">30</span>
          Open Graph templates · shadcn registry · MIT
          <ChevronRight className="size-3.5" />
        </motion.a>
        <motion.h1
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
          className="max-w-[900px] text-[clamp(46px,7.6vw,96px)] leading-[0.98] font-semibold tracking-[-0.055em] text-ink"
        >
          Make every link
          <br />
          look <span className="text-gradient">incredible.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-ink-2 sm:text-[18px]"
        >
          Social cards for developers. Pick one of 30 templates, make it yours, then export a PNG or install the React source.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 }} className="mt-9 flex flex-wrap justify-center gap-3">
          <LinkButton href={href('/studio')} variant="primary" size="lg">
            Open the Studio <ChevronRight />
          </LinkButton>
          <CopyPill text={cmd} label="Copy install command" />
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────────────────── Stage: live style switcher ───────────────────────── */

function Stage() {
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
    <section className="relative z-10 mx-auto -mt-20 max-w-[1200px] px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 0.35 }} className="rounded-[28px] bg-paper-2/50 p-2 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:p-3" onPointerDown={() => setAuto(false)}>
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1 pb-3 sm:px-3">
          <div className="flex items-center gap-2 font-mono text-[12px] text-ink-3">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
            </span>
            <span className="ml-2 hidden rounded-md bg-paper/60 px-2 py-1 text-ink-2 sm:inline">{slug(name)}.dev</span>
          </div>
          <span className="font-mono text-[11.5px] text-ink-3">
            {String(tpl.number).padStart(2, '0')} · {tpl.name} · 1200×630
          </span>
        </div>
        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-[18px] bg-paper-3 shadow-[0_0_0_1px_var(--line)]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={config.template}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.015, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <OgPreview config={config} id={`hero-${config.template}`} />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* controls */}
        <div className="grid gap-2 p-1 pt-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div role="tablist" aria-label="Card style" className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-paper/50 p-1 shadow-[inset_0_0_0_1px_var(--line)]">
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
                  'relative flex h-8 shrink-0 items-center overflow-hidden rounded-full px-3.5 text-[13px] font-medium transition-colors duration-200',
                  style === i ? 'bg-paper-3 text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]' : 'text-ink-2 hover:text-ink',
                )}
              >
                {s.label}
                {style === i && auto ? <span key={`p${style}`} className="absolute bottom-0 left-3 h-px bg-accent" style={{ animation: `hero-progress ${CYCLE_MS}ms linear forwards` }} /> : null}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input aria-label="Project name" value={name} onChange={(e) => (setAuto(false), setName(e.target.value))} maxLength={24} className="h-10 w-28 rounded-full bg-paper/50 px-4 text-[13.5px] text-ink shadow-[inset_0_0_0_1px_var(--line)] outline-none focus:shadow-[inset_0_0_0_1px_var(--accent)]" />
            <input aria-label="Headline" value={headline} onChange={(e) => (setAuto(false), setHeadline(e.target.value))} maxLength={70} className="h-10 w-full min-w-0 rounded-full bg-paper/50 px-4 text-[13.5px] text-ink shadow-[inset_0_0_0_1px_var(--line)] outline-none focus:shadow-[inset_0_0_0_1px_var(--accent)] lg:w-72" />
          </div>
        </div>
      </motion.div>
      <style>{`@keyframes hero-progress{from{width:0}to{width:calc(100% - 24px)}}`}</style>

      <Reveal className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[14px] font-medium text-ink-2">
        {[
          ['Templates', '30'],
          ['Collections', '6'],
          ['Exports', 'png · svg · tsx · json'],
          ['Runtime deps', 'react'],
          ['License', 'MIT'],
        ].map(([k, v]) => (
          <span key={k} className="inline-flex items-center gap-2">
            {k} <small className="font-mono text-[12px] text-ink-3">{v}</small>
          </span>
        ))}
      </Reveal>
    </section>
  )
}

/* ───────────────────────── Marquee ───────────────────────── */

function MarqueeRow({ ids, reverse, dur }: { ids: string[]; reverse?: boolean; dur: number }) {
  const list = [...ids, ...ids]
  return (
    <div className="marquee overflow-hidden py-2">
      <div className={cn('marquee-track gap-4', reverse && 'reverse')} style={{ ['--dur' as string]: `${dur}s` }}>
        {list.map((id, i) => {
          const t = getTemplate(id)
          return (
            <a key={`${id}-${i}`} href={href(`/templates/${id}`)} aria-hidden={i >= ids.length} tabIndex={i >= ids.length ? -1 : undefined} className="group w-[300px] shrink-0 rounded-[18px] bg-paper-2 p-1.5 shadow-[var(--shadow-panel)] sm:w-[360px]">
              <div className="overflow-hidden rounded-[13px] shadow-[0_0_0_1px_var(--line)]">
                <OgPreview config={defaultConfig(id)} id={`mq-${id}-${i}`} />
              </div>
              <div className="flex items-center justify-between px-2 pt-2 pb-1 text-[12.5px]">
                <span className="font-medium text-ink">{t.name}</span>
                <span className="font-mono text-[11px] text-ink-3 transition-colors group-hover:text-accent">{COLLECTIONS.find((c) => c.id === t.collection)!.label}</span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function Marquee() {
  const ids = TEMPLATES.map((t) => t.id)
  return (
    <section className="pt-24 md:pt-28" aria-label="All templates">
      <MarqueeRow ids={ids.filter((_, i) => i % 2 === 0)} dur={110} />
      <MarqueeRow ids={ids.filter((_, i) => i % 2 === 1)} dur={125} reverse />
    </section>
  )
}

/* ───────────────────────── Bento of templates (dithercn) ───────────────────────── */

const BENTO: { id: string; span: string }[] = [
  { id: 'nocturne', span: 'md:col-span-4 md:row-span-2' },
  { id: 'terminal', span: 'md:col-span-2' },
  { id: 'halftone', span: 'md:col-span-2' },
  { id: 'monograph', span: 'md:col-span-3' },
  { id: 'spectrum', span: 'md:col-span-3' },
  { id: 'launch', span: 'md:col-span-2' },
  { id: 'pixel', span: 'md:col-span-2' },
  { id: 'repository', span: 'md:col-span-2' },
]

function Bento() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-28 sm:px-6 md:pt-36">
      <SectionHead title="Start from a template.">
        <p>Thirty cards in six collections. Each one has its own layout and type pairing, so no two look alike. Customize one, export it, or install it.</p>
        <MoreLink to={href('/templates')}>See all 30 templates</MoreLink>
      </SectionHead>
      <div className="grid gap-3 md:grid-cols-6">
        {BENTO.map(({ id, span }, i) => {
          const t = getTemplate(id)
          return (
            <Reveal key={id} className={span} delay={(i % 3) * 0.06}>
              <a href={href(`/templates/${id}`)} className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-paper-2 shadow-[var(--shadow-panel)]">
                <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgb(124_138_255/0.10),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative w-full overflow-hidden rounded-[10px] shadow-[0_0_0_1px_var(--line),0_20px_40px_-20px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]">
                    <OgPreview config={defaultConfig(id)} id={`bento-${id}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 pb-4 text-[13.5px]">
                  <span className="font-medium text-ink">{t.name}</span>
                  <span className="flex items-center gap-1 text-[12.5px] text-ink-3">
                    {COLLECTIONS.find((c) => c.id === t.collection)!.label}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                </div>
              </a>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────────────── Live customization (gradients.sh) ───────────────────────── */

const SWATCHES = ['#7c8aff', '#ff5a36', '#19c37d', '#ffb224', '#ff6bcb', '#f4f4f5']
const FONTS = ['Inter Tight', 'Instrument Serif', 'Unbounded', 'Space Grotesk', 'Bodoni Moda']

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt: (v: number) => string }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="grid gap-2">
      <span className="flex justify-between text-[12.5px] text-ink-2">
        {label}
        <span className="font-mono text-ink">{fmt(value)}</span>
      </span>
      <span className="relative block h-1 rounded-full bg-ink/10">
        <span className="absolute inset-y-0 left-0 rounded-full bg-ink" style={{ width: `${pct}%` }} />
        <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[0_0_0_1px_var(--line-strong),0_2px_6px_rgb(0_0_0/0.4)]" style={{ left: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="absolute inset-0 -top-2 h-5 w-full cursor-pointer opacity-0" aria-label={label} />
      </span>
    </label>
  )
}

function Customize() {
  const [accent, setAccent] = useState(SWATCHES[1])
  const [font, setFont] = useState(FONTS[0])
  const [scale, setScale] = useState(1)
  const [name, setName] = useState('Northwind')
  const cfg = useMemo<OgConfig>(() => {
    const c = defaultConfig('modernist')
    c.content = { ...c.content, name, headline: 'Ship the boring parts faster.', description: 'Infrastructure primitives for teams that would rather be building product.', category: 'Developer tools', domain: `${slug(name)}.dev` }
    c.theme = { accent }
    c.options = { ...c.options, displayFont: font === 'Inter Tight' ? undefined : font, scale }
    return c
  }, [accent, font, scale, name])

  const code = `import { ${componentName('modernist')} } from '@/components/opengraphcn/templates/${templateFile('modernist')}'

export function Og() {
  return (
    <${componentName('modernist')}
      content={{ name: '${name.replace(/'/g, "\\'")}', headline: 'Ship the boring parts faster.' }}
      theme={{ accent: '${accent}' }}
      options={{ ${font === 'Inter Tight' ? '' : `displayFont: '${font}', `}scale: ${scale.toFixed(2)} }}
    />
  )
}`

  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-28 sm:px-6 md:pt-36">
      <SectionHead title={<>Change anything. The card and the code keep up.</>}>
        <p>Every control in the Studio is a prop on the component. Change the colour, font or size and the code beside it changes too.</p>
        <MoreLink to={href('/studio?t=modernist')}>Open this in the Studio</MoreLink>
      </SectionHead>
      <Reveal className="grid overflow-hidden rounded-[24px] bg-paper-2 shadow-[var(--shadow-panel)] lg:grid-cols-[1.25fr_1fr]">
        <div className="relative overflow-hidden p-4 sm:p-8">
          <div className="grain absolute inset-0 bg-[radial-gradient(55%_75%_at_15%_15%,rgb(124_138_255/0.38),transparent),radial-gradient(50%_70%_at_90%_85%,rgb(255_128_206/0.3),transparent),radial-gradient(45%_55%_at_75%_5%,rgb(255_182_118/0.2),transparent)]" />
          <div className="relative grid gap-4">
            <div className="overflow-hidden rounded-[12px] shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_30px_60px_-20px_rgb(0_0_0/0.7)]">
              <OgPreview config={cfg} id="customize" />
            </div>
            <div className="grid gap-4 rounded-[16px] bg-[var(--glass)] p-4 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:grid-cols-2">
              <div className="grid content-start gap-3">
                <label className="grid gap-1.5">
                  <span className="text-[12.5px] text-ink-2">Project name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} maxLength={22} className="h-9 rounded-lg bg-paper/60 px-3 text-[13.5px] text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] outline-none focus:shadow-[inset_0_0_0_1px_var(--accent)]" />
                </label>
                <div className="grid gap-1.5">
                  <span className="text-[12.5px] text-ink-2">Accent</span>
                  <div className="flex gap-2">
                    {SWATCHES.map((s) => (
                      <button key={s} aria-label={`Accent ${s}`} onClick={() => setAccent(s)} className={cn('size-6 rounded-full transition-transform hover:scale-110', accent === s && 'ring-2 ring-ink ring-offset-2 ring-offset-paper-2')} style={{ background: s }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid content-start gap-3">
                <div className="grid gap-1.5">
                  <span className="text-[12.5px] text-ink-2">Display typeface</span>
                  <select value={font} onChange={(e) => setFont(e.target.value)} className="h-9 rounded-lg bg-paper/60 px-2.5 text-[13.5px] text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] outline-none">
                    {FONTS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <Slider label="Type scale" value={scale} min={0.8} max={1.2} step={0.01} onChange={setScale} fmt={(v) => `${v.toFixed(2)}×`} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col border-t border-line lg:border-t-0 lg:border-l">
          <div className="flex h-11 items-center gap-2 border-b border-line px-4 font-mono text-[12px] text-ink-3">
            <FileCode2 className="size-3.5 text-accent" /> components/og.tsx
          </div>
          <CodeBlock code={code} className="flex-1 rounded-none border-0 bg-transparent" />
          <div className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-[12px]">
            <span className="text-accent">$</span>
            <span className="no-scrollbar overflow-x-auto whitespace-nowrap text-ink-2">{installCommand('modernist')}</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ───────────────────────── Export & integrate ───────────────────────── */

const EXPORTS = [
  { icon: FileImage, name: 'PNG', ext: '.png', body: 'Exactly 1200×630, or 2× for retina. Rendered from the SVG right in your browser, with the fonts embedded.' },
  { icon: PenTool, name: 'SVG', ext: '.svg', body: 'A single vector file with the fonts and images built in. Opens anywhere.' },
  { icon: FileCode2, name: 'React', ext: '.tsx', body: 'A typed component that renders the same card from props.' },
  { icon: TerminalIcon, name: 'Next.js', ext: 'route', body: 'An opengraph-image.tsx route that renders the same SVG on the server with resvg.' },
  { icon: Braces, name: 'JSON', ext: '.json', body: 'The full, versioned design. Import it later to pick up where you left off.' },
]

const NEXT_SNIPPET = `// app/opengraph-image.tsx
import { monograph } from '@/components/opengraphcn/templates/monograph'
import { renderOgPng } from '@/components/opengraphcn/server/render'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const png = await renderOgPng(monograph, {
    content: { name: 'Acme', headline: 'Build something remarkable.' },
  })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}`

function Exports() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-28 sm:px-6 md:pt-36">
      <SectionHead title="From the Studio to production, without a screenshot.">
        <p>The Studio preview, the PNG export and the Next.js route all render the same SVG. What you see is the file that ships.</p>
      </SectionHead>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.15fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {EXPORTS.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.04} className={cn(i === 0 && 'sm:col-span-2')}>
              <div className="group flex h-full flex-col gap-3 rounded-[20px] bg-paper-2 p-5 shadow-[var(--shadow-panel)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-[10px] bg-accent/12 text-accent shadow-[inset_0_0_0_1px_rgb(124_138_255/0.25)]">
                    <e.icon className="size-[18px]" strokeWidth={1.7} />
                  </span>
                  <span className="font-mono text-[11.5px] text-ink-3">{e.ext}</span>
                </div>
                <p className="mt-2 text-[15px] font-medium text-ink">{e.name}</p>
                <p className="text-[13.5px] leading-relaxed text-ink-2">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="flex min-w-0 flex-col overflow-hidden rounded-[20px] bg-paper-2 shadow-[var(--shadow-panel)]">
          <div className="flex h-11 items-center justify-between border-b border-line px-4 font-mono text-[12px] text-ink-3">
            <span className="flex items-center gap-2">
              <span className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
              </span>
              <span className="ml-2">app/opengraph-image.tsx</span>
            </span>
            <span>Node runtime</span>
          </div>
          <CodeBlock code={NEXT_SNIPPET} className="flex-1 rounded-none border-0 bg-transparent" />
          <p className="border-t border-line px-4 py-3 text-[12.5px] leading-relaxed text-ink-3">
            Line breaks come from the same font measurements in the browser and in Node. On the server, fontkit turns the text into outlines and resvg draws the PNG. No headless browser is involved.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Install ───────────────────────── */

function Install() {
  const cmd = installCommand('monograph')
  const [done, setDone] = useState(false)
  return (
    <section className="mx-auto max-w-[1200px] px-4 pt-28 sm:px-6 md:pt-36">
      <SectionHead title="One command. Only the template you need.">
        <p>
          Every template is its own item in the shadcn registry. You get one small React file plus a shared core. The website and the Studio don't come with it.
        </p>
      </SectionHead>
      <Reveal>
        <button
          type="button"
          onClick={async () => {
            if (await copyText(cmd)) {
              setDone(true)
              setTimeout(() => setDone(false), 1600)
            }
          }}
          className="group flex w-full items-center gap-3 overflow-hidden rounded-[18px] bg-paper-2 py-4 pr-4 pl-5 text-left shadow-[var(--shadow-panel)] transition-colors hover:bg-paper-3/80"
        >
          <span className="font-mono text-[13px] text-accent">$</span>
          <code className="no-scrollbar flex-1 overflow-x-auto font-mono text-[13.5px] whitespace-nowrap text-ink">{cmd}</code>
          <span className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-paper/60 px-3 text-[12.5px] text-ink-2 shadow-[inset_0_0_0_1px_var(--line-strong)] group-hover:text-ink">
            {done ? <Check className="size-3.5 text-accent" /> : <Copy className="size-3.5" />}
            {done ? 'Copied' : 'Copy'}
          </span>
        </button>
      </Reveal>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {[
          { n: '01', h: 'Add a template', b: 'The shadcn CLI copies the template and the small shared core into components/opengraphcn.' },
          { n: '02', h: 'Render it', b: 'It is just an <svg>, so it works anywhere React runs, server components included.' },
          { n: '03', h: 'Ship the image', b: 'Add the server item and serve a real PNG from a Next.js opengraph-image route.' },
        ].map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="h-full rounded-[20px] bg-paper-2 p-5 shadow-[var(--shadow-panel)]">
              <p className="font-mono text-[12px] text-accent">{s.n}</p>
              <p className="mt-6 text-[15px] font-medium text-ink">{s.h}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{s.b}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] text-ink-3">
        Registry:{' '}
        <a className="font-mono underline decoration-line-strong underline-offset-2 hover:text-ink" href={`${REGISTRY_URL}/registry.json`} target="_blank" rel="noreferrer">
          {REGISTRY_URL.replace(/^https?:\/\//, '')}/registry.json
        </a>{' '}
        · swap <span className="font-mono">monograph</span> for any template id.
      </p>
    </section>
  )
}

/* ───────────────────────── Open source CTA ───────────────────────── */

function OpenSource() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-28 sm:px-6 md:py-36">
      <Reveal className="relative isolate overflow-hidden rounded-[28px] bg-paper-2 px-6 py-20 text-center shadow-[var(--shadow-panel)] sm:px-12 md:py-28">
        <div className="absolute inset-0 -z-10">
          <DitherField variant="tide" cell={6} stars />
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_55%_at_50%_40%,var(--paper-2)_40%,transparent)]" />
        <h2 className="mx-auto max-w-3xl text-[clamp(38px,5.6vw,72px)] leading-[1] font-semibold tracking-[-0.05em] text-ink">
          Open source.
          <br />
          <span className="text-gradient">Fork it, theme it, ship it.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-ink-2">Each template is a small, readable React file under the MIT license. Add your own, improve the renderer, or open an issue with a design you'd like to see.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <LinkButton href={REPO_URL} external variant="primary" size="lg">
            <Github /> Star on GitHub
          </LinkButton>
          <LinkButton href={href('/docs')} variant="outline" size="lg">
            Read the docs <ArrowRight />
          </LinkButton>
        </div>
      </Reveal>
    </section>
  )
}

export function Home() {
  return (
    <main>
      <Hero />
      <Stage />
      <Marquee />
      <Bento />
      <Customize />
      <Exports />
      <Install />
      <OpenSource />
    </main>
  )
}
