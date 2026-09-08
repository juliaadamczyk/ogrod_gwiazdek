import React from 'react'
import { VASES, VaseArt } from '../art/vases'
import { sciezkiLodyg } from '../art/stems'
import { TableArt } from '../art/Table'
import { ItemArt } from './ItemArt'
import { ROZMIAR_ELEMENTU as ROZMIAR } from '../data/catalog'


// Statyczny podglad bukietu - uzywany w kolekcji. Ten sam uklad co stol roboczy.
export function BouquetPreview({ vaseId, vaseColor, items }) {
  const wazon = VASES[vaseId] || VASES.wazon_kula
  const usta = wazon.mouth
  const lodygi = sciezkiLodyg(items, usta, wazon.dno)
  const pudlo = {
    left: `${wazon.box.x}%`,
    top: `${wazon.box.y}%`,
    width: `${wazon.box.size}%`,
    height: `${wazon.box.size}%`,
  }

  const rysuj = (item) => (
    <div
      key={item.uid}
      className="item statyczny"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${ROZMIAR[item.kind] || 21}%`,
        zIndex: item.z,
        transformOrigin: item.kind === 'leaf' ? '50% 84%' : '50% 50%',
        transform: `translate(-50%, -50%) rotate(${item.rot}deg) scale(${item.skala})`,
      }}
    >
      <ItemArt kind={item.kind} id={item.id} color={item.color} />
    </div>
  )

  return (
    <div className="podglad">
      <TableArt />
      <div className="wazon wazon-tyl" style={pudlo}>
        <VaseArt id={vaseId} color={vaseColor} size="100%" />
      </div>

      <svg className="lodygi" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
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

      <div className="wazon wazon-przod" style={pudlo}>
        <VaseArt id={vaseId} color={vaseColor} size="100%" tylko="przod" />
      </div>

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

      {items.map(rysuj)}
    </div>
  )
}
