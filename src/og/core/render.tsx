import { cloneElement, type CSSProperties, type ReactElement } from 'react'
import { resolveFace } from './text'
import { hash } from './utils'
import {
  DEFAULT_CONTENT,
  DEFAULT_OPTIONS,
  type FontRef,
  type OgAssets,
  type OgContent,
  type OgOptions,
  type OgTheme,
  type TemplateDef,
  type TemplateProps,
} from './types'

export interface OgImageProps {
  content?: Partial<OgContent>
  theme?: Partial<OgTheme>
  assets?: OgAssets
  options?: Partial<OgOptions>
  className?: string
  style?: CSSProperties
  /** id prefix for gradients/filters; defaults to a hash of the props (hook-free, RSC-safe) */
  id?: string
}

/** resolve every font role, applying the optional display-font override */
export function resolveFonts(template: TemplateDef, options: Partial<OgOptions> = {}): Record<string, FontRef> {
  const out: Record<string, FontRef> = {}
  for (const [role, ref] of Object.entries(template.fonts)) {
    if (role === 'display' && options.displayFont && options.displayFont !== ref.family) {
      out[role] = resolveFace({ family: options.displayFont, weight: ref.weight, style: ref.style })
    } else out[role] = resolveFace(ref)
  }
  return out
}

export function resolveProps(template: TemplateDef, p: OgImageProps, uid: string): TemplateProps {
  const options = { ...DEFAULT_OPTIONS, ...p.options }
  return {
    content: { ...DEFAULT_CONTENT, ...p.content },
    theme: { ...template.theme, ...stripEmpty(p.theme) },
    assets: p.assets ?? {},
    options,
    fonts: resolveFonts(template, options),
    uid,
  }
}

function stripEmpty<T extends object>(o: T | undefined): Partial<T> {
  const out: Partial<T> = {}
  if (!o) return out
  for (const [k, v] of Object.entries(o)) if (v) (out as Record<string, unknown>)[k] = v
  return out
}

export function OgImage({ template, ...props }: OgImageProps & { template: TemplateDef }) {
  const uid = (props.id ?? `og-${template.id}-${hash(JSON.stringify([props.content, props.theme, props.options, props.assets && Object.keys(props.assets)])).toString(36)}`).replace(/[^a-zA-Z0-9_-]/g, '')
  const el = template.render(resolveProps(template, props, uid)) as ReactElement<Record<string, unknown>>
  return cloneElement(el, {
    className: props.className,
    style: props.style,
    role: 'img',
    'aria-label': `${props.content?.name ?? DEFAULT_CONTENT.name} — ${props.content?.headline ?? DEFAULT_CONTENT.headline}`,
  })
}
