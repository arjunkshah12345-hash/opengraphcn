import { BlockText, blockTop, caps, join } from '../core/kit'
import { Frame, Text } from '../core/primitives'
import { fitLine } from '../core/text'
import type { TemplateDef, TemplateProps } from '../core/types'
import { OgImage, type OgImageProps } from '../core/render'

const W = 1200
const H = 630
/* ─────────────────────────── 09 · Blueprint ─────────────────────────── */

function Blueprint({ content: c, theme: t, options: o, fonts: f, uid }: TemplateProps) {
  const ink = t.text
  const s = o.scale
  const head = blockTop(c.headline, { font: f.display, maxWidth: 620, maxLines: 3, max: 66 * s, min: 32, lineHeight: 1.04, tracking: -0.02, top: 112, maxHeight: 220 })
  const dimY = head.bottom + 30
  const desc = blockTop(c.description, { font: f.mono, maxWidth: 560, maxLines: 3, max: 17, min: 14, lineHeight: 1.5, top: dimY + 44 })
  const cx = 940
  const cy = 236
  const tb = { x: 742, y: 452, w: 1200 - 742 - 48, h: 130 }
  const cell = (x: number, y: number, label: string, value: string, wv: number) => (
    <g>
      <Text x={x + 10} y={y + 17} lines={label} font={f.mono} size={10} tracking={0.12} fill={ink} opacity={0.6} />
      <Text x={x + 10} y={y + 37} lines={fitLine(value || '—', f.monoBold, 15, 10, wv - 20).text} font={f.monoBold} size={fitLine(value || '—', f.monoBold, 15, 10, wv - 20).size} fill={ink} />
    </g>
  )
  return (
    <Frame background={t.background}>
      <defs>
        <pattern id={`${uid}-minor`} width={24} height={24} patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke={ink} strokeOpacity={0.07} strokeWidth={1} />
        </pattern>
        <pattern id={`${uid}-major`} width={120} height={120} patternUnits="userSpaceOnUse">
          <path d="M 120 0 L 0 0 0 120" fill="none" stroke={ink} strokeOpacity={0.16} strokeWidth={1} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-minor)`} />
      <rect width={W} height={H} fill={`url(#${uid}-major)`} />
      <rect x={24} y={24} width={W - 48} height={H - 48} fill="none" stroke={ink} strokeWidth={2} />
      <rect x={32} y={32} width={W - 64} height={H - 64} fill="none" stroke={ink} strokeOpacity={0.5} strokeWidth={0.8} />
      {Array.from({ length: 8 }, (_, i) => (
        <Text key={i} x={32 + ((W - 64) / 8) * (i + 0.5)} y={30 - 10} anchor="middle" lines={String(i + 1)} font={f.mono} size={10} fill={ink} opacity={0.6} />
      ))}
      {['A', 'B', 'C', 'D'].map((l, i) => (
        <Text key={l} x={12} y={32 + ((H - 64) / 4) * (i + 0.5) + 4} anchor="middle" lines={l} font={f.mono} size={10} fill={ink} opacity={0.6} />
      ))}
      <Text x={88} y={84} lines={caps(join(['Drawing', o.showBrand ? c.name : '', c.category], '  /  '))} font={f.mono} size={12} tracking={0.14} fill={t.accent} />
      <Text x={86} y={head.y} lines={head.lines} font={f.display} size={head.size} lh={head.lh} tracking={-0.02} fill={ink} />
      <g stroke={t.accent} strokeWidth={1.2}>
        <line x1={88} x2={88 + head.width} y1={dimY} y2={dimY} />
        <line x1={88} x2={88} y1={dimY - 9} y2={dimY + 9} />
        <line x1={88 + head.width} x2={88 + head.width} y1={dimY - 9} y2={dimY + 9} />
      </g>
      <rect x={88 + head.width / 2 - 44} y={dimY - 11} width={88} height={22} fill={t.background} />
      <Text x={88 + head.width / 2} y={dimY + 5} anchor="middle" lines={`${Math.round(head.width)} PX`} font={f.mono} size={12} tracking={0.08} fill={t.accent} />
      <BlockText b={desc} x={88} font={f.mono} fill={ink} opacity={0.85} />
      <g fill="none" stroke={ink}>
        <circle cx={cx} cy={cy} r={124} strokeWidth={1.6} />
        <circle cx={cx} cy={cy} r={62} strokeWidth={1} strokeDasharray="6 6" />
        <rect x={cx - 88} y={cy - 88} width={176} height={176} strokeWidth={1} strokeOpacity={0.6} transform={`rotate(45 ${cx} ${cy})`} />
        <line x1={cx - 160} x2={cx + 160} y1={cy} y2={cy} strokeWidth={0.8} strokeDasharray="14 4 2 4" strokeOpacity={0.7} />
        <line x1={cx} x2={cx} y1={cy - 160} y2={cy + 160} strokeWidth={0.8} strokeDasharray="14 4 2 4" strokeOpacity={0.7} />
      </g>
      <g stroke={t.accent} strokeWidth={1.2} fill="none">
        <line x1={cx} y1={cy} x2={cx + 124 * Math.cos(-0.7)} y2={cy + 124 * Math.sin(-0.7)} />
        <line x1={cx - 124} x2={cx + 124} y1={cy - 150} y2={cy - 150} />
        <line x1={cx - 124} x2={cx - 124} y1={cy - 158} y2={cy - 142} />
        <line x1={cx + 124} x2={cx + 124} y1={cy - 158} y2={cy - 142} />
      </g>
      <rect x={cx - 30} y={cy - 161} width={60} height={22} fill={t.background} />
      <Text x={cx} y={cy - 145} anchor="middle" lines="Ø 248" font={f.mono} size={12} fill={t.accent} />
      <Text x={cx + 64} y={cy - 64} lines="R 124" font={f.mono} size={12} fill={t.accent} />
      <circle cx={cx} cy={cy} r={4} fill={t.accent} />
      <g>
        <rect x={tb.x} y={tb.y} width={tb.w} height={tb.h} fill={t.background} stroke={ink} strokeWidth={1.6} />
        <line x1={tb.x} x2={tb.x + tb.w} y1={tb.y + 44} y2={tb.y + 44} stroke={ink} strokeWidth={0.8} />
        <line x1={tb.x} x2={tb.x + tb.w} y1={tb.y + 88} y2={tb.y + 88} stroke={ink} strokeWidth={0.8} />
        <line x1={tb.x + tb.w / 2} x2={tb.x + tb.w / 2} y1={tb.y + 44} y2={tb.y + 88} stroke={ink} strokeWidth={0.8} />
        {[1, 2].map((i) => (
          <line key={i} x1={tb.x + (tb.w / 3) * i} x2={tb.x + (tb.w / 3) * i} y1={tb.y + 88} y2={tb.y + tb.h} stroke={ink} strokeWidth={0.8} />
        ))}
        {cell(tb.x, tb.y, 'PROJECT', o.showBrand ? c.name : c.domain, tb.w)}
        {cell(tb.x, tb.y + 44, 'DRAWN BY', c.author, tb.w / 2)}
        {cell(tb.x + tb.w / 2, tb.y + 44, 'DATE', c.date, tb.w / 2)}
        {cell(tb.x, tb.y + 88, 'SHEET', '01 / 01', tb.w / 3)}
        {cell(tb.x + tb.w / 3, tb.y + 88, 'SCALE', '1 : 1', tb.w / 3)}
        {cell(tb.x + (2 * tb.w) / 3, tb.y + 88, 'REV', c.badge, tb.w / 3)}
      </g>
      {o.showMeta ? <Text x={88} y={H - 62} lines={caps(c.domain)} font={f.mono} size={12} tracking={0.16} fill={ink} opacity={0.7} /> : null}
    </Frame>
  )
}

export const blueprint: TemplateDef = {
  id: 'blueprint',
  number: 9,
  name: 'Blueprint',
  collection: 'developer',
  description: 'Drafting sheet with grid, zone markers, a dimensioned headline, schematic and a title block.',
  fonts: {
    display: { family: 'Space Grotesk', weight: 500 },
    mono: { family: 'IBM Plex Mono', weight: 400 },
    monoBold: { family: 'IBM Plex Mono', weight: 600 },
  },
  theme: { primary: '#ffffff', accent: '#ffd36b', background: '#1b4c8c', text: '#f4f7ff' },
  limits: { headline: 56, description: 120 },
  uses: ['author', 'date', 'badge', 'category'],
  render: Blueprint,
}

/** <BlueprintImage /> renders the blueprint template as an SVG (1200×630). */
export function BlueprintImage(props: OgImageProps) {
  return <OgImage template={blueprint} {...props} />
}
