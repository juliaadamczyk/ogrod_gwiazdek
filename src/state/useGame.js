import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CATALOG_LIST,
  BY_ID,
  wycen,
  NASADA_LISCIA,
  LIMIT_KWIATOW,
  LIMIT_LISCI,
  LIMIT_DODATKOW,
} from '../data/catalog'
import { anchorsFor, VASES } from '../art/vases'

const KEY = 'ogrod-gwiazdek-v1'

// Domyslne warstwy: liscie z tylu, potem kwiaty, dodatki na wierzchu.
// Kazdy element trzyma wlasne "z", wiec dziecko moze je dowolnie poprzekladac.
const BAZA_Z = { leaf: 1000, flower: 2000, extra: 3000 }
const MIN_Z = 100
const zDomyslne = (kind, i) => (BAZA_Z[kind] || 2000) + i

function startoweOdblokowane() {
  const out = {}
  for (const [kind, list] of Object.entries(CATALOG_LIST)) {
    out[kind] = list.filter((x) => x.start).map((x) => x.id)
  }
  return out
}

function stanPoczatkowy() {
  return {
    gwiazdki: 0,
    odblokowane: startoweOdblokowane(),
    kolekcja: [],
    stol: { vaseId: 'wazon_kula', vaseColor: VASES.wazon_kula.defaultColor, items: [] },
    sprzedanych: 0,
  }
}

// Zapisy sprzed wprowadzenia warstw nie maja pola z - dokladamy je wg starej kolejnosci
function zItemom(items) {
  return items.map((i, idx) => (typeof i.z === 'number' ? i : { ...i, z: zDomyslne(i.kind, idx) }))
}

function uzupelnijZ(stol) {
  return { ...stol, items: zItemom(stol.items || []) }
}

function wczytaj() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return stanPoczatkowy()
    const zapis = JSON.parse(raw)
    const baza = stanPoczatkowy()
    return {
      ...baza,
      ...zapis,
      // dokladamy elementy startowe, gdyby katalog urosl po ostatnim zapisie
      odblokowane: Object.fromEntries(
        Object.keys(baza.odblokowane).map((k) => [
          k,
          Array.from(new Set([...(baza.odblokowane[k] || []), ...((zapis.odblokowane || {})[k] || [])])),
        ])
      ),
      stol: uzupelnijZ({ ...baza.stol, ...(zapis.stol || {}) }),
      kolekcja: (zapis.kolekcja || []).map((k) => ({ ...k, items: zItemom(k.items || []) })),
    }
  } catch {
    return stanPoczatkowy()
  }
}

let uidLicznik = 0
const nowyUid = () => `i${Date.now().toString(36)}${(uidLicznik++).toString(36)}`

const losowo = (a, b) => a + Math.random() * (b - a)

// nic nie moze wyjechac poza stol
const wGranicach = (v) => (Number.isFinite(v) ? Math.min(97, Math.max(3, v)) : 50)

export function useGame() {
  const [stan, setStan] = useState(wczytaj)
  const zapisTimer = useRef(null)

  // zapis do localStorage (z lekkim opoznieniem, zeby nie pisac przy kazdym pikselu przeciagania)
  useEffect(() => {
    clearTimeout(zapisTimer.current)
    zapisTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(stan))
      } catch {
        /* brak miejsca / tryb prywatny - gra dziala dalej, tylko bez zapisu */
      }
    }, 250)
    return () => clearTimeout(zapisTimer.current)
  }, [stan])

  const { stol } = stan
  const kotwice = useMemo(() => anchorsFor(stol.vaseId), [stol.vaseId])

  const odblokowany = useCallback(
    (kind, id) => (stan.odblokowane[kind] || []).includes(id),
    [stan.odblokowane]
  )

  // --- Praca na stole ---

  // Kazda kategoria ma WLASNA pule miejsc - zielen nie zabiera miejsca kwiatom.
  const limitKwiatow = LIMIT_KWIATOW
  const limitLisci = LIMIT_LISCI
  const kwiatow = stol.items.filter((i) => i.kind === 'flower').length
  const lisci = stol.items.filter((i) => i.kind === 'leaf').length
  const dodatkow = stol.items.filter((i) => i.kind === 'extra').length

  // Zwraca null gdy dodano, albo tekst komunikatu gdy sie nie zmiescilo.
  const dodaj = useCallback(
    (kind, id, color, punktWe) => {
      if (kind === 'extra' && dodatkow >= LIMIT_DODATKOW) {
        return 'Więcej dodatków się nie zmieści'
      }
      if (kind === 'flower' && kwiatow >= limitKwiatow) {
        return `Więcej niż ${LIMIT_KWIATOW} kwiatów się nie zmieści`
      }
      if (kind === 'leaf' && lisci >= limitLisci) {
        return `Więcej niż ${LIMIT_LISCI} liści się nie zmieści`
      }
      // odrzucamy punkt, ktorego nie da sie policzyc - inaczej kwiat wyladowalby w rogu ekranu
      const punkt =
        punktWe && Number.isFinite(punktWe.x) && Number.isFinite(punktWe.y) ? punktWe : null
      setStan((s) => {
        const kat = BY_ID[kind][id]
        if (!kat) return s
        const swobodny = kind === 'extra'
        let baza = punkt
        if (!baza && swobodny) {
          // wstazki i drobiazgi ladują przy szyjce wazonu, nie w srodku bukietu
          const usta = (VASES[s.stol.vaseId] || VASES.wazon_kula).mouth
          baza = { x: usta.x + losowo(-7, 7), y: usta.y + losowo(-1, 7) }
        }
        if (!baza && kind === 'leaf') {
          // Lisc ma wlasna galazke i obraca sie wokol nasady, wiec sadzimy go tak,
          // zeby ta nasada wypadla w wylocie wazonu. Rozrzut robi obrot, nie pozycja.
          const usta = (VASES[s.stol.vaseId] || VASES.wazon_kula).mouth
          baza = { x: usta.x + losowo(-6, 6), y: usta.y - NASADA_LISCIA + losowo(-2, 2) }
        }
        if (!baza) {
          const zajete = s.stol.items.filter((i) => i.kind === 'flower')
          const wolne = kotwice.filter((k) => !zajete.some((i) => Math.hypot(i.x - k.x, i.y - k.y) < 7))
          const pula = wolne.length ? wolne : kotwice
          baza = pula[Math.floor(Math.random() * pula.length)]
        }
        const item = {
          uid: nowyUid(),
          kind,
          id,
          color: color || kat.kolor,
          // losowy offset + losowy obrot => bukiet od razu wyglada naturalnie
          x: wGranicach(baza.x + (punkt || kind !== 'flower' ? 0 : losowo(-3.2, 3.2))),
          y: wGranicach(baza.y + (punkt || kind !== 'flower' ? 0 : losowo(-3.2, 3.2))),
          rot: swobodny ? losowo(-12, 12) : losowo(-22, 22) * (kind === 'leaf' ? 1.15 : 1),
          skala: (kat.skala || 1) * losowo(0.94, 1.06),
          z: zDomyslne(kind, s.stol.items.length),
        }
        return { ...s, stol: { ...s.stol, items: [...s.stol.items, item] } }
      })
      return null
    },
    [kotwice, kwiatow, lisci, dodatkow, limitKwiatow, limitLisci]
  )

  const przesun = useCallback((uid, x, y) => {
    setStan((s) => ({
      ...s,
      stol: {
        ...s.stol,
        items: s.stol.items.map((i) => (i.uid === uid ? { ...i, x: wGranicach(x), y: wGranicach(y) } : i)),
      },
    }))
  }, [])

  // Magnetyzm: po upuszczeniu blisko kotwicy kwiat "wskakuje" na nia (bez presji precyzji)
  const upusc = useCallback(
    (uid, x, y) => {
      setStan((s) => {
        const item = s.stol.items.find((i) => i.uid === uid)
        if (!item) return s
        let nx = x
        let ny = y
        // Magnetyzm dziala TYLKO dla kwiatow. Liscie i dodatki zostaja dokladnie
        // tam, gdzie je puszczono - inaczej "uciekaly" spod palca.
        if (item.kind === 'flower') {
          let best = null
          let bestD = Infinity
          for (const k of kotwice) {
            const d = Math.hypot(k.x - x, k.y - y)
            if (d < bestD) { bestD = d; best = k }
          }
          if (best && bestD < 5) {
            nx = best.x + losowo(-1, 1)
            ny = best.y + losowo(-1, 1)
          }
        }
        return {
          ...s,
          stol: {
            ...s.stol,
            items: s.stol.items.map((i) =>
              i.uid === uid ? { ...i, x: wGranicach(nx), y: wGranicach(ny) } : i
            ),
          },
        }
      })
    },
    [kotwice]
  )

  const zmienKolor = useCallback((uid, color) => {
    setStan((s) => ({
      ...s,
      stol: { ...s.stol, items: s.stol.items.map((i) => (i.uid === uid ? { ...i, color } : i)) },
    }))
  }, [])

  const obroc = useCallback((uid, delta) => {
    setStan((s) => ({
      ...s,
      stol: { ...s.stol, items: s.stol.items.map((i) => (i.uid === uid ? { ...i, rot: i.rot + delta } : i)) },
    }))
  }, [])

  const skaluj = useCallback((uid, mnoznik) => {
    setStan((s) => ({
      ...s,
      stol: {
        ...s.stol,
        items: s.stol.items.map((i) =>
          i.uid === uid ? { ...i, skala: Math.min(1.9, Math.max(0.5, i.skala * mnoznik)) } : i
        ),
      },
    }))
  }, [])

  const usun = useCallback((uid) => {
    setStan((s) => ({ ...s, stol: { ...s.stol, items: s.stol.items.filter((i) => i.uid !== uid) } }))
  }, [])

  // Przelozenie elementu przed wszystkie inne / za wszystkie inne
  const naPrzod = useCallback((uid) => {
    setStan((s) => {
      const max = Math.max(...s.stol.items.map((i) => i.z ?? 0), 0)
      return {
        ...s,
        stol: { ...s.stol, items: s.stol.items.map((i) => (i.uid === uid ? { ...i, z: max + 1 } : i)) },
      }
    })
  }, [])

  const doTylu = useCallback((uid) => {
    setStan((s) => {
      const min = Math.min(...s.stol.items.map((i) => i.z ?? 0), BAZA_Z.flower)
      // nie schodzimy ponizej MIN_Z, zeby nic nie schowalo sie za wazonem
      return {
        ...s,
        stol: {
          ...s.stol,
          items: s.stol.items.map((i) => (i.uid === uid ? { ...i, z: Math.max(MIN_Z, min - 1) } : i)),
        },
      }
    })
  }, [])

  const ustawWazon = useCallback((vaseId) => {
    setStan((s) => ({
      ...s,
      stol: { ...s.stol, vaseId, vaseColor: BY_ID.vase[vaseId]?.kolor || VASES[vaseId]?.defaultColor },
    }))
  }, [])

  const ustawKolorWazonu = useCallback((vaseColor) => {
    setStan((s) => ({ ...s, stol: { ...s.stol, vaseColor } }))
  }, [])

  const wyczyscStol = useCallback(() => {
    setStan((s) => ({ ...s, stol: { ...s.stol, items: [] } }))
  }, [])

  // --- Kolekcja i sprzedaz ---

  const wycena = useMemo(() => wycen(stol.items, stol.vaseId), [stol.items, stol.vaseId])

  // UWAGA: wynik liczymy z biezacego stanu PRZED setStan.
  // Odczyt z wnetrza updatera nie dziala - React uruchamia go pozniej (i w StrictMode dwa razy).
  const zapiszDoKolekcji = useCallback(
    (nazwa) => {
      if (!stol.items.some((i) => i.kind === 'flower')) return false
      const wpis = {
        uid: nowyUid(),
        nazwa: nazwa || `Bukiet ${stan.kolekcja.length + 1}`,
        data: new Date().toISOString(),
        vaseId: stol.vaseId,
        vaseColor: stol.vaseColor,
        items: stol.items.map((i) => ({ ...i })),
        wartosc: wycen(stol.items, stol.vaseId).razem,
      }
      setStan((s) => ({ ...s, kolekcja: [wpis, ...s.kolekcja], stol: { ...s.stol, items: [] } }))
      return true
    },
    [stol, stan.kolekcja.length]
  )

  const sprzedaj = useCallback(() => {
    const w = wycen(stol.items, stol.vaseId)
    if (!w.mozna) return 0
    setStan((s) => ({
      ...s,
      gwiazdki: s.gwiazdki + w.razem,
      sprzedanych: s.sprzedanych + 1,
      stol: { ...s.stol, items: [] },
    }))
    return w.razem
  }, [stol])

  const sprzedajZKolekcji = useCallback(
    (uid) => {
      const wpis = stan.kolekcja.find((k) => k.uid === uid)
      if (!wpis) return 0
      setStan((s) => ({
        ...s,
        gwiazdki: s.gwiazdki + wpis.wartosc,
        sprzedanych: s.sprzedanych + 1,
        kolekcja: s.kolekcja.filter((k) => k.uid !== uid),
      }))
      return wpis.wartosc
    },
    [stan.kolekcja]
  )

  const wczytajZKolekcji = useCallback((uid) => {
    setStan((s) => {
      const wpis = s.kolekcja.find((k) => k.uid === uid)
      if (!wpis) return s
      return {
        ...s,
        stol: { vaseId: wpis.vaseId, vaseColor: wpis.vaseColor, items: wpis.items.map((i) => ({ ...i, uid: nowyUid() })) },
      }
    })
  }, [])

  const usunZKolekcji = useCallback((uid) => {
    setStan((s) => ({ ...s, kolekcja: s.kolekcja.filter((k) => k.uid !== uid) }))
  }, [])

  // --- Sklepik ---

  const kup = useCallback(
    (kind, id) => {
      const kat = BY_ID[kind][id]
      if (!kat || (stan.odblokowane[kind] || []).includes(id)) return false
      if (stan.gwiazdki < kat.cena) return false
      setStan((s) => ({
        ...s,
        gwiazdki: s.gwiazdki - kat.cena,
        odblokowane: { ...s.odblokowane, [kind]: [...s.odblokowane[kind], id] },
      }))
      return true
    },
    [stan.odblokowane, stan.gwiazdki]
  )

  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    setStan(stanPoczatkowy())
  }, [])

  // tryb testowy dla dorosłych: dosypanie gwiazdek (widoczne w Ustawieniach)
  const dosypGwiazdki = useCallback((n) => {
    setStan((s) => ({ ...s, gwiazdki: s.gwiazdki + n }))
  }, [])

  return {
    stan,
    stol,
    kotwice,
    wycena,
    limitKwiatow,
    limitLisci,
    kwiatow,
    lisci,
    odblokowany,
    dodaj,
    przesun,
    upusc,
    zmienKolor,
    obroc,
    skaluj,
    usun,
    naPrzod,
    doTylu,
    ustawWazon,
    ustawKolorWazonu,
    wyczyscStol,
    zapiszDoKolekcji,
    sprzedaj,
    sprzedajZKolekcji,
    wczytajZKolekcji,
    usunZKolekcji,
    kup,
    reset,
    dosypGwiazdki,
  }
}
