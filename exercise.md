## Übung - Refactoring

Die Datei `src/orderMgr.ts` berechnet den Endpreis einer Bestellung in einem Online-Shop.
Sie funktioniert, ist aber schwer zu lesen und zu ändern. Die Tests in `test/orderMgr.test.ts`
halten das aktuelle Verhalten fest (Charakterisierungstests).

**Fachliche Regeln** (so wie der Code sie heute umsetzt):

| Regel | Wert |
|---|---|
| Gold-Kunde (`"G"`) | 10 % Rabatt, wenn der Warenwert **über** 100 € liegt |
| Premium-Kunde (`"P"`) | 15 % Rabatt über 50 €, sonst 5 % |
| Versandkosten | 4,95 €, wenn der Betrag nach Rabatt unter 30 € liegt und kein versandkostenfreier Versand gewählt ist |
| Mengenbonus | 5 € Abzug ab 11 Artikeln |
| Ungültige Positionen | werden ignoriert |

## Aufgabe: Refactoring in kleinen Schritten

1. Startet die Tests im Watch-Modus: `npm run test:watch`. Alle Tests müssen grün sein.
2. Verbessert den Code **Schritt für Schritt**. Nach **jedem** Schritt müssen die Tests grün bleiben.
3. Ändert die Signaturen von `calc` und `save` zunächst **nicht**, damit die Tests weiterlaufen.

Empfohlene Reihenfolge:

- [ ] Variablen umbenennen (`r`, `c`, `x`, `p`, `q` …), in VS Code mit `F2` (*Rename Symbol*)
- [ ] `var` durch `const` / `let` ersetzen, `==` durch `===`
- [ ] Magic Numbers durch benannte Konstanten ersetzen
- [ ] Nutzlose und falsche Kommentare entfernen oder korrigieren
- [ ] Verschachtelte `if`-Blöcke vereinfachen
- [ ] Teilberechnungen in eigene Funktionen auslagern (*Refactor… → Extract to function*)
- [ ] Das leere `catch` ersetzen: Welche Fehler können auftreten? Was soll dann passieren?

## Bonus (für Schnelle)

- Ersetzt `any[]` durch ein Interface `OrderItem` und den Kundentyp-String durch einen Union Type.
- Ersetzt das Flag-Argument `f: boolean` durch einen aussagekräftigen Typ.
- Ersetzt die Fehlercodes `-1` und `-2` durch Exceptions und passt die Tests an.
- Diskussion: Ist `number` (Gleitkommazahl) der richtige Typ für Geldbeträge?