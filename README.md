# Ogród Gwiazdek 🌷★

Gra przeglądarkowa do układania bukietów, zrobiona dla dziesięciolatki.

Układasz kwiaty na okrągłym stole, zmieniasz im kolory, a gotowy bukiet
**zapisujesz do kolekcji** albo **sprzedajesz za gwiazdki**, które w sklepiku
odblokowują nowe kwiaty, liście, wazony i dodatki.

Bez presji czasu, bez przegrywania, bez reklam i bez internetu — cały stan gry
siedzi w przeglądarce gracza.

## Zagraj

**[juliaadamczyk.github.io/ogrod_gwiazdek](https://juliaadamczyk.github.io/ogrod_gwiazdek/)**

Działa też z jednego pliku, bez żadnej instalacji — pobierz
[`graj-bez-node.html`](./graj-bez-node.html) i kliknij dwa razy.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Aplikacja startuje na `http://localhost:5173`. Wymaga Node.js 20 lub nowszego.

| Komenda | Co robi |
|---|---|
| `npm run dev` | serwer developerski |
| `npm run build` | build produkcyjny do `dist/` |
| `npm run preview` | podgląd builda |
| `npm run ikony` | eksport ikon do plików `.svg` w `src/assets/` |

## Grafika

Wszystkie kwiaty, liście, wazony i dodatki są **narysowane jako SVG bezpośrednio
w kodzie** (`src/art/`) — gra nie wczytuje żadnych plików graficznych. Dlatego
zmiana koloru kwiatu to jeden props, a cała gra waży ~200 kB.

## Sterowanie

- Wszystko obsługiwane przez **Pointer Events** — jeden kod dla myszy i dotyku.
- Desktop: stół po lewej, stały panel wyboru po prawej.
- Telefon (< 900 px): stół u góry, panel jako zwijana szuflada na dole.

## Technologie

React 18 + Vite. Publikacja na GitHub Pages automatycznie przy każdym
`push` na `main`.
