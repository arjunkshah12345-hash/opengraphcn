import { cn } from './ui'

// A 1200×630 card, dithered: density falls off left → right like an ordered-dither ramp.
const CELLS: [number, number][] = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [6, 0],
  [0, 1], [1, 1], [2, 1], [3, 1], [5, 1], [7, 1],
  [0, 2], [1, 2], [2, 2], [4, 2], [6, 2],
  [0, 3], [1, 3], [3, 3], [5, 3],
  [0, 4], [2, 4], [4, 4],
]

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 10" className={cn('h-[13px] w-auto', className)} aria-hidden>
      <defs>
        <linearGradient id="ogcn-mark" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent-2)" />
          <stop offset="0.6" stopColor="var(--accent)" />
          <stop offset="1" stopColor="#ff8fd0" />
        </linearGradient>
      </defs>
      {CELLS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x * 2} y={y * 2} width="1.6" height="1.6" fill="url(#ogcn-mark)" />
      ))}
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-ink', className)}>
      <LogoMark />
      <span className="font-mono text-[14px] font-medium tracking-[-0.01em]">opengraphcn</span>
    </span>
  )
}
