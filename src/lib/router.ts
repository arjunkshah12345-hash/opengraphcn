import { useEffect, useState } from 'react'

// Hash routing: GitHub Pages serves a single index.html, so every route lives after the #.

export interface Route {
  path: string
  query: URLSearchParams
}

function parse(): Route {
  const raw = location.hash.replace(/^#/, '') || '/'
  const [path, qs = ''] = raw.split('?')
  return { path: path.replace(/\/+$/, '') || '/', query: new URLSearchParams(qs) }
}

export function useRoute() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export function navigate(to: string, { replace = false } = {}) {
  const hash = '#' + to
  if (replace) history.replaceState(null, '', hash)
  else location.hash = to
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export const href = (to: string) => '#' + to
