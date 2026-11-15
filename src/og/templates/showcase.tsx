import { BlockText, blockTop, Blob, ditherPath, Mark } from '../core/kit'
import { Frame, Grain, Text } from '../core/primitives'
import { ellipsize, fitLine, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 27 · Showcase ─────────────────────────── */

function Showcase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 470, maxLines: 4, max: 64 * s, min: 30, lineHeight: 1.02, tracking: -0.04, top: 206, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 430, maxLines: 3, max: 19, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  const win = { x: 610, y: 96, w: 700, h: 600 }
  const inner = { x: win.x, y: win.y + 46, w: win.w, h: win.h - 46 }
  const url = ellipsize(c.domain || c.name, f.mono, 13, 300)
  const urlW = measure(url, f.mono, 13) + 40
  const hero = fitLine(c.name || ' ', f.display, 76, 30, 480, -0.045)
  const badgeW = c.badge ? measure(c.badge, f.label, 13) + 26 : 0
  return (
    <Frame background={t.background}>
      <Blob uid={uid} id="a" cx={980} cy={180} rx={340} ry={240} fill={t.accent} blur={110} opacity={0.55} />
      <Blob uid={uid} id="b" cx={760} cy={620} rx={300} ry={180} fill={t.primary} blur={110} opacity={0.45} />
      <Grain uid={uid} opacity={0.08} />
      {o.showBrand ? (
        <g>
          <Mark x={M} y={70} size={36} assets={assets} name={c.name} uid={uid} fill={t.text} color={t.background} font={f.display} shape="rounded" />
          <Text x={M + 50} y={95} lines={c.name} font={f.label} size={20} fill={t.text} />
        </g>
      ) : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      {desc.bottom < 580 ? <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.62} /> : null}

      <rect x={win.x + 8} y={win.y + 24} width={win.w} height={win.h} rx={16} fill="#000000" opacity={0.1} />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={16} fill="#ffffff" stroke="#000000" strokeOpacity={0.08} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={win.x + 24 + i * 18} cy={win.y + 23} r={5.5} fill={mix(t.text, '#ffffff', 0.82)} />
      ))}
      <rect x={win.x + win.w / 2 - urlW / 2 - 40} y={win.y + 10} width={urlW} height={26} rx={13} fill={mix(t.text, '#ffffff', 0.94)} />
      <Text x={win.x + win.w / 2 - 40} y={win.y + 28} anchor="middle" lines={url} font={f.mono} size={13} fill={t.text} opacity={0.6} />
      <line x1={win.x} x2={win.x + win.w} y1={inner.y} y2={inner.y} stroke="#000000" strokeOpacity={0.07} />
      <clipPath id={`${uid}-inner`}>
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} />
      </clipPath>
      {assets.screenshot ? (
        <image href={assets.screenshot} x={inner.x} y={inner.y} width={inner.w} height={inner.h} preserveAspectRatio="xMidYMin slice" clipPath={`url(#${uid}-inner)`} />
      ) : (
        <g clipPath={`url(#${uid}-inner)`}>
          <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} fill={t.primary} />
          <path d={ditherPath({ x: inner.x, y: inner.y, w: inner.w, h: inner.h, cell: 9, f: (u, v) => Math.max(0, 1.05 - Math.hypot((u - 0.75) * 1.1, (v - 0.85) * 1.4)) * 0.95 })} fill={t.accent} />
          <Mark x={inner.x + 36} y={inner.y + 30} size={30} assets={assets} name={c.name} uid={`${uid}-n`} fill="#ffffff" color={t.primary} font={f.display} shape="rounded" />
          <Text x={inner.x + 78} y={inner.y + 51} lines={c.name} font={f.label} size={17} fill="#ffffff" />
          {c.badge ? (
            <g>
              <rect x={inner.x + 40} y={inner.y + 126} width={badgeW} height={28} rx={14} fill="#ffffff" fillOpacity={0.14} />
              <Text x={inner.x + 40 + badgeW / 2} y={inner.y + 145} anchor="middle" lines={c.badge} font={f.label} size={13} fill="#ffffff" />
            </g>
          ) : null}
          <Text x={inner.x + 38} y={inner.y + 236} lines={hero.text} font={f.display} size={hero.size} tracking={-0.045} fill="#ffffff" />
        </g>
      )}
    </Frame>
  )
}

export const showcase: TemplateDef = {
  id: 'showcase',
  number: 27,
  name: 'Showcase',
  collection: 'product',
  description: 'Your product in a browser window bleeding off the edge — your screenshot, or a dithered hero — on a soft glow.',
  fonts: {
    display: { family: 'Geist', weight: 600 },
    label: { family: 'Geist', weight: 500 },
    body: { family: 'Geist', weight: 400 },
    mono: { family: 'Geist Mono', weight: 400 },
  },
  theme: { primary: '#14161f', accent: '#ff6a3d', background: '#f4f2ee', text: '#121212' },
  limits: { headline: 60, description: 110 },
  uses: ['screenshot', 'logo', 'badge'],
  render: Showcase,
}

/** <ShowcaseImage /> renders the showcase template as an SVG (1200×630). */
export function ShowcaseImage(props: OgImageProps) {
  return <OgImage template={showcase} {...props} />
}
