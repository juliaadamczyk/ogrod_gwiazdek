// Blat stolu widziany z boku (lekko z gory) - owal w fioletowo-zolte paski,
// z widoczna gruboscia blatu. Wazon stoi NA blacie, bukiet rosnie nad nim.
import React from 'react'

// Srodek blatu i jego promienie w ukladzie sceny (0-100)
export const BLAT = { cx: 50, cy: 79, rx: 38, ry: 11 }

const PASKI = 9
const FIOLET = ['#9b74d6', '#8a5fc9']
const ZOLTY = ['#ffd97a', '#f7c95c']

export function TableArt() {
  const { cx, cy, rx, ry } = BLAT
  const grubosc = 5
  // Paski biegna w poprzek blatu; przy patrzeniu z boku sciskaja sie w pionie razem z owalem
  const pasy = Array.from({ length: PASKI }, (_, i) => ({
    y: cy - ry + (i * 2 * ry) / PASKI,
    h: (2 * ry) / PASKI + 0.02,
    fill: i % 2 ? FIOLET[(i >> 1) % 2] : ZOLTY[(i >> 1) % 2],
  }))

  return (
    <svg viewBox="0 0 100 100" className="table-svg" aria-hidden="true">
      <defs>
        <clipPath id="blat-obrys">
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
        </clipPath>
        <linearGradient id="bok-blatu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a4fb5" />
          <stop offset="100%" stopColor="#4b2f74" />
        </linearGradient>
        <radialGradient id="glebia-blatu" cx="50%" cy="50%" r="50%">
          <stop offset="52%" stopColor="#3b2357" stopOpacity="0" />
          <stop offset="100%" stopColor="#3b2357" stopOpacity="0.26" />
        </radialGradient>
        <linearGradient id="polysk-blatu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* miekki cien na podlodze */}
      <ellipse cx={cx} cy={cy + grubosc + 5} rx={rx * 0.94} ry={ry * 0.5} fill="#a9855f" opacity="0.2" />

      {/* grubosc blatu - dolny owal wystaje spod gornego */}
      <ellipse cx={cx} cy={cy + grubosc} rx={rx} ry={ry} fill="url(#bok-blatu)" />

      {/* powierzchnia blatu w paski */}
      <g clipPath="url(#blat-obrys)">
        <rect x={cx - rx} y={cy - ry} width={rx * 2} height={ry * 2} fill="#f3e3bd" />
        {pasy.map((p, i) => (
          <rect key={i} x={cx - rx} y={p.y} width={rx * 2} height={p.h} fill={p.fill} />
        ))}
      </g>

      {/* przyciemnienie brzegow, zeby blat byl plaszczyzna, a nie naklejka */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#glebia-blatu)" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#polysk-blatu)" />

      {/* kant blatu */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#6d47a6" strokeWidth="1.1" />
      <path
        d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`}
        fill="none"
        stroke="#d3b6f5"
        strokeWidth="0.9"
        opacity="0.5"
      />
    </svg>
  )
}

export function TrashArt({ open }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <g transform={open ? 'translate(0 3)' : ''}>
        <path d="M22 30 L28 88 C29 93 71 93 72 88 L78 30 Z" fill="#8d9aa6" />
        <path d="M50 92 C62 92 71 91 72 88 L78 30 L62 30 L56 91 Z" fill="#6e7c88" />
        <path d="M38 40 L41 82 M50 40 L50 82 M62 40 L59 82" stroke="#5b6874" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform={open ? 'rotate(-18 22 24)' : ''}>
        <rect x="16" y="18" width="68" height="12" rx="6" fill="#aab6c1" />
        <rect x="40" y="10" width="20" height="8" rx="4" fill="#aab6c1" />
      </g>
    </svg>
  )
}
