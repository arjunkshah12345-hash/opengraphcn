import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from './ui'

export function Modal({ open, onOpenChange, title, description, children, className }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] data-[state=open]:animate-[fade_160ms_ease-out]" />
        <Dialog.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-h-[88dvh] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-line bg-paper p-5 shadow-2xl focus:outline-none data-[state=open]:animate-[pop_200ms_var(--ease-out-expo)]',
            className,
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{title}</Dialog.Title>
              {description ? <Dialog.Description className="mt-1 text-[13px] leading-relaxed text-ink-2">{description}</Dialog.Description> : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
            </div>
            <Dialog.Close className="grid size-8 shrink-0 place-items-center rounded-md text-ink-2 hover:bg-paper-2 hover:text-ink" aria-label="Close">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
      <style>{`@keyframes fade{from{opacity:0}}@keyframes pop{from{opacity:0;transform:translate(-50%,-48%) scale(.98)}}`}</style>
    </Dialog.Root>
  )
}
