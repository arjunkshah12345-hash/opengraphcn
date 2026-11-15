import { clsx, type ClassValue } from 'clsx'
import { Check, Copy } from 'lucide-react'
import { createContext, forwardRef, useCallback, useContext, useRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export const cn = (...v: ClassValue[]) => twMerge(clsx(v))

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent'
type Size = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

const variants: Record<Variant, string> = {
  primary: 'btn-accent',
  accent: 'btn-accent',
  secondary: 'bg-paper-3/80 text-ink shadow-[inset_0_0_0_1px_var(--line)] hover:bg-paper-3',
  outline: 'bg-paper-2/60 text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] backdrop-blur hover:bg-paper-3/80',
  ghost: 'text-ink-2 hover:text-ink hover:bg-paper-3/70',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-9 px-3.5 text-sm gap-2 rounded-[10px]',
  lg: 'h-11 px-5 text-[15px] gap-2 rounded-full',
  icon: 'h-9 w-9 rounded-[10px]',
  'icon-sm': 'h-8 w-8 rounded-lg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = 'secondary', size = 'md', type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,color,border-color,transform,filter] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})

export function LinkButton({ href, className, variant = 'secondary', size = 'md', children, external, ...rest }: { href: string; className?: string; variant?: Variant; size?: Size; children: ReactNode; external?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className={cn('inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,color,border-color,filter] duration-150 ease-out [&_svg]:size-4', variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </a>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-9 w-full rounded-lg border border-line-strong bg-paper/60 px-3 text-sm text-ink placeholder:text-ink-3 transition-colors hover:border-ink/25 focus:border-accent/70 focus:ring-3 focus:ring-accent/15 focus:outline-none focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full resize-none rounded-lg border border-line-strong bg-paper/60 px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink-3 transition-colors hover:border-ink/25 focus:border-accent/70 focus:ring-3 focus:ring-accent/15 focus:outline-none focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  )
})

export function Field({ label, hint, htmlFor, children, counter, className }: { label: string; hint?: ReactNode; htmlFor?: string; children: ReactNode; counter?: { value: number; limit?: number }; className?: string }) {
  const over = counter?.limit && counter.value > counter.limit
  return (
    <div className={cn('grid gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[12px] font-medium text-ink-2">
          {label}
        </label>
        {counter?.limit ? (
          <span className={cn('font-mono text-[10.5px] tabular-nums', over ? 'text-accent' : 'text-ink-3')} title={over ? 'Longer than recommended — the layout will shrink or clamp this text' : 'Recommended length'}>
            {counter.value}/{counter.limit}
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <p className="text-[11.5px] leading-snug text-ink-3">{hint}</p> : null}
    </div>
  )
}

export function Segmented<T extends string>({ value, onChange, options, className, size = 'md' }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode; title?: string }[]; className?: string; size?: 'sm' | 'md' }) {
  return (
    <div role="radiogroup" className={cn('inline-flex rounded-[10px] bg-paper-3/70 p-0.5', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 whitespace-nowrap rounded-lg font-medium transition-[background-color,color,box-shadow] duration-150',
            size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-8 px-3 text-[13px]',
            value === o.value ? 'bg-paper text-ink shadow-[0_0_0_1px_var(--line-strong),0_1px_2px_rgb(0_0_0/0.1)]' : 'text-ink-2 hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Switch({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 py-1 text-[13px] text-ink">
      {label}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-5 w-9 rounded-full transition-colors duration-200', checked ? 'bg-accent' : 'bg-paper-3 shadow-[inset_0_0_0_1px_var(--line-strong)]')}
      >
        <span className={cn('absolute top-0.5 left-0.5 size-4 rounded-full bg-paper shadow-sm transition-transform duration-200 ease-out-quart', checked && 'translate-x-4')} />
      </button>
    </label>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line-strong bg-paper-3/60 px-1 font-mono text-[10.5px] text-ink-2">{children}</kbd>
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

export function CopyButton({ text, className, label, variant = 'ghost', size = 'icon-sm' }: { text: string; className?: string; label?: string; variant?: Variant; size?: Size }) {
  const [done, setDone] = useState(false)
  const t = useRef<number>(0)
  return (
    <Button
      variant={variant}
      size={label ? 'sm' : size}
      className={className}
      aria-label={label ?? 'Copy to clipboard'}
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true)
          clearTimeout(t.current)
          t.current = window.setTimeout(() => setDone(false), 1400)
        }
      }}
    >
      {done ? <Check /> : <Copy />}
      {label ? <span>{done ? 'Copied' : label}</span> : null}
    </Button>
  )
}

/* ───────────── toasts ───────────── */

interface Toast {
  id: number
  text: string
  tone: 'default' | 'error'
}
const ToastCtx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((text: string, tone: Toast['tone'] = 'default') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t.slice(-2), { id, text, tone }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto max-w-md rounded-full px-4 py-2 text-[13px] font-medium shadow-[var(--shadow-panel)] backdrop-blur-md animate-[toast-in_240ms_var(--ease-out-expo)]',
              t.tone === 'error' ? 'bg-[#ff5a5a] text-white' : 'bg-paper-3/90 text-ink',
            )}
          >
            {t.text}
          </div>
        ))}
      </div>
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`}</style>
    </ToastCtx.Provider>
  )
}
