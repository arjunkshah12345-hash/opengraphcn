import { Loader2, Trash2 } from 'lucide-react'
import { Github } from '../../components/icons'
import { useEffect, useRef, useState } from 'react'
import { Modal } from '../../components/Modal'
import { OgPreview } from '../../components/OgPreview'
import { Button, Input, Switch } from '../../components/ui'
import { GitHubImportError, importRepo, type RepoImport } from '../../lib/github'
import { deleteDesign, listDesigns, type SavedDesign } from '../../lib/storage'
import type { OgConfig } from '../../og/core/types'
import { getTemplate } from '../../og/templates'

export function GitHubDialog({ open, onOpenChange, onImported }: { open: boolean; onOpenChange: (v: boolean) => void; onImported: (r: RepoImport, useRepoTemplate: boolean) => void }) {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<{ kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string }>({ kind: 'idle' })
  const [useRepo, setUseRepo] = useState(true)
  const abort = useRef<AbortController | null>(null)
  useEffect(() => () => abort.current?.abort(), [])
  const submit = async () => {
    abort.current?.abort()
    abort.current = new AbortController()
    setState({ kind: 'loading' })
    try {
      const r = await importRepo(url, abort.current.signal)
      setState({ kind: 'idle' })
      onImported(r, useRepo)
      onOpenChange(false)
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setState({ kind: 'error', message: e instanceof GitHubImportError ? e.message : 'Something went wrong while importing.' })
    }
  }
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Import from GitHub" description="Paste a public repository. Name, description, owner, language, stars and homepage come straight from the GitHub API.">
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (state.kind !== 'loading') submit()
        }}
      >
        <Input autoFocus placeholder="https://github.com/owner/repo" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="GitHub repository URL" aria-invalid={state.kind === 'error'} />
        <Switch id="use-repo" checked={useRepo} onChange={setUseRepo} label="Switch to the Repository template" />
        {state.kind === 'error' ? (
          <p role="alert" className="rounded-md bg-accent/10 px-3 py-2 text-[13px] text-accent">
            {state.message}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11.5px] text-ink-3">No sign-in. Uses GitHub’s public API (60 requests/hour).</p>
          <Button type="submit" variant="primary" disabled={!url.trim() || state.kind === 'loading'}>
            {state.kind === 'loading' ? <Loader2 className="animate-spin" /> : <Github />}
            {state.kind === 'loading' ? 'Fetching…' : 'Import'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function SavedDialog({ open, onOpenChange, onRestore }: { open: boolean; onOpenChange: (v: boolean) => void; onRestore: (c: OgConfig) => void }) {
  const [list, setList] = useState<SavedDesign[]>([])
  useEffect(() => {
    if (open) setList(listDesigns())
  }, [open])
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Saved designs" description="Stored in this browser’s local storage." className="max-w-2xl">
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((d) => (
            <div key={d.id} className="group">
              <button className="block w-full overflow-hidden rounded-md shadow-[0_0_0_1px_var(--line)] transition-shadow hover:shadow-[0_0_0_2px_var(--accent)]" onClick={() => (onRestore(d.config), onOpenChange(false))} aria-label={`Restore ${d.name}`}>
                <OgPreview config={d.config} id={`saved-${d.id}`} />
              </button>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{d.name}</p>
                  <p className="font-mono text-[10.5px] text-ink-3">
                    {getTemplate(d.config.template).name} · {new Date(d.savedAt).toLocaleString()}
                  </p>
                </div>
                <Button size="icon-sm" variant="ghost" aria-label={`Delete ${d.name}`} onClick={() => (deleteDesign(d.id), setList(listDesigns()))}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-[13px] text-ink-3">Nothing saved yet. Press Save (⌘S) in the Studio.</p>
      )}
    </Modal>
  )
}

export function FullPreview({ open, onOpenChange, config }: { open: boolean; onOpenChange: (v: boolean) => void; config: OgConfig }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Actual size · 1200 × 630" className="max-w-[min(1250px,calc(100vw-2rem))] p-4">
      <div className="scrollbar-thin overflow-auto rounded-md">
        <div style={{ width: 1200 }} className="og-surface">
          <OgPreview config={config} id="fullsize" />
        </div>
      </div>
    </Modal>
  )
}
