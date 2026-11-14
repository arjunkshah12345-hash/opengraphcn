import { BlockText, blockTop, caps, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { ellipsize, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

const H = 630
/* ─────────────────────────── 27 · Showcase ─────────────────────────── */

function Showcase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 64
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 420, maxLines: 4, max: 54 * s, min: 28, lineHeight: 1.04, tracking: -0.04, top: 176, maxHeight: 250 })
  const desc = blockTop(c.description, { font: f.body, maxWidth: 400, maxLines: 3, max: 18, min: 15, lineHeight: 1.45, top: head.bottom + 22 })
  const bx = 548
  const by = 84
  const bw = 720
  const bh = 620
  const urlW = 300
  const inner = { x: bx, y: by + 46, w: bw, h: bh - 46 }
  const mini = blockTop(c.headline, { font: f.display, maxWidth: 520, maxLines: 2, max: 40, min: 22, lineHeight: 1.05, tracking: -0.04, top: inner.y + 120 })
  return (
    <Frame background={t.background}>
      <defs>
        <filter id={`${uid}-sh`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
        <clipPath id={`${uid}-win`}>
          <rect x={bx} y={by} width={bw} height={bh} rx={14} />
        </clipPath>
        <linearGradient id={`${uid}-card`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.accent} />
          <stop offset="1" stopColor={mix(t.accent, t.primary, 0.6)} />
        </linearGradient>
      </defs>
      <rect x={bx + 20} y={by + 36} width={bw} height={bh} rx={14} fill="#000000" opacity={0.18} filter={`url(#${uid}-sh)`} />
      <g clipPath={`url(#${uid}-win)`}>
        <rect x={bx} y={by} width={bw} height={bh} fill="#ffffff" />
        <rect x={bx} y={by} width={bw} height={46} fill={mix('#ffffff', t.text, 0.05)} />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={bx + 24 + i * 18} cy={by + 23} r={5.5} fill={t.text} fillOpacity={0.16} />
        ))}
        <rect x={bx + bw / 2 - urlW / 2 - 60} y={by + 11} width={urlW} height={24} rx={12} fill={t.text} fillOpacity={0.06} />
        <Text x={bx + bw / 2 - 60} y={by + 28} anchor="middle" lines={ellipsize(c.domain, f.body, 13, urlW - 30)} font={f.body} size={13} fill={t.text} opacity={0.6} />
        {assets.screenshot ? (
          <image href={assets.screenshot} x={inner.x} y={inner.y} width={inner.w} height={inner.h} preserveAspectRatio="xMidYMin slice" />
        ) : (
          <g>
            <Mark x={inner.x + 36} y={inner.y + 30} size={26} assets={assets} name={c.name} uid={uid} fill={t.text} color="#ffffff" font={f.label} />
            <Text x={inner.x + 72} y={inner.y + 49} lines={ellipsize(c.name, f.label, 16, 200)} font={f.label} size={16} fill={t.text} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={inner.x + 330 + i * 70} y={inner.y + 39} width={46} height={8} rx={4} fill={t.text} fillOpacity={0.14} />
            ))}
            <Text x={inner.x + 36} y={mini.y} lines={mini.lines} font={f.display} size={mini.size} lh={mini.lh} tracking={-0.04} fill={t.text} />
            <rect x={inner.x + 36} y={mini.bottom + 22} width={128} height={38} rx={19} fill={t.accent} />
            <Text x={inner.x + 100} y={mini.bottom + 46} anchor="middle" lines="Get started" font={f.label} size={14} fill="#ffffff" />
            <rect x={inner.x + 176} y={mini.bottom + 22} width={110} height={38} rx={19} fill="none" stroke={t.text} strokeOpacity={0.2} />
            <Text x={inner.x + 231} y={mini.bottom + 46} anchor="middle" lines="Docs" font={f.label} size={14} fill={t.text} />
            <rect x={inner.x + 36} y={mini.bottom + 92} width={inner.w - 72} height={260} rx={12} fill={`url(#${uid}-card)`} />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={inner.x + 64 + i * 200} y={mini.bottom + 124} width={176} height={110} rx={8} fill="#ffffff" fillOpacity={0.18 + i * 0.06} />
            ))}
          </g>
        )}
      </g>
      <rect x={bx} y={by} width={bw} height={bh} rx={14} fill="none" stroke={t.text} strokeOpacity={0.12} />
      {c.badge ? (
        <g>
          <rect x={M} y={100} width={measure(caps(c.badge), f.label, 12, 0.12) + 24} height={26} rx={13} fill={t.accent} fillOpacity={0.14} />
          <Text x={M + 12} y={117} lines={caps(c.badge)} font={f.label} size={12} tracking={0.12} fill={t.accent} />
        </g>
      ) : null}
      {o.showBrand ? <Text x={M} y={156} lines={c.name} font={f.label} size={20} tracking={-0.01} fill={t.text} opacity={0.65} /> : null}
      <Text x={M - 2} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      <BlockText b={desc} x={M} font={f.body} fill={t.text} opacity={0.68} />
      {o.showMeta ? <Text x={M} y={H - 52} lines={ellipsize(c.domain, f.label, 15, 420)} font={f.label} size={15} fill={t.text} /> : null}
    </Frame>
  )
}

export const showcase: TemplateDef = {
  id: 'showcase',
  number: 27,
  name: 'Showcase',
  collection: 'product',
  description: 'A browser window that bleeds off the canvas: your screenshot, or a live mini landing page.',
  fonts: {
    display: { family: 'Inter Tight', weight: 600 },
    label: { family: 'Inter Tight', weight: 500 },
    body: { family: 'Inter Tight', weight: 400 },
  },
  theme: { primary: '#1c2a4a', accent: '#f25a2a', background: '#f2f0eb', text: '#141414' },
  limits: { headline: 56, description: 110 },
  uses: ['screenshot', 'logo', 'badge'],
  render: Showcase,
}

/** <ShowcaseImage /> renders the showcase template as an SVG (1200×630). */
export function ShowcaseImage(props: OgImageProps) {
  return <OgImage template={showcase} {...props} />
}
