# Timer 2.0 - Build 01

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

## Web-App

- [Timer Web (DE)](https://igelsbacher.github.io/physioclock/web-app/index.html?lang=de)
- Übungskatalog mit 100 lokalisierten Übungen aus der iOS-App-Datei `Catalog100.json`.
- Trainingstimer, eigene Trainingssets, Wochenplan, Verlauf, Wochenziel, Befinden und JSON-Backup.
- Derzeit nur lokale Browserdaten; **keine** aktive Cloud-Synchronisation und **keine** serverseitige Kaufprüfung.
- [Architektur und Sicherheitsanforderungen für Azure-/iOS-Synchronisation](web-app/ARCHITEKTUR.md).

Die neue Web-App ergänzt die vorhandenen Hilfeseiten. Für eine geschützte Nutzung mit echten Benutzerkonten und Premium-Zugang ist ein Backend ausserhalb von GitHub Pages erforderlich.
