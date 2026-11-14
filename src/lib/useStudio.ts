import { useCallback, useReducer } from 'react'
import type { OgConfig } from '../og/core/types'
import { defaultConfig } from './config'

interface State {
  past: OgConfig[]
  present: OgConfig
  future: OgConfig[]
  key?: string
  at: number
}

type Action =
  | { type: 'set'; fn: (c: OgConfig) => OgConfig; key?: string }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'load'; next: OgConfig }

const LIMIT = 120

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'set': {
      const now = Date.now()
      const next = a.fn(s.present)
      if (next === s.present) return s
      // coalesce rapid edits of the same field (typing) into one history step
      if (a.key && a.key === s.key && now - s.at < 800) return { ...s, present: next, at: now }
      return { past: [...s.past, s.present].slice(-LIMIT), present: next, future: [], key: a.key, at: now }
    }
    case 'undo': {
      if (!s.past.length) return s
      return { past: s.past.slice(0, -1), present: s.past[s.past.length - 1], future: [s.present, ...s.future], at: 0 }
    }
    case 'redo': {
      if (!s.future.length) return s
      return { past: [...s.past, s.present], present: s.future[0], future: s.future.slice(1), at: 0 }
    }
    case 'load':
      return { past: [...s.past, s.present].slice(-LIMIT), present: a.next, future: [], at: 0 }
  }
}

export function useStudio(initial: () => OgConfig = () => defaultConfig()) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ past: [], present: initial(), future: [], at: 0 }))
  const update = useCallback((fn: (c: OgConfig) => OgConfig, key?: string) => dispatch({ type: 'set', fn, key }), [])
  return {
    config: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    update,
    undo: useCallback(() => dispatch({ type: 'undo' }), []),
    redo: useCallback(() => dispatch({ type: 'redo' }), []),
    load: useCallback((next: OgConfig) => dispatch({ type: 'load', next }), []),
  }
}
