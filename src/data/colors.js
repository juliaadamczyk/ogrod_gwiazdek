// Pomocniki koloru: z jednego koloru bazowego wyliczamy cala palete odcieni,
// dzieki czemu kazdy kwiat da sie przemalowac jednym klikiem.

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function shade(hex, dl, ds = 0, dh = 0) {
  const { h, s, l } = rgbToHsl(hexToRgb(hex))
  return `hsl(${(h + dh + 360) % 360} ${clamp(s + ds, 0, 100)}% ${clamp(l + dl, 0, 100)}%)`
}

// Paleta odcieni jednego kwiatu.
// Dla bardzo jasnych kolorow (biel, krem) przyciemniamy mocniej, zeby ksztalt byl czytelny.
export function palette(hex) {
  const { l } = rgbToHsl(hexToRgb(hex))
  const light = l > 82
  return {
    base: hex,
    light: shade(hex, light ? -5 : 11, -4),
    dark: shade(hex, light ? -19 : -12, 2),
    deep: shade(hex, light ? -33 : -24, 4),
    line: shade(hex, light ? -44 : -30, 6),
  }
}

// Palety do wyboru w grze
export const FLOWER_COLORS = [
  '#ef476f', '#ff7aa2', '#ffb3c6', '#fff1f4',
  '#f4a261', '#ffd166', '#fff3b0', '#ffffff',
  '#8ac926', '#57cc99', '#4cc9f0', '#4361ee',
  '#9d4edd', '#c77dff', '#e0aaff', '#a4133c',
]

export const VASE_COLORS = [
  '#e8d5c4', '#d9b8a0', '#c98b6b', '#8d5a44',
  '#a8dadc', '#457b9d', '#1d3557', '#b7e4c7',
  '#f7b2bd', '#e5989b', '#ffd6a5', '#fdfcdc',
  '#cdb4db', '#9a8c98', '#f1faee', '#2f3e46',
]

export const LEAF_COLORS = [
  '#2d6a4f', '#40916c', '#52b788', '#95d5b2',
  '#7f9172', '#a3b18a', '#588157', '#344e41',
]

export const EXTRA_COLORS = [
  '#e63946', '#ff7aa2', '#ffd166', '#f4a261',
  '#4cc9f0', '#4361ee', '#9d4edd', '#ffffff',
  '#2d6a4f', '#8d5a44', '#f1faee', '#2f3e46',
]

export const COLOR_SETS = {
  flower: FLOWER_COLORS,
  leaf: LEAF_COLORS,
  vase: VASE_COLORS,
  extra: EXTRA_COLORS,
}
