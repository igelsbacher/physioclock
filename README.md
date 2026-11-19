# Timer · Website (vormals PhysioClock)

Informations- und Anleitungswebsite zur iOS-App Timer. Der neutrale Timer ist
Standard; der optionale Bewegungsmodus wird in der App aktiviert. Die Website
enthält keine Webapplikation, keine Übungen und keine Bewegungsfotos.

- [Startseite](https://igelsbacher.github.io/physioclock/)
- [Anleitung](https://igelsbacher.github.io/physioclock/de/kompletteinfuehrung.html)
- [Datenschutz](https://igelsbacher.github.io/physioclock/de/datenschutz.html)

Alle Inhalte werden auf Deutsch, Englisch, Französisch und Italienisch aus
`scripts/timer-content.mjs` erzeugt. Die PDF-Handbücher stehen unter `downloads/`.
Die Rechtstexte werden aus der aktuellen App-Dokumentfassung unter
`legal/current-documents.json` erzeugt; historische Fassungen bleiben erhalten.

```sh
node scripts/generate-neutral-site.mjs
python3 scripts/generate-timer-pdfs.py
node scripts/check-website-links.mjs
node scripts/check-current-version.mjs
```
