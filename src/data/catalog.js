// Katalog wszystkich elementow gry: nazwy, ceny w sklepiku, wartosc przy sprzedazy,
// kolor domyslny i to, czy element jest odblokowany od startu.
//
// wartosc  = ile gwiazdek dokłada do bukietu przy sprzedaży
// cena     = ile gwiazdek kosztuje odblokowanie w sklepiku
// skala    = wielkosc glowki wzgledem bazowej (kwiaty pionowe/kolosowe sa wieksze)

export const FLOWERS = [
  { id: 'roza',        nazwa: 'Róża',            kolor: '#ef476f', wartosc: 2, cena: 0,  skala: 1.05, start: true },
  { id: 'stokrotka',   nazwa: 'Stokrotka',       kolor: '#fff1f4', wartosc: 1, cena: 0,  skala: 0.95, start: true },
  { id: 'tulipan',     nazwa: 'Tulipan',         kolor: '#ff7aa2', wartosc: 1, cena: 0,  skala: 1.0,  start: true, nasada: { x: 50, y: 75 } },
  { id: 'rumianek',    nazwa: 'Rumianek',        kolor: '#ffffff', wartosc: 1, cena: 0,  skala: 0.9,  start: true },
  { id: 'gipsowka',    nazwa: 'Gipsówka',        kolor: '#fff1f4', wartosc: 1, cena: 30, skala: 1.0, nasada: { x: 50, y: 72 } },
  { id: 'bellis',      nazwa: 'Bellis',          kolor: '#ffb3c6', wartosc: 1, cena: 45, skala: 0.85 },
  { id: 'viola',       nazwa: 'Bratek',          kolor: '#c77dff', wartosc: 2, cena: 65, skala: 0.9, nasada: { x: 50, y: 80 } },
  { id: 'narcyz',      nazwa: 'Narcyz',          kolor: '#ffd166', wartosc: 2, cena: 90, skala: 1.0 },
  { id: 'kosmos',      nazwa: 'Kosmos',          kolor: '#ff7aa2', wartosc: 2, cena: 115, skala: 1.0 },
  { id: 'cynia',       nazwa: 'Cynia',           kolor: '#f4a261', wartosc: 2, cena: 145, skala: 1.05 },
  { id: 'szafirek',    nazwa: 'Szafirek',        kolor: '#4361ee', wartosc: 2, cena: 175, skala: 1.0, nasada: { x: 50, y: 92 } },
  { id: 'hortensja',   nazwa: 'Hortensja',       kolor: '#c77dff', wartosc: 3, cena: 285, skala: 1.15 },
  { id: 'werbena',     nazwa: 'Werbena',         kolor: '#a4133c', wartosc: 2, cena: 210, skala: 1.0 },
  { id: 'iberis',      nazwa: 'Iberis',          kolor: '#fdf0f5', wartosc: 2, cena: 245, skala: 1.0, nasada: { x: 50, y: 74 } },
  { id: 'jasmin',      nazwa: 'Jaśmin',          kolor: '#fff1f4', wartosc: 2, cena: 415, skala: 1.05, nasada: { x: 50, y: 80 } },
  { id: 'frezja',      nazwa: 'Frezja',          kolor: '#ffd166', wartosc: 3, cena: 465, skala: 1.1, nasada: { x: 25, y: 82 } },
  { id: 'lupinus',     nazwa: 'Łubin',           kolor: '#9d4edd', wartosc: 3, cena: 515, skala: 1.15, nasada: { x: 50, y: 92 } },
  { id: 'antirrhinum', nazwa: 'Lwia paszcza',    kolor: '#f4a261', wartosc: 3, cena: 570, skala: 1.15, nasada: { x: 50, y: 88 } },
  { id: 'brachycome',  nazwa: 'Brachycome',      kolor: '#4cc9f0', wartosc: 2, cena: 325, skala: 0.9 },
  { id: 'godecja',     nazwa: 'Godecja',         kolor: '#ffb3c6', wartosc: 2, cena: 370, skala: 1.0 },
  { id: 'polygonum',   nazwa: 'Rdest',           kolor: '#ffb3c6', wartosc: 3, cena: 630, skala: 1.1, nasada: { x: 49, y: 92 } },
  { id: 'nicotiana',   nazwa: 'Tytoń ozdobny',   kolor: '#8ac926', wartosc: 3, cena: 700, skala: 1.0 },
  { id: 'piwonia',     nazwa: 'Piwonia królewska', kolor: '#e5397a', wartosc: 6, cena: 1200, skala: 1.3 },
]

export const LEAVES = [
  { id: 'listek',        nazwa: 'Listek',          kolor: '#52b788', wartosc: 1, cena: 0,  skala: 1.0,  start: true },
  { id: 'eukaliptus',    nazwa: 'Eukaliptus',      kolor: '#95d5b2', wartosc: 1, cena: 0,  skala: 1.15, start: true },
  { id: 'zdzbla',        nazwa: 'Długa trawa',     kolor: '#8fbf7a', wartosc: 1, cena: 0,  skala: 1.3,  start: true },
  { id: 'paproc',     nazwa: 'Paproć',     kolor: '#2d6a4f', wartosc: 1, cena: 50, skala: 1.2 },
  { id: 'ruskus',     nazwa: 'Ruskus',     kolor: '#40916c', wartosc: 1, cena: 80, skala: 1.15 },
  { id: 'bluszcz',    nazwa: 'Bluszcz',    kolor: '#52b788', wartosc: 1, cena: 120, skala: 1.15 },
  { id: 'trawa',      nazwa: 'Trawa ozdobna', kolor: '#a3b18a', wartosc: 1, cena: 170, skala: 1.2 },
]

export const VASES_CATALOG = [
  { id: 'wazon_kula',   nazwa: 'Okrągły wazon',    kolor: '#a8dadc', bonus: 0, cena: 0,  start: true },
  { id: 'doniczka',     nazwa: 'Doniczka',         kolor: '#c98b6b', bonus: 1, cena: 70 },
  { id: 'wazon_smukly', nazwa: 'Smukły wazon',     kolor: '#457b9d', bonus: 1, cena: 120 },
  { id: 'sloik',        nazwa: 'Słoik ze wstążką', kolor: '#b7e4c7', bonus: 2, cena: 180 },
  { id: 'dzbanek',      nazwa: 'Dzbanek',          kolor: '#e5989b', bonus: 2, cena: 250 },
  { id: 'koszyk',       nazwa: 'Koszyk',           kolor: '#d9a066', bonus: 2, cena: 330 },
  { id: 'papier',       nazwa: 'Papier ozdobny',   kolor: '#e8c4b0', bonus: 3, cena: 430 },
  { id: 'folia',        nazwa: 'Folia',            kolor: '#f1faee', bonus: 3, cena: 550 },
]

export const EXTRAS = [
  { id: 'kokarda',          nazwa: 'Kokarda',    kolor: '#e63946', wartosc: 2, cena: 0,  skala: 0.85, start: true },
  { id: 'wstazka',          nazwa: 'Wstążka',    kolor: '#ff7aa2', wartosc: 1, cena: 55, skala: 1.0 },
  { id: 'drut',             nazwa: 'Linka',      kolor: '#ffd166', wartosc: 1, cena: 55, skala: 1.0 },
  { id: 'perelki',          nazwa: 'Perełki',    kolor: '#ffffff', wartosc: 1, cena: 90, skala: 0.95 },
  { id: 'serduszko',        nazwa: 'Serduszko',  kolor: '#e63946', wartosc: 1, cena: 130, skala: 0.7 },
  { id: 'gwiazdka_ozdoba',  nazwa: 'Gwiazdka',   kolor: '#ffd166', wartosc: 1, cena: 170, skala: 0.7 },
  { id: 'motylek',          nazwa: 'Motylek',    kolor: '#4cc9f0', wartosc: 2, cena: 220, skala: 0.75 },
  { id: 'biedronka',        nazwa: 'Biedronka',  kolor: '#e63946', wartosc: 2, cena: 280, skala: 0.55 },
]

// Jedno pokrętło do przeskalowania całego sklepiku. 1 = ceny jak wyżej,
// 0.5 = wszystko dwa razy tańsze, 2 = dwa razy droższe.
export const MNOZNIK_CEN = 1

if (MNOZNIK_CEN !== 1) {
  for (const lista of [FLOWERS, LEAVES, VASES_CATALOG, EXTRAS]) {
    for (const poz of lista) poz.cena = Math.round(poz.cena * MNOZNIK_CEN)
  }
}

// szybkie wyszukiwanie po id
export const BY_ID = {
  flower: Object.fromEntries(FLOWERS.map((f) => [f.id, f])),
  leaf: Object.fromEntries(LEAVES.map((f) => [f.id, f])),
  vase: Object.fromEntries(VASES_CATALOG.map((f) => [f.id, f])),
  extra: Object.fromEntries(EXTRAS.map((f) => [f.id, f])),
}

export const CATALOG_LIST = { flower: FLOWERS, leaf: LEAVES, vase: VASES_CATALOG, extra: EXTRAS }

// Punkt styku lodygi z kwiatem (pole `nasada` przy kwiatach) podawany jest
// w jednostkach rysunku 0-100; brak pola oznacza srodek ikony.
export const SRODEK_IKONY = { x: 50, y: 50 }

// Domyslna nasada: dol glowki, nie jej srodek. Dzieki temu lodyga podchodzi
// do kwiatu OD DOLU i widac ja spod platkow, zamiast chowac sie calkiem za nimi.
export const NASADA_DOMYSLNA = { x: 50, y: 76 }

// Bazowa wielkosc elementu na stole, w % szerokosci sceny.
// Uzywaja jej Workbench, BouquetPreview i logika sadzenia lisci.
export const ROZMIAR_ELEMENTU = { flower: 21, leaf: 25, extra: 20 }

// Lisc obraca sie wokol punktu 84% swojej wysokosci (patrz Workbench),
// wiec jego nasada lezy 8.5 jednostki ponizej srodka.
export const NASADA_LISCIA = ROZMIAR_ELEMENTU.leaf * (0.84 - 0.5)

export const KATEGORIE = [
  { key: 'flower', label: 'Kwiaty', emoji: '🌸' },
  { key: 'leaf', label: 'Liście', emoji: '🌿' },
  { key: 'vase', label: 'Wazony', emoji: '🏺' },
  { key: 'extra', label: 'Dodatki', emoji: '🎀' },
]

// Ile elementów zmieści się na jednym bukiecie. Każda kategoria ma WŁASNĄ pulę,
// żeby zieleń nie zabierała miejsca kwiatom.
export const LIMIT_KWIATOW = 15
export const LIMIT_LISCI = 15
export const LIMIT_DODATKOW = 6

// --- Reguła wyceny bukietu (prosta, zeby dalo sie ja wytlumaczyc dziecku) ---
// 1. Pierwszy kwiat danego gatunku jest wart tyle, ile ma w katalogu.
// 2. Każdy KOLEJNY taki sam kwiat jest wart tylko 1 gwiazdkę.
//    (bez tego dało się wsadzić same lwie paszcze i drukować gwiazdki)
// 3. Za każdy różny gatunek kwiatu +1 gwiazdka — premia za różnorodność.
// 4. Liście: 1 gwiazdka za każdy RÓŻNY rodzaj, powtórki gratis.
// 5. Dodatki: liczy się każdy różny rodzaj, powtórki gratis.
// 6. Wazon/opakowanie dokłada swój bonus.
// 7. Bukiet musi mieć min. 3 kwiaty, żeby dało się go sprzedać.
export function wycen(bukiet, vaseId) {
  const kwiaty = bukiet.filter((b) => b.kind === 'flower')
  const liscie = bukiet.filter((b) => b.kind === 'leaf')
  const dodatki = bukiet.filter((b) => b.kind === 'extra')

  const widziane = new Set()
  let zaKwiaty = 0
  let powtorki = 0
  for (const b of kwiaty) {
    if (widziane.has(b.id)) {
      zaKwiaty += 1
      powtorki += 1
    } else {
      widziane.add(b.id)
      zaKwiaty += BY_ID.flower[b.id]?.wartosc ?? 1
    }
  }

  const gatunki = widziane.size
  const zaRoznorodnosc = gatunki
  const zaLiscie = new Set(liscie.map((b) => b.id)).size
  const zaDodatki = [...new Set(dodatki.map((b) => b.id))].reduce(
    (suma, id) => suma + (BY_ID.extra[id]?.wartosc ?? 1),
    0
  )
  const zaWazon = BY_ID.vase[vaseId]?.bonus ?? 0

  return {
    zaKwiaty,
    powtorki,
    zaLiscie,
    zaDodatki,
    gatunki,
    zaRoznorodnosc,
    zaWazon,
    razem: zaKwiaty + zaLiscie + zaDodatki + zaRoznorodnosc + zaWazon,
    mozna: kwiaty.length >= 3,
    liczbaKwiatow: kwiaty.length,
  }
}
