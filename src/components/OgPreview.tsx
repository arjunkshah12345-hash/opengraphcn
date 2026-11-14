import { memo } from 'react'
import { OgImage } from '../og/core/render'
import type { OgConfig } from '../og/core/types'
import { getTemplate } from '../og/templates'
import { cn } from './ui'

/** Live SVG render of a config. The exact same element tree is serialized for export. */
export const OgPreview = memo(function OgPreview({ config, className, id }: { config: OgConfig; className?: string; id?: string }) {
  const t = getTemplate(config.template)
  return <OgImage template={t} id={id} content={config.content} theme={config.theme} assets={config.assets} options={config.options} className={cn('og-svg', className)} />
})

export function OgFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('og-surface overflow-hidden rounded-[10px] bg-paper-2', className)}>{children}</div>
}
