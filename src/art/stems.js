// Jedna, uniwersalna lodyga: krzywa od wnetrza pojemnika do NASADY glowki kwiatu.
// Pierwszy punkt kontrolny lezy wysoko NAD wylotem, wiec lodyga wychodzi z wazonu
// pionowo (trzyma sie osi szyjki) i skreca do kwiatka dopiero ponad kantem.
//
// UWAGA: tylko dla kwiatow. Liscie maja wlasna galazke narysowana w ikonie,
// wiec doklejanie im drugiej lodygi wygladaloby zle.
import { BY_ID, ROZMIAR_ELEMENTU, SRODEK_IKONY, NASADA_DOMYSLNA } from '../data/catalog'

const KOLORY = ['#5f8050', '#6f9160', '#7fa06d']

// Gdzie dokladnie lodyga ma dotknac kwiatu. Punkt `nasada` jest podany
// w jednostkach rysunku, wiec przeliczamy go na scene i obracamy razem z kwiatem -
// dzieki temu np. tulipan zawsze ma lodyge u dolu kielicha, a nie z boku.
function punktNasady(item) {
  const n = BY_ID.flower[item.id]?.nasada || NASADA_DOMYSLNA
  const jednostka = (ROZMIAR_ELEMENTU.flower / 100) * item.skala
  const dx = (n.x - SRODEK_IKONY.x) * jednostka
  const dy = (n.y - SRODEK_IKONY.y) * jednostka
  const kat = (item.rot * Math.PI) / 180
  return {
    x: item.x + dx * Math.cos(kat) - dy * Math.sin(kat),
    y: item.y + dx * Math.sin(kat) + dy * Math.cos(kat),
  }
}

const miedzy = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

const wysokoscW = (p, t) => {
  const u = 1 - t
  return u * u * u * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t * t * t * p[3].y
}

// Najmniejsze t, przy ktorym krzywa przecina wysokosc wylotu wazonu.
function tNaWysokosci(p, y) {
  let poprzednia = wysokoscW(p, 0)
  for (let i = 1; i <= 200; i += 1) {
    const t = i / 200
    const aktualna = wysokoscW(p, t)
    if ((poprzednia - y) * (aktualna - y) <= 0) return t
    poprzednia = aktualna
  }
  return 1
}

// Podzial krzywej (de Casteljau) - zwraca jej DRUGA polowe, od t do konca.
// Dzieki temu kopia rysowana w warstwie kwiatu lezy dokladnie na oryginale,
// zamiast byc osobna krzywa obok niego (stad braly sie podwojne lodygi).
function drugaPolowa(p, t) {
  const a = miedzy(p[0], p[1], t)
  const b = miedzy(p[1], p[2], t)
  const c = miedzy(p[2], p[3], t)
  const d = miedzy(a, b, t)
  const e = miedzy(b, c, t)
  return [miedzy(d, e, t), e, c, p[3]]
}

const zapisz = (p) => `M${p[0].x} ${p[0].y} C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`

export function sciezkiLodyg(items, usta, dno) {
  return items
    .filter((i) => i.kind === 'flower')
    .map((i, idx) => {
      const koniec = punktNasady(i)
      const startX = usta.x + ((idx % 3) - 1) * 1.6
      const punkty = [
        { x: startX, y: dno },
        { x: startX, y: usta.y - 16 },
        { x: koniec.x * 0.72 + startX * 0.28, y: koniec.y + (usta.y - koniec.y) * 0.3 },
        koniec,
      ]
      return {
        uid: i.uid,
        // pelna lodyga, rysowana POD wazonem
        d: zapisz(punkty),
        // ten sam odcinek od wylotu w gore - kopia w warstwie kwiatu
        dNad: zapisz(drugaPolowa(punkty, tNaWysokosci(punkty, usta.y))),
        z: i.z,
        kolor: KOLORY[idx % KOLORY.length],
      }
    })
}
