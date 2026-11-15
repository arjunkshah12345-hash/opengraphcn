import { Download, Pause, Play, RotateCcw } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Wordmark } from '../components/Logo'
import { OgPreview } from '../components/OgPreview'
import { Button, cn, useToast } from '../components/ui'
import { defaultConfig } from '../lib/config'
import { href } from '../lib/router'
import { installCommand, REPO_URL } from '../lib/site'
import { OgImage } from '../og/core/render'
import { Frame, Text } from '../og/core/primitives'
import { blockCenter } from '../og/core/kit'
import type { OgConfig, TemplateDef } from '../og/core/types'
import { getTemplate } from '../og/templates'
import { exportPng } from './studio/Studio'

// A distraction-free stage for a single continuous 30-second screen recording.
// Every change is a real state change — the same thing a person would do by hand.

/** the "before" card: what an unstyled default OG image tends to look like */
const plain: TemplateDef = {
  id: 'plain',
  number: 0,
  name: 'Default',
  collection: 'minimal',
  description: 'A typical default social card.',
  fonts: { display: { family: 'Inter Tight', weight: 400 } },
  theme: { primary: '#666666', accent: '#999999', background: '#e9e9e9', text: '#333333' },
  render: ({ content: c, theme: t, fonts: f }) => {
    const b = blockCenter(c.name, { font: f.display, maxWidth: 900, maxLines: 1, max: 64, min: 30, center: 300 })
    return (
      <Frame background={t.background}>
        <Text x={600} y={b.y} anchor="middle" lines={b.lines} font={f.display} size={b.size} fill={t.text} />
        <Text x={600} y={b.y + 56} anchor="middle" lines={c.domain} font={f.display} size={24} fill={t.primary} />
      </Frame>
    )
  },
}

const CYCLE = ['terminal', 'atmosphere', 'brutalist', 'journal', 'dither', 'chromatic', 'blueprint', 'nocturne']
const STRIP = ['monograph', ...CYCLE, 'launch']
const ACCENTS = ['#ff7a45', '#2b6cff', '#16a34a', '#e11d48', '#f5b301']
const NEW_NAME = 'Lumen'

export function Demo() {
  const toast = useToast()
  const [template, setTemplate] = useState<string>('plain')
  const [name, setName] = useState('Acme')
  const [accent, setAccent] = useState<string | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [ending, setEnding] = useState(false)
  const [pulse, setPulse] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const timers = useRef<number[]>([])
  const start = useRef(0)

  const config = useMemo<OgConfig>(() => {
    const c = defaultConfig(template === 'plain' ? 'monograph' : template)
    c.template = template
    c.content = { ...c.content, name, domain: `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'acme'}.dev` }
    if (accent) c.theme = { accent }
    return c
  }, [template, name, accent])

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const reset = useCallback(() => {
    clear()
    setPlaying(false)
    setEnding(false)
    setTemplate('plain')
    setName('Acme')
    setAccent(undefined)
    setElapsed(0)
  }, [])

  const exportNow = useCallback(
    async (cfg: OgConfig) => {
      try {
        await exportPng(cfg)
        toast('PNG downloaded · 1200×630')
      } catch {
        toast('Export failed', 'error')
      }
    },
    [toast],
  )

  const play = useCallback(() => {
    reset()
    setPlaying(true)
    start.current = performance.now()
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    const click = (id: string, ms: number) => {
      at(ms - 220, () => setPulse(id))
      at(ms, () => {
        setTemplate(id)
        setPulse(null)
      })
    }
    // 0–5s: plain default card
    // 5s: one click → editorial
    click('monograph', 5000)
    // 10–20s: eight distinct compositions
    CYCLE.forEach((id, i) => click(id, 10000 + i * 1250))
    // 20–25s: final template, rename and recolor
    click('launch', 20000)
    const old = 'Acme'
    for (let i = 1; i <= old.length; i++) at(20900 + i * 90, () => setName(old.slice(0, old.length - i)))
    for (let i = 1; i <= NEW_NAME.length; i++) at(21400 + i * 120, () => setName(NEW_NAME.slice(0, i)))
    ACCENTS.slice(1, 4).forEach((a, i) => at(22600 + i * 700, () => setAccent(a)))
    // 25s: real PNG export
    at(25000, () => setPulse('export'))
    at(25250, () => {
      setPulse(null)
      const c = defaultConfig('launch')
      c.content = { ...c.content, name: NEW_NAME, domain: 'lumen.dev' }
      c.theme = { accent: ACCENTS[3] }
      exportNow(c)
    })
    // 28s: repository + install command
    at(28000, () => setEnding(true))
    at(30500, () => setPlaying(false))
  }, [reset, exportNow])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      setElapsed(Math.min(30, (performance.now() - start.current) / 1000))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => () => clear(), [])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input')) return
      if (e.key === ' ') {
        e.preventDefault()
        if (playing) reset()
        else play()
      }
      if (e.key.toLowerCase() === 'r') reset()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [playing, play, reset])

  const tpl = template === 'plain' ? plain : getTemplate(template)

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="flex h-16 shrink-0 items-center justify-between px-6 md:px-10">
        <a href={href('/')}>
          <Wordmark />
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[11px] tabular-nums text-ink-3 sm:inline">{elapsed.toFixed(1)}s / 30s</span>
          <Button size="sm" variant="ghost" onClick={reset} aria-label="Reset demo">
            <RotateCcw /> Reset
          </Button>
          <Button size="sm" variant={playing ? 'secondary' : 'primary'} onClick={playing ? reset : play}>
            {playing ? <Pause /> : <Play />} {playing ? 'Stop' : 'Autoplay 30s'}
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-6 md:px-10">
        <div className="relative w-full max-w-[1120px]">
          <div className="og-surface relative aspect-[1200/630] w-full overflow-hidden rounded-[10px] bg-paper-2">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={template}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.015, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                {template === 'plain' ? (
                  <OgImage template={plain} id="demo-plain" content={config.content} className="og-svg" />
                ) : (
                  <OgPreview config={config} id={`demo-${template}`} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {ending ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-6 bottom-6 rounded-xl bg-ink/95 p-6 text-paper shadow-2xl backdrop-blur md:inset-x-10 md:bottom-10 md:p-8"
              >
                <p className="text-[clamp(28px,3.6vw,48px)] leading-none font-semibold tracking-[-0.045em]">opengraphcn — make every link look incredible.</p>
                <p className="mt-4 font-mono text-[13px] text-paper/70">{REPO_URL.replace('https://', '')}</p>
                <p className="mt-2 overflow-x-auto font-mono text-[13px] whitespace-nowrap text-accent">$ {installCommand('launch')}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="grid w-full max-w-[1120px] gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {STRIP.map((id) => {
              const t = getTemplate(id)
              const active = template === id
              return (
                <button
                  key={id}
                  onClick={() => setTemplate(id)}
                  className={cn('group w-[104px] shrink-0 text-left transition-transform duration-200', pulse === id && 'scale-95')}
                  aria-pressed={active}
                >
                  <div className={cn('overflow-hidden rounded-[5px] transition-shadow duration-200', active ? 'shadow-[0_0_0_2px_var(--accent)]' : 'shadow-[0_0_0_1px_var(--line-strong)]', pulse === id && 'shadow-[0_0_0_4px_var(--accent)]')}>
                    <OgPreview config={defaultConfig(id)} id={`strip-${id}`} />
                  </div>
                  <p className={cn('mt-1 truncate text-[11px] font-medium', active ? 'text-ink' : 'text-ink-3')}>{t.name}</p>
                </button>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input aria-label="Project name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="h-10 w-32 rounded-md border border-line-strong bg-paper px-3 text-[15px] font-medium text-ink focus:outline-none" />
            <div className="flex gap-1.5">
              {ACCENTS.map((a) => (
                <button key={a} aria-label={`Accent ${a}`} onClick={() => setAccent(a)} className={cn('size-7 rounded-full ring-offset-2 ring-offset-paper transition-shadow', accent === a && 'ring-2 ring-ink')} style={{ background: a }} />
              ))}
            </div>
            <Button variant="accent" className={cn('h-10 transition-transform', pulse === 'export' && 'scale-95')} onClick={() => exportNow(config)} disabled={template === 'plain'}>
              <Download /> Export PNG
            </Button>
          </div>
        </div>
        <p className="font-mono text-[11px] text-ink-3">
          {tpl.number ? `${String(tpl.number).padStart(2, '0')} ${tpl.name}` : 'Default card'} · press <span className="text-ink-2">space</span> to play, <span className="text-ink-2">r</span> to reset
        </p>
      </main>
    </div>
  )
}
