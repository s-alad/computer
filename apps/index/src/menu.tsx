import { useState } from 'react'
import type { CSSProperties } from 'react'

const ITEMS = ['paper', 'todo', 'stocks']
const TINT = '#ffffff'
const INTENSITY = 1.4
const SELECT = 'bar' as 'glow' | 'bar' | 'accent'
const ACCENT = '#7fd9ff'
const ITEM_GAP = 0
const DIVIDERS = false as boolean

const MONO = "'IBM Plex Mono', ui-monospace, monospace"

function rgba(hex: string): (a: number) => string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (a) => `rgba(${r},${g},${b},${a})`
}

const tint = rgba(TINT)
const accent = rgba(ACCENT)
const barBg = `linear-gradient(90deg, ${accent(0.42)}, ${accent(0.14)} 55%, ${accent(0.02)})`
const bar = SELECT === 'bar'

const box: CSSProperties = {
  display: 'grid',
  gap: `${ITEM_GAP}px`,
  minWidth: '240px',
  pointerEvents: 'auto',
  fontFamily: MONO,
  fontSize: '15px',
  lineHeight: 1,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 500,
  background: `linear-gradient(90deg, ${tint(0.2 * INTENSITY)} 0%, ${tint(0.07 * INTENSITY)} 45%, ${tint(0)} 100%)`,
  borderLeft: `1px solid ${tint(Math.min(1, 0.7 * INTENSITY + 0.2))}`,
  boxShadow: `inset 14px 0 28px -14px ${tint(Math.min(1, 0.55 * INTENSITY))}`,
}

function borderBottom(on: boolean, notLast: boolean): string {
  if (!(DIVIDERS && notLast)) return '1px solid transparent'
  return on && bar ? `1px solid ${accent(0.35)}` : `1px solid ${tint(0.14)}`
}

function itemStyle(on: boolean, hovered: boolean, notLast: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    padding: '11px 28px 11px 12px',
    color: on ? (SELECT === 'accent' ? ACCENT : '#ffffff') : hovered ? '#ffffff' : '#c9cdd4',
    textShadow: on && SELECT === 'glow' ? `0 0 10px ${tint(0.8)}` : 'none',
    background: on && bar ? barBg : hovered ? `linear-gradient(90deg, ${tint(0.1)}, ${tint(0)})` : 'transparent',
    boxShadow: on && bar ? `inset 3px 0 0 ${accent(1)}, inset 12px 0 20px -10px ${accent(0.7)}` : 'none',
    borderBottom: borderBottom(on, notLast),
  }
}

const markerStyle: CSSProperties = {
  width: '10px',
  textAlign: 'center',
  fontSize: SELECT === 'accent' ? '9px' : 'inherit',
  color: SELECT === 'accent' ? ACCENT : 'inherit',
}

export function Menu() {
  const [selected, setSelected] = useState<string>(ITEMS[0] ?? 'paper')
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <nav style={box}>
      {ITEMS.map((label, i) => {
        const on = selected === label
        return (
          <a
            key={label}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setSelected(label)
            }}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
            style={itemStyle(on, hovered === label, i < ITEMS.length - 1)}
          >
            <span style={markerStyle}>{on ? (SELECT === 'accent' ? '■' : '!') : ''}</span>
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}
