// Dodatki: wstazki, kokardy, drobiazgi. Rysowane wokol punktu (50,50).
import React from 'react'
import { palette } from '../data/colors'

const SHAPES = {
  kokarda: (c) => (
    <g>
      <path d="M50 50 C34 30 8 32 10 48 C12 64 36 62 50 50Z" fill={c.base} />
      <path d="M50 50 C66 30 92 32 90 48 C88 64 64 62 50 50Z" fill={c.base} />
      <path d="M50 50 C36 34 14 36 13 47 C22 40 38 42 50 50Z" fill={c.light} />
      <path d="M50 50 C64 34 86 36 87 47 C78 40 62 42 50 50Z" fill={c.light} />
      <path d="M44 54 L30 88 L44 82 L48 92 Z" fill={c.dark} />
      <path d="M56 54 L70 88 L56 82 L52 92 Z" fill={c.dark} />
      <ellipse cx="50" cy="50" rx="10" ry="9" fill={c.deep} />
    </g>
  ),

  wstazka: (c) => (
    <g>
      <path d="M4 42 C26 28 74 28 96 42 L96 58 C74 44 26 44 4 58 Z" fill={c.base} />
      <path d="M4 42 C26 28 74 28 96 42 L96 48 C74 34 26 34 4 48 Z" fill={c.light} />
      <path d="M40 44 L28 26 L50 40 L72 26 L60 44 Z" fill={c.dark} />
    </g>
  ),

  drut: (c) => (
    <g>
      <path d="M6 78 C22 46 34 92 48 56 C60 26 70 78 84 44 C90 30 94 34 96 30"
        fill="none" stroke={c.base} strokeWidth="4" strokeLinecap="round" />
      {[[20, 62], [46, 60], [72, 56], [92, 32]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={c.light} />
      ))}
    </g>
  ),

  perelki: (c) => (
    <g>
      {[[10, 60], [24, 48], [39, 42], [55, 44], [70, 52], [84, 64], [30, 68], [62, 70]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5.5 - (i % 3) * 0.8} fill={c.base} />
          <circle cx={x - 1.6} cy={y - 1.6} r="1.8" fill="#fff" opacity="0.8" />
        </g>
      ))}
      <path d="M10 60 C24 44 70 44 84 64" fill="none" stroke={c.dark} strokeWidth="1.6" opacity="0.6" />
    </g>
  ),

  motylek: (c) => (
    <g>
      <path d="M50 52 C30 22 6 26 10 46 C13 62 36 62 50 52Z" fill={c.base} />
      <path d="M50 52 C70 22 94 26 90 46 C87 62 64 62 50 52Z" fill={c.base} />
      <path d="M50 54 C34 52 16 60 22 76 C28 90 46 76 50 54Z" fill={c.light} />
      <path d="M50 54 C66 52 84 60 78 76 C72 90 54 76 50 54Z" fill={c.light} />
      <ellipse cx="26" cy="42" rx="5" ry="4" fill={c.deep} />
      <ellipse cx="74" cy="42" rx="5" ry="4" fill={c.deep} />
      <ellipse cx="50" cy="58" rx="4" ry="16" fill="#4a3b46" />
      <path d="M48 44 C42 30 38 26 34 24 M52 44 C58 30 62 26 66 24"
        fill="none" stroke="#4a3b46" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),

  biedronka: (c) => (
    <g>
      <ellipse cx="50" cy="56" rx="30" ry="26" fill={c.base} />
      <path d="M50 30 C34 30 20 42 20 56 C20 70 34 82 50 82 Z" fill={c.dark} />
      <circle cx="50" cy="34" r="14" fill="#3b3238" />
      <circle cx="45" cy="31" r="3" fill="#fff" />
      <circle cx="55" cy="31" r="3" fill="#fff" />
      <path d="M50 32 L50 82" stroke="#3b3238" strokeWidth="3" />
      {[[36, 48], [64, 48], [34, 66], [66, 66], [50, 72]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#3b3238" />
      ))}
    </g>
  ),

  serduszko: (c) => (
    <g>
      <path d="M50 86 C18 64 12 44 22 32 C33 19 46 26 50 38 C54 26 67 19 78 32 C88 44 82 64 50 86Z" fill={c.base} />
      <path d="M32 34 C26 38 24 46 28 54" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
    </g>
  ),

  gwiazdka_ozdoba: (c) => (
    <g>
      <path d="M50 12 L60 40 L90 42 L66 60 L74 88 L50 71 L26 88 L34 60 L10 42 L40 40 Z" fill={c.base} />
      <path d="M50 24 L57 43 L76 45 L61 56 L50 50 Z" fill={c.light} />
    </g>
  ),
}

export const EXTRA_IDS = Object.keys(SHAPES)

export function ExtraArt({ id, color = '#e63946', size = 100, style }) {
  const shape = SHAPES[id] || SHAPES.kokarda
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      {shape(palette(color))}
    </svg>
  )
}
