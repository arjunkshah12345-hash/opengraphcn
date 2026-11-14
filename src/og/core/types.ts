import type { ReactElement } from 'react'
import type { FontStyle } from './fonts'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630
export const CONFIG_VERSION = 1

export type Collection = 'editorial' | 'developer' | 'abstract' | 'minimal' | 'experimental' | 'product'

export const COLLECTIONS: { id: Collection; label: string; letter: string }[] = [
  { id: 'editorial', label: 'Editorial', letter: 'A' },
  { id: 'developer', label: 'Developer', letter: 'B' },
  { id: 'abstract', label: 'Abstract', letter: 'C' },
  { id: 'minimal', label: 'Minimal', letter: 'D' },
  { id: 'experimental', label: 'Experimental', letter: 'E' },
  { id: 'product', label: 'Product', letter: 'F' },
]

export interface OgContent {
  /** project / brand name */
  name: string
  headline: string
  description: string
  domain: string
  author: string
  category: string
  badge: string
  date: string
  /** repository metadata (optional, only real values — never invented) */
  owner?: string
  language?: string
  stars?: number | null
  forks?: number | null
}

export interface OgTheme {
  primary: string
  accent: string
  background: string
  text: string
}

export interface OgAssets {
  /** data: or same-origin URLs. Remote URLs taint canvases and are not fetched by resvg. */
  logo?: string
  favicon?: string
  screenshot?: string
  avatar?: string
}

export interface OgOptions {
  /** typography scale multiplier, 0.8 – 1.2 */
  scale: number
  variant?: string
  showBrand: boolean
  showMeta: boolean
  /** override the template's display typeface */
  displayFont?: string
}

export interface OgConfig {
  version: typeof CONFIG_VERSION
  template: string
  content: OgContent
  /** only the colors the user changed; the rest come from the template */
  theme: Partial<OgTheme>
  assets: OgAssets
  options: OgOptions
}

export interface FontRef {
  family: string
  weight: number
  style?: FontStyle
}

export interface TemplateProps {
  content: OgContent
  theme: OgTheme
  assets: OgAssets
  options: OgOptions
  /** resolved fonts for each role the template declares */
  fonts: Record<string, FontRef>
  /** unique, DOM-safe id prefix for gradients / filters / clip paths */
  uid: string
}

export interface TemplateDef {
  id: string
  number: number
  name: string
  collection: Collection
  description: string
  /** font roles, `display` is the role users can override */
  fonts: { display: FontRef } & Record<string, FontRef>
  theme: OgTheme
  /** soft character guidance shown in the editor; layouts still fit/clamp beyond it */
  limits?: { headline?: number; description?: number }
  variants?: { id: string; label: string }[]
  /** which brand inputs the template uses (so the editor can say so) */
  uses?: ('logo' | 'favicon' | 'screenshot' | 'avatar' | 'author' | 'date' | 'badge' | 'category' | 'stars' | 'language')[]
  render: (props: TemplateProps) => ReactElement
}

export const DEFAULT_CONTENT: OgContent = {
  name: 'Acme',
  headline: 'Build something remarkable.',
  description: 'Open-source tools for the next generation.',
  domain: 'acme.dev',
  author: 'Ada Park',
  category: 'Open source',
  badge: 'v1.0',
  date: 'Nov 14, 2026',
}

export const DEFAULT_OPTIONS: OgOptions = {
  scale: 1,
  showBrand: true,
  showMeta: true,
}
