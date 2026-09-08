# Ogród Gwiazdek – specyfikacja gry

## 1. Koncept

Gra przeglądarkowa, w której gracz układa bukiety kwiatów na okrągłym, wzorzystym stole, a następnie:
- **zapisuje bukiet do własnej kolekcji**, lub
- **sprzedaje go za gwiazdki** (waluta w grze), które odblokowują nowe kwiaty, wazony i dodatki.

Odbiorczyni: dziecko, ok. 10 lat. Autorka koncepcji: siostrzenica. Cel: prosta, ciepła, satysfakcjonująca zabawa w dekorowanie, bez presji czasu ani przegrywania.

## 2. Stack technologiczny

| Element | Wybór | Uzasadnienie |
|---|---|---|
| Frontend | **React (Vite)** | znane, dobrze się skaluje, łatwe zarządzanie stanem bukietu |
| Zapis danych | **localStorage** (przeglądarka) | jedno urządzenie na start, zero backendu/bazy danych, można później rozbudować o backend bez przepisywania całej logiki |
| Hosting | **GitHub Pages** | darmowy, wdrożenie przez `npm run deploy` (pakiet `gh-pages`) |
| Grafika kwiatów | **SVG**, pobrane z gotowych źródeł w internecie | umożliwia zmianę koloru w kodzie (bez podmiany plików) |
| Dźwięk | krótkie efekty (klik, sprzedaż) | pliki mp3/ogg, kilka sztuk |

## 3. Urządzenie docelowe

**Telefon i komputer** (responsywnie):
- Layout dostosowany do obu: na telefonie panele wyboru raczej jako zakładki na dole ekranu/rozwijane szuflady (mało miejsca), na komputerze mogą być stałe boczne panele
- Elementy do przeciągania (kwiaty, liście) muszą mieć **duży obszar dotykowy** na telefonie (min. ok. 44×44px), nie tylko duży wizualnie
- Testować obsługę zarówno myszą (drag & drop) jak i dotykiem (touch events) – w React najprościej biblioteką wspierającą oba naraz (np. `@dnd-kit` lub `interact.js`)

## 4. Ekrany / layout (na podstawie szkicu)

**Ekran główny — stół roboczy:**
- Okrągły, wzorzysty (paski) stół na środku
- Wazon na stole (aktualnie wybrany)
- Kosz na odpady obok stołu (przeciągnij kwiat = usuń)
- **Licznik gwiazdek w prawym górnym rogu** (zawsze widoczny)
- Górne menu: zmiana koloru, zapisz do kolekcji, sprzedaj, ustawienia/reset

**Panele wyboru (zakładki/kategorie):**
1. 🌸 Kwiaty
2. 🌿 Liście (osobna kategoria — eukaliptus, paproć itd., warstwa "pod spodem" bukietu)
3. 🏺 Wazony (+ papier ozdobny, folia)
4. 🎀 Dodatki (wstążki, linka/drut)

**Ekran kolekcji** — osobny widok z zapisanymi bukietami (galeria).

**Ekran sklepiku** — odblokowywanie nowych elementów za gwiazdki.

## 5. Mechaniki

### Zmiana koloru
- Klik na kwiat (w panelu wyboru lub już w bukiecie) → mała paleta kolorów obok
- Klik na wazon → analogicznie
- Technicznie: SVG z `fill` sterowanym przez CSS/JS, bez podmiany plików

### Wkładanie kwiatów do wazonu
- Łodyga i główka kwiatu to **dwa oddzielne elementy** nakładane na siebie (jedna uniwersalna łodyga dla wszystkich kwiatów, różna długość/kąt)
- Punkty kotwiczące (anchor points) zdefiniowane dla każdego wazonu — kwiat "wskakuje" na wolny punkt
- **Losowy offset X/Y + losowy obrót** przy wstawieniu — bukiet od razu wygląda naturalnie
- Kwiat **można przeciągnąć i poprawić** ręcznie po wstawieniu (ważne dla 10-latki — brak presji precyzji, magnetyzm przy upuszczeniu blisko właściwego miejsca)
- Liście wstawiane analogicznie, ale niżej w z-index (warstwa pod kwiatami)

### Ekonomia / progresja
- **Start: ograniczony asortyment** (kilka kwiatów, jeden wazon) — reszta do odblokowania
- Sprzedaż bukietu → gwiazdki (liczba zależna np. od liczby różnych kwiatów/rzadkości — do ustalenia z siostrzenicą jako prosta reguła)
- Gwiazdki wydawane w sklepiku na nowe kwiaty/liście/wazony/dodatki

### Zapis danych (localStorage)
Do zapisania:
- stan gracza: liczba gwiazdek, odblokowane elementy
- kolekcja zapisanych bukietów (nie sprzedanych)

## 6. Struktura danych (przykład)

```json
{
  "flowers": [
    {"id": "roza", "nazwa": "Róża", "ikona": "roza.svg", "kolory": ["czerwony","rozowy","bialy"], "odblokowany_domyslnie": true}
  ],
  "leaves": [
    {"id": "eukaliptus", "nazwa": "Eukaliptus", "ikona": "eukaliptus.svg", "odblokowany_domyslnie": true}
  ],
  "vases": [
    {"id": "wazon1", "nazwa": "Okragly wazon", "obraz": "wazon1.svg", "anchor_points": [{"x":0,"y":0,"rot":0}, "..."], "odblokowany_domyslnie": true}
  ],
  "extras": [
    {"id": "wstazka_czerwona", "typ": "wstazka", "obraz": "wstazka_cz.svg"}
  ]
}
```

```json
{
  "gracz": {
    "gwiazdki": 0,
    "odblokowane_kwiaty": ["roza"],
    "odblokowane_wazony": ["wazon1"],
    "kolekcja": []
  }
}
```

## 7. Grafika — plan pozyskania ikon

- **Kwiaty i liście: wybrane ręcznie z internetu** (Flaticon, Freepik, SVG Repo, itch.io — patrz lista źródeł wcześniej w rozmowie), dopasowywane wizualnie do nazw z listy przez siostrzenicę
- **Łodygi: rysowane osobno w kodzie** (proste SVG/CSS, jedna uniwersalna, nie pobierana z internetu)
- Format: **SVG** (umożliwia zmianę koloru)
- Ewentualne własne rysunki siostrzenicy: rysunek na papierze → zdjęcie/skan → wektoryzacja (Vectorizer.ai lub Inkscape „Trace Bitmap") — opcja na uzupełnienie braków, nie na start

## 8. Źródła ikon — lista i sposób wyboru

**Gotowe paczki (spójny styl, sprawdzić w pierwszej kolejności):**
1. [1000+ Free Flowers](https://josepvalls.itch.io/flowers-spritesheet) — itch.io, CC0, setki kwiatków w jednym spójnym płaskim stylu
2. [Kenney – Foliage Pack](https://kenney.nl/assets/foliage-sprites) — liście/zieleń, CC0
3. [Free Flower Pack – 12 Icons](https://jennpixel.itch.io/free-flower-pack-12-icons) — styl pikselowy (alternatywa, jeśli spodoba się bardziej growy klimat)

**Duże katalogi (mieszane style — wybierać w obrębie jednego stylu/autora):**
4. [SVG Repo – kwiaty](https://www.svgrepo.com/vectors/flower/)
5. [Flaticon – flower icons](https://www.flaticon.com/search?word=flower)
6. [Freepik – flower icons](https://www.freepik.com/icons/flower)
7. [Icons8 – flowers](https://icons8.com/icons/set/flower)

**Sposób wyboru (żeby uniknąć chaosu):**
1. Siostrzenica przegląda najpierw pozycje 1–2 (gotowy, spójny styl) — jeśli to wystarczy do większości nazw z listy, gotowe
2. Do brakujących, rzadszych nazw (np. Lupinus, Gipsofila) szuka w punktach 4–7, **zawsze wybierając 2–3 kandydatów na raz** i porównując, który pasuje stylem do reszty (płaski / outline / realistyczny — nie mieszać)
3. Wybrane pliki zapisujecie z nazwą pliku = `id` kwiatu z listy w sekcji 8 (np. `roza.svg`), żeby od razu pasowały do struktury danych z sekcji 6
4. Przy plikach z Flaticon/Freepik/Icons8 sprawdzić, czy wymagana jest **atrybucja autora** (część darmowych ikon tego wymaga) — jeśli tak, zapisać źródło do późniejszej stopki/informacji o autorach w grze

**Struktura folderów w projekcie:**
```
/src/assets/flowers/   → roza.svg, tulipan.svg, ...
/src/assets/leaves/    → eukaliptus.svg, paproc.svg, ...
/src/assets/vases/     → wazon1.svg, ...
/src/assets/extras/    → wstazka_czerwona.svg, ...
```

## 9. Lista nazw kwiatów (z Waszej listy — do dopasowania ikon)

Róża, Rumianek, Tulipan, Hortensja, Lupinus, Gipsofila, Stokrotka, Zinnia, Jaśmin, Antirrhinum, Polygonum, Narcyz, Godetia/Convolvulus, Cosmo, Brachycome, Freezja, Bellis, Viola, Werbena, Szafirek/Myosotis, Iberis, Nicotiana + liście: Eukaliptus, Paproć

## 10. Kolejność prac (etapy)

1. Wybór i pozyskanie ikon SVG (kwiaty, liście, wazony, dodatki) — **w toku**
2. Szkielet aplikacji React + Vite, statyczny layout (stół, panele, menu)
3. Logika przeciągania kwiatów/liści na stół (anchor points + losowy offset)
4. Zmiana koloru (klik → paleta)
5. Kosz na odpady (usuwanie)
6. Zapis/sprzedaż + licznik gwiazdek + localStorage
7. Ekran kolekcji
8. Sklepik / odblokowywanie
9. Dźwięk
10. Deploy na GitHub Pages

## 11. Otwarte decyzje (do ustalenia z siostrzenicą w trakcie pracy)

- Dokładna reguła: ile gwiazdek za sprzedany bukiet
- Ceny odblokowania poszczególnych kwiatów/wazonów w sklepiku
- Ostateczny wybór konkretnych plików ikon
