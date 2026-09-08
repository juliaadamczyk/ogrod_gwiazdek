#!/usr/bin/env python3
"""Sklada graj-bez-node.html - jeden samowystarczalny plik z cala gra w srodku.

Po kazdej zmianie w src/ uruchom ponownie:
    python3 scripts/zbuduj-graj-bez-node.py

Plik dziala po zwyklym dwukliku (file://) - nie pobiera niczego z dysku.
Z internetu bierze tylko React i Babel (cdnjs) oraz font Baloo 2.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

MODULY = [
    "src/data/colors.js",
    "src/data/catalog.js",
    "src/sound.js",
    "src/art/flowers.jsx",
    "src/art/leaves.jsx",
    "src/art/extras.jsx",
    "src/art/vases.jsx",
    "src/art/Table.jsx",
    "src/art/stems.js",
    "src/state/useGame.js",
    "src/components/ItemArt.jsx",
    "src/components/Palette.jsx",
    "src/components/BouquetPreview.jsx",
    "src/components/Workbench.jsx",
    "src/components/Panels.jsx",
    "src/components/Collection.jsx",
    "src/components/Shop.jsx",
    "src/components/IconSheet.jsx",
    "src/App.jsx",
]

zrodla = {p: (ROOT / p).read_text(encoding="utf-8") for p in MODULY}
css = (ROOT / "src/styles.css").read_text(encoding="utf-8")

# </script> w tresci rozwalilby dokument - w naszych zrodlach go nie ma, ale sprawdzamy
for sciezka, tresc in zrodla.items():
    assert "</script" not in tresc.lower(), f"{sciezka} zawiera </script>"

html = f"""<!doctype html>
<!--
  Ogrod Gwiazdek - wersja bez instalowania Node/npm.
  WYGENEROWANY PLIK - nie edytuj recznie.
  Zrodla siedza w src/; po zmianach przebuduj:
      python3 scripts/zbuduj-graj-bez-node.py

  Otwiera sie zwyklym dwuklikiem. Z internetu pobiera tylko React, Babel i font.
-->
<html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#f7e9d8">
<title>Ogrod Gwiazdek</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
<style>
#err {{ color: #b3243f; white-space: pre-wrap; font: 13px ui-monospace, Menlo, monospace; padding: 16px; }}
#ladowanie {{ padding: 40px; text-align: center; color: #8a7580; font-size: 17px; }}
</style>
</head><body>
<div id="err"></div>
<div id="root"><div id="ladowanie">Sadzimy kwiatki…</div></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js"></script>

<script id="zrodla" type="application/json">
{json.dumps(zrodla, ensure_ascii=False)}
</script>

<script>
// Wszystkie moduly siedza w tym pliku - zero pobierania z dysku, wiec dziala z file://
var ZRODLA = JSON.parse(document.getElementById('zrodla').textContent)
var KOLEJNOSC = {json.dumps(MODULY)}
var mods = {{}}

function nazwa(sciezka) {{
  return sciezka.split('/').pop().replace(/\\.(jsx|js)$/, '')
}}

function req(spec) {{
  if (spec === 'react') return React
  if (spec === 'react-dom/client') return ReactDOM
  if (spec.slice(-4) === '.css') return {{}}
  var key = nazwa(spec)
  if (!(key in mods)) throw new Error('brak modulu: ' + spec)
  return mods[key]
}}

try {{
  if (typeof React === 'undefined' || typeof Babel === 'undefined') {{
    throw new Error('Nie udalo sie pobrac React/Babel z internetu. Sprawdz polaczenie i odswiez strone.')
  }}
  for (var i = 0; i < KOLEJNOSC.length; i++) {{
    var sciezka = KOLEJNOSC[i]
    var kod = Babel.transform(ZRODLA[sciezka], {{
      presets: ['react'],
      plugins: ['transform-modules-commonjs'],
      filename: sciezka,
    }}).code
    var module = {{ exports: {{}} }}
    new Function('require', 'module', 'exports', 'React', kod)(req, module, module.exports, React)
    mods[nazwa(sciezka)] = module.exports
  }}
  document.getElementById('root').innerHTML = ''
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(React.StrictMode, null, React.createElement(mods.App.default))
  )
}} catch (e) {{
  document.getElementById('ladowanie').remove()
  document.getElementById('err').textContent = 'BLAD: ' + e.message + '\\n\\n' + (e.stack || '')
}}
</script>
</body></html>
"""

wyjscie = ROOT / "graj-bez-node.html"
wyjscie.write_text(html, encoding="utf-8")
print(f"Zapisano {wyjscie.name} — {len(html) // 1024} KB, {len(MODULY)} modulow w srodku")
