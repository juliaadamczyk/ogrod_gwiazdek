import React from 'react'
import { FlowerArt } from '../art/flowers'
import { LeafArt } from '../art/leaves'
import { ExtraArt } from '../art/extras'
import { VaseThumb } from '../art/vases'

// Jedno miejsce, ktore wie ktory zestaw ksztaltow narysowac
export function ItemArt({ kind, id, color, size = '100%' }) {
  if (kind === 'leaf') return <LeafArt id={id} color={color} size={size} />
  if (kind === 'extra') return <ExtraArt id={id} color={color} size={size} />
  if (kind === 'vase') return <VaseThumb id={id} color={color} size={size} />
  return <FlowerArt id={id} color={color} size={size} />
}
