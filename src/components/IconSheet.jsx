import React, { useState } from 'react'
import { CATALOG_LIST, KATEGORIE } from '../data/catalog'
import { ItemArt } from './ItemArt'
import { Palette } from './Palette'

// Kartoteka ikon - wszystkie narysowane ksztalty w jednym miejscu.
// Sluzy do przegladania z siostrzenica: co poprawic, co dorysowac.
export function IconSheet({ naStol }) {
  const [kolor, setKolor] = useState(null)

  return (
    <div className="widok">
      <h2 className="naglowek-widoku">Kartoteka ikon</h2>
      <p className="podtytul">
        Wszystkie kwiaty, liście, wazony i dodatki narysowane w grze. Kliknij kolor,
        żeby zobaczyć, jak wygląda cały zestaw w jednym odcieniu.
      </p>

      <div className="kartoteka-paleta">
        <Palette kind="flower" tytul="Przemaluj wszystko" wybrany={kolor} onWybierz={setKolor} />
        <button type="button" className="btn maly cichy" onClick={() => setKolor(null)}>
          Kolory własne
        </button>
      </div>

      {KATEGORIE.map((k) => (
        <section key={k.key} className="kartoteka-sekcja">
          <h3>{k.emoji} {k.label} <span className="licznik-mini">{CATALOG_LIST[k.key].length}</span></h3>
          <div className="siatka sklep-siatka">
            {CATALOG_LIST[k.key].map((poz) => (
              <div key={poz.id} className="kafel sklep-kafel">
                <span className="kafel-art">
                  <ItemArt kind={k.key} id={poz.id} color={kolor || poz.kolor} />
                </span>
                <span className="kafel-nazwa">{poz.nazwa}</span>
                <span className="cena id-pliku">{poz.id}</span>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="modal-akcje" style={{ marginTop: 18, justifyContent: 'center' }}>
        <button type="button" className="btn" onClick={naStol}>Wracam do stołu</button>
      </div>
    </div>
  )
}
