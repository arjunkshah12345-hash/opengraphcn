import { CONFIG_VERSION, DEFAULT_CONTENT, DEFAULT_OPTIONS, type OgConfig } from '../og/core/types'
import { getTemplate, TEMPLATES } from '../og/templates'

export function defaultConfig(template = 'monograph'): OgConfig {
  return {
    version: CONFIG_VERSION,
    template,
    content: { ...DEFAULT_CONTENT },
    theme: {},
    assets: {},
    options: { ...DEFAULT_OPTIONS },
  }
}

/** validate + normalise anything that claims to be a config (JSON import, URL, storage) */
export function normalizeConfig(input: unknown): OgConfig {
  const base = defaultConfig()
  if (!input || typeof input !== 'object') return base
  const o = input as Partial<OgConfig>
  const template = typeof o.template === 'string' && TEMPLATES.some((t) => t.id === o.template) ? o.template : base.template
  const str = (v: unknown, d: string) => (typeof v === 'string' ? v.slice(0, 400) : d)
  const c = (o.content ?? {}) as Partial<OgConfig['content']>
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
  const hex = (v: unknown) => (typeof v === 'string' && /^#[0-9a-f]{3,8}$/i.test(v) ? v : undefined)
  const t = (o.theme ?? {}) as Record<string, unknown>
  const a = (o.assets ?? {}) as Record<string, unknown>
  const asset = (v: unknown) => (typeof v === 'string' && (v.startsWith('data:image/') || v.startsWith('https://')) ? v : undefined)
  const op = (o.options ?? {}) as Partial<OgConfig['options']>
  return {
    version: CONFIG_VERSION,
    template,
    content: {
      name: str(c.name, base.content.name),
      headline: str(c.headline, base.content.headline),
      description: str(c.description, base.content.description),
      domain: str(c.domain, base.content.domain),
      author: str(c.author, base.content.author),
      category: str(c.category, base.content.category),
      badge: str(c.badge, base.content.badge),
      date: str(c.date, base.content.date),
      owner: typeof c.owner === 'string' ? c.owner : undefined,
      language: typeof c.language === 'string' ? c.language : undefined,
      stars: num(c.stars),
      forks: num(c.forks),
    },
    theme: { primary: hex(t.primary), accent: hex(t.accent), background: hex(t.background), text: hex(t.text) },
    assets: { logo: asset(a.logo), favicon: asset(a.favicon), screenshot: asset(a.screenshot), avatar: asset(a.avatar) },
    options: {
      scale: typeof op.scale === 'number' ? Math.min(1.2, Math.max(0.8, op.scale)) : 1,
      variant: typeof op.variant === 'string' ? op.variant : undefined,
      showBrand: op.showBrand !== false,
      showMeta: op.showMeta !== false,
      displayFont: typeof op.displayFont === 'string' ? op.displayFont : undefined,
    },
  }
}

/** the resolved theme (template defaults + user overrides) */
export function resolvedTheme(cfg: OgConfig) {
  return { ...getTemplate(cfg.template).theme, ...Object.fromEntries(Object.entries(cfg.theme).filter(([, v]) => v)) }
}

function b64url(s: string) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function unb64url(s: string) {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'))
  return new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)))
}

/** share links carry everything except uploaded images (too large for a URL) */
export function encodeShare(cfg: OgConfig) {
  const { assets, ...rest } = cfg
  const remote = Object.fromEntries(Object.entries(assets).filter(([, v]) => typeof v === 'string' && v.startsWith('https://')))
  return b64url(JSON.stringify({ ...rest, assets: remote }))
}

export function decodeShare(s: string): OgConfig | null {
  try {
    return normalizeConfig(JSON.parse(unb64url(s)))
  } catch {
    return null
  }
}

export function hasUploads(cfg: OgConfig) {
  return Object.values(cfg.assets).some((v) => typeof v === 'string' && v.startsWith('data:'))
}
