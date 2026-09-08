// Glowki kwiatow rysowane jako SVG w kodzie.
// Kazdy ksztalt dostaje wyliczona palete odcieni (c) i rysuje sie w ukladzie 100x100,
// srodek kwiatu = punkt (50,50). Dzieki temu zmiana koloru = jeden props, bez podmiany plikow.
import React from 'react'
import { palette } from '../data/colors'

const GOLD = '#f9c74f'
const GOLD_D = '#f3a712'
const DARK = '#5a3d52'

// N platkow rozlozonych w kole wokol (50,50)
const ring = (n, render, start = 0) =>
  Array.from({ length: n }, (_, i) => (
    <g key={i} transform={`rotate(${start + (i * 360) / n} 50 50)`}>{render(i)}</g>
  ))

// Maly kwiatuszek (uzywany w baldachach: hortensja, werbena, gipsowka, iberis...)
const floret = (cx, cy, r, n, fill, center, key) => (
  <g key={key}>
    {Array.from({ length: n }, (_, i) => (
      <ellipse
        key={i}
        cx={cx}
        cy={cy - r * 0.6}
        rx={r * 0.46}
        ry={r * 0.62}
        fill={fill}
        transform={`rotate(${(i * 360) / n + (key || 0) * 11} ${cx} ${cy})`}
      />
    ))}
    {center && <circle cx={cx} cy={cy} r={r * 0.3} fill={center} />}
  </g>
)

const SHAPES = {
  roza: (c) => (
    <g>
      {ring(7, () => <circle cx="50" cy="30" r="15" fill={c.base} />)}
      {ring(6, () => <circle cx="50" cy="37" r="12.5" fill={c.light} />, 26)}
      <circle cx="50" cy="50" r="20" fill={c.base} />
      <path
        d="M50 50 C56 50 58 43 52 40 C44 36 38 45 42 53 C47 63 60 60 63 50 C67 37 54 28 42 32 C28 37 24 54 32 65"
        fill="none"
        stroke={c.deep}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  ),

  rumianek: (c) => (
    <g>
      {ring(16, () => <ellipse cx="50" cy="24" rx="4" ry="19" fill={c.base} />)}
      {ring(16, () => <ellipse cx="50" cy="29" rx="2.6" ry="14" fill={c.light} />, 11)}
      <circle cx="50" cy="50" r="11" fill={GOLD} />
      <circle cx="50" cy="50" r="6.5" fill={GOLD_D} />
    </g>
  ),

  tulipan: (c) => (
    <g>
      <path d="M50 76 C40 74 29 62 27 46 C25 32 32 22 38 25 C44 28 45 50 50 76Z" fill={c.dark} />
      <path d="M50 76 C60 74 71 62 73 46 C75 32 68 22 62 25 C56 28 55 50 50 76Z" fill={c.light} />
      <path d="M50 20 C61 20 67 33 65 49 C63 64 57 77 50 77 C43 77 37 64 35 49 C33 33 39 20 50 20Z" fill={c.base} />
      <path d="M50 24 C55 30 56 44 53 60" fill="none" stroke={c.deep} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </g>
  ),

  hortensja: (c) => (
    <g>
      <circle cx="50" cy="50" r="34" fill={c.deep} opacity="0.28" />
      {[
        [50, 26, 12], [30, 36, 12], [70, 36, 12], [24, 57, 12], [76, 57, 12],
        [38, 72, 12], [62, 72, 12], [50, 50, 13], [36, 52, 11], [64, 52, 11],
      ].map(([x, y, r], i) => floret(x, y, r, 4, i % 3 === 0 ? c.light : i % 3 === 1 ? c.base : c.dark, GOLD, i))}
    </g>
  ),

  lupinus: (c) => (
    <g>
      {Array.from({ length: 11 }, (_, i) => {
        const y = 9 + i * 8.2
        const w = 1.5 + i * 1.35
        const r = 5.4 + i * 0.28
        return (
          <g key={i}>
            <ellipse cx={50 - w} cy={y} rx={r * 1.25} ry={r} fill={i % 2 ? c.dark : c.base} transform={`rotate(-26 ${50 - w} ${y})`} />
            <ellipse cx={50 + w} cy={y + 2} rx={r * 1.25} ry={r} fill={i % 2 ? c.base : c.light} transform={`rotate(26 ${50 + w} ${y + 2})`} />
            <ellipse cx="50" cy={y + 4} rx={r * 1.1} ry={r * 0.9} fill={i % 2 ? c.light : c.deep} />
          </g>
        )
      })}
      <ellipse cx="50" cy="6" rx="4.5" ry="6" fill={c.light} />
    </g>
  ),

  gipsowka: (c) => (
    <g>
      <path d="M50 72 L50 20 M50 68 L30 48 M50 68 L70 48 M50 56 L36 30 M50 56 L64 30"
        fill="none" stroke="#8aa17a" strokeWidth="2" strokeLinecap="round" />
      {[[30, 46, 9], [70, 46, 9], [36, 28, 8], [64, 28, 8], [50, 18, 9], [50, 58, 8], [42, 40, 7], [58, 40, 7], [22, 62, 7], [78, 62, 7]]
        .map(([x, y, r], i) => floret(x, y, r, 5, i % 2 ? c.base : c.light, c.dark, i))}
    </g>
  ),

  stokrotka: (c) => (
    <g>
      {ring(12, () => <ellipse cx="50" cy="27" rx="7.5" ry="17" fill={c.base} />)}
      {ring(12, () => <ellipse cx="50" cy="31" rx="5" ry="13" fill={c.light} />, 15)}
      <circle cx="50" cy="50" r="12" fill={GOLD} />
      <circle cx="50" cy="50" r="7" fill={GOLD_D} />
    </g>
  ),

  cynia: (c) => (
    <g>
      {ring(11, () => <ellipse cx="50" cy="26" rx="8" ry="18" fill={c.dark} />)}
      {ring(11, () => <ellipse cx="50" cy="33" rx="7.5" ry="15" fill={c.base} />, 16)}
      {ring(9, () => <ellipse cx="50" cy="40" rx="6" ry="10" fill={c.light} />, 8)}
      <circle cx="50" cy="50" r="8.5" fill={GOLD} />
      {ring(8, () => <circle cx="50" cy="44" r="2.4" fill={GOLD_D} />)}
    </g>
  ),

  jasmin: (c) => (
    <g>
      <path d="M50 80 L50 62 M50 74 L32 56 M50 74 L68 56" fill="none" stroke="#7f9172" strokeWidth="2.4" strokeLinecap="round" />
      {[[32, 50, 17], [68, 50, 17], [50, 26, 19]].map(([x, y, r], i) => (
        <g key={i}>
          {Array.from({ length: 6 }, (_, j) => (
            <ellipse key={j} cx={x} cy={y - r * 0.58} rx={r * 0.3} ry={r * 0.6} fill={j % 2 ? c.base : c.light}
              transform={`rotate(${(j * 360) / 6 + i * 13} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r={r * 0.24} fill={GOLD} />
        </g>
      ))}
    </g>
  ),

  antirrhinum: (c) => (
    <g>
      <path d="M50 88 L50 18" fill="none" stroke="#7f9172" strokeWidth="2.6" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => {
        const y = 18 + i * 17
        const s = 0.62 + i * 0.11
        const bok = i % 2 ? 1 : -1
        return (
          <g key={i} transform={`translate(${50 + bok * 11 * s} ${y}) scale(${s}) rotate(${bok * 20})`}>
            {/* dolna warga - szeroka, ciemniejsza */}
            <path d="M-20 0 C-24 16 -12 26 0 26 C12 26 24 16 20 0 Z" fill={c.dark} />
            {/* gardziel */}
            <ellipse cx="0" cy="2" rx="13" ry="9" fill={c.deep} />
            <ellipse cx="0" cy="1" rx="7" ry="4.5" fill={GOLD} />
            {/* gorna warga - jasna, dwa platy */}
            <path d="M-20 1 C-23 -14 -13 -24 -4 -22 C-1 -21 -1 -12 -2 1 Z" fill={c.light} />
            <path d="M20 1 C23 -14 13 -24 4 -22 C1 -21 1 -12 2 1 Z" fill={c.base} />
          </g>
        )
      })}
      <ellipse cx="50" cy="11" rx="5" ry="7" fill={c.light} />
    </g>
  ),

  polygonum: (c) => (
    <g>
      <path d="M49 92 C45 76 56 44 50 10" fill="none" stroke="#7f9172" strokeWidth="2.8" strokeLinecap="round" />
      {Array.from({ length: 16 }, (_, i) => {
        const t = i / 15
        // ta sama krzywa co lodyga - kwiatuszki siedza na niej
        const y = 10 + t * 84
        const x = 50 - 6 * Math.sin(t * Math.PI * 1.15) + (t > 0.55 ? (t - 0.55) * 10 : 0)
        const r = 3.4 + t * 1.9
        return (
          <g key={i}>
            <circle cx={x - r * 0.85} cy={y} r={r} fill={i % 2 ? c.base : c.light} />
            <circle cx={x + r * 0.85} cy={y + 1.5} r={r} fill={i % 2 ? c.dark : c.base} />
            <circle cx={x} cy={y + 2.6} r={r * 0.8} fill={i % 2 ? c.light : c.deep} />
          </g>
        )
      })}
    </g>
  ),

  narcyz: (c) => (
    <g>
      {ring(6, () => <ellipse cx="50" cy="27" rx="11" ry="17" fill={c.base} />)}
      {ring(6, () => <ellipse cx="50" cy="30" rx="7" ry="13" fill={c.light} />, 30)}
      <circle cx="50" cy="50" r="16" fill={GOLD} />
      <circle cx="50" cy="50" r="11.5" fill={GOLD_D} />
      <circle cx="50" cy="50" r="6.5" fill="#e07a1f" />
    </g>
  ),

  godecja: (c) => (
    <g>
      {ring(4, () => <ellipse cx="50" cy="30" rx="19" ry="21" fill={c.base} />, 45)}
      {ring(4, () => <ellipse cx="50" cy="36" rx="11" ry="14" fill={c.deep} opacity="0.55" />, 45)}
      <circle cx="50" cy="50" r="9" fill={c.light} />
      {ring(5, () => <ellipse cx="50" cy="45" rx="1.8" ry="4" fill={GOLD} />)}
      <circle cx="50" cy="50" r="3.5" fill={GOLD_D} />
    </g>
  ),

  kosmos: (c) => (
    <g>
      {ring(8, () => (
        <path d="M50 50 C36 42 33 22 41 12 L50 19 L59 12 C67 22 64 42 50 50Z" fill={c.base} />
      ))}
      {ring(8, () => (
        <path d="M50 50 C43 44 41 32 45 25 L50 29 L55 25 C59 32 57 44 50 50Z" fill={c.light} opacity="0.75" />
      ))}
      <circle cx="50" cy="50" r="10" fill={GOLD} />
      {ring(7, () => <circle cx="50" cy="45" r="2.2" fill={GOLD_D} />)}
    </g>
  ),

  brachycome: (c) => (
    <g>
      {ring(20, () => <ellipse cx="50" cy="25" rx="3.2" ry="19" fill={c.base} />)}
      {ring(20, () => <ellipse cx="50" cy="30" rx="2" ry="14" fill={c.light} />, 9)}
      <circle cx="50" cy="50" r="10" fill={DARK} />
      <circle cx="50" cy="50" r="6" fill={GOLD_D} />
    </g>
  ),

  frezja: (c) => (
    <g>
      <path d="M25 82 C27 70 34 52 56 34 C68 24 78 20 86 18" fill="none" stroke="#7f9172" strokeWidth="3" strokeLinecap="round" />
      {[[26, 74, -35, 1], [38, 56, -18, 0.95], [54, 42, 5, 0.9], [70, 30, 25, 0.8], [84, 22, 45, 0.62]].map(([x, y, r, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d="M0 4 C-4 -6 -12 -11 -13 -19 C-14 -27 -7 -31 0 -31 C7 -31 14 -27 13 -19 C12 -11 4 -6 0 4Z" fill={i % 2 ? c.base : c.light} />
          <ellipse cx="0" cy="-28" rx="13" ry="7" fill={c.dark} opacity="0.5" />
          <ellipse cx="0" cy="-30" rx="9" ry="4.5" fill={GOLD} opacity="0.8" />
        </g>
      ))}
    </g>
  ),

  bellis: (c) => (
    <g>
      {ring(22, () => <ellipse cx="50" cy="26" rx="3" ry="18" fill={c.base} />)}
      {ring(18, () => <ellipse cx="50" cy="32" rx="2.6" ry="13" fill={c.light} />, 9)}
      {ring(14, () => <ellipse cx="50" cy="39" rx="2.2" ry="8" fill={c.dark} />, 12)}
      <circle cx="50" cy="50" r="8" fill={GOLD} />
      <circle cx="50" cy="50" r="4.5" fill={GOLD_D} />
    </g>
  ),

  viola: (c) => (
    <g>
      {/* dwa gorne platki - najciemniejsze */}
      <ellipse cx="32" cy="29" rx="18" ry="17" fill={c.dark} transform="rotate(-16 32 29)" />
      <ellipse cx="68" cy="29" rx="18" ry="17" fill={c.dark} transform="rotate(16 68 29)" />
      {/* dwa boczne */}
      <ellipse cx="23" cy="55" rx="19" ry="17" fill={c.base} transform="rotate(-22 23 55)" />
      <ellipse cx="77" cy="55" rx="19" ry="17" fill={c.base} transform="rotate(22 77 55)" />
      {/* duzy dolny - najjasniejszy */}
      <ellipse cx="50" cy="71" rx="25" ry="21" fill={c.light} />
      {/* ciemna "buzia" bratka - mala, zeby platki byly widoczne */}
      <path d="M50 42 C60 42 65 54 60 65 C56 74 44 74 40 65 C35 54 40 42 50 42Z" fill={c.deep} />
      <circle cx="50" cy="49" r="8" fill={GOLD} />
      <circle cx="50" cy="49" r="4" fill={GOLD_D} />
      {[-24, 0, 24].map((a, i) => (
        <path key={i} d="M50 54 L50 72" stroke={c.line} strokeWidth="2.6" strokeLinecap="round"
          transform={`rotate(${a} 50 54)`} />
      ))}
    </g>
  ),

  werbena: (c) => (
    <g>
      <circle cx="50" cy="50" r="33" fill={c.deep} opacity="0.22" />
      {[[50, 24, 11], [27, 38, 11], [73, 38, 11], [27, 63, 11], [73, 63, 11], [50, 77, 11], [50, 50, 12]]
        .map(([x, y, r], i) => floret(x, y, r, 5, i % 2 ? c.base : c.light, i % 2 ? '#fff8e7' : GOLD, i))}
    </g>
  ),

  szafirek: (c) => (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const y = 11 + i * 9.4
        const w = 1 + i * 1.5
        const r = 4.6 + i * 0.42
        return (
          <g key={i}>
            <circle cx={50 - w} cy={y} r={r} fill={i % 2 ? c.dark : c.base} />
            <circle cx={50 + w} cy={y + 3} r={r} fill={i % 2 ? c.base : c.light} />
            <circle cx="50" cy={y + 5} r={r * 0.92} fill={i % 2 ? c.light : c.deep} />
            <ellipse cx={50 - w} cy={y + r * 0.55} rx={r * 0.5} ry={r * 0.26} fill="#fff" opacity="0.5" />
          </g>
        )
      })}
      <circle cx="50" cy="6" r="3.6" fill={c.light} />
    </g>
  ),

  iberis: (c) => (
    <g>
      <path d="M50 74 L50 62" fill="none" stroke="#7f9172" strokeWidth="3" strokeLinecap="round" />
      {[[24, 40, 11], [40, 30, 11], [58, 28, 11], [75, 38, 11], [32, 54, 11], [50, 47, 12], [68, 54, 11], [42, 66, 10], [60, 66, 10]]
        .map(([x, y, r], i) => floret(x, y, r, 4, i % 2 ? c.base : c.light, c.dark, i))}
    </g>
  ),

  // Nagroda koncowa - gesta, wielowarstwowa piwonia
  piwonia: (c) => (
    <g>
      {ring(9, () => <ellipse cx="50" cy="24" rx="14.5" ry="19" fill={c.deep} />)}
      {ring(9, () => <ellipse cx="50" cy="29" rx="13" ry="16" fill={c.dark} />, 20)}
      {ring(9, () => <ellipse cx="50" cy="35" rx="11.5" ry="13" fill={c.base} />, 10)}
      {ring(8, () => <ellipse cx="50" cy="40" rx="9.5" ry="10.5" fill={c.light} />, 24)}
      {ring(7, () => <ellipse cx="50" cy="44" rx="7.5" ry="8" fill={c.base} />, 12)}
      {ring(6, () => <ellipse cx="50" cy="47" rx="5.5" ry="6" fill={c.dark} />, 28)}
      <circle cx="50" cy="50" r="7.5" fill={GOLD} />
      {ring(10, () => <circle cx="50" cy="45.5" r="1.7" fill={GOLD_D} />)}
      <circle cx="50" cy="50" r="3.2" fill={GOLD_D} />
    </g>
  ),

  nicotiana: (c) => (
    <g>
      {ring(5, () => <path d="M50 50 L41 24 L50 8 L59 24 Z" fill={c.base} />)}
      {ring(5, () => <path d="M50 50 L45 30 L50 18 L55 30 Z" fill={c.light} />)}
      <circle cx="50" cy="50" r="12" fill={c.deep} />
      <circle cx="50" cy="50" r="7" fill={GOLD} />
      <circle cx="50" cy="50" r="3.5" fill={GOLD_D} />
    </g>
  ),
}

export const FLOWER_IDS = Object.keys(SHAPES)

export function FlowerArt({ id, color = '#ff7aa2', size = 100, style }) {
  const shape = SHAPES[id] || SHAPES.stokrotka
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      {shape(palette(color))}
    </svg>
  )
}
