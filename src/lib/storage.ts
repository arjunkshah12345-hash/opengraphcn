import type { OgConfig } from '../og/core/types'
import { normalizeConfig } from './config'

const DESIGNS = 'ogcn-designs'
const DRAFT = 'ogcn-draft'

export interface SavedDesign {
  id: string
  name: string
  savedAt: number
  config: OgConfig
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function listDesigns(): SavedDesign[] {
  return read<SavedDesign[]>(DESIGNS, []).map((d) => ({ ...d, config: normalizeConfig(d.config) }))
}

export function saveDesign(config: OgConfig, name?: string): { ok: true; design: SavedDesign } | { ok: false; error: string } {
  const design: SavedDesign = { id: Math.random().toString(36).slice(2, 10), name: name || config.content.name || 'Untitled', savedAt: Date.now(), config }
  try {
    localStorage.setItem(DESIGNS, JSON.stringify([design, ...listDesigns()].slice(0, 40)))
    return { ok: true, design }
  } catch {
    return { ok: false, error: 'Browser storage is full — remove a saved design or use smaller images.' }
  }
}

export function deleteDesign(id: string) {
  localStorage.setItem(DESIGNS, JSON.stringify(listDesigns().filter((d) => d.id !== id)))
}

export function saveDraft(config: OgConfig) {
  try {
    localStorage.setItem(DRAFT, JSON.stringify(config))
  } catch {
    /* storage full — drafts are best effort */
  }
}

export function loadDraft(): OgConfig | null {
  const d = read<unknown>(DRAFT, null)
  return d ? normalizeConfig(d) : null
}
