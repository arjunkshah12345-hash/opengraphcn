import { Bookmark, Expand, FolderOpen, Maximize, Minus, Plus, Redo2, RotateCcw, Save, Undo2 } from 'lucide-react'
import { Github } from '../../components/icons'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { OgPreview } from '../../components/OgPreview'
import { Button, Kbd, cn, useToast } from '../../components/ui'
import { fileBase } from '../../lib/codegen'
import { decodeShare, defaultConfig, normalizeConfig } from '../../lib/config'
import { siteFonts } from '../../lib/fonts'
import { navigate, type Route } from '../../lib/router'
import { loadDraft, saveDesign, saveDraft } from '../../lib/storage'
import { useStudio } from '../../lib/useStudio'
import { download, renderSvg, svgToPng } from '../../og/core/export'
import { OgImage } from '../../og/core/render'
import { COLLECTIONS, type OgConfig } from '../../og/core/types'
import { getTemplate } from '../../og/templates'
import { FullPreview, GitHubDialog, SavedDialog } from './dialogs'
import { BrandPanel, ContentPanel, ExportPanel, StylePanel, TemplateBrowser } from './panels'

type Tab = 'templates' | 'content' | 'style' | 'brand' | 'export'

function initialConfig(route: Route): OgConfig {
  const d = route.query.get('d')
  if (d) {
    const shared = decodeShare(d)
    if (shared) return shared
  }
  const draft = loadDraft()
  const t = route.query.get('t')
  if (t) return normalizeConfig({ ...(draft ?? defaultConfig()), template: t, theme: {} })
  return draft ?? defaultConfig()
}

/** render the current config to a standalone SVG string (fonts embedded) */
export function exportSvg(config: OgConfig) {
  const t = getTemplate(config.template)
  return renderSvg(<OgImage template={t} id="export" content={config.content} theme={config.theme} assets={config.assets} options={config.options} />, { fonts: siteFonts })
}

export async function exportPng(config: OgConfig, scale: 1 | 2 = 1) {
  const blob = await svgToPng(await exportSvg(config), scale)
  download(blob, `${fileBase(config)}${scale === 2 ? '@2x' : ''}.png`)
  return blob
}

export function Studio({ route }: { route: Route }) {
  const studio = useStudio(() => initialConfig(route))
  const { config, update, undo, redo, canUndo, canRedo, load } = studio
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('content')
  const [keepColors, setKeepColors] = useState(false)
  const [zoom, setZoom] = useState<number | 'fit'>('fit')
  const [fit, setFit] = useState(0.6)
  const [busy, setBusy] = useState<string | null>(null)
  const [dialog, setDialog] = useState<'github' | 'saved' | 'full' | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const t = getTemplate(config.template)

  // ?t=<template> or ?d=<share> — on first load and when navigating while mounted
  const qd = route.query.get('d')
  const qt = route.query.get('t')
  const consumed = useRef(true)
  useEffect(() => {
    if (!qd && !qt) return
    if (consumed.current) consumed.current = false // initialConfig already applied it
    else if (qd) {
      const shared = decodeShare(qd)
      if (shared) load(shared)
    } else if (qt) update((c) => normalizeConfig({ ...c, template: qt, theme: {} }))
    navigate('/studio', { replace: true })
  }, [qd, qt, load, update])

  useEffect(() => {
    const id = window.setTimeout(() => saveDraft(config), 400)
    return () => clearTimeout(id)
  }, [config])

  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const pad = window.innerWidth < 768 ? 24 : 80
      setFit(Math.max(0.15, Math.min((el.clientWidth - pad) / 1200, (el.clientHeight - pad) / 630, 1.5)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = zoom === 'fit' ? fit : zoom
  const pickTemplate = useCallback(
    (id: string) => update((c) => (c.template === id ? c : { ...c, template: id, theme: keepColors ? c.theme : {}, options: { ...c.options, displayFont: undefined } })),
    [update, keepColors],
  )

  const onPng = useCallback(
    async (s: 1 | 2) => {
      setBusy('png')
      try {
        await exportPng(config, s)
        toast(`PNG downloaded · ${1200 * s}×${630 * s}`)
      } catch (e) {
        console.error(e)
        toast('PNG export failed — see console for details.', 'error')
      } finally {
        setBusy(null)
      }
    },
    [config, toast],
  )
  const onSvg = useCallback(async () => {
    setBusy('svg')
    try {
      download(await exportSvg(config), `${fileBase(config)}.svg`, 'image/svg+xml')
      toast('SVG downloaded')
    } catch {
      toast('SVG export failed.', 'error')
    } finally {
      setBusy(null)
    }
  }, [config, toast])
  const onSave = useCallback(() => {
    const r = saveDesign(config)
    toast(r.ok ? `Saved “${r.design.name}” to this browser` : r.error, r.ok ? 'default' : 'error')
  }, [config, toast])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      const typing = (e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]')
      if (mod && e.key.toLowerCase() === 'z' && !typing) {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if (mod && e.key.toLowerCase() === 'y' && !typing) {
        e.preventDefault()
        redo()
      } else if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSave()
      } else if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        onPng(1)
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [undo, redo, onSave, onPng])

  const panels: Record<Exclude<Tab, 'templates'>, React.ReactNode> = {
    content: <ContentPanel config={config} update={update} />,
    style: <StylePanel config={config} update={update} keepColors={keepColors} setKeepColors={setKeepColors} />,
    brand: <BrandPanel config={config} update={update} />,
    export: <ExportPanel config={config} onPng={onPng} onSvg={onSvg} busy={busy} onLoadJson={load} onImport={() => setDialog('github')} />,
  }
  const tabs: { id: Tab; label: string; mobileOnly?: boolean }[] = [
    { id: 'templates', label: 'Templates', mobileOnly: true },
    { id: 'content', label: 'Content' },
    { id: 'style', label: 'Style' },
    { id: 'brand', label: 'Brand' },
    { id: 'export', label: 'Export' },
  ]
  const col = COLLECTIONS.find((c) => c.id === t.collection)!

  return (
    <div className="flex flex-col overflow-x-hidden md:h-[calc(100dvh-56px)] md:flex-row">
      {/* left: templates (desktop) */}
      <aside className="hidden w-[264px] shrink-0 border-r border-line md:block" aria-label="Templates">
        <TemplateBrowser config={config} onPick={pickTemplate} />
      </aside>

      {/* center: canvas */}
      <section className="flex min-w-0 flex-1 flex-col" aria-label="Canvas">
        <div className="no-scrollbar flex h-12 items-center gap-1 overflow-x-auto border-b border-line px-2 sm:px-3">
          <Button size="icon-sm" variant="ghost" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (⌘Z)">
            <Undo2 />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (⇧⌘Z)">
            <Redo2 />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label="Reset design"
            title="Reset to defaults"
            onClick={() => {
              load(defaultConfig(config.template))
              toast('Reset to defaults — undo brings it back.')
            }}
          >
            <RotateCcw />
          </Button>
          <span className="mx-1 hidden h-4 w-px bg-line-strong sm:block" />
          <Button size="icon-sm" variant="ghost" className="hidden sm:inline-flex" aria-label="Zoom out" onClick={() => setZoom(Math.max(0.15, +(scale - 0.1).toFixed(2)))}>
            <Minus />
          </Button>
          <button className="hidden w-12 rounded-md py-1 text-center font-mono text-[11.5px] text-ink-2 hover:bg-paper-2 sm:block" onClick={() => setZoom(1)} title="Zoom to 100%">
            {Math.round(scale * 100)}%
          </button>
          <Button size="icon-sm" variant="ghost" className="hidden sm:inline-flex" aria-label="Zoom in" onClick={() => setZoom(Math.min(2, +(scale + 0.1).toFixed(2)))}>
            <Plus />
          </Button>
          <Button size="icon-sm" variant={zoom === 'fit' ? 'secondary' : 'ghost'} className="hidden sm:inline-flex" aria-label="Fit to screen" title="Fit to screen" onClick={() => setZoom('fit')}>
            <Maximize />
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Full-size preview" title="Full-size preview" onClick={() => setDialog('full')}>
            <Expand />
          </Button>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => setDialog('github')} className="hidden lg:inline-flex">
              <Github /> Import
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => setDialog('saved')} aria-label="Saved designs" title="Saved designs">
              <FolderOpen />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={onSave} aria-label="Save design" title="Save (⌘S)">
              <Save />
            </Button>
            <Button size="sm" variant="accent" onClick={() => onPng(1)} disabled={!!busy} className="ml-1">
              {busy === 'png' ? 'Rendering…' : 'Export PNG'}
            </Button>
          </div>
        </div>
        <div ref={stage} className="dot-grid relative h-[56vw] max-h-[60dvh] min-h-[220px] overflow-auto bg-paper-2/50 md:h-auto md:max-h-none md:flex-1">
          <div className="flex min-h-full w-max min-w-full items-center justify-center p-3 md:p-10">
            <div className="og-surface shrink-0 overflow-hidden rounded-[6px] transition-[width] duration-200 ease-out-quart" style={{ width: 1200 * scale }} data-testid="studio-canvas">
              <OgPreview config={config} id="studio" />
            </div>
          </div>
        </div>
        <div className="hidden h-9 items-center justify-between border-t border-line px-3 font-mono text-[11px] text-ink-3 md:flex">
          <span>
            {String(t.number).padStart(2, '0')} · {t.name} · {col.label}
          </span>
          <span className="flex items-center gap-3">
            <span>
              <Kbd>⌘</Kbd> <Kbd>E</Kbd> export
            </span>
            <span>
              <Kbd>⌘</Kbd> <Kbd>S</Kbd> save
            </span>
            <span>1200 × 630</span>
          </span>
        </div>
      </section>

      {/* right: controls */}
      <aside className="flex w-full shrink-0 flex-col border-l border-line md:w-[352px]" aria-label="Controls">
        <div role="tablist" className="no-scrollbar flex h-12 shrink-0 items-center gap-0.5 overflow-x-auto border-b border-line px-2">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              role="tab"
              aria-selected={tab === tb.id}
              onClick={() => setTab(tb.id)}
              className={cn('h-8 shrink-0 rounded-md px-3 text-[13px] font-medium transition-colors', tab === tb.id ? 'bg-paper-2 text-ink' : 'text-ink-2 hover:text-ink', tb.mobileOnly && 'md:hidden')}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
          {tab === 'templates' ? (
            <div className="h-[70dvh] md:hidden">
              <TemplateBrowser config={config} onPick={(id) => pickTemplate(id)} compact />
            </div>
          ) : null}
          <div className={cn('p-4', tab === 'templates' && 'hidden md:block')}>
            {tab === 'templates' ? panels.content : panels[tab]}
          </div>
        </div>
        <div className="hidden items-center gap-2 border-t border-line px-4 py-2.5 text-[11.5px] text-ink-3 md:flex">
          <Bookmark className="size-3.5" /> Drafts autosave to this browser.
        </div>
      </aside>

      <GitHubDialog
        open={dialog === 'github'}
        onOpenChange={(v) => setDialog(v ? 'github' : null)}
        onImported={(r, useRepo) => {
          update((c) => ({ ...c, template: useRepo ? 'repository' : c.template, theme: useRepo ? {} : c.theme, content: { ...c.content, ...r.content }, assets: { ...c.assets, avatar: r.avatar ?? c.assets.avatar } }))
          setTab('content')
          toast(`Imported ${r.fullName}`)
        }}
      />
      <SavedDialog open={dialog === 'saved'} onOpenChange={(v) => setDialog(v ? 'saved' : null)} onRestore={(c) => (load(c), toast('Design restored'))} />
      <FullPreview open={dialog === 'full'} onOpenChange={(v) => setDialog(v ? 'full' : null)} config={config} />
    </div>
  )
}
