import { beforeEach, describe, expect, it, vi } from "vitest";
import { calc, d, save } from "../src/orderMgr";

/**
 * Charakterisierungstests: Sie halten das AKTUELLE Verhalten von orderMgr fest.
 * Sie müssen vor UND nach jedem Refactoring-Schritt grün sein.
 *
 * Position   = [Name, Einzelpreis, Menge]   (alles als String)
 * Kundentyp  = "N" normal | "G" Gold | "P" Premium
 * Letzter Parameter: true = versandkostenfrei
 */

beforeEach(() => {
  d.length = 0;
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("calc", () => {
  it("Normalkunde zahlt Versand unter 30 €", () => {
    expect(calc([["Buch", "12.50", "2"]], "N", false)).toBeCloseTo(29.95, 2);
  });

  it("versandkostenfrei: keine Versandkosten", () => {
    expect(calc([["Buch", "12.50", "2"]], "N", true)).toBeCloseTo(25.0, 2);
  });

  it("Gold-Kunde erhält 10 % über 100 €", () => {
    expect(calc([["Monitor", "120.00", "1"]], "G", false)).toBeCloseTo(108.0, 2);
  });

  it("Gold-Kunde erhält bei genau 100 € keinen Rabatt", () => {
    expect(calc([["Drucker", "100.00", "1"]], "G", false)).toBeCloseTo(100.0, 2);
  });

  it("Premium-Kunde erhält 5 % bis einschließlich 50 €", () => {
    expect(calc([["Kabel", "10.00", "4"]], "P", false)).toBeCloseTo(38.0, 2);
  });

  it("Premium-Kunde erhält 15 % über 50 €", () => {
    expect(calc([["Maus", "30.00", "2"]], "P", false)).toBeCloseTo(51.0, 2);
  });

  it("ungültige Positionen werden ignoriert", () => {
    const items = [
      ["Defekt", "abc", "1"],
      ["Ohne Menge", "10.00", "0"],
      null,
      ["Tasse", "20.00", "1"],
    ];
    expect(calc(items, "N", true)).toBeCloseTo(20.0, 2);
  });

  it("Mengenbonus von 5 € ab 11 Artikeln", () => {
    // 12 × 1,00 € = 12,00 € + 4,95 € Versand − 5,00 € Bonus
    expect(calc([["Stift", "1.00", "12"]], "N", false)).toBeCloseTo(11.95, 2);
  });

  it("kein Mengenbonus bei 10 Artikeln", () => {
    expect(calc([["Stift", "1.00", "10"]], "N", false)).toBeCloseTo(14.95, 2);
  });
});

describe("save", () => {
  it("ohne Liste liefert -1", () => {
    expect(save(null, "N", false)).toBe(-1);
  });

  it("mit leerer Liste liefert -2", () => {
    expect(save([], "N", false)).toBe(-2);
  });

  it("legt die Bestellung mit Endpreis ab", () => {
    expect(save([["Monitor", "120.00", "1"]], "G", false)).toBe(0);
    expect(d).toHaveLength(1);
    expect(d[0][1]).toBeCloseTo(108.0, 2);
  });
});
