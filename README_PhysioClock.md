# PhysioClock · Website Version 1.0

Öffentliche Website mit Schnellanleitung, sechs Trainingsmodulen, Übungskatalog,
PDF-Anleitungen, Datenschutz und Hilfe in Deutsch, Englisch, Französisch und
Italienisch.

- [Startseite](https://igelsbacher.github.io/physioclock/)
- [Schnellanleitung](https://igelsbacher.github.io/physioclock/de/#quick-start)
- [Datenschutz](https://igelsbacher.github.io/physioclock/de/datenschutz.html)

Die Website läuft als statische Seite auf GitHub Pages. Die öffentlichen
PDF-Anleitungen stehen unter `downloads/`, die aktuellen Rechtstexte unter
`legal/`. Die Buildnummern der iOS-App sind unabhängig von der Website-Version.

```sh
node scripts/check-website-links.mjs
node scripts/check-current-version.mjs
```
