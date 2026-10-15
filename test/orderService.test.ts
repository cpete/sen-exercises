import { describe, expect, it } from "vitest";
import { OrderService } from "../src/orderService";
import type { Order } from "../src/order";

// Sicherheitsnetz für das Refactoring: Diese Tests brauchen weder DB noch Mailserver.

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

describe("Validierung", () => {
  it("akzeptiert eine gültige Bestellung", () => {
    expect(new OrderService().validate(makeOrder())).toEqual([]);
  });

  it("lehnt eine ungültige E-Mail-Adresse ab", () => {
    const errors = new OrderService().validate(makeOrder({ customerEmail: "keine-mail" }));
    expect(errors).toContain("E-Mail-Adresse ungültig");
  });

  it("lehnt eine Bestellung ohne Positionen ab", () => {
    const errors = new OrderService().validate(makeOrder({ items: [] }));
    expect(errors).toContain("Bestellung enthält keine Positionen");
  });

  it("lehnt Menge 0 ab", () => {
    const items = [{ sku: "A-1", name: "Artikel", unitPriceCents: 1000, quantity: 0 }];
    const errors = new OrderService().validate(makeOrder({ items }));
    expect(errors).toContain("Ungültige Menge bei A-1");
  });
});

describe("Preisberechnung", () => {
  it("Regulärer Kunde DE, kleine Bestellung: Versandkosten, keine Rabatte", () => {
    const r = new OrderService().calculate(makeOrder());
    expect(r).toMatchObject({
      subtotalCents: 2000, discountCents: 0, netCents: 2000,
      vatCents: 380, shippingCents: 499, totalCents: 2879,
    });
  });

  it("Premium DE, 600 EUR: 10 % + 5 % Mengenrabatt, kein Versand", () => {
    const items = [{ sku: "B-1", name: "Teuer", unitPriceCents: 60000, quantity: 1 }];
    const r = new OrderService().calculate(makeOrder({ customerType: "premium", items }));
    expect(r).toMatchObject({
      subtotalCents: 60000, discountCents: 9000, netCents: 51000,
      vatCents: 9690, shippingCents: 0, totalCents: 60690,
    });
  });

  it("Student AT: 5 % Rabatt, 20 % MwSt., versandkostenfrei ab 50 EUR netto", () => {
    const items = [{ sku: "C-1", name: "Buch", unitPriceCents: 2000, quantity: 3 }];
    const r = new OrderService().calculate(makeOrder({ customerType: "student", country: "AT", items }));
    expect(r).toMatchObject({
      discountCents: 300, netCents: 5700, vatCents: 1140, shippingCents: 0, totalCents: 6840,
    });
  });

  it("Schweiz: 8,1 % MwSt. und pauschal 14,99 EUR Versand", () => {
    const items = [{ sku: "D-1", name: "Uhr", unitPriceCents: 10000, quantity: 1 }];
    const r = new OrderService().calculate(makeOrder({ country: "CH", items }));
    expect(r).toMatchObject({ netCents: 10000, vatCents: 810, shippingCents: 1499, totalCents: 12309 });
  });
});

describe("placeOrder", () => {
  it("weist eine ungültige Bestellung ab, bevor irgendetwas gespeichert wird", () => {
    expect(() => new OrderService().placeOrder(makeOrder({ items: [] }))).toThrow(/Ungültige Bestellung/);
  });
});
