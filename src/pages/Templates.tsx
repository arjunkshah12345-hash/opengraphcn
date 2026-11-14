import { ArrowLeft, ArrowRight, Download } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CodeBlock } from '../components/Code'
import { OgFrame, OgPreview } from '../components/OgPreview'
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
    <main className="mx-auto max-w-[1240px] px-4 pt-14 pb-24 sm:px-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Template library · 30</p>
      <h1 className="max-w-3xl font-display text-[clamp(44px,6vw,80px)] leading-[0.95] tracking-[-0.02em] text-ink">Pick a direction. Make it yours.</h1>
      <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2">Six collections, five templates each. Every one has its own composition, type pairing and layout rules — and exports to PNG, SVG, React and Next.js.</p>
      <div className="no-scrollbar sticky top-14 z-10 -mx-4 mt-10 flex gap-1 overflow-x-auto border-b border-line bg-paper/90 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        {[{ id: 'all' as const, label: 'All', letter: '' }, ...COLLECTIONS].map((c) => (
          <button key={c.id} onClick={() => setCol(c.id)} className={cn('h-8 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-colors', col === c.id ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2 hover:text-ink')}>
            {c.letter ? <span className="mr-1.5 font-mono text-[10.5px] opacity-50">{c.letter}</span> : null}
            {c.label}
          </button>
        ))}
      </div>
      {COLLECTIONS.filter((c) => col === 'all' || c.id === col).map((c) => (
        <section key={c.id} className="pt-12">
          <div className="mb-5 flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-accent">{c.letter}</span>
            <h2 className="font-display text-[34px] leading-none text-ink">{c.label}</h2>
          </div>
          <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.filter((t) => t.collection === c.id).map((t) => (
              <a key={t.id} href={href(`/templates/${t.id}`)} className="group block">
                <OgFrame className="transition-transform duration-300 ease-out-quart group-hover:-translate-y-1">
                  <OgPreview config={defaultConfig(t.id)} id={`lib-${t.id}`} />
                </OgFrame>
                <p className="mt-3 text-[14px] font-medium text-ink">
                  <span className="mr-2 font-mono text-[11px] text-ink-3">{String(t.number).padStart(2, '0')}</span>
                  {t.name}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-ink-2">{t.description}</p>
              </a>
            ))}
          </div>
        </section>
      ))}
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
      <main className="mx-auto max-w-[1240px] px-6 py-24">
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
    <main className="mx-auto max-w-[1240px] px-4 pt-8 pb-24 sm:px-6">
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
          <OgFrame>
            <OgPreview config={cfg} id={`detail-${t.id}`} />
          </OgFrame>
        </div>
        <div className="grid content-start gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              {String(t.number).padStart(2, '0')} · {col.label}
            </p>
            <h1 className="mt-3 font-display text-[56px] leading-[0.95] text-ink">{t.name}</h1>
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
            <div className="flex items-center gap-2 rounded-lg border border-line bg-paper-2/60 py-1.5 pr-1.5 pl-3">
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

