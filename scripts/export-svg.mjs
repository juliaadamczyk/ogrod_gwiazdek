// Eksport wszystkich narysowanych ikon do osobnych plikow .svg
// Uruchomienie:  npm run ikony
// Efekt: src/assets/flowers/*.svg, leaves/*.svg, vases/*.svg, extras/*.svg
//        - dokladnie struktura folderow z sekcji 8 specyfikacji.
//
// Pliki .svg sluza do podgladu i do ewentualnej edycji w Inkscape.
// Sama gra rysuje ikony z kodu, wiec zmiana koloru dziala bez podmiany plikow.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Vite w trybie SSR sam ogarnia JSX - nie potrzeba osobnego kroku budowania
const vite = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' })

const flowers = await vite.ssrLoadModule('/src/art/flowers.jsx')
const leaves = await vite.ssrLoadModule('/src/art/leaves.jsx')
const extras = await vite.ssrLoadModule('/src/art/extras.jsx')
const vases = await vite.ssrLoadModule('/src/art/vases.jsx')
const katalog = await vite.ssrLoadModule('/src/data/catalog.js')

const grupy = [
  { folder: 'flowers', ids: flowers.FLOWER_IDS, Art: flowers.FlowerArt, lista: katalog.FLOWERS },
  { folder: 'leaves', ids: leaves.LEAF_IDS, Art: leaves.LeafArt, lista: katalog.LEAVES },
  { folder: 'extras', ids: extras.EXTRA_IDS, Art: extras.ExtraArt, lista: katalog.EXTRAS },
  { folder: 'vases', ids: vases.VASE_IDS, Art: vases.VaseThumb, lista: katalog.VASES_CATALOG },
]

let ile = 0
for (const { folder, ids, Art, lista } of grupy) {
  const kat = join(root, 'src', 'assets', folder)
  mkdirSync(kat, { recursive: true })
  for (const id of ids) {
    const kolor = lista.find((k) => k.id === id)?.kolor
    const markup = renderToStaticMarkup(React.createElement(Art, { id, color: kolor, size: 200 }))
    const svg = markup.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
    writeFileSync(join(kat, `${id}.svg`), `${svg}\n`, 'utf8')
    ile++
  }
  console.log(`  ${folder.padEnd(8)} ${String(ids.length).padStart(2)} plikow`)
}

await vite.close()
console.log(`\nGotowe - ${ile} ikon zapisanych w src/assets/`)
