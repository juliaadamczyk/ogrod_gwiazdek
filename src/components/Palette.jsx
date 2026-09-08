import React from 'react'
import { COLOR_SETS } from '../data/colors'

export function Palette({ kind, wybrany, onWybierz, tytul = 'Kolor' }) {
  const kolory = COLOR_SETS[kind] || COLOR_SETS.flower
  return (
    <div className="paleta">
      <div className="paleta-tytul">{tytul}</div>
      <div className="paleta-siatka">
        {kolory.map((k) => (
          <button
            key={k}
            type="button"
            className={'swatch' + (k === wybrany ? ' wybrany' : '')}
            style={{ background: k }}
            aria-label={`Kolor ${k}`}
            onClick={() => onWybierz(k)}
          />
        ))}
      </div>
    </div>
  )
}
