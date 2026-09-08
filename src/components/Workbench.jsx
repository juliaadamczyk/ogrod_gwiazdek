import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TableArt, TrashArt } from '../art/Table'
import { VASES, VaseArt } from '../art/vases'
import { sciezkiLodyg } from '../art/stems'
import { ItemArt } from './ItemArt'
import { ROZMIAR_ELEMENTU as ROZMIAR } from '../data/catalog'
import { Palette } from './Palette'
import { dzwiek } from '../sound'


export function Workbench({ gra, sceneRef, zaznaczony, setZaznaczony }) {
  const { stol, kotwice, przesun, upusc, usun, zmienKolor, obroc, skaluj, naPrzod, doTylu } = gra
  const koszRef = useRef(null)
  const [koszAktywny, setKoszAktywny] = useState(false)
  const [przeciagany, setPrzeciagany] = useState(null)
  const drag = useRef(null)

  const doProcentow = useCallback(
    (clientX, clientY) => {
      const r = sceneRef.current.getBoundingClientRect()
      if (!r.width || !r.height) return null
      return {
        x: ((clientX - r.left) / r.width) * 100,
        y: ((clientY - r.top) / r.height) * 100,
      }
    },
    [sceneRef]
  )

  const nadKoszem = (clientX, clientY) => {
    const el = koszRef.current
    if (!el) return false
    const r = el.getBoundingClientRect()
    return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom
  }

  const onPointerDown = (e, item) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = doProcentow(e.clientX, e.clientY)
    if (!p) return
    drag.current = {
      uid: item.uid,
      dx: item.x - p.x,
      dy: item.y - p.y,
      startX: e.clientX,
      startY: e.clientY,
      ruszony: false,
    }
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY)
    if (!d.ruszony && dist < 6) return
    d.ruszony = true
    setPrzeciagany(d.uid)
    const p = doProcentow(e.clientX, e.clientY)
    if (!p) return
    przesun(d.uid, p.x + d.dx, p.y + d.dy)
    setKoszAktywny(nadKoszem(e.clientX, e.clientY))
  }

  const onPointerUp = (e, item) => {
    const d = drag.current
    drag.current = null
    setKoszAktywny(false)
    setPrzeciagany(null)
    if (!d) return
    if (!d.ruszony) {
      // krotkie tapniecie = zaznaczenie i paletka kolorow
      setZaznaczony((z) => (z === item.uid ? null : item.uid))
      return
    }
    if (nadKoszem(e.clientX, e.clientY)) {
      usun(d.uid)
      setZaznaczony(null)
      dzwiek.kosz()
      return
    }
    const p = doProcentow(e.clientX, e.clientY)
    if (!p) return
    upusc(d.uid, p.x + d.dx, p.y + d.dy)
  }

  // Escape / klik w tlo zamyka paletke
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setZaznaczony(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setZaznaczony])

  const wazon = VASES[stol.vaseId] || VASES.wazon_kula
  const usta = wazon.mouth
  const lodygi = sciezkiLodyg(stol.items, usta, wazon.dno)
  const pudloWazonu = {
    left: `${wazon.box.x}%`,
    top: `${wazon.box.y}%`,
    width: `${wazon.box.size}%`,
    height: `${wazon.box.size}%`,
  }
  const zazn = stol.items.find((i) => i.uid === zaznaczony)

  const renderItem = (item) => {
    const bazowy = ROZMIAR[item.kind] || 21
    return (
      <div
        key={item.uid}
        className={
          'item' +
          (zaznaczony === item.uid ? ' zaznaczony' : '') +
          (przeciagany === item.uid ? ' przeciagany' : '')
        }
        style={{
          left: `${item.x}%`,
          top: `${item.y}%`,
          width: `${bazowy}%`,
          zIndex: item.z,
          // liscie obracaja sie wokol nasady (dolu), a nie srodka - dzieki temu
          // przy obracaniu nie wyjezdzaja z wazonu i latwiej je dopasowac
          transformOrigin: item.kind === 'leaf' ? '50% 84%' : '50% 50%',
          transform: `translate(-50%, -50%) rotate(${item.rot}deg) scale(${item.skala})`,
        }}
        onPointerDown={(e) => onPointerDown(e, item)}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => onPointerUp(e, item)}
        onPointerCancel={() => { drag.current = null; setKoszAktywny(false); setPrzeciagany(null) }}
      >
        <ItemArt kind={item.kind} id={item.id} color={item.color} />
      </div>
    )
  }

  return (
    <div className="plansza" onPointerDown={() => setZaznaczony(null)}>
      <div className="scena" ref={sceneRef}>
        <TableArt />

        {/* Wazon TYL: caly ksztalt, rysowany pod lodygami */}
        <div className="wazon wazon-tyl" style={pudloWazonu}>
          <VaseArt id={stol.vaseId} color={stol.vaseColor} size="100%" />
        </div>

        {/* Lodygi: jedna uniwersalna krzywa od wnetrza wazonu do glowki kwiatu */}
        <svg className="lodygi" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {/* cien styku wazonu z blatem - bez niego wazon sprawia wrazenie, ze lewituje */}
          <ellipse
            cx={wazon.box.x + wazon.box.size / 2}
            cy={wazon.box.y + wazon.box.size * 0.925}
            rx={wazon.box.size * 0.26}
            ry={2.6}
            fill="#4b2f74"
            opacity="0.28"
          />
          {lodygi.map((l) => (
            <path key={l.uid} d={l.d} stroke={l.kolor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
          ))}
        </svg>

        {/* Wazon PRZOD: tylko czesc ponizej linii otworu, rysowana nad lodygami.
            Efekt: lodygi widac, jak wchodza w otwor, a dalej chowaja sie w wazonie. */}
        <div className="wazon wazon-przod" style={pudloWazonu}>
          <VaseArt id={stol.vaseId} color={stol.vaseColor} size="100%" tylko="przod" />
        </div>

        {/* Kazda lodyga jeszcze raz, w warstwie SWOJEGO kwiatu i przycieta od gory
            do wylotu wazonu (albo do samego kwiatu, jesli ten wisi nizej).
            Dzieki temu „do tylu / na wierzch" przesuwa kwiat RAZEM z lodyga,
            a mimo to nic nie rysuje sie po korpusie wazonu. */}
        {lodygi.map((l) => (
            <svg
              key={`nad-${l.uid}`}
              className="lodyga-nad"
              style={{ zIndex: l.z - 1 }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={l.dNad} stroke={l.kolor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
        ))}

        {/* Podpowiedz gdy pusto */}
        {stol.items.length === 0 && (
          <div className="podpowiedz">
            <span>Wybierz kwiatek z panelu&nbsp;👇</span>
            <small>albo przeciągnij go na stół</small>
          </div>
        )}

        {/* Kolejnosc warstw bierze sie z pola z kazdego elementu (przyciski „do tylu / na wierzch") */}
        {stol.items.map(renderItem)}

        {/* Paletka + narzedzia zaznaczonego elementu */}
        {zazn && (
          <div
            className="narzedzia"
            style={{
              left: `${Math.min(78, Math.max(22, zazn.x))}%`,
              top: `${Math.min(88, Math.max(6, zazn.y + 14))}%`,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Palette
              kind={zazn.kind}
              wybrany={zazn.color}
              tytul="Zmień kolor"
              onWybierz={(k) => zmienKolor(zazn.uid, k)}
            />
            <div className="narzedzia-rzad">
              <button type="button" onClick={() => obroc(zazn.uid, -5)} title="Obróć w lewo">↺</button>
              <button type="button" onClick={() => skaluj(zazn.uid, 0.88)} title="Mniejszy">－</button>
              <button type="button" onClick={() => skaluj(zazn.uid, 1.14)} title="Większy">＋</button>
              <button type="button" onClick={() => obroc(zazn.uid, 5)} title="Obróć w prawo">↻</button>
            </div>
            <div className="narzedzia-rzad">
              <button type="button" className="szeroki" onClick={() => doTylu(zazn.uid)}>
                ↙ Do tyłu
              </button>
              <button type="button" className="szeroki" onClick={() => naPrzod(zazn.uid)}>
                Na wierzch ↗
              </button>
              <button
                type="button"
                className="usun"
                onClick={() => { usun(zazn.uid); setZaznaczony(null); dzwiek.kosz() }}
                title="Wyrzuć"
              >
                🗑
              </button>
            </div>
          </div>
        )}
      </div>

      <div ref={koszRef} className={'kosz' + (koszAktywny ? ' aktywny' : '')} title="Przeciągnij tutaj, żeby wyrzucić">
        <TrashArt open={koszAktywny} />
        <span>Kosz</span>
      </div>
    </div>
  )
}
