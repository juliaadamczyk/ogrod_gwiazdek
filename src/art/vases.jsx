// Wazony i opakowania.
// Kazdy wazon opisuje wlasny ksztalt (SVG) ORAZ geometrie bukietu:
//  - box    : gdzie wazon lezy na scenie (procenty sceny, scena jest kwadratem)
//  - mouth  : punkt zbiegu lodyg (wylot wazonu)
//  - spread : promienie kopuly, w ktorej lapia sie kwiaty
//  - capacity: ile punktow kotwiczacych generujemy
import React from 'react'
import { palette } from '../data/colors'

const shine = (o = 0.35) => <ellipse cx="34" cy="52" rx="7" ry="18" fill="#fff" opacity={o} transform="rotate(-12 34 52)" />

export const VASES = {
  wazon_kula: {
    otworY: 12.5,
    dnoArt: 50,
    name: 'Okrągły wazon',
    box: { x: 30, y: 43.4, size: 40 },
    mouthArt: { x: 50, y: 12 },
    spread: { rx: 27, ry: 33 },
    capacity: 13,
    defaultColor: '#a8dadc',
    art: (c) => (
      <g>
        <path d="M34 12 L39 34 C15 46 14 80 50 94 C86 80 85 46 61 34 L66 12 Z" fill={c.base} />
        <path d="M50 94 C86 80 85 46 61 34 L58 20 C64 44 78 62 62 82 C57 88 54 91 50 94Z" fill={c.dark} />
        {shine()}
        <ellipse cx="50" cy="12" rx="16.5" ry="5.5" fill={c.light} />
        <ellipse cx="50" cy="12.5" rx="12" ry="3.6" fill={c.deep} />
      </g>
    ),
  },

  wazon_smukly: {
    otworY: 8.5,
    dnoArt: 44,
    name: 'Smukły wazon',
    box: { x: 29, y: 41.1, size: 42 },
    mouthArt: { x: 50, y: 8 },
    spread: { rx: 25, ry: 31 },
    capacity: 10,
    defaultColor: '#457b9d',
    art: (c) => (
      <g>
        <path d="M32 8 L38 44 C30 64 33 84 50 95 C67 84 70 64 62 44 L68 8 Z" fill={c.base} />
        <path d="M50 95 C67 84 70 64 62 44 L58 16 C62 48 72 66 58 86 C55 90 52 93 50 95Z" fill={c.dark} />
        {shine(0.3)}
        <ellipse cx="50" cy="8" rx="18" ry="5.5" fill={c.light} />
        <ellipse cx="50" cy="8.5" rx="13" ry="3.6" fill={c.deep} />
      </g>
    ),
  },

  dzbanek: {
    otworY: 12.5,
    dnoArt: 48,
    name: 'Dzbanek',
    box: { x: 29, y: 41.5, size: 42 },
    mouthArt: { x: 48, y: 12 },
    spread: { rx: 26, ry: 32 },
    capacity: 12,
    defaultColor: '#e5989b',
    art: (c) => (
      <g>
        <path d="M66 26 C90 26 92 62 66 66" fill="none" stroke={c.dark} strokeWidth="9" strokeLinecap="round" />
        <path d="M28 12 L27 32 C17 48 20 82 48 94 C76 82 79 48 69 32 L68 12 Z" fill={c.base} />
        <path d="M48 94 C76 82 79 48 69 32 L67 18 C71 46 80 66 60 86 C55 90 51 92 48 94Z" fill={c.dark} />
        {shine(0.3)}
        <ellipse cx="48" cy="12" rx="20.5" ry="6" fill={c.light} />
        <ellipse cx="48" cy="12.5" rx="15" ry="4" fill={c.deep} />
      </g>
    ),
  },

  doniczka: {
    otworY: 15,
    dnoArt: 48,
    name: 'Doniczka',
    box: { x: 30, y: 43, size: 40 },
    mouthArt: { x: 50, y: 10 },
    spread: { rx: 27, ry: 31 },
    capacity: 11,
    defaultColor: '#c98b6b',
    art: (c) => (
      <g>
        <path d="M20 26 L30 88 C32 95 68 95 70 88 L80 26 Z" fill={c.base} />
        <path d="M50 95 C62 95 69 93 70 88 L80 26 L62 26 L58 92 C56 94 53 95 50 95Z" fill={c.dark} />
        <rect x="14" y="10" width="72" height="18" rx="7" fill={c.light} />
        <rect x="14" y="10" width="72" height="7" rx="3.5" fill={c.deep} opacity="0.5" />
      </g>
    ),
  },

  sloik: {
    otworY: 11,
    dnoArt: 47,
    name: 'Słoik ze wstążką',
    box: { x: 31, y: 44.5, size: 38 },
    mouthArt: { x: 50, y: 8 },
    spread: { rx: 25, ry: 31 },
    capacity: 10,
    defaultColor: '#b7e4c7',
    art: (c) => (
      <g>
        <path d="M26 10 L26 30 C20 40 20 84 26 90 C34 96 66 96 74 90 C80 84 80 40 74 30 L74 10 Z" fill={c.base} opacity="0.9" />
        <path d="M74 30 C80 40 80 84 74 90 C70 93 62 95 54 95 L54 12 L74 10Z" fill={c.dark} opacity="0.75" />
        {shine(0.45)}
        <rect x="24" y="8" width="52" height="7" rx="3.5" fill={c.light} />
        <path d="M18 56 C34 50 66 50 82 56 L82 66 C66 60 34 60 18 66 Z" fill="#e63946" />
        <path d="M44 58 L34 48 L50 56 L66 48 L56 58 Z" fill="#c1121f" />
      </g>
    ),
  },

  papier: {
    otworY: 17,
    dnoArt: 80,
    name: 'Papier ozdobny',
    box: { x: 27, y: 37.8, size: 46 },
    mouthArt: { x: 50, y: 17 },
    spread: { rx: 30, ry: 27 },
    capacity: 14,
    defaultColor: '#e8c4b0',
    art: (c) => (
      <g>
        {/* sylwetka stozka - gorna krawedz to tylny rant, widoczny za kwiatami */}
        <path d="M12 17 A38 9 0 0 0 88 17 L56 84 C53 87 47 87 44 84 Z" fill={c.deep} />
        {/* przednia powierzchnia papieru */}
        <path d="M12 17 A38 9 0 0 1 88 17 L56 84 C53 87 47 87 44 84 Z" fill={c.base} />
        {/* prawa strona ciemniejsza */}
        <path d="M88 17 A38 9 0 0 1 50 26 L50 86 C53 86 55 85 56 84 Z" fill={c.dark} />
        {/* zalamania papieru zbiegajace sie do przewiazania */}
        <path d="M26 22 L47 83 M50 26 L50 86 M74 22 L53 83"
          stroke={c.deep} strokeWidth="1.1" opacity="0.35" fill="none" />
        {/* sznurek - papier scisniety u dolu */}
        <path d="M39 72 C44 76 56 76 61 72 M40 77 C45 81 55 81 60 77"
          stroke="#9c7a56" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M46 80 L39 90 M54 80 L61 90"
          stroke="#9c7a56" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  folia: {
    otworY: 15,
    dnoArt: 80,
    name: 'Folia',
    box: { x: 26, y: 36, size: 48 },
    mouthArt: { x: 50, y: 15 },
    spread: { rx: 31, ry: 26 },
    capacity: 15,
    defaultColor: '#f1faee',
    art: (c) => (
      <g>
        <path d="M11 15 A39 9 0 0 0 89 15 L56 84 C53 87 47 87 44 84 Z" fill={c.dark} opacity="0.42" />
        <path d="M11 15 A39 9 0 0 1 89 15 L56 84 C53 87 47 87 44 84 Z" fill={c.base} opacity="0.6" />
        <path d="M25 21 L47 83 M52 24 L52 86 M75 21 L54 83"
          stroke="#fff" strokeWidth="1.7" opacity="0.75" fill="none" />
        <path d="M39 72 C44 76 56 76 61 72 M40 77 C45 81 55 81 60 77"
          stroke="#f0b429" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M46 80 L39 90 M54 80 L61 90"
          stroke="#f0b429" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      </g>
    ),
  },

  koszyk: {
    otworY: 27,
    dnoArt: 59,
    name: 'Koszyk',
    box: { x: 27, y: 37.8, size: 46 },
    mouthArt: { x: 50, y: 26 },
    spread: { rx: 29, ry: 33 },
    capacity: 14,
    defaultColor: '#d9a066',
    art: (c) => (
      <g>
        <path d="M22 26 C22 4 78 4 78 26" fill="none" stroke={c.dark} strokeWidth="7" strokeLinecap="round" />
        <path d="M12 28 L24 88 C26 94 74 94 76 88 L88 28 Z" fill={c.base} />
        <path d="M50 94 C64 94 74 93 76 88 L88 28 L66 28 L58 92 C56 93 53 94 50 94Z" fill={c.dark} />
        {[38, 52, 66, 80].map((y) => (
          <path key={y} d={`M${13 + (y - 28) * 0.16} ${y} L${87 - (y - 28) * 0.16} ${y}`} stroke={c.deep} strokeWidth="2.6" opacity="0.55" />
        ))}
        {[24, 38, 52, 66, 80].map((x) => (
          <path key={x} d={`M${x} 28 L${x + (x - 50) * 0.22} 90`} stroke={c.deep} strokeWidth="2.2" opacity="0.4" />
        ))}
        <rect x="8" y="22" width="84" height="10" rx="5" fill={c.light} />
      </g>
    ),
  },
}

// Wylot wazonu w ukladzie sceny liczymy z pozycji na rysunku,
// dzieki czemu lodygi zawsze trafiaja dokladnie w otwor - niezaleznie od rozmiaru wazonu.
for (const v of Object.values(VASES)) {
  v.mouth = {
    x: v.box.x + (v.mouthArt.x / 100) * v.box.size,
    y: v.box.y + (v.mouthArt.y / 100) * v.box.size,
  }
  // punkt, w ktorym zbiegaja sie lodygi (dno wazonu / przewiazanie opakowania)
  v.dno = v.box.y + (v.dnoArt / 100) * v.box.size
}

export const VASE_IDS = Object.keys(VASES)

// Kopula punktow kotwiczacych: srodek wyzej, brzegi nizej i szerzej (jak prawdziwy bukiet).
export function anchorsFor(vaseId) {
  const v = VASES[vaseId] || VASES.wazon_kula
  const { mouth, spread, capacity } = v
  const GOLDEN = 2.399963229728653
  return Array.from({ length: capacity }, (_, i) => {
    const t = (i + 0.5) / capacity
    const r = Math.sqrt(t)
    const a = i * GOLDEN
    return {
      x: mouth.x + Math.cos(a) * r * spread.rx,
      // srodek bukietu najwyzej, brzegi schodza tuz nad kant wazonu (0.30 * ry),
      // dzieki czemu kwiaty siedza W wazonie, a nie wisza nad nim
      y: mouth.y - spread.ry * (0.3 + 0.7 * (1 - r)),
    }
  })
}

// Wazon rysujemy DWA razy: raz caly (za lodygami) i raz sama jego przednia polowa
// (przed lodygami). Dzieki temu tyl i wnetrze wazonu sa z tylu, a lodygi widac,
// jak wchodza w otwor - zamiast urywac sie na kancie.
export function VaseArt({ id, color, size = 100, style, tylko }) {
  const v = VASES[id] || VASES.wazon_kula
  const rysunek = v.art(palette(color || v.defaultColor))
  if (tylko !== 'przod') {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
        {rysunek}
      </svg>
    )
  }
  const clipId = `wazon-przod-${id}`
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="-10" y={v.otworY} width="120" height={120 - v.otworY} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{rysunek}</g>
    </svg>
  )
}

// Wersja do miniaturek w panelu/sklepie - zachowuje proporcje
export function VaseThumb({ id, color, size = 56 }) {
  const v = VASES[id] || VASES.wazon_kula
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {v.art(palette(color || v.defaultColor))}
    </svg>
  )
}
