// Liscie i zielen - rysowane jako SVG, srodek galazki w punkcie (50,50).
import React from 'react'
import { palette } from '../data/colors'

const SHAPES = {
  eukaliptus: (c) => (
    <g>
      {/* dluga lodyga - dolny odcinek celowo bez lisci */}
      <path d="M50 99 C46 76 54 50 50 5" fill="none" stroke={c.deep} strokeWidth="3" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 10 + i * 6.4
        const side = i % 2 ? 1 : -1
        const r = 5.4 + i * 0.62
        const x = 50 + side * (6 + i * 0.8)
        return (
          <g key={i}>
            <path d={`M50 ${y + 2} L${x} ${y}`} stroke={c.deep} strokeWidth="1.8" strokeLinecap="round" />
            <ellipse cx={x + side * r * 0.75} cy={y} rx={r} ry={r * 0.86} fill={i % 2 ? c.base : c.light} />
          </g>
        )
      })}
      <ellipse cx="50" cy="7" rx="5.4" ry="5.4" fill={c.light} />
    </g>
  ),

  // Zwykly listek - najprostsza zielen, dostepna od poczatku
  listek: (c) => (
    <g>
      <path d="M50 98 C48 90 49 84 50 80" fill="none" stroke={c.deep} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 6 C66 20 73 40 68 58 C64 72 55 80 50 84 C45 80 36 72 32 58 C27 40 34 20 50 6Z" fill={c.base} />
      <path d="M50 6 C66 20 73 40 68 58 C64 72 55 80 50 84 Z" fill={c.dark} />
      <path d="M50 10 L50 82" stroke={c.deep} strokeWidth="2.2" strokeLinecap="round" />
      {[22, 34, 46, 58, 68].map((y, i) => (
        <g key={y}>
          <path d={`M50 ${y} C${44 - i} ${y + 3} ${39 - i} ${y + 7} ${36 - i * 0.6} ${y + 12}`}
            fill="none" stroke={c.deep} strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />
          <path d={`M50 ${y} C${56 + i} ${y + 3} ${61 + i} ${y + 7} ${64 + i * 0.6} ${y + 12}`}
            fill="none" stroke={c.line} strokeWidth="1.3" opacity="0.45" strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),


  // Dlugie, trawiaste zdzbla - wysoka zielen do "rozciagniecia" bukietu
  zdzbla: (c) => {
    const zdzblo = (dx, top, gr, fill, key) => {
      const h = 99 - top
      return (
        <path
          key={key}
          d={`M50 99
              C${(50 + dx * 0.12).toFixed(1)} ${(99 - h * 0.42).toFixed(1)}
                ${(50 + dx * 0.58).toFixed(1)} ${(99 - h * 0.74).toFixed(1)}
                ${(50 + dx).toFixed(1)} ${top}
              C${(50 + dx * 0.52 + gr).toFixed(1)} ${(99 - h * 0.7).toFixed(1)}
                ${(50 + dx * 0.1 + gr).toFixed(1)} ${(99 - h * 0.4).toFixed(1)}
                ${(50 + gr * 0.8).toFixed(1)} 99 Z`}
          fill={fill}
        />
      )
    }
    const odcienie = [c.dark, c.base, c.light, c.base, c.dark, c.light]
    return (
      <g>
        {[[-27, 12, 3.0], [-15, 4, 3.4], [-5, 8, 3.2], [7, 2, 3.4], [19, 7, 3.0], [30, 18, 2.6]].map(
          ([dx, top, gr], i) => zdzblo(dx, top, gr, odcienie[i], i)
        )}
      </g>
    )
  },

  paproc: (c) => (
    <g>
      <path d="M50 99 C47 74 53 44 50 6" fill="none" stroke={c.deep} strokeWidth="2.4" strokeLinecap="round" />
      {Array.from({ length: 10 }, (_, i) => {
        const y = 10 + i * 9.2
        const len = 7 + i * 3.4
        const opad = 4 + i * 0.6
        return (
          <g key={i}>
            <path
              d={`M50 ${y} C${50 - len * 0.45} ${y - 2} ${50 - len} ${y + opad * 0.4} ${50 - len} ${y + opad}
                  C${50 - len * 0.55} ${y + opad * 0.9} ${50 - len * 0.2} ${y + opad * 0.6} 50 ${y}Z`}
              fill={i % 2 ? c.base : c.light}
            />
            <path
              d={`M50 ${y + 3} C${50 + len * 0.45} ${y + 1} ${50 + len} ${y + 3 + opad * 0.4} ${50 + len} ${y + 3 + opad}
                  C${50 + len * 0.55} ${y + 3 + opad * 0.9} ${50 + len * 0.2} ${y + 3 + opad * 0.6} 50 ${y + 3}Z`}
              fill={i % 2 ? c.dark : c.base}
            />
          </g>
        )
      })}
    </g>
  ),

  ruskus: (c) => (
    <g>
      <path d="M50 99 L50 8" fill="none" stroke={c.deep} strokeWidth="2.8" strokeLinecap="round" />
      {Array.from({ length: 8 }, (_, i) => {
        const y = 14 + i * 10.5
        const side = i % 2 ? 1 : -1
        const len = 14 + i * 1.8
        return (
          <path
            key={i}
            d={`M50 ${y + 4} C${50 + side * len * 0.4} ${y - 6} ${50 + side * len} ${y - 5} ${50 + side * len} ${y + 3}
                C${50 + side * len} ${y + 10} ${50 + side * len * 0.4} ${y + 11} 50 ${y + 4}Z`}
            fill={i % 2 ? c.base : c.light}
          />
        )
      })}
      <path d="M50 14 C44 4 56 4 50 14Z" fill={c.light} />
    </g>
  ),

  bluszcz: (c) => (
    <g>
      <path d="M50 99 C58 76 42 54 50 6" fill="none" stroke={c.deep} strokeWidth="2.6" strokeLinecap="round" />
      {[[30, 20, -25], [70, 34, 25], [28, 50, -20], [72, 64, 22], [38, 80, -18], [50, 8, 0]].map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.9 + (i % 3) * 0.12})`}>
          <path d="M0 12 C-13 8 -16 -2 -10 -8 C-6 -12 -2 -9 0 -6 C2 -9 6 -12 10 -8 C16 -2 13 8 0 12Z"
            fill={i % 2 ? c.base : c.light} />
        </g>
      ))}
    </g>
  ),

  trawa: (c) => (
    <g>
      {[[-30, 26], [-15, 34], [0, 40], [15, 34], [30, 26]].map(([rot, len], i) => (
        <path
          key={i}
          d={`M50 96 C${50 + rot * 0.3} ${96 - len} ${50 + rot * 0.9} ${70 - len} ${50 + rot * 1.4} ${58 - len}`}
          fill="none"
          stroke={i % 2 ? c.base : c.light}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {[[22, 24], [78, 24], [50, 12]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="9" fill={c.dark} opacity="0.8" transform={`rotate(${(i - 1) * 18} ${x} ${y})`} />
      ))}
    </g>
  ),
}

export const LEAF_IDS = Object.keys(SHAPES)

export function LeafArt({ id, color = '#40916c', size = 100, style }) {
  const shape = SHAPES[id] || SHAPES.eukaliptus
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      {shape(palette(color))}
    </svg>
  )
}
