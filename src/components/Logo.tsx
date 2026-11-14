import { cn } from './ui'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={cn('h-[15px] w-auto', className)} aria-hidden>
      <rect x="0.75" y="0.75" width="30.5" height="18.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="23.5" cy="7" r="2.6" fill="var(--accent)" />
      <rect x="5" y="12" width="11" height="2.2" rx="1.1" fill="currentColor" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-ink', className)}>
      <LogoMark />
      <span className="text-[16px] font-semibold tracking-[-0.02em]">
        opengraph<span className="font-mono text-[13px] font-normal tracking-normal text-ink-3">cn</span>
      </span>
    </span>
  )
}
