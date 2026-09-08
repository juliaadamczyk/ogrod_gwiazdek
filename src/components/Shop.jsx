import React, { useState } from 'react'
import { CATALOG_LIST, KATEGORIE } from '../data/catalog'
import { ItemArt } from './ItemArt'
import { dzwiek } from '../sound'

export function Shop({ gra }) {
  const { stan, odblokowany, kup } = gra
  const [kat, setKat] = useState('flower')
  const [komunikat, setKomunikat] = useState(null)

  const lista = CATALOG_LIST[kat]

  const sprobuj = (poz) => {
    if (odblokowany(kat, poz.id)) return
    if (kup(kat, poz.id)) {
      dzwiek.zakup()
      setKomunikat(`Odblokowane: ${poz.nazwa} 🎉`)
    } else {
      dzwiek.blad()
      setKomunikat(`Brakuje ${poz.cena - stan.gwiazdki}★ — jeszcze jeden bukiet do sprzedania!`)
    }
    setTimeout(() => setKomunikat(null), 2200)
  }

  return (
    <div className="widok">
      <h2 className="naglowek-widoku">
        Sklepik <span className="licznik-mini">{stan.gwiazdki}★</span>
      </h2>
      <p className="podtytul">Sprzedawaj bukiety, zbieraj gwiazdki i odblokowuj nowe rzeczy.</p>

      <div className="zakladki sklep-zakladki">
        {KATEGORIE.map((k) => (
          <button
            key={k.key}
            type="button"
            className={'zakladka' + (kat === k.key ? ' aktywna' : '')}
            onClick={() => setKat(k.key)}
          >
            <span className="emo">{k.emoji}</span>
            <span>{k.label}</span>
          </button>
        ))}
      </div>

      {komunikat && <div className="komunikat">{komunikat}</div>}

      <div className="siatka sklep-siatka">
        {lista.map((poz) => {
          const mam = odblokowany(kat, poz.id)
          const stac = stan.gwiazdki >= poz.cena
          return (
            <button
              key={poz.id}
              type="button"
              className={'kafel sklep-kafel' + (mam ? ' kupiony' : stac ? ' dostepny' : ' zadrogi')}
              onClick={() => sprobuj(poz)}
              disabled={mam}
            >
              <span className="kafel-art">
                <ItemArt kind={kat} id={poz.id} color={poz.kolor} />
              </span>
              <span className="kafel-nazwa">{poz.nazwa}</span>
              <span className="cena">{mam ? '✓ mam' : `${poz.cena}★`}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
