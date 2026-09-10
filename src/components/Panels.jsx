import React, { useRef, useState } from 'react'
import { CATALOG_LIST, KATEGORIE } from '../data/catalog'
import { ItemArt } from './ItemArt'
import { Palette } from './Palette'

export function Panels({ gra, sceneRef, naSklep, onKomunikat }) {
  const [kat, setKat] = useState('flower')
  const [otwarty, setOtwarty] = useState(true)
  const { odblokowany, dodaj, stol, ustawWazon, ustawKolorWazonu } = gra
  const [duch, setDuch] = useState(null)
  const drag = useRef(null)

  const lista = CATALOG_LIST[kat]

  const nadScena = (x, y) => {
    const el = sceneRef.current
    if (!el) return null
    const r = el.getBoundingClientRect()
    // scena jeszcze bez wymiarow (np. tuz po starcie) - lepiej oddac null niz policzyc NaN
    if (!r.width || !r.height) return null
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return null
    const p = { x: ((x - r.left) / r.width) * 100, y: ((y - r.top) / r.height) * 100 }
    return Number.isFinite(p.x) && Number.isFinite(p.y) ? p : null
  }

  const startDrag = (e, poz) => {
    if (kat === 'vase') return
    // Na dotyku NIE przechwytujemy wskaznika i nie przeciagamy z polki: gest
    // w gore (polka jest POD stolem) walczylby z przewijaniem listy kwiatow.
    // Zostaje tapniecie - kwiat sam wskakuje na wolne miejsce w wazonie.
    const dotyk = e.pointerType === 'touch'
    if (!dotyk) e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { poz, startX: e.clientX, startY: e.clientY, ruszony: false, dotyk }
  }

  const moveDrag = (e) => {
    const d = drag.current
    if (!d || d.dotyk) return
    if (!d.ruszony && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 8) return
    d.ruszony = true
    setDuch({ poz: d.poz, x: e.clientX, y: e.clientY })
  }

  const endDrag = (e, poz) => {
    const d = drag.current
    drag.current = null
    setDuch(null)
    if (!d) return
    // Palec pojechal w bok/w dol = to bylo przewijanie polki, nie tapniecie.
    // Zwykle zalatwia to pointercancel, ale nie kazda przegladarka go wysyla.
    if (d.dotyk && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 10) return
    if (!d.ruszony) {
      // tapniecie = kwiat sam wskakuje na wolny punkt kotwiczacy
      const blad = dodaj(kat, poz.id, poz.kolor, null)
      if (blad) onKomunikat(blad)
      return
    }
    const punkt = nadScena(e.clientX, e.clientY)
    if (punkt) {
      const blad = dodaj(kat, poz.id, poz.kolor, punkt)
      if (blad) onKomunikat(blad)
    }
  }

  return (
    <section className={'panele' + (otwarty ? '' : ' zwiniete')}>
      <div className="zakladki">
        {KATEGORIE.map((k) => (
          <button
            key={k.key}
            type="button"
            className={'zakladka' + (kat === k.key ? ' aktywna' : '')}
            onClick={() => { setKat(k.key); setOtwarty(true) }}
          >
            <span className="emo">{k.emoji}</span>
            <span>{k.label}</span>
          </button>
        ))}
        <button
          type="button"
          className="zwin"
          onClick={() => setOtwarty((o) => !o)}
          title={otwarty ? 'Zwiń panel' : 'Rozwiń panel'}
        >
          {otwarty ? '▾' : '▴'}
        </button>
      </div>

      <div className="panel-tresc">
        {kat === 'vase' && (
          <div className="wazon-kolor">
            <Palette
              kind="vase"
              tytul="Kolor wazonu"
              wybrany={stol.vaseColor}
              onWybierz={(k) => ustawKolorWazonu(k)}
            />
          </div>
        )}

        <div className="siatka">
          {lista.map((poz) => {
            const mam = odblokowany(kat, poz.id)
            const aktywnyWazon = kat === 'vase' && stol.vaseId === poz.id
            return (
              <button
                key={poz.id}
                type="button"
                className={'kafel' + (mam ? '' : ' zamkniety') + (aktywnyWazon ? ' wybrany' : '')}
                onPointerDown={(e) => mam && startDrag(e, poz)}
                onPointerMove={moveDrag}
                onPointerUp={(e) => {
                  if (!mam) { naSklep(); return }
                  if (kat === 'vase') { ustawWazon(poz.id); return }
                  endDrag(e, poz)
                }}
                onPointerCancel={() => { drag.current = null; setDuch(null) }}
              >
                <span className="kafel-art">
                  <ItemArt kind={kat} id={poz.id} color={poz.kolor} />
                </span>
                <span className="kafel-nazwa">{poz.nazwa}</span>
                {!mam && <span className="klodka">🔒 {poz.cena}★</span>}
              </button>
            )
          })}
        </div>
      </div>

      {duch && (
        <div className="duch" style={{ left: duch.x, top: duch.y }}>
          <ItemArt kind={kat} id={duch.poz.id} color={duch.poz.kolor} />
        </div>
      )}
    </section>
  )
}
