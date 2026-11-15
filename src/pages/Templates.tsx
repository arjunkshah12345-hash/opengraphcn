import { ArrowLeft, ArrowRight, Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CodeBlock } from '../components/Code'
import { OgPreview } from '../components/OgPreview'
import { Button, CopyButton, LinkButton, cn, useToast } from '../components/ui'
import { componentName, templateFile } from '../lib/codegen'
import { defaultConfig } from '../lib/config'
import { href } from '../lib/router'
import { installCommand } from '../lib/site'
import { COLLECTIONS, type Collection } from '../og/core/types'
import { TEMPLATES } from '../og/templates'
import { exportPng } from './studio/Studio'

export function TemplatesPage() {
  const [col, setCol] = useState<Collection | 'all'>('all')
  return (
    <main className="relative isolate">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] overflow-hidden [mask-image:linear-gradient(black,transparent)]">
        <div className="absolute top-[-40%] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_138_255/0.16),transparent)]" />
      </div>
      <div className="mx-auto max-w-[1200px] px-4 pt-36 pb-28 sm:px-6 sm:pt-40">
      <p className="mb-5 font-mono text-[12px] text-accent">Template library · 30</p>
      <h1 className="max-w-3xl text-[clamp(42px,6vw,76px)] leading-[1] font-semibold tracking-[-0.05em] text-ink">Pick a direction. Make it yours.</h1>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2">Six collections of five templates. Each one has its own layout and type pairing, and each exports to PNG, SVG, React and Next.js.</p>
      <div className="sticky top-20 z-20 mt-10 flex justify-start">
        <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-[var(--glass)] p-1 shadow-[var(--shadow-panel)] backdrop-blur-xl">
          {[{ id: 'all' as const, label: 'All', letter: '' }, ...COLLECTIONS].map((c) => (
            <button key={c.id} onClick={() => setCol(c.id)} className={cn('h-8 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-colors', col === c.id ? 'bg-paper-3 text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]' : 'text-ink-2 hover:text-ink')}>
              {c.label}
              <span className="ml-1.5 font-mono text-[10.5px] text-ink-3">{c.id === 'all' ? 30 : 5}</span>
            </button>
          ))}
        </div>
      </div>
      {COLLECTIONS.filter((c) => col === 'all' || c.id === col).map((c) => (
        <section key={c.id} className="pt-12">
          <div className="mb-6 flex items-baseline gap-3">
            <h2 className="text-[30px] leading-none font-semibold tracking-[-0.04em] text-ink">{c.label}</h2>
            <span className="font-mono text-[12px] text-ink-3">05</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.filter((t) => t.collection === c.id).map((t) => (
              <a key={t.id} href={href(`/templates/${t.id}`)} className="group flex flex-col rounded-[20px] bg-paper-2 p-2 shadow-[var(--shadow-panel)] transition-colors hover:bg-paper-3/70">
                <div className="overflow-hidden rounded-[13px] shadow-[0_0_0_1px_var(--line)]">
                  <div className="transition-transform duration-500 ease-out-expo group-hover:scale-[1.025]">
                    <OgPreview config={defaultConfig(t.id)} id={`lib-${t.id}`} />
                  </div>
                </div>
                <div className="px-3 pt-3 pb-2">
                  <p className="flex items-center justify-between text-[14px] font-medium text-ink">
                    {t.name}
                    <span className="font-mono text-[11px] text-ink-3">{String(t.number).padStart(2, '0')}</span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-2">{t.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
      </div>
    </main>
  )
}

export function TemplateDetail({ id }: { id: string }) {
  const t = TEMPLATES.find((x) => x.id === id)
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const cfg = useMemo(() => defaultConfig(id), [id])
  if (!t) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 pt-36 pb-24">
        <p className="text-ink-2">No template called “{id}”.</p>
        <LinkButton href={href('/templates')} className="mt-4">
          Back to templates
        </LinkButton>
      </main>
    )
  }
  const idx = TEMPLATES.indexOf(t)
  const prev = TEMPLATES[(idx + TEMPLATES.length - 1) % TEMPLATES.length]
  const next = TEMPLATES[(idx + 1) % TEMPLATES.length]
  const col = COLLECTIONS.find((c) => c.id === t.collection)!
  const fonts = [...new Set(Object.values(t.fonts).map((f) => `${f.family}${f.style === 'italic' ? ' Italic' : ''}`))]
  const usage = `import { ${componentName(t.id)} } from '@/components/opengraphcn/templates/${templateFile(t.id)}'

<${componentName(t.id)}
  content={{ name: 'Acme', headline: 'Build something remarkable.' }}
  theme={{ accent: '${t.theme.accent}' }}
/>`
  return (
    <main className="mx-auto max-w-[1200px] px-4 pt-28 pb-28 sm:px-6 sm:pt-32">
      <div className="mb-8 flex items-center justify-between">
        <LinkButton href={href('/templates')} variant="ghost" size="sm">
          <ArrowLeft /> All templates
        </LinkButton>
        <div className="flex gap-1">
          <LinkButton href={href(`/templates/${prev.id}`)} variant="ghost" size="sm" aria-label={`Previous: ${prev.name}`}>
            <ArrowLeft /> {prev.name}
          </LinkButton>
          <LinkButton href={href(`/templates/${next.id}`)} variant="ghost" size="sm" aria-label={`Next: ${next.name}`}>
            {next.name} <ArrowRight />
          </LinkButton>
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="rounded-[24px] bg-paper-2 p-2 shadow-[var(--shadow-panel)] sm:p-3">
            <div className="overflow-hidden rounded-[16px] shadow-[0_0_0_1px_var(--line)]">
              <OgPreview config={cfg} id={`detail-${t.id}`} />
            </div>
          </div>
        </div>
        <div className="grid content-start gap-6">
          <div>
            <p className="font-mono text-[12px] text-accent">
              {String(t.number).padStart(2, '0')} · {col.label}
            </p>
            <h1 className="mt-3 text-[48px] leading-[1] font-semibold tracking-[-0.05em] text-ink">{t.name}</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href={href(`/studio?t=${t.id}`)} variant="primary">
              Customize in Studio <ArrowRight />
            </LinkButton>
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  await exportPng(cfg)
                  toast('PNG downloaded')
                } catch {
                  toast('Export failed', 'error')
                } finally {
                  setBusy(false)
                }
              }}
            >
              <Download /> {busy ? 'Rendering…' : 'PNG'}
            </Button>
          </div>
          <dl className="grid grid-cols-[96px_1fr] gap-y-2.5 border-t border-line pt-5 text-[13px]">
            <dt className="text-ink-3">Typefaces</dt>
            <dd className="text-ink">{fonts.join(', ')}</dd>
            <dt className="text-ink-3">Palette</dt>
            <dd className="flex gap-1.5">
              {Object.entries(t.theme).map(([k, v]) => (
                <span key={k} title={`${k} ${v}`} className="size-5 rounded-full shadow-[0_0_0_1px_var(--line-strong)]" style={{ background: v }} />
              ))}
            </dd>
            <dt className="text-ink-3">Guidance</dt>
            <dd className="text-ink">
              Headline ≤ {t.limits?.headline ?? 60} chars{t.limits?.description ? `, description ≤ ${t.limits.description}` : ''}
            </dd>
            <dt className="text-ink-3">Uses</dt>
            <dd className="text-ink">{['name', 'headline', 'description', 'domain', ...(t.uses ?? [])].join(', ')}</dd>
          </dl>
          <div className="grid gap-2">
            <p className="text-[12px] font-medium text-ink-2">Install</p>
            <div className="flex items-center gap-2 rounded-xl bg-paper-2 py-1.5 pr-1.5 pl-3 shadow-[var(--shadow-panel)]">
              <code className="no-scrollbar flex-1 overflow-x-auto font-mono text-[12px] whitespace-nowrap text-ink">{installCommand(t.id)}</code>
              <CopyButton text={installCommand(t.id)} />
            </div>
          </div>
          <CodeBlock code={usage} />
        </div>
      </div>
    </main>
  )
}

