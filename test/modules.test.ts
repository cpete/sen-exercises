import { describe, expect, it } from "vitest";
import type { Order } from "../src/order";
import { OrderValidator } from "../src/orderValidator";
import { PriceCalculator } from "../src/priceCalculator";

// Dieselben Fälle wie im Startcode, jetzt aber gegen die einzelnen Module.

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "T-1",
    customerEmail: "kunde@example.com",
    customerType: "regular",
    country: "DE",
    items: [{ sku: "A-1", name: "Artikel", unitPriceCents: 1000, quantity: 2 }],
    ...overrides,
  };
}

describe("OrderValidator", () => {
  const validator = new OrderValidator();

  it("akzeptiert eine gültige Bestellung", () => {
    expect(validator.validate(makeOrder())).toEqual([]);
  });

  it("lehnt eine ungültige E-Mail-Adresse ab", () => {
    expect(validator.validate(makeOrder({ customerEmail: "keine-mail" }))).toContain("E-Mail-Adresse ungültig");
  });

  it("lehnt eine Bestellung ohne Positionen ab", () => {
    expect(validator.validate(makeOrder({ items: [] }))).toContain("Bestellung enthält keine Positionen");
  });

  it("lehnt Menge 0 ab", () => {
    const items = [{ sku: "A-1", name: "Artikel", unitPriceCents: 1000, quantity: 0 }];
    expect(validator.validate(makeOrder({ items }))).toContain("Ungültige Menge bei A-1");
  });
});

describe("PriceCalculator", () => {
  const calculator = new PriceCalculator();

  it("Regulärer Kunde DE, kleine Bestellung: Versandkosten, keine Rabatte", () => {
    expect(calculator.calculate(makeOrder())).toMatchObject({
      subtotalCents: 2000, discountCents: 0, netCents: 2000,
      vatCents: 380, shippingCents: 499, totalCents: 2879,
    });
  });

  it("Premium DE, 600 EUR: 10 % + 5 % Mengenrabatt, kein Versand", () => {
    const items = [{ sku: "B-1", name: "Teuer", unitPriceCents: 60000, quantity: 1 }];
    expect(calculator.calculate(makeOrder({ customerType: "premium", items }))).toMatchObject({
      subtotalCents: 60000, discountCents: 9000, netCents: 51000,
      vatCents: 9690, shippingCents: 0, totalCents: 60690,
    });
  });

  it("Student AT: 5 % Rabatt, 20 % MwSt., versandkostenfrei ab 50 EUR netto", () => {
    const items = [{ sku: "C-1", name: "Buch", unitPriceCents: 2000, quantity: 3 }];
    expect(calculator.calculate(makeOrder({ customerType: "student", country: "AT", items }))).toMatchObject({
      discountCents: 300, netCents: 5700, vatCents: 1140, shippingCents: 0, totalCents: 6840,
    });
  });

  it("Schweiz: 8,1 % MwSt. und pauschal 14,99 EUR Versand", () => {
    const items = [{ sku: "D-1", name: "Uhr", unitPriceCents: 10000, quantity: 1 }];
    expect(calculator.calculate(makeOrder({ country: "CH", items }))).toMatchObject({
      netCents: 10000, vatCents: 810, shippingCents: 1499, totalCents: 12309,
    });
  });
});
