import React, { useRef, useState } from 'react'
import { useGame } from './state/useGame'
import { Workbench } from './components/Workbench'
import { Panels } from './components/Panels'
import { Collection } from './components/Collection'
import { Shop } from './components/Shop'
import { IconSheet } from './components/IconSheet'
import { dzwiek } from './sound'

function Modal({ tytul, onZamknij, children }) {
  return (
    <div className="modal-tlo" onClick={onZamknij}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>{tytul}</h3>
          <button type="button" className="zamknij" onClick={onZamknij} aria-label="Zamknij">✕</button>
        </header>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const gra = useGame()
  const sceneRef = useRef(null)
  const [widok, setWidok] = useState('stol')
  const [zaznaczony, setZaznaczony] = useState(null)
  const [modal, setModal] = useState(null)
  const [nazwaBukietu, setNazwaBukietu] = useState('')
  const [dzwiekOn, setDzwiekOn] = useState(true)
  const [toast, setToast] = useState(null)

  const { stan, wycena } = gra

  const pokazToast = (t) => {
    setToast(t)
    setTimeout(() => setToast(null), 2400)
  }

  const zapisz = () => {
    if (gra.zapiszDoKolekcji(nazwaBukietu.trim())) {
      dzwiek.zapis()
      pokazToast('Bukiet w kolekcji! 🖼️')
    } else {
      dzwiek.blad()
      pokazToast('Najpierw dodaj chociaż jeden kwiatek')
    }
    setNazwaBukietu('')
    setModal(null)
  }

  const sprzedaj = () => {
    const zysk = gra.sprzedaj()
    if (zysk) {
      dzwiek.sprzedaz()
      pokazToast(`Sprzedane za ${zysk}★`)
    } else {
      dzwiek.blad()
      pokazToast('Bukiet musi mieć co najmniej 3 kwiaty')
    }
    setModal(null)
  }

  return (
    <div className={'app' + (widok === 'stol' ? ' app-stol' : '')}>
      <header className="gorne-menu">
        <button
          type="button"
          className="logo"
          onClick={() => { setWidok('stol') }}
        >
          <span className="logo-kwiat">🌷</span>
          <span className="logo-tekst">Ogród<br />Gwiazdek</span>
        </button>

        <nav className="nawigacja">
          <button type="button" className={widok === 'stol' ? 'aktywny' : ''} onClick={() => { setWidok('stol') }}>
            Stół
          </button>
          <button type="button" className={widok === 'kolekcja' ? 'aktywny' : ''} onClick={() => { setWidok('kolekcja') }}>
            Kolekcja <b>{stan.kolekcja.length}</b>
          </button>
          <button type="button" className={widok === 'sklep' ? 'aktywny' : ''} onClick={() => { setWidok('sklep') }}>
            Sklepik
          </button>
        </nav>

        <div className="prawy-rog">
          <div className="gwiazdki" title="Twoje gwiazdki">
            <span className="gwiazda">★</span>
            <span className="ile">{stan.gwiazdki}</span>
          </div>
          <button type="button" className="ikonka" onClick={() => setModal('ustawienia')} title="Ustawienia">⚙️</button>
        </div>
      </header>

      {widok === 'stol' && (
        <main className="stol-widok">
          <Workbench gra={gra} sceneRef={sceneRef} zaznaczony={zaznaczony} setZaznaczony={setZaznaczony} />

          <div className="akcje">
            <span className="miejsca">
              <b className={gra.kwiatow >= gra.limitKwiatow ? 'pelno' : ''}>
                🌸 {gra.kwiatow}/{gra.limitKwiatow}
              </b>
              <b className={gra.lisci >= gra.limitLisci ? 'pelno' : ''}>
                🌿 {gra.lisci}/{gra.limitLisci}
              </b>
            </span>
            <div className="akcje-przyciski">
              <button type="button" className="btn zapisz" onClick={() => setModal('zapisz')} title="Zapisz bukiet">
                💾<span className="etykieta"> Zapisz</span>
              </button>
              <button
                type="button"
                className={'btn zloty' + (wycena.mozna ? '' : ' nieaktywny')}
                onClick={() => setModal('sprzedaj')}
              >
                ★ Sprzedaj <b>{wycena.razem}</b>
              </button>
            </div>
          </div>

          <Panels gra={gra} sceneRef={sceneRef} naSklep={() => setWidok('sklep')} onKomunikat={pokazToast} />
        </main>
      )}

      {widok === 'kolekcja' && <Collection gra={gra} naStol={() => setWidok('stol')} />}
      {widok === 'sklep' && <Shop gra={gra} />}
      {widok === 'ikony' && <IconSheet naStol={() => setWidok('stol')} />}

      {modal === 'zapisz' && (
        <Modal tytul="Zapisz bukiet w kolekcji" onZamknij={() => setModal(null)}>
          <p>Jak nazwiemy ten bukiet?</p>
          <input
            className="pole"
            value={nazwaBukietu}
            placeholder={`Bukiet ${stan.kolekcja.length + 1}`}
            onChange={(e) => setNazwaBukietu(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && zapisz()}
            maxLength={30}
            autoFocus
          />
          <div className="modal-akcje">
            <button type="button" className="btn cichy" onClick={() => setModal(null)}>Anuluj</button>
            <button type="button" className="btn" onClick={zapisz}>Zapisz</button>
          </div>
        </Modal>
      )}

      {modal === 'sprzedaj' && (
        <Modal tytul="Sprzedaj bukiet" onZamknij={() => setModal(null)}>
          <ul className="rachunek">
            <li><span>Kwiaty ({wycena.liczbaKwiatow})</span><b>{wycena.zaKwiaty}★</b></li>
            {wycena.powtorki > 0 && (
              <li className="uwaga">
                <span>w tym powtórki ({wycena.powtorki}) — po 1★</span>
                <b>{wycena.powtorki}★</b>
              </li>
            )}
            <li><span>Liście (różne rodzaje)</span><b>{wycena.zaLiscie}★</b></li>
            <li><span>Dodatki</span><b>{wycena.zaDodatki}★</b></li>
            <li><span>Premia za różne gatunki ({wycena.gatunki})</span><b>{wycena.zaRoznorodnosc}★</b></li>
            <li><span>Wazon / opakowanie</span><b>{wycena.zaWazon}★</b></li>
            <li className="suma"><span>Razem</span><b>{wycena.razem}★</b></li>
          </ul>
          {!wycena.mozna && <p className="ostrzezenie">Do sprzedaży potrzeba minimum 3 kwiatów — masz {wycena.liczbaKwiatow}.</p>}
          {wycena.powtorki > 2 && (
            <p className="wskazowka">
              Najwięcej gwiazdek daje bukiet z <strong>różnych</strong> kwiatów — te same liczą się tylko po 1★.
            </p>
          )}
          <div className="modal-akcje">
            <button type="button" className="btn cichy" onClick={() => setModal(null)}>Jeszcze poprawię</button>
            <button type="button" className={'btn zloty' + (wycena.mozna ? '' : ' nieaktywny')} onClick={sprzedaj}>
              Sprzedaj za {wycena.razem}★
            </button>
          </div>
        </Modal>
      )}

      {modal === 'ustawienia' && (
        <Modal tytul="Ustawienia" onZamknij={() => setModal(null)}>
          <label className="przelacznik">
            <input
              type="checkbox"
              checked={dzwiekOn}
              onChange={(e) => { setDzwiekOn(e.target.checked); dzwiek.ustawWlaczony(e.target.checked) }}
            />
            <span>Dźwięki</span>
          </label>
          <p className="statystyki">
            Sprzedanych bukietów: <b>{stan.sprzedanych}</b><br />
            W kolekcji: <b>{stan.kolekcja.length}</b><br />
            Gwiazdek: <b>{stan.gwiazdki}</b>
          </p>
          <div className="modal-akcje kolumna">
            <button
              type="button"
              className="btn cichy"
              onClick={() => {
                if (gra.stol.items.length && confirm('Wyczyścić cały stół?')) {
                  gra.wyczyscStol()
                  dzwiek.kosz()
                  setModal(null)
                }
              }}
            >
              Wyczyść stół
            </button>
            <button type="button" className="btn cichy" onClick={() => { setWidok('ikony'); setModal(null) }}>
              Zobacz kartotekę ikon
            </button>
            <button type="button" className="btn cichy" onClick={() => { gra.dosypGwiazdki(50); dzwiek.zakup(); pokazToast('+50★') }}>
              +50★ (tryb dla rodzica)
            </button>
            <button
              type="button"
              className="btn niebezpieczny"
              onClick={() => {
                if (confirm('Skasować WSZYSTKO: gwiazdki, kolekcję i odblokowane kwiaty?')) {
                  gra.reset()
                  setModal(null)
                  pokazToast('Gra zaczyna się od nowa')
                }
              }}
            >
              Zacznij grę od nowa
            </button>
          </div>
        </Modal>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
