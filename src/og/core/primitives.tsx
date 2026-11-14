import type { ReactNode, SVGProps } from 'react'
import { measure, resolveFace } from './text'
import { OG_HEIGHT, OG_WIDTH, type FontRef } from './types'

/**
 * Text can render as live <text> (browser preview, SVG/PNG export with embedded fonts)
 * or as outlined glyph paths (server renderers such as resvg, where font-family matching
 * is unreliable). Pass an outliner to renderToSvgString to switch.
 */
export type Outliner = (args: { text: string; font: Required<FontRef>; size: number; tracking: number; x: number; y: number }) => string

let activeOutliner: Outliner | null = null

/** set by renderToSvgString for the duration of a synchronous render */
export function setOutliner(o: Outliner | null) {
  activeOutliner = o
}

export interface TextProps extends Omit<SVGProps<SVGTextElement>, 'x' | 'y' | 'fontSize'> {
  x: number
  /** baseline of the first line */
  y: number
  lines: string[] | string
  font: FontRef
  size: number
  /** line height multiple */
  lh?: number
  /** letter-spacing in em */
  tracking?: number
  anchor?: 'start' | 'middle' | 'end'
  fill?: string
}

export function Text({ x, y, lines, font, size, lh = 1.1, tracking = 0, anchor = 'start', fill = '#000', opacity, ...rest }: TextProps) {
  const outline = activeOutliner
  const list = typeof lines === 'string' ? [lines] : lines
  const face = resolveFace(font)
  const r = (n: number) => Math.round(n * 100) / 100

  if (outline) {
    const d = list
      .map((line, i) => {
        const w = measure(line, face, size, tracking)
        const lx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x
        return outline({ text: line, font: face, size, tracking, x: lx, y: y + i * size * lh })
      })
      .join(' ')
    const { stroke, strokeWidth, strokeOpacity, fillOpacity, transform, style, strokeLinejoin } = rest
    return <path d={d} fill={fill} opacity={opacity} {...{ stroke, strokeWidth, strokeOpacity, fillOpacity, transform, style, strokeLinejoin }} />
  }

  return (
    <text
      x={r(x)}
      y={r(y)}
      fontFamily={`'${face.family}'`}
      fontWeight={face.weight}
      fontStyle={face.style}
      fontSize={r(size)}
      letterSpacing={tracking ? r(tracking * size) : undefined}
      textAnchor={anchor === 'start' ? undefined : anchor}
      fill={fill}
      opacity={opacity}
      xmlSpace="preserve"
      {...rest}
    >
      {list.length === 1
        ? list[0]
        : list.map((line, i) => (
            <tspan key={i} x={r(x)} y={r(y + i * size * lh)}>
              {line}
            </tspan>
          ))}
    </text>
  )
}

export function Frame({ children, background, ...rest }: { children: ReactNode; background?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={OG_WIDTH}
      height={OG_HEIGHT}
      viewBox={`0 0 ${OG_WIDTH} ${OG_HEIGHT}`}
      {...rest}
    >
      {background ? <rect width={OG_WIDTH} height={OG_HEIGHT} fill={background} /> : null}
      {children}
    </svg>
  )
}

/** an <image> clipped to a (rounded) rect, cover-fit */
export function Img({ href, x, y, w, h, r = 0, uid, fit = 'cover', opacity }: { href: string; x: number; y: number; w: number; h: number; r?: number; uid: string; fit?: 'cover' | 'contain'; opacity?: number }) {
  const id = `${uid}-clip-${Math.round(x)}-${Math.round(y)}`
  return (
    <g opacity={opacity}>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx={r} />
      </clipPath>
      <image href={href} x={x} y={y} width={w} height={h} preserveAspectRatio={fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'} clipPath={`url(#${id})`} />
    </g>
  )
}

/** fine film grain via feTurbulence (supported by browsers and resvg) */
export function Grain({ uid, opacity = 0.08, freq = 0.9, blend = 'multiply' }: { uid: string; opacity?: number; freq?: number; blend?: string }) {
  const id = `${uid}-grain`
  return (
    <g style={{ mixBlendMode: blend as never }}>
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} stitchTiles="stitch" seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={OG_WIDTH} height={OG_HEIGHT} filter={`url(#${id})`} opacity={opacity} />
    </g>
  )
}
