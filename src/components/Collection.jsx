import React from 'react'
import { BouquetPreview } from './BouquetPreview'
import { dzwiek } from '../sound'

export function Collection({ gra, naStol }) {
  const { stan, sprzedajZKolekcji, wczytajZKolekcji, usunZKolekcji } = gra
  const { kolekcja } = stan

  if (!kolekcja.length) {
    return (
      <div className="widok pusto">
        <div className="pusto-ikona">🖼️</div>
        <h2>Kolekcja jest jeszcze pusta</h2>
        <p>Ułóż bukiet na stole i kliknij <strong>Zapisz</strong>, żeby trafił tutaj.</p>
        <button type="button" className="btn duzy" onClick={naStol}>Wracam do stołu</button>
      </div>
    )
  }

  return (
    <div className="widok">
      <h2 className="naglowek-widoku">Moja kolekcja <span className="licznik-mini">{kolekcja.length}</span></h2>
      <div className="galeria">
        {kolekcja.map((b) => (
          <article key={b.uid} className="karta-bukietu">
            <BouquetPreview vaseId={b.vaseId} vaseColor={b.vaseColor} items={b.items} />
            <h3>{b.nazwa}</h3>
            <p className="meta">
              {new Date(b.data).toLocaleDateString('pl-PL')} · wart {b.wartosc}★
            </p>
            <div className="karta-akcje">
              <button type="button" className="btn maly" onClick={() => { wczytajZKolekcji(b.uid); naStol() }}>
                Otwórz
              </button>
              <button
                type="button"
                className="btn maly zloty"
                onClick={() => { const z = sprzedajZKolekcji(b.uid); if (z) dzwiek.sprzedaz() }}
              >
                Sprzedaj {b.wartosc}★
              </button>
              <button
                type="button"
                className="btn maly cichy"
                onClick={() => { if (confirm(`Na pewno usunąć „${b.nazwa}”?`)) { usunZKolekcji(b.uid); dzwiek.kosz() } }}
              >
                🗑
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
