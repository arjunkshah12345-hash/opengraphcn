import { Moon, Sun } from 'lucide-react'
import { Github } from './icons'
import { useEffect, useState } from 'react'
import { REPO_URL } from '../lib/site'
import { href } from '../lib/router'
import { Wordmark } from './Logo'
import { cn } from './ui'

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#050506' : '#ffffff')
  }, [dark])
  return {
    dark,
    toggle: () =>
      setDark((d) => {
        try {
          localStorage.setItem('ogcn-theme', d ? 'light' : 'dark')
        } catch {
          /* ignore */
        }
        return !d
      }),
  }
}

export function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} className="grid size-8 place-items-center rounded-full text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink">
      {dark ? <Sun className="size-[15px]" /> : <Moon className="size-[15px]" />}
    </button>
  )
}

const LINKS = [
  { to: '/templates', label: 'Templates' },
  { to: '/studio', label: 'Studio' },
  { to: '/docs', label: 'Docs' },
  { to: '/demo', label: 'Demo' },
]

function NavLinks({ path }: { path: string }) {
  return (
    <>
      {LINKS.map((l) => (
        <a
          key={l.to}
          href={href(l.to)}
          className={cn(
            'rounded-full px-2.5 py-1.5 text-[13.5px] transition-colors sm:px-3',
            path.startsWith(l.to) ? 'text-ink' : 'text-ink-2 hover:text-ink',
            l.to === '/demo' && 'hidden sm:block',
          )}
        >
          {l.label}
        </a>
      ))}
    </>
  )
}

export function Nav({ path, wide }: { path: string; wide?: boolean }) {
  if (wide) {
    // app chrome (Studio): flush toolbar, DitherKit-style
    return (
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="flex h-12 items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-4">
            <a href={href('/')} className="rounded-md" aria-label="opengraphcn home">
              <Wordmark />
            </a>
            <span className="hidden h-4 w-px bg-line-strong sm:block" />
            <nav className="hidden items-center sm:flex">
              <NavLinks path={path} />
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <nav className="flex items-center sm:hidden">
              <NavLinks path={path} />
            </nav>
            <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="hidden size-8 place-items-center rounded-full text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink sm:grid">
              <Github className="size-[15px]" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
    )
  }
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-4 sm:pt-5">
      <div className="pointer-events-auto flex h-12 w-full max-w-[760px] items-center justify-between gap-2 rounded-full bg-[var(--glass)] py-1.5 pr-1.5 pl-4 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:pl-5">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <a href={href('/')} className="shrink-0 rounded-md" aria-label="opengraphcn home">
            <Wordmark />
          </a>
          <nav className="hidden items-center md:flex">
            <NavLinks path={path} />
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <nav className="flex items-center md:hidden">
            {LINKS.slice(0, 2).map((l) => (
              <a key={l.to} href={href(l.to)} className={cn('rounded-full px-2 py-1.5 text-[13px]', path.startsWith(l.to) ? 'text-ink' : 'text-ink-2')}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="hidden h-8 items-center gap-1.5 rounded-full px-2.5 font-mono text-[12px] text-ink-2 transition-colors hover:bg-paper-3 hover:text-ink sm:flex">
            <Github className="size-[15px]" /> MIT
          </a>
          <ThemeToggle />
          <a href={href('/studio')} className="btn-accent hidden h-9 items-center rounded-full px-4 text-[13px] font-medium sm:flex">
            Open Studio
          </a>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 pt-14 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-3">
          <Wordmark />
          <p className="max-w-xs text-[13px] leading-relaxed text-ink-2">The open-source social image studio for developers. MIT licensed. Fonts are OFL, served from Fontsource.</p>
        </div>
        {[
          { h: 'Product', l: [['Templates', href('/templates')], ['Studio', href('/studio')], ['Launch demo', href('/demo')]] },
          { h: 'Docs', l: [['Getting started', href('/docs')], ['Next.js', href('/docs/nextjs')], ['Exports', href('/docs/exports')]] },
          { h: 'Project', l: [['GitHub', REPO_URL], ['Contributing', `${REPO_URL}/blob/main/CONTRIBUTING.md`], ['License', `${REPO_URL}/blob/main/LICENSE`]] },
        ].map((g) => (
          <div key={g.h} className="grid content-start gap-2.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{g.h}</p>
            {g.l.map(([label, url]) => (
              <a key={label} href={url} className="text-[13.5px] text-ink-2 transition-colors hover:text-ink" {...(url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between border-t border-line px-5 py-5 font-mono text-[11.5px] text-ink-3 sm:px-8">
        <span>© {new Date().getFullYear()} opengraphcn · MIT</span>
        <span>1200 × 630</span>
      </div>
      <p aria-hidden className="pointer-events-none mx-auto -mb-[3.2vw] max-w-[1400px] select-none text-center font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--line-strong)] text-[15.5vw]">
        opengraphcn
      </p>
    </footer>
  )
}
