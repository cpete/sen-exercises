# HSBI Software Engineering – Vorlesung 5

## Phase 1 · Analyse des Ausgangscodes

Untersucht wurde [`software-design-god-class` bei `e748b29`](https://github.com/cpete/sen-exercises/tree/e748b299772ebe6a1e7e670272aaaae2c7c00432). Die Zeilenangaben in diesem Abschnitt beziehen sich auf diesen Stand.

Das Projekt verwendet TypeScript auf Node.js mit ESM, ES2022 und strikter Typprüfung. Es hat keine deklarierten Produktionsabhängigkeiten. Die Entwicklungsabhängigkeiten sind TypeScript `^5.6.0`, `tsx ^4.19.0`, Vitest `^2.1.0` und `@types/node ^22.0.0`. Das Lockfile fixiert sie auf 5.9.3, 4.23.15, 2.1.9 und 22.20.5. MySQL und SMTP sind simulierte Adapter. [package.json](https://github.com/cpete/sen-exercises/blob/e748b299772ebe6a1e7e670272aaaae2c7c00432/package.json)

| Befehl | Ergebnis im Ausgangsstand |
| --- | --- |
| `npm ci` | Installation aus dem Lockfile. |
| `npm test` | 9 von 9 Tests bestanden. Die Standardkonfiguration schließt die Demo aus. |
| `npm run test:demo` | Ohne `DB_HOST` fehlgeschlagen. `src/db.ts:8` wirft `ECONNREFUSED`, bevor der Mailer erreicht wird. Der Fehler ist laut `vitest.demo.config.ts:3` beabsichtigt. |
| `npm run typecheck` | Bestanden. |
| `npm start` | Erfolgreiche Demo mit simulierten Hosts. Der Beleg für `B-1001` weist 22.994 Cent aus. |

### Concerns in `OrderService`

| Anliegen | Codezeile oder Methode | Änderungsgrund |
| --- | --- | --- |
| Bestelldaten validieren | `validate()`, Z. 14–38 | Pflichtfelder, E-Mail-Regel, zulässige Positionswerte oder Fehlermeldungen ändern sich. |
| Warenwert berechnen | `calculate()`, Z. 40–44 | Berechnungsgrundlage der Positionen ändert sich. |
| Rabatte und Nettobetrag berechnen | `calculate()`, Z. 46–59 | Kundentypen, Rabattstaffel, Schwellenwert oder Rundung ändern sich. |
| Mehrwertsteuer berechnen | `calculate()`, Z. 61–70 | Steuersätze, Länder oder Bemessungsgrundlage ändern sich. |
| Versand berechnen | `calculate()`, Z. 72–78 | Pauschalen, Versandzonen oder Freigrenze ändern sich. |
| Beleg erstellen | `calculate()`, Z. 80–88 | Belegfelder oder Zusammensetzung des Gesamtbetrags ändern sich. |
| Bestellung und Positionen speichern | `placeOrder()`, Z. 102–113 | Datenbankadapter, Tabellenschema oder Schreibstrategie ändern sich. |
| Bestätigung versenden | `placeOrder()`, Z. 115–121 | Empfänger, Text, Betragsformat oder Versandkanal ändern sich. |
| Ablauf steuern und Validierungsfehler weitergeben | `placeOrder()`, Z. 91–100, 103–126 | Reihenfolge der Schritte oder Fehlerverhalten ändern sich. |
| Ablauf protokollieren | `placeOrder()`, Z. 92, 96 und 125 | Ereignisse, Logformat oder Logziel ändern sich. |
| Letzten Beleg und Mailzähler verwalten | Z. 10–12 und `placeOrder()`, Z. 122–124 | Zustandsmodell oder Zeitpunkt der Fortschreibung ändern sich. |

[Ursprünglicher OrderService](https://github.com/cpete/sen-exercises/blob/e748b299772ebe6a1e7e670272aaaae2c7c00432/src/orderService.ts#L9-L128)

### Auswirkungen eines Treuebonus

- Für einen zusätzlichen Preisnachlass liegt die zentrale Änderung im Rabattblock von `calculate()` (Z. 46–59). Zu klären sind Anspruch, Höhe, Schwelle, Kombination mit bestehenden Rabatten und Rundung. Ein vor der Steuer angewendeter Bonus ändert den Nettobetrag und damit die MwSt., gegebenenfalls die Versandkosten und den Gesamtbetrag.
- Falls die Berechtigung neue Kundendaten erfordert, kommt das Feld in `src/order.ts` zu `Order`. `validate()` (Z. 14–38) ist betroffen, sofern für das Feld eine Eingaberegel gilt. Falls der Anspruch aus der Bestellhistorie stammt, braucht der Ablauf zusätzlich eine Datenquelle vor der Preisberechnung.
- Wenn `Receipt.discountCents` den gesamten Rabatt enthält, übernehmen SQL und Bestätigung den geänderten Gesamtbetrag bereits über `totalCents`. Bei separatem Bonusausweis kommt ein Feld in `Receipt` und in die Belegerstellung (Z. 80–88). SQL/Schema (Z. 103–113) und Mailtext (Z. 117–121) sind betroffen, sofern sie den Bonus separat speichern oder anzeigen sollen.
- Die fachlichen Tests in `test/orderService.test.ts` wären um Anspruchsgrenze, Kombination mit bestehenden Rabatten und Auswirkungen auf Steuern und Versandfreigrenze zu ergänzen, sobald die Regeln feststehen.

### Code Smells

- **God Class / Divergent Change.** Fachregeln, Infrastruktur und Ablauf haben verschiedene Änderungsgründe und liegen in derselben Klasse.
- **Long Method.** `placeOrder()` bündelt Ablauf, SQL, Mailtext, Logging und Zustandsänderungen. `calculate()` bündelt Rabatt-, Steuer- und Versandregeln.
- **Enge Kopplung an konkrete Infrastruktur.** `placeOrder()` erzeugt MySQL- und SMTP-Adapter direkt. Der Erfolgsfall ist damit an die simulierten Host-Einstellungen gebunden.
- **Öffentlich veränderlicher Zustand.** Aufrufer können `lastReceipt` und `sentMails` überschreiben. Damit lässt sich der Ablaufzustand von außen verändern.
- **Magic Numbers.** Schwellenwerte und Pauschalen wie `50000`, `5000`, `499` und `1499` stehen direkt in den Regeln.
- **SQL per Stringverkettung.** ID, E-Mail und SKU werden ohne Maskierung in SQL-Stringliterale eingesetzt. Apostrophe in diesen Werten können die SQL-Syntax verändern.

[Ursprünglicher OrderService](https://github.com/cpete/sen-exercises/blob/e748b299772ebe6a1e7e670272aaaae2c7c00432/src/orderService.ts#L9-L128)

## Phase 2 · Refactoring

Abgabebranch `refactor/order-service-concerns`, ausgehend von `software-design-god-class` bei `e748b29`.

| Commit | Änderung | Prüfung vor dem Commit |
| --- | --- | --- |
| `e6b4872` | `OrderValidator` extrahiert | Standardtests 9/9, Typprüfung, Demo 1/1 mit simulierten Hosts |
| `dd6ace1` | `PriceCalculator` extrahiert | Standardtests 9/9, Typprüfung, Demo 1/1 mit simulierten Hosts |
| `c32e367` | `OrderRepository` extrahiert | Standardtests 9/9, Typprüfung, Demo 1/1 mit simulierten Hosts |
| `d7cf49a` | `NotificationService` extrahiert | Standardtests 9/9, Typprüfung, Demo 1/1 mit simulierten Hosts |

### Schnittstellen, Implementierung, Kohäsion und Kopplung

Die Kopplungsbewertung bezieht sich auf die direkten Abhängigkeiten des jeweiligen Moduls. Die Typen `Order` und `Receipt` kommen aus `src/order.ts`.

| Modul | Öffentliche Schnittstelle | Private Implementierung | Kohäsion | Kopplung |
| --- | --- | --- | --- | --- |
| `OrderValidator` | `validate(order: Order): string[]` | Prüft Bestellkopf und Positionen und sammelt Fehlermeldungen in definierter Reihenfolge. Die Regeln und Meldungen liegen im Methodenkörper. | **hoch**. Alle Prüfungen beantworten dieselbe Frage nach der Gültigkeit der Bestellung. | **niedrig**. Hängt nur vom Typ `Order` ab. |
| `PriceCalculator` | `calculate(order: Order): Receipt` | Berechnet Warenwert, Rabatt, Netto, MwSt. und Versand und erzeugt den Beleg. Schwellenwerte, Beträge und Rundung liegen im Methodenkörper. | **hoch**. Die Berechnungsschritte tragen gemeinsam zum Beleg und Gesamtbetrag bei. | **niedrig**. Verwendet die Datentypen `Order` und `Receipt` ohne Laufzeitabhängigkeit auf andere Projektmodule. |
| `OrderRepository` | `save(order, receipt): void`. Eingaben sind `id`, `customerEmail`, `items` und `totalCents`. | Erzeugt die Verbindung beim Speichern, schreibt zuerst die Bestellung und anschließend je ein SQL-Statement pro Position. | **hoch**. Alle Statements speichern Teile derselben Bestellung. | **mittel**. Die Schnittstelle verbirgt den Datenbankadapter. Die Implementierung hängt von `MySqlConnection`, dem SQL-Schema und indirekt von `DB_HOST` ab. |
| `NotificationService` | `sendOrderConfirmation(order, receipt): void`. Eingaben sind `id`, `customerEmail` und `totalCents`. | Erzeugt den Mailer erst beim Versand, baut Betreff und Text, formatiert den Betrag in EUR und versendet die Nachricht. | **hoch**. Inhalt, Format und Versand dienen derselben Bestellbestätigung. | **mittel**. Die Schnittstelle verbirgt den SMTP-Adapter. Die Implementierung hängt von `SmtpMailer` und indirekt von `SMTP_HOST` ab. |
| `OrderService` | `new OrderService()`, `validate(order): string[]`, `calculate(order): Receipt`, `placeOrder(order): Receipt` sowie die schreibbaren Felder `lastReceipt` und `sentMails`. | Hält die vier Helfer in privaten Feldern. `placeOrder()` delegiert und steuert Reihenfolge, Logging, Fehlerweitergabe und Zustandsfortschreibung. | **hoch**. Die verbleibenden Aufgaben koordinieren denselben Bestellvorgang. | **mittel**. Der Ablauf hängt von vier konkreten Klassen und der Reihenfolge ihrer Aufrufe ab. Die Abhängigkeit verläuft vom Koordinator zu den Hilfsmodulen. |

Die vier Module verwenden schmale Methoden und einfache Komposition. `OrderService` erstellt die Module selbst. `OrderRepository` und `NotificationService` erstellen die Infrastrukturadapter bei der jeweiligen Operation, sodass Verbindungsfehler weiterhin zum selben Zeitpunkt im Bestellablauf auftreten.

Ein Vergleich mit dem Ausgangsstand ergab gleiche Ergebnisse für 90 Preiskombinationen, die Reihenfolge mehrerer Validierungsfehler und fünf Bestellabläufe. Verglichen wurden Belege, Fehlertypen und -meldungen, Log-/SQL-/Mail-Ausgaben und öffentlicher Zustand. Darunter waren der Erfolgsfall sowie fehlende DB- und SMTP-Konfiguration. `npm start` lieferte weiterhin 22.994 Cent für `B-1001`. Die SQL-Verkettung und die konkreten Infrastrukturadapter sind Teil der verschobenen Implementierung.

Für einen späteren Treuebonus ist `PriceCalculator` der Einstiegspunkt für die Rabattregel. Wenn der Bonus weitere Eingaben oder einen separaten Ausweis benötigt, sind die in Phase 1 genannten Schnittstellen betroffen.

### Prüfung der Abgabe

Nach `npm ci` lassen sich die Standardtests mit `npm test` und die Typprüfung mit `npm run typecheck` ausführen. Für den erfolgreichen Demotest müssen `DB_HOST` und `SMTP_HOST` gesetzt sein. Die Adapter verwenden diese Werte als Schalter für die Simulation.

```powershell
$env:DB_HOST = 'demo-db'
$env:SMTP_HOST = 'demo-smtp'
npm run test:demo
```

Erwartet werden 9 bestandene Standardtests, eine erfolgreiche Typprüfung und 1 bestandener Demotest mit diesen Einstellungen. Beim Start in einer Umgebung ohne `DB_HOST` demonstriert derselbe Test den dokumentierten `ECONNREFUSED`-Fehler.
