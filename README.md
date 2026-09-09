# Ogród Gwiazdek 🌷★

Gra przeglądarkowa do układania bukietów — implementacja specyfikacji z
[`ogrod-gwiazdek-spec.md`](./ogrod-gwiazdek-spec.md).

Układasz kwiaty na okrągłym stole, zmieniasz im kolory, a gotowy bukiet
**zapisujesz do kolekcji** albo **sprzedajesz za gwiazdki**, które w sklepiku
odblokowują nowe kwiaty, liście, wazony i dodatki.

---

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje na `http://localhost:5173`.

### Wymagania

Node.js 20 lub nowszy (CI buduje na 24) — do pobrania z [nodejs.org](https://nodejs.org).

### Bez Node — plik awaryjny

Gra chodzi też z jednego pliku, bez żadnej instalacji:

**[`graj-bez-node.html`](./graj-bez-node.html) — kliknij dwa razy i już.**

Cały kod z `src/` jest wklejony do środka, więc nic nie pobiera z dysku
(dlatego działa z `file://`, gdzie zwykłe wczytywanie plików jest zablokowane).
Z internetu bierze tylko React, Babel i font — bez sieci pokaże komunikat o błędzie.

To wygenerowany plik. Po każdej zmianie w `src/` trzeba go przebudować:

```bash
python3 scripts/zbuduj-graj-bez-node.py
```

Jest wolniejszy od Vite (transpiluje JSX przy każdym otwarciu). Skoro Node już
jest, do codziennej pracy służy `npm run dev` — ale ten plik warto zachować,
bo pozwala wysłać całą grę jednym załącznikiem.

⚠️ Przy otwarciu przez `file://` część przeglądarek (m.in. Safari) blokuje
`localStorage` — gra wtedy działa, ale **nie zapamięta gwiazdek i kolekcji**
po zamknięciu karty. Gra jest na to odporna (nie wywala się), ale jeśli
gwiazdki i kolekcja mają się zachować na dłużej, lepiej uruchomić przez serwer:
`python3 -m http.server 8899`, a docelowo przez `npm run dev`.

| Komenda | Co robi |
|---|---|
| `npm run dev` | serwer developerski |
| `npm run build` | build produkcyjny do `dist/` |
| `npm run preview` | podgląd builda |
| `npm run ikony` | eksport wszystkich ikon do plików `.svg` w `src/assets/` |
| `python3 scripts/zbuduj-graj-bez-node.py` | przebudowa pliku `graj-bez-node.html` (nie wymaga Node) |

### Deploy na GitHub Pages

Publikacja jest automatyczna. Każdy `push` na `main` uruchamia workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), który robi
`npm ci`, `npm run build` i wystawia `dist/` na GitHub Pages.

Jednorazowa konfiguracja w repo: **Settings → Pages → Source: „GitHub Actions"**.

`vite.config.js` ma `base: './'`, więc gra działa niezależnie od nazwy repo —
nie trzeba nic podmieniać.

---

## Struktura

```
src/
├── art/                 grafika rysowana w kodzie (SVG)
│   ├── flowers.jsx      22 kwiaty
│   ├── leaves.jsx       7 rodzajów zieleni (3 od startu)
│   ├── stems.js         wyliczanie krzywych łodyg (tylko dla kwiatów)
│   ├── vases.jsx        8 wazonów/opakowań + geometria bukietu
│   ├── extras.jsx       8 dodatków
│   └── Table.jsx        blat stołu (widok z boku) i kosz
├── components/
│   ├── Workbench.jsx    stół roboczy: przeciąganie, magnetyzm, kosz, paletka
│   ├── Panels.jsx       zakładki wyboru (kwiaty / liście / wazony / dodatki)
│   ├── Collection.jsx   galeria zapisanych bukietów
│   ├── Shop.jsx         sklepik
│   ├── IconSheet.jsx    kartoteka wszystkich ikon (do przeglądania z siostrzenicą)
│   ├── BouquetPreview.jsx  statyczny podgląd bukietu
│   ├── Palette.jsx      paletka kolorów
│   └── ItemArt.jsx      wybór właściwego zestawu kształtów
├── data/
│   ├── catalog.js       nazwy, ceny, wartości, reguła wyceny bukietu
│   └── colors.js        palety + wyliczanie odcieni z jednego koloru
├── state/useGame.js     stan gry + zapis w localStorage
└── sound.js             efekty dźwiękowe (WebAudio, bez plików mp3)
```

---

## Jak to działa

### Dodawanie kwiatów
- **Tapnięcie** kafelka w panelu → kwiat sam wskakuje na wolny punkt kotwiczący
  z losowym przesunięciem i obrotem (bukiet od razu wygląda naturalnie).
- **Przeciągnięcie** kafelka na stół → kwiat ląduje dokładnie tam, gdzie puścisz.

### Łodygi
Nie są osobnymi obrazkami. Każda łodyga to krzywa rysowana w locie od wnętrza
wazonu do główki kwiatu — więc długość i kąt dopasowują się same, cokolwiek
dziecko zrobi z kwiatem. Wazon jest rysowany *nad* łodygami, więc ich dolne
końce chowają się w środku.

Łodyga to krzywa sześcienna, której **pierwszy punkt kontrolny leży prosto nad
startem** — dzięki temu wychodzi z wazonu pionowo przez szyjkę i skręca do kwiatka
dopiero nad kantem. Bez tego łodygi kwiatów z brzegu przebijały bokiem wąską
szyjkę i bukiet wyglądał, jakby wisiał nad wazonem. Start jest w punkcie `dno` pojemnika
(dla wazonów w środku bańki, dla opakowań przy przewiązaniu), a kopuła punktów kotwiczących siedzi nisko: środek
najwyżej, brzegi tuż nad kantem (`0.3 * ry`).

### Poprawianie
Każdy element można przeciągnąć. **Magnetyzm działa tylko dla kwiatów**: po
upuszczeniu bliżej niż ~5% szerokości stołu od punktu kotwiczącego kwiat wskakuje
na niego. Liście i dodatki zostają dokładnie tam, gdzie je puszczono — wcześniej
„uciekały" spod palca. Tapnięcie w kwiat otwiera paletkę: 16 kolorów, obrót, powiększenie,
zmniejszenie, przekładanie warstw, wyrzucenie.

Obrót idzie po **5°** (nie 15°), żeby dało się dopasować element dokładnie.
Liście dodatkowo obracają się **wokół nasady**, a nie środka
(`transform-origin: 50% 84%`) — przy obracaniu zostają w wazonie i rusza się
tylko czubek. Losowy obrót przy wstawianiu liścia jest też mniejszy niż dla kwiatów.

### Kadr
`.scena` to kwadrat o boku `min(100%, 68vh)` (na telefonie `56vh`), a blat zajmuje
`rx: 38` z 50 — bukiet dominuje w kadrze. Chcesz przybliżyć bardziej: podnieś `vh`
w `.scena` albo zmniejsz `BLAT.rx`.

### Stół
Blat widziany z boku — owalna płaszczyzna w fioletowo-żółte paski, z widoczną
grubością blatu i cieniem. Wazon **stoi na blacie** (ma własny cień styku),
a bukiet rośnie nad nim. Geometria blatu siedzi w jednej stałej `BLAT`
w [`src/art/Table.jsx`](src/art/Table.jsx); pozycje wazonów (`box.y`) są do niej
dopasowane tak, żeby ich spody lądowały na wysokości blatu.

### Opakowania (papier, folia)
To **pojemniki**, tak samo jak wazony — wybiera się je w zakładce *Wazony*
i bukiet układa się w nich sam. Nie przeciąga się ich po stole (mają
`pointer-events: none`), bo z ich wylotu liczy się geometria całego bukietu.
Narysowane są jak prawdziwy bukiet w papierze: stożek o prostych bokach,
**ściśnięty i przewiązany sznurkiem u dołu**. Nie mają domalowanych łodyg —
każdy pojemnik ma pole `dnoArt` mówiące, jak głęboko schodzą **prawdziwe**
łodygi, więc w opakowaniu sięgają aż do przewiązania (a przez przezroczystą
folię je widać). Pusty pojemnik nie ma pod spodem żadnej zieleni. Rożek jest węższy niż kopuła kwiatów (`spread.rx` > promień wlotu),
więc kwiaty wyrastają **nad** papierem, zamiast w nim tonąć.

### Wazon w dwóch warstwach
Wazon rysowany jest **dwa razy**: raz cały pod łodygami (`.wazon-tyl`, z-index 5)
i raz sama jego część poniżej linii wlotu, nad łodygami (`.wazon-przod`, z-index 50,
przycięta `clipPath`-em od `otworY` w dół). Dzięki temu tył i wnętrze wazonu są
z tyłu, a łodygi widać, jak wchodzą w otwór — zamiast urywać się na kancie.
Każdy wazon ma jedno pole `otworY` (wysokość linii wlotu w jednostkach rysunku).

Ścieżki łodyg liczy jedna funkcja `sciezkiLodyg()`
w [`src/art/stems.js`](src/art/stems.js), wspólna dla stołu i podglądu kolekcji.

Każda łodyga rysowana jest **dwa razy**: raz we wspólnej warstwie pod wazonem
(`.lodygi`, z-index 10 — to ona daje efekt schowania we wnętrzu i prześwitywania
przez folię) i raz w warstwie **swojego kwiatu** (`.lodyga-nad`, `z = kwiat.z − 1`).

Kopia wierzchnia to **dokładny fragment tej samej krzywej**, wycięty algorytmem
de Casteljau w punkcie, w którym łodyga przecina wysokość wylotu (`drugaPolowa()`
w `stems.js`). To ważne: krzywa Béziera zmienia kształt na całej długości, gdy
przesunie się jej punkt początkowy — narysowanie „drugiej, podobnej" krzywej
od wylotu dawało widoczne **podwójne łodygi**. Dzięki temu „↙ Do tyłu / Na wierzch ↗"
przesuwa kwiat **razem z łodygą**, a mimo to nic nie rysuje się po korpusie
wazonu. Jeśli kwiat wisi niżej niż wylot, przycięcie schodzi aż do niego —
wtedy łodyga świadomie przechodzi przed wazonem, bo kwiat też jest przed nim.
Łodyga kończy się w **nasadzie** kwiatu, nie w środku ikony. Każdy kwiat może
mieć w katalogu pole `nasada: { x, y }` (w jednostkach rysunku 0–100); domyślnie
jest to `NASADA_DOMYSLNA` = dół główki. Punkt obraca się razem z kwiatem, więc
np. obrócony tulipan ma łodygę u dołu kielicha, a nie przyklejoną z boku.
Osobne wartości mają kwiaty, których nasada nie jest na środku dołu:
tulipan, bratek, szafirek, łubin, lwia paszcza, rdest, gipsówka, jaśmin, iberis
i frezja (ta ma nasadę przesuniętą także w poziomie).

Sześć kwiatów rysuje **własne gałązki** (gipsówka, jaśmin, iberis, frezja,
lwia paszcza, rdest). Ich narysowane łodygi są celowo skrócone tak, żeby
zaczynały się dokładnie tam, gdzie zaczyna się rozgałęzienie — a `nasada`
wskazuje ten sam punkt. Gruba doklejana łodyga dochodzi więc do rozgałęzienia
i dalej przejmują cienkie witki, zamiast stykać się z nimi w pół drogi.

Łodygi dostają **tylko kwiaty** — liście mają własną gałązkę narysowaną w ikonie,
więc doklejanie im drugiej łodygi wyglądałoby źle. Dlatego liście sadzą się
w dolnej części kopuły, gdzie ich własna gałązka sięga wazonu.

### Dźwięk
Wybieranie kwiatów i liści, przestawianie ich i zmiana kolorów są **ciche** —
dźwięk zostaje tylko przy wydarzeniach: kosz, zapis, sprzedaż, zakup w sklepiku.

### Warstwy
Kolejność sceny: `blat 1 → wazon (tył) 5 → łodygi kwiatów 10 → liście ~1000 →
wazon (przód) 1500 → kwiaty ~2000 → dodatki ~3000`. `.scena` ma
`isolation: isolate`, żeby te wysokie warstwy zostały **wewnątrz** sceny
i nie przebijały górnego paska ani modali. Przód wazonu jest **nad
liśćmi**, żeby ich własne łodygi chowały się w wazonie tak samo jak łodygi
kwiatów. Ale **każdy element ma
własne `z`** i można go przełożyć: zaznacz i użyj **↙ Do tyłu** / **Na wierzch ↗**.
Przeciągany element jest chwilowo na wierzchu, ale jego zapisana warstwa się nie
zmienia. Nic nie schodzi poniżej wazonu (dolny limit `MIN_Z`).

### Kosz
Przeciągnij element na kosz obok stołu — kosz się otwiera i element znika.

### Wycena bukietu i limity

Reguła jest celowo prosta, żeby dało się ją wytłumaczyć dziecku:

| Składnik | Gwiazdki |
|---|---|
| **pierwszy** kwiat danego gatunku | 1–3 (Piwonia królewska: 6) |
| **każdy kolejny taki sam** kwiat | 1 |
| każdy **różny** rodzaj liścia | 1 (powtórki gratis) |
| każdy **różny** dodatek | 1–2 (powtórki gratis) |
| każdy różny gatunek kwiatu | **+1** ← premia za różnorodność |
| wazon / opakowanie | 0–3 (bonus wazonu) |

Typowa sprzedaż: bukiet startowy ~13★, w połowie gry ~35★, w pełni rozwinięty ~60★.

**Limity — każda kategoria ma własną pulę**, żeby zieleń nie zabierała miejsca
kwiatom:

| Kategoria | Limit |
|---|---|
| kwiaty | `LIMIT_KWIATOW` = 15 |
| liście | `LIMIT_LISCI` = 15 |
| dodatki | `LIMIT_DODATKOW` = 6 |

Wszystkie trzy stałe siedzą w [`src/data/catalog.js`](src/data/catalog.js).
Punkty kotwiczące wazonu (`capacity`, 10–16) nadal decydują o tym, **gdzie**
kwiaty wskakują — przy większej liczbie kwiatów niż punktów po prostu siadają
po kilka blisko siebie z losowym przesunięciem.

Przy próbie przepełnienia gra pokazuje komunikat (osobny dla kwiatów, zieleni
i dodatków), a nad przyciskami widać licznik `🌸 13/15  🌿 8/15`, który
podświetla się na różowo, gdy dana pula jest pełna.

Sprzedaż wymaga minimum **3 kwiatów**. Okno sprzedaży pokazuje pełne wyliczenie
razem z osobną linijką o powtórkach.

**Dlaczego tak:** bez zasady „powtórki po 1★" dało się wsadzić 13 lwich paszcz
(najdroższy kwiat) i dostać 52★ za jedno kliknięcie — czyli drukować gwiazdki.
Teraz ten sam bukiet daje 18★, a bukiet z 4 różnych kwiatów i 3 różnych liści — 20★.
Różnorodność wygrywa, a jeden kwiat dokłada najwyżej `wartosc + 2` gwiazdki
na bukiet, przy cenie odblokowania 12–38★ — czyli zwraca się po kilku bukietach,
nie po jednym.

### Ceny w sklepiku

| Kategoria | Zakres | Suma |
|---|---|---|
| kwiaty (18 do kupienia) | 30 → 700★ | 5395★ |
| **Piwonia królewska** (nagroda końcowa) | **1200★** | 1200★ |
| liście (4) | 50 → 170★ | 420★ |
| wazony i opakowania (7) | 70 → 550★ | 1930★ |
| dodatki (7) | 55 → 280★ | 1000★ |
| | | **9945★** |

Najdroższy zwykły kwiat kosztuje 700★, więc piwonia za 1200★ dalej wyraźnie
odstaje jako cel końcowy.

**Ile to gra:** przy średniej sprzedaży ok. 35★ odblokowanie wszystkiego to
mniej więcej **280 bukietów**. To dużo — jeśli okaże się za wolno, jest na to
jedno pokrętło: stała `MNOZNIK_CEN` w [`src/data/catalog.js`](src/data/catalog.js)
skaluje cały sklepik. `0.6` → ok. 170 bukietów, `0.5` → ok. 140,
`0.35` → ok. 100. Nie trzeba ruszać trzydziestu liczb osobno.

Zmiana reguły wyceny: funkcja `wycen()` w [`src/data/catalog.js`](src/data/catalog.js).
Zmiana cen: pola `cena` w tym samym pliku. Zmiana limitów: `LIMIT_KWIATOW`,
`LIMIT_LISCI`, `LIMIT_DODATKOW` tamże.

### Zapis
Wszystko leci do `localStorage` pod kluczem `ogrod-gwiazdek-v1`:
gwiazdki, odblokowane elementy, kolekcja **oraz bukiet w trakcie układania**
(zamknięcie karty nie kasuje roboty). Reset: ⚙️ → *Zacznij grę od nowa*.

---

## Grafika

Wszystkie ikony są **narysowane jako SVG bezpośrednio w kodzie**, nie pobierane
z internetu. Powody:

1. **Zmiana koloru działa naprawdę.** Z jednego koloru bazowego wyliczamy pięć
   odcieni (`src/data/colors.js`), więc kwiat po przemalowaniu dalej ma cienie
   i głębię, zamiast być płaską plamą.
2. **Jeden spójny styl** dla wszystkich 43 elementów.
3. **Komplet nazw** z sekcji 9 specyfikacji — nic nie brakuje.
4. **Zero atrybucji i licencji** do pilnowania.

Pliki `.svg` na dysku (gdyby ktoś chciał je oglądać albo edytować w Inkscape):

```bash
npm run ikony     # → src/assets/flowers|leaves|vases|extras/*.svg
```

Podgląd w grze: ⚙️ → **Zobacz kartotekę ikon** — cały zestaw na jednym ekranie,
z możliwością przemalowania wszystkiego na raz.

Folder `flower_icons/` z pobranymi PNG-ami został jako **referencja wizualna** —
nie jest używany przez grę. Były w trzech różnych stylach (płaski bez konturu,
płaski z czarnym konturem, cienki outline) i pokrywały ~10 z 22 nazw z listy.

### Co zostało sprawdzone

Gra była uruchomiona i przeklikana w przeglądarce. Zweryfikowane:
dodawanie tapnięciem i przeciągnięciem z panelu, łodygi podążające za kwiatem,
warstwy (liście pod kwiatami), zmiana koloru kwiatu i wazonu, obrót/skala/usuwanie,
przeciąganie po stole, kosz, wycena i sprzedaż (rachunek się zgadza),
zapis do kolekcji i podgląd, zakup w sklepiku, trwałość `localStorage`,
kartoteka ikon z przemalowaniem całego zestawu, layout desktop i telefon (375 px).
Osobno sprawdzony `graj-bez-node.html` otwarty jako `file://` — startuje i gra
poprawnie, także w `React.StrictMode`. Po zmianie stołu przeklikane ponownie:
nowy blat, wazon stojący na nim, nowe liście, przekładanie warstw
(z-index 1001 → 2005 → 999) i podgląd w kolekcji. Po poprawce geometrii bukietu
sprawdzone jeszcze raz: kwiaty siedzą w wazonie, obrót po 5° (−19,9° → +0,1°
w czterech kliknięciach), liść obraca się wokół nasady, „Długa trawa" odblokowana.

Po instalacji Node sprawdzone także na prawdziwym Vite: `npm install` (109 paczek),
`npm run build` (202 kB JS / 64 kB gzip, 12 kB CSS, build w ~2,5 s),
`npm run dev` i `npm run ikony` (46 plików SVG). Gra przeklikana na
`localhost:5173` — dodawanie, sprzedaż, naliczanie gwiazdek, zapis stanu.

**Nadal nie sprawdzone:** publikacja na GitHub Pages (workflow nie był jeszcze uruchomiony)
oraz **dotyk na prawdziwym telefonie** — Pointer Events testowane były myszą
i zdarzeniami syntetycznymi w przeglądarce desktopowej. To gra głównie na
telefon, więc to realna luka.

### Do obgadania z siostrzenicą

- **Paproć** wychodzi trochę „choinkowo" — kandydat do przerysowania.
- **Lwia paszcza** i **rdest** są najtrudniejsze do rozpoznania w małym rozmiarze.
- Spec wymieniał „Godetia/Convolvulus" i „Szafirek/Myosotis" jako pary —
  narysowana jest godecja i szafirek; powój i niezapominajka do dorobienia,
  jeśli będą potrzebne.
- Wszystkie kształty siedzą w `src/art/*.jsx`, każdy w osobnej funkcji pod swoim
  `id` — poprawka jednego kwiatka nie rusza reszty.

---

## Sterowanie / urządzenia

- Wszystko obsługiwane przez **Pointer Events** — jeden kod dla myszy i dotyku,
  bez zewnętrznej biblioteki drag&drop.
- Elementy na stole mają ~21% szerokości stołu, czyli grubo ponad 44×44 px
  nawet na małym telefonie.
- Desktop: stół po lewej, stały panel wyboru po prawej.
- Telefon (< 900 px): stół u góry, panel jako zwijana szuflada na dole.
