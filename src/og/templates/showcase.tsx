import { blockTop, Brand, Mark } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { balance, ellipsize, fit, measure } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { mix } from '../core/utils'
import { OgImage, type OgImageProps } from '../core/render'

/* ─────────────────────────── 27 · Showcase ─────────────────────────── */

function Showcase({ content: c, theme: t, options: o, fonts: f, assets, uid }: TemplateProps) {
  const M = 72
  const head = blockTop(c.headline, { font: f.display, maxWidth: 520, maxLines: 4, max: 60 * o.scale, min: 30, lineHeight: 1.04, tracking: -0.04, top: 196, maxHeight: 250 })
  const desc = c.description ? blockTop(c.description, { font: f.body, maxWidth: 470, maxLines: 3, max: 20, min: 15, lineHeight: 1.45, top: head.bottom + 22 }) : null
  const win = { x: 650, y: 96, w: 640, h: 600 }
  const inner = { x: win.x, y: win.y + 44 }
  const url = ellipsize(c.domain || c.name, f.body, 13, 260)
  const uw = measure(url, f.body, 13) + 36
  const ph = fit(c.headline, { font: f.display, maxWidth: 440, maxLines: 2, max: 34, min: 20, lineHeight: 1.08, tracking: -0.035 })
  const plines = ph.truncated ? ph.lines : balance(c.headline, f.display, ph.size, 440, -0.035)
  const cta = c.domain ? ellipsize(`Visit ${c.domain}`, f.label, 13, 220) : 'Get started'
  const cw = measure(cta, f.label, 13) + 36
  const pcx = inner.x + 300
  return (
    <Frame background={t.background}>
      {o.showBrand ? <Brand x={M} y={70} size={36} assets={assets} name={c.name} uid={uid} font={f.label} fill={t.text} bg={t.background} /> : null}
      <Text x={M - 3} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.04} fill={t.text} />
      {desc && desc.bottom < 590 ? <Text x={M} y={desc.y} lines={desc.lines} font={f.body} size={desc.size} lh={desc.lh} fill={t.text} opacity={0.55} /> : null}
      <rect x={win.x + 6} y={win.y + 18} width={win.w} height={win.h} rx={14} fill="#000000" opacity={0.06} />
      <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={14} fill="#ffffff" stroke="#000000" strokeOpacity={0.1} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={win.x + 22 + i * 18} cy={win.y + 22} r={5.5} fill={['#ff5f57', '#febc2e', '#28c840'][i]} />
      ))}
      <rect x={pcx - uw / 2} y={win.y + 9} width={uw} height={26} rx={13} fill={mix(t.text, '#ffffff', 0.94)} />
      <Text x={pcx} y={win.y + 27} anchor="middle" lines={url} font={f.body} size={13} fill={t.text} opacity={0.6} />
      <line x1={win.x} x2={win.x + win.w} y1={inner.y} y2={inner.y} stroke="#000000" strokeOpacity={0.08} />
      {assets.screenshot ? (
        <g>
          <clipPath id={`${uid}-shot`}>
            <rect x={inner.x} y={inner.y} width={win.w} height={win.h - 44} />
          </clipPath>
          <image href={assets.screenshot} x={inner.x} y={inner.y} width={win.w} height={win.h - 44} preserveAspectRatio="xMidYMin slice" clipPath={`url(#${uid}-shot)`} />
        </g>
      ) : (
        <g>
          <Mark x={inner.x + 28} y={inner.y + 22} size={24} assets={assets} name={c.name} uid={`${uid}-p`} fill={t.text} color="#ffffff" font={f.label} />
          <Text x={inner.x + 62} y={inner.y + 40} lines={ellipsize(c.name, f.label, 15, 200)} font={f.label} size={15} fill={t.text} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={inner.x + 380 + i * 64} y={inner.y + 30} width={44} height={8} rx={4} fill={t.text} opacity={0.12} />
          ))}
          <Text x={pcx} y={inner.y + 140} anchor="middle" lines={plines} font={f.display} size={ph.size} lh={1.08} tracking={-0.035} fill={t.text} />
          <rect x={pcx - cw / 2} y={inner.y + 150 + plines.length * ph.size * 1.08} width={cw} height={36} rx={18} fill={t.accent} />
          <Text x={pcx} y={inner.y + 173 + plines.length * ph.size * 1.08} anchor="middle" lines={cta} font={f.label} size={13} fill="#ffffff" />
          <rect x={inner.x + 40} y={inner.y + 240 + plines.length * ph.size * 1.08} width={win.w - 80} height={300} rx={12} fill={mix(t.accent, '#ffffff', 0.9)} stroke={t.accent} strokeOpacity={0.15} />
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
  description: 'A SaaS homepage card: headline and pitch on the left, your site in a browser window bleeding off the right.',
  fonts: {
    display: { family: 'Inter Tight', weight: 600 },
    body: { family: 'Inter Tight', weight: 400 },
    label: { family: 'Inter Tight', weight: 600 },
  },
  theme: { primary: '#111111', accent: '#111111', background: '#f4f4f5', text: '#111111' },
  limits: { headline: 50, description: 110 },
  uses: ['screenshot', 'logo'],
  render: Showcase,
}

/** <ShowcaseImage /> renders the showcase template as an SVG (1200×630). */
export function ShowcaseImage(props: OgImageProps) {
  return <OgImage template={showcase} {...props} />
}
