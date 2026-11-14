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
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#11100f' : '#f4f1ea')
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
    <button type="button" onClick={toggle} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} className="grid size-9 place-items-center rounded-md text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink">
      {dark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
    </button>
  )
}

const LINKS = [
  { to: '/templates', label: 'Templates' },
  { to: '/studio', label: 'Studio' },
  { to: '/docs', label: 'Docs' },
]

export function Nav({ path, wide }: { path: string; wide?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className={cn('mx-auto flex h-14 items-center justify-between px-4 sm:px-6', wide ? 'max-w-none' : 'max-w-[1240px]')}>
        <a href={href('/')} className="rounded-md" aria-label="opengraphcn home">
          <Wordmark />
        </a>
        <nav className="flex items-center gap-0.5">
          {LINKS.map((l) => (
            <a
              key={l.to}
              href={href(l.to)}
              className={cn(
                'rounded-md px-2.5 py-1.5 text-[13.5px] font-medium transition-colors sm:px-3',
                path.startsWith(l.to) ? 'text-ink' : 'text-ink-2 hover:text-ink',
              )}
            >
              {l.label}
            </a>
          ))}
          <span className="mx-1.5 hidden h-4 w-px bg-line-strong sm:block" />
          <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repository" className="hidden size-9 place-items-center rounded-md text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink sm:grid">
            <Github className="size-[17px]" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
    </footer>
  )
}
