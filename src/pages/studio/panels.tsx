import { Download, FileJson, ImagePlus, Link2, RotateCcw, Trash2, Upload } from 'lucide-react'
import { Github } from '../../components/icons'
import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { CodeBlock } from '../../components/Code'
import { OgPreview } from '../../components/OgPreview'
import { Button, Field, Input, Segmented, Switch, Textarea, cn, copyText, useToast } from '../../components/ui'
import { jsonSource, nextSource, reactSource, fileBase } from '../../lib/codegen'
import { encodeShare, hasUploads, normalizeConfig, resolvedTheme } from '../../lib/config'
import { download } from '../../og/core/export'
import { FONT_FACES } from '../../og/core/fonts'
import { COLLECTIONS, type Collection, type OgAssets, type OgConfig, type OgContent, type OgTheme } from '../../og/core/types'
import { getTemplate, TEMPLATES } from '../../og/templates'

export type Update = (fn: (c: OgConfig) => OgConfig, key?: string) => void

/* ───────────── Template browser ───────────── */

export function TemplateBrowser({ config, onPick, compact }: { config: OgConfig; onPick: (id: string) => void; compact?: boolean }) {
  const [q, setQ] = useState('')
  const [col, setCol] = useState<Collection | 'all'>('all')
  const deferred = useDeferredValue(config.content)
  const list = TEMPLATES.filter((t) => (col === 'all' || t.collection === col) && (!q || `${t.name} ${t.collection} ${t.description}`.toLowerCase().includes(q.toLowerCase())))
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid gap-2.5 border-b border-line p-3">
        <Input placeholder="Search 30 templates…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search templates" className="h-8 text-[13px]" />
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {[{ id: 'all' as const, label: 'All' }, ...COLLECTIONS].map((c) => (
            <button
              key={c.id}
              onClick={() => setCol(c.id)}
              className={cn('h-6 shrink-0 rounded-full px-2.5 text-[11.5px] font-medium transition-colors', col === c.id ? 'bg-paper-3 text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]' : 'text-ink-2 hover:bg-paper-3/60 hover:text-ink')}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className={cn('scrollbar-thin min-h-0 flex-1 overflow-y-auto p-3', compact ? 'grid grid-cols-2 content-start gap-3' : 'grid content-start gap-3.5')}>
        {list.map((t) => {
          const active = t.id === config.template
          return (
            <button key={t.id} onClick={() => onPick(t.id)} className="group text-left" aria-pressed={active} aria-label={`Use ${t.name} template`}>
              <div className={cn('overflow-hidden rounded-lg transition-shadow duration-200', active ? 'shadow-[0_0_0_2px_var(--accent)]' : 'shadow-[0_0_0_1px_var(--line)] group-hover:shadow-[0_0_0_1px_var(--line-strong)]')}>
                <ThumbPreview id={t.id} content={deferred} assets={config.assets} />
              </div>
              <p className="mt-1.5 flex items-baseline gap-1.5 text-[12px] font-medium text-ink">
                <span className="font-mono text-[10px] text-ink-3">{String(t.number).padStart(2, '0')}</span>
                {t.name}
              </p>
            </button>
          )
        })}
        {!list.length ? <p className="col-span-2 py-8 text-center text-[13px] text-ink-3">No templates match “{q}”.</p> : null}
      </div>
    </div>
  )
}

function ThumbPreview({ id, content, assets }: { id: string; content: OgContent; assets: OgAssets }) {
  const cfg = useMemo(() => normalizeConfig({ template: id, content, assets, options: {} }), [id, content, assets])
  return <OgPreview config={cfg} id={`thumb-${id}`} />
}

/* ───────────── Content ───────────── */

export function ContentPanel({ config, update }: { config: OgConfig; update: Update }) {
  const c = config.content
  const t = getTemplate(config.template)
  const set = (k: keyof OgContent) => (e: { target: { value: string } }) => {
    const value = e.target.value
    update((cfg) => ({ ...cfg, content: { ...cfg.content, [k]: value } }), `content.${k}`)
  }
  const uses = new Set(t.uses ?? [])
  const repo = c.owner || c.language || c.stars != null || c.forks != null || t.id === 'repository'
  return (
    <div className="grid gap-4">
      <Field label="Project name" htmlFor="f-name">
        <Input id="f-name" value={c.name} onChange={set('name')} maxLength={60} />
      </Field>
      <Field label="Headline" htmlFor="f-headline" counter={{ value: c.headline.length, limit: t.limits?.headline }} hint={t.limits?.headline && c.headline.length > t.limits.headline ? 'Over the recommended length — the layout will shrink, then clamp with an ellipsis.' : undefined}>
        <Textarea id="f-headline" rows={2} value={c.headline} onChange={set('headline')} maxLength={240} />
      </Field>
      <Field label="Description" htmlFor="f-desc" counter={{ value: c.description.length, limit: t.limits?.description }}>
        <Textarea id="f-desc" rows={3} value={c.description} onChange={set('description')} maxLength={320} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Domain" htmlFor="f-domain">
          <Input id="f-domain" value={c.domain} onChange={set('domain')} maxLength={80} />
        </Field>
        <Field label={`Author${uses.has('author') ? '' : ' ·'}`} htmlFor="f-author">
          <Input id="f-author" value={c.author} onChange={set('author')} maxLength={60} />
        </Field>
        <Field label="Category" htmlFor="f-cat">
          <Input id="f-cat" value={c.category} onChange={set('category')} maxLength={40} />
        </Field>
        <Field label="Badge" htmlFor="f-badge">
          <Input id="f-badge" value={c.badge} onChange={set('badge')} maxLength={24} />
        </Field>
        <Field label="Date" htmlFor="f-date" className="col-span-2">
          <Input id="f-date" value={c.date} onChange={set('date')} maxLength={40} />
        </Field>
      </div>
      <p className="text-[11.5px] leading-snug text-ink-3">
        {t.name} shows: name, headline, description{t.uses?.length ? `, ${t.uses.filter((u) => !['logo', 'favicon', 'screenshot', 'avatar'].includes(u)).join(', ')}` : ''}. Fields a template doesn’t use are kept for the next one.
      </p>
      {repo ? (
        <details className="group rounded-xl border border-line bg-paper-2/60 p-3" open={t.id === 'repository'}>
          <summary className="cursor-pointer text-[12px] font-medium text-ink-2">Repository metadata</summary>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Owner" htmlFor="f-owner">
              <Input id="f-owner" value={c.owner ?? ''} onChange={set('owner')} />
            </Field>
            <Field label="Language" htmlFor="f-lang">
              <Input id="f-lang" value={c.language ?? ''} onChange={set('language')} />
            </Field>
            {(['stars', 'forks'] as const).map((k) => (
              <Field key={k} label={k[0].toUpperCase() + k.slice(1)} htmlFor={`f-${k}`}>
                <Input
                  id={`f-${k}`}
                  type="number"
                  min={0}
                  value={c[k] ?? ''}
                  placeholder="unknown"
                  onChange={(e) => {
                    const v = e.target.value === '' ? null : Math.max(0, Math.floor(Number(e.target.value)))
                    update((cfg) => ({ ...cfg, content: { ...cfg.content, [k]: v } }), `content.${k}`)
                  }}
                />
              </Field>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] text-ink-3">Leave empty to hide. opengraphcn never makes numbers up.</p>
        </details>
      ) : null}
    </div>
  )
}

/* ───────────── Style ───────────── */

const FAMILIES = [...new Set(FONT_FACES.map((f) => f.family))]
const COLOR_FIELDS: { key: keyof OgTheme; label: string }[] = [
  { key: 'accent', label: 'Accent' },
  { key: 'primary', label: 'Primary' },
  { key: 'background', label: 'Background' },
  { key: 'text', label: 'Text' },
]

export function StylePanel({ config, update, keepColors, setKeepColors }: { config: OgConfig; update: Update; keepColors: boolean; setKeepColors: (v: boolean) => void }) {
  const t = getTemplate(config.template)
  const theme = resolvedTheme(config)
  const setColor = (k: keyof OgTheme, v: string | undefined) => update((c) => ({ ...c, theme: { ...c.theme, [k]: v } }), `theme.${k}`)
  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11.5px] text-ink-2">Colors</p>
          {Object.values(config.theme).some(Boolean) ? (
            <Button size="sm" variant="ghost" onClick={() => update((c) => ({ ...c, theme: {} }))}>
              <RotateCcw /> Template colors
            </Button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_FIELDS.map(({ key, label }) => {
            const overridden = !!config.theme[key]
            return (
              <label key={key} className="flex items-center gap-2 rounded-lg border border-line-strong bg-paper-2/60 p-1.5 pr-2 transition-colors hover:border-ink/30">
                <input type="color" aria-label={`${label} color`} value={theme[key]} onChange={(e) => setColor(key, e.target.value)} className="size-7 shrink-0" />
                <span className="grid min-w-0 flex-1">
                  <span className="text-[11px] text-ink-3">{label}</span>
                  <input
                    aria-label={`${label} hex`}
                    className="w-full bg-transparent font-mono text-[12px] text-ink outline-none"
                    defaultValue={theme[key]}
                    key={theme[key]}
                    onBlur={(e) => /^#[0-9a-f]{6}$/i.test(e.target.value) && setColor(key, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  />
                </span>
                {overridden ? (
                  <button aria-label={`Reset ${label}`} title="Reset to template color" onClick={(e) => (e.preventDefault(), setColor(key, undefined))} className="size-2 rounded-full bg-accent" />
                ) : null}
              </label>
            )
          })}
        </div>
        <Switch id="keep-colors" checked={keepColors} onChange={setKeepColors} label="Keep my colors when switching templates" />
      </div>

      <Field label="Display typeface" htmlFor="f-font" hint={`Default: ${t.fonts.display.family}. Body and label fonts stay as designed.`}>
        <select
          id="f-font"
          value={config.options.displayFont ?? ''}
          onChange={(e) => update((c) => ({ ...c, options: { ...c.options, displayFont: e.target.value || undefined } }))}
          className="h-9 w-full rounded-lg border border-line-strong bg-paper-2/60 px-2.5 text-sm text-ink focus:border-accent/70 focus:outline-none"
        >
          <option value="">{t.fonts.display.family} (template default)</option>
          {FAMILIES.filter((f) => f !== t.fonts.display.family).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`Type scale · ${config.options.scale.toFixed(2)}×`} htmlFor="f-scale" hint="Scales the headline’s maximum size. Fitting still keeps it inside the safe area.">
        <input id="f-scale" type="range" min={0.8} max={1.2} step={0.01} value={config.options.scale} onChange={(e) => update((c) => ({ ...c, options: { ...c.options, scale: Number(e.target.value) } }), 'options.scale')} />
      </Field>
    </div>
  )
}

/* ───────────── Brand ───────────── */

async function readImage(file: File, max = 1400): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('read'))
    r.readAsDataURL(file)
  })
  if (file.type === 'image/svg+xml') return raw
  const img = new Image()
  img.src = raw
  await img.decode()
  const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight))
  if (scale === 1 && file.size < 600_000) return raw
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
  return file.type === 'image/png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.88)
}

const ASSETS: { key: keyof OgAssets; label: string; hint: string }[] = [
  { key: 'logo', label: 'Logo', hint: 'Square works best. Replaces the monogram.' },
  { key: 'favicon', label: 'Favicon', hint: 'Fallback mark when no logo is set.' },
  { key: 'screenshot', label: 'Product screenshot', hint: 'Used by Showcase, The Cover and Canvas.' },
  { key: 'avatar', label: 'Avatar / portrait', hint: 'Used by Founder and Repository.' },
]

export function BrandPanel({ config, update }: { config: OgConfig; update: Update }) {
  const t = getTemplate(config.template)
  const toast = useToast()
  const uses = new Set(t.uses ?? [])
  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        {ASSETS.map((a) => {
          const value = config.assets[a.key]
          return (
            <div key={a.key} className="flex items-center gap-3 rounded-xl border border-line bg-paper-2/60 p-2.5">
              <div className="dot-grid grid size-12 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-paper-2">
                {value ? <img src={value} alt="" className="size-full object-contain" /> : <ImagePlus className="size-4 text-ink-3" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  {a.label}
                  {uses.has(a.key) ? <span className="rounded bg-accent/12 px-1.5 py-px font-mono text-[9.5px] uppercase tracking-wide text-accent">used here</span> : null}
                </p>
                <p className="truncate text-[11.5px] text-ink-3">{a.hint}</p>
              </div>
              {value ? (
                <Button size="icon-sm" variant="ghost" aria-label={`Remove ${a.label}`} onClick={() => update((c) => ({ ...c, assets: { ...c.assets, [a.key]: undefined } }))}>
                  <Trash2 />
                </Button>
              ) : null}
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-paper-3/80 px-2.5 text-[12.5px] font-medium text-ink shadow-[inset_0_0_0_1px_var(--line)] transition-colors hover:bg-paper-3">
                <Upload className="size-3.5" />
                {value ? 'Replace' : 'Upload'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    e.target.value = ''
                    if (!file) return
                    if (file.size > 8_000_000) return toast('That image is over 8 MB — try a smaller one.', 'error')
                    try {
                      const data = await readImage(file)
                      update((c) => ({ ...c, assets: { ...c.assets, [a.key]: data } }))
                    } catch {
                      toast('Could not read that image.', 'error')
                    }
                  }}
                />
              </label>
            </div>
          )
        })}
        <p className="text-[11.5px] leading-snug text-ink-3">Images stay in your browser. They are embedded in PNG/SVG exports and omitted from share links.</p>
      </div>
      <div className="grid gap-1 border-t border-line pt-4">
        <Switch id="show-brand" checked={config.options.showBrand} onChange={(v) => update((c) => ({ ...c, options: { ...c.options, showBrand: v } }))} label="Show brand name" />
        <Switch id="show-meta" checked={config.options.showMeta} onChange={(v) => update((c) => ({ ...c, options: { ...c.options, showMeta: v } }))} label="Show metadata (domain, date, author…)" />
      </div>
    </div>
  )
}

/* ───────────── Export ───────────── */

export function ExportPanel({ config, onPng, onSvg, busy, onLoadJson, onImport }: { config: OgConfig; onPng: (scale: 1 | 2) => void; onSvg: () => void; busy: string | null; onLoadJson: (c: OgConfig) => void; onImport: () => void }) {
  const [tab, setTab] = useState<'react' | 'next' | 'json'>('react')
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const code = tab === 'react' ? reactSource(config) : tab === 'next' ? nextSource(config) : jsonSource(config)
  const ext = tab === 'json' ? 'json' : 'tsx'
  const filename = tab === 'next' ? 'opengraph-image.tsx' : tab === 'json' ? `${fileBase(config)}.json` : `${fileBase(config)}.tsx`
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="accent" className="col-span-2 h-10" onClick={() => onPng(1)} disabled={!!busy}>
          <Download /> {busy === 'png' ? 'Rendering…' : 'Download PNG · 1200×630'}
        </Button>
        <Button onClick={() => onPng(2)} disabled={!!busy}>
          PNG @2x
        </Button>
        <Button onClick={onSvg} disabled={!!busy}>
          {busy === 'svg' ? 'Rendering…' : 'SVG'}
        </Button>
      </div>

      <div className="grid gap-2">
        <Segmented
          size="sm"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'react', label: 'React' },
            { value: 'next', label: 'Next.js' },
            { value: 'json', label: 'JSON' },
          ]}
        />
        <CodeBlock code={code} lang={tab === 'json' ? 'json' : 'tsx'} title={filename} maxHeight={300} />
        <Button size="sm" variant="ghost" className="justify-self-start" onClick={() => download(code, filename, ext === 'json' ? 'application/json' : 'text/plain')}>
          <Download /> Download {filename}
        </Button>
      </div>

      <div className="grid gap-2 border-t border-line pt-4">
        <Button
          variant="outline"
          onClick={async () => {
            const url = `${location.origin}${location.pathname}#/studio?d=${encodeShare(config)}`
            if (await copyText(url)) toast(hasUploads(config) ? 'Link copied — uploaded images aren’t included in links.' : 'Share link copied.')
          }}
        >
          <Link2 /> Copy share link
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <FileJson /> Import JSON
          </Button>
          <Button variant="outline" onClick={onImport}>
            <Github /> From GitHub
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            e.target.value = ''
            if (!f) return
            try {
              onLoadJson(normalizeConfig(JSON.parse(await f.text())))
              toast('Design restored from JSON.')
            } catch {
              toast('That file isn’t a valid opengraphcn JSON export.', 'error')
            }
          }}
        />
      </div>
    </div>
  )
}
