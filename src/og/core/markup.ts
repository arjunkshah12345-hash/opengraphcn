import { Fragment, isValidElement, type ReactElement, type ReactNode } from 'react'
import { setOutliner, type Outliner } from './primitives'

// A tiny, hook-free static renderer for template element trees → SVG markup.
// Works in browsers, Node and React Server Components (no react-dom/server needed).

const KEEP_CAMEL = new Set([
  'viewBox', 'preserveAspectRatio', 'gradientUnits', 'gradientTransform', 'patternUnits', 'patternContentUnits', 'patternTransform',
  'baseFrequency', 'numOctaves', 'stitchTiles', 'stdDeviation', 'refX', 'refY', 'markerWidth', 'markerHeight', 'markerUnits',
  'clipPathUnits', 'filterUnits', 'primitiveUnits', 'textLength', 'lengthAdjust', 'spreadMethod', 'startOffset', 'tableValues',
])
const SPECIAL: Record<string, string> = { className: 'class', xmlSpace: 'xml:space', xlinkHref: 'xlink:href', htmlFor: 'for' }
const VOID_SKIP = new Set(['children', 'key', 'ref', 'dangerouslySetInnerHTML'])

const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escAttr = (s: string) => escText(s).replace(/"/g, '&quot;')
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

function attrName(k: string) {
  if (SPECIAL[k]) return SPECIAL[k]
  if (KEEP_CAMEL.has(k) || k.startsWith('aria-') || k.startsWith('data-')) return k
  return kebab(k)
}

function styleString(style: Record<string, unknown>) {
  return Object.entries(style)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${kebab(k)}:${v}`)
    .join(';')
}

function render(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string') return escText(node)
  if (typeof node === 'number' || typeof node === 'bigint') return String(node)
  if (Array.isArray(node)) return node.map(render).join('')
  if (!isValidElement(node)) return ''
  const el = node as ReactElement<Record<string, unknown>>
  const { type, props } = el
  if (type === Fragment) return render(props.children as ReactNode)
  if (typeof type === 'function') return render((type as (p: unknown) => ReactNode)(props))
  if (typeof type !== 'string') return ''
  let attrs = ''
  for (const [k, v] of Object.entries(props)) {
    if (VOID_SKIP.has(k) || v == null || v === false || typeof v === 'function') continue
    if (k === 'style' && typeof v === 'object') {
      const s = styleString(v as Record<string, unknown>)
      if (s) attrs += ` style="${escAttr(s)}"`
      continue
    }
    attrs += ` ${attrName(k)}="${escAttr(v === true ? '' : String(v))}"`
  }
  const children = render(props.children as ReactNode)
  return children ? `<${type}${attrs}>${children}</${type}>` : `<${type}${attrs}/>`
}

/** serialize an element tree (e.g. <MonographImage/>) to SVG markup; pass an outliner to draw text as paths */
export function renderToSvgString(node: ReactNode, opts: { outline?: Outliner | null } = {}) {
  setOutliner(opts.outline ?? null)
  try {
    return render(node)
  } finally {
    setOutliner(null)
  }
}
