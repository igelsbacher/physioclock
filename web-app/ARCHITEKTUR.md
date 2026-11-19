# PhysioClock Web – Architektur und sichere Synchronisation

Stand: 18. November 2026. Status: **Web-App mit lokaler Datenspeicherung veröffentlicht; Cloud-Synchronisation NICHT bereitgestellt.**

## Aktueller Stand

- Host: GitHub Pages, Repository `igelsbacher/physioclock`, Web-App unter `/web-app/index.html`.
- Daten des Browsers: `localStorage`-Schlüssel `pcweb.sets`, `pcweb.v2`, `pcweb.lang`.
- 100 Übungen und vier Sprachen aus `PhysioClock/Catalog100.json` des vom Projektinhaber hochgeladenen iOS-Builds; die Web-Katalogdatei enthält nur Übungs-ID, Bereich und lokalisierte Bezeichnung.
- Trainingsverlauf, Wochenziel, Befindensprotokoll, Wochenplan und JSON-Export/-Import.
- Keine Web-Accounts, keine serverseitige Datenbank, keine Kaufvalidierung, keine automatische Synchronisation. Dies ist eine statische Web-App und keine installierte native iOS-App.
- **Sicherheitshinweis:** GitHub Pages ist öffentlich. Niemals persönliche Trainingsdaten, Zugangstoken, Authentifizierungsgeheimnisse oder App-Store-Schlüssel dort ablegen.

## Was vor einer echten Synchronisation zwingend erforderlich ist

1. **Hosting und Identität:** Azure App Service / Static Web Apps für die Web-Oberfläche, HTTPS-only, authentifizierte Endpunkte, Microsoft Entra External ID oder andere geeignete OIDC-Identität. Kein Vertrauen auf eine nur im Browser gespeicherte Benutzer-ID.
2. **Speicher:** Azure Cosmos DB oder Azure SQL, mit eindeutiger Benutzerpartition und serverseitiger Zugriffskontrolle. Verschlüsselung in Übertragung und im Ruhezustand, Backup und Löschkonzept. Bevorzugte Region: Schweiz, sofern für eingesetzte Dienste verfügbar, sonst rechtskonform geprüfter Standort.
3. **API:** versionierte Endpunkte `GET /api/v1/me/state`, `PUT /api/v1/me/state` mit ETag/If-Match, `DELETE /api/v1/me/state`, `GET /api/v1/me/export`; Authentifizierung pro Request, Begrenzung der Datenmenge und Eingabevalidierung. `userId` ausschliesslich aus verifiziertem Token, niemals aus Request-Payload.
4. **Konfliktstrategie:** pro Element stabile UUID, Aktualisierungszeit, Tombstones für Löschungen, serverseitige ETag-Version und 409/412 bei Konflikten. Kein stilles Überschreiben von Trainingsverlauf, Zielwerten und Befinden.
5. **iOS-Anpassung:** Native SwiftUI-App benötigt denselben Login und einen expliziten Sync-Adapter. Vorhandene iCloud-Synchronisation und neuer Azure-Sync dürfen nicht gleichzeitig unkontrolliert auf denselben Datenbestand schreiben. Datenmigration und Duplikatsprüfung sind nötig.
6. **Apple-Käufe:** Nicht durch einen Browser-Flag freischalten. StoreKit-Transaktionen bzw. App Store Server API mit serverseitig validiertem Transaktionsnachweis; bestehende lebenslange Einmalkäufe `ch.personal.physioclock.plus` weiter anerkennen; Jahresabo `ch.personal.physioclock.premium.yearly` mit Status/Verfall/Widerruf prüfen. Die Identität muss mit der verifizierten Berechtigung verknüpft werden.
7. **Recht/Datenschutz:** Datenschutzinformation für Benutzerkonten, Cloud-Speicherung, Datenkategorien, Aufbewahrungsfristen, Auskunft/Löschung, AV-Verträge, Zugriffsprotokolle ohne sensible Trainingsinhalte, Cookie- und Consent-Prüfung nach tatsächlichem Einsatz. Schweizer DSG und gegebenenfalls DSGVO prüfen.
8. **Tests und Freigabe:** Autorisierung über Benutzergrenzen, Token-Ablauf, Replay, Widerruf, Offline-Handling, Mehrgeräte-Konflikte, Datenlöschung, Abonnement-Ablauf, Import/Export, Bildschirmgrössen, barrierefreie Bedienung und Xcode/TestFlight. Danach erst produktiv umstellen.

## Datenformat lokal

JSON-Export `format: "physioclock-web-backup"`, `version: 2`, `sets`, `progress`.
Die lokale Exportdatei kann Gesundheits- bzw. Befindensangaben enthalten. Nutzer sollen sie geschützt aufbewahren und nicht in ein öffentliches GitHub-Repository einchecken. Import ist nur für das Web-Backupformat implementiert, **nicht** für das native iOS-iCloud-Datenmodell.

## Abgrenzung und nächste Lieferung

Die Web-App ist derzeit eine öffentlich aufrufbare, lokal speichernde Trainingsoberfläche. Benutzerkonto, Azure-API, gesicherte Cloud-Datenbank, StoreKit-/Server-Entitlement-Brücke und iOS-Sync-Adapter sind **nicht** bereitgestellt. Vor deren Implementierung sind Azure-Tenant/Subscription, Domain, Hosting-Berechtigung, Identitätsentscheidung und iOS-Testumgebung erforderlich. Keine Zugangsdaten in diesem Dokument hinterlegen.
