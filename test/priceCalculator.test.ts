import { describe, expect, it } from "vitest";
import { createOrderItem, type OrderItem } from "../src/orderItem";
import { calculateTotal } from "../src/priceCalculator";
import type { CustomerType, ShippingOption } from "../src/types";

interface PriceCase {
  description: string;
  customerType: CustomerType;
  shippingOption: ShippingOption;
  items: OrderItem[];
  expectedTotal: number;
}

/** Dieselben fachlichen Fälle wie die Charakterisierungstests, jetzt gegen die neue API. */
const cases: PriceCase[] = [
  {
    description: "Normalkunde zahlt Versand unter 30 €",
    customerType: "regular",
    shippingOption: "standard",
    items: [createOrderItem("Buch", 12.5, 2)],
    expectedTotal: 29.95,
  },
  {
    description: "versandkostenfrei: keine Versandkosten",
    customerType: "regular",
    shippingOption: "free",
    items: [createOrderItem("Buch", 12.5, 2)],
    expectedTotal: 25.0,
  },
  {
    description: "Gold-Kunde erhält 10 % über 100 €",
    customerType: "gold",
    shippingOption: "standard",
    items: [createOrderItem("Monitor", 120, 1)],
    expectedTotal: 108.0,
  },
  {
    description: "Gold-Kunde erhält bei genau 100 € keinen Rabatt",
    customerType: "gold",
    shippingOption: "standard",
    items: [createOrderItem("Drucker", 100, 1)],
    expectedTotal: 100.0,
  },
  {
    description: "Premium-Kunde erhält 5 % bis einschließlich 50 €",
    customerType: "premium",
    shippingOption: "standard",
    items: [createOrderItem("Kabel", 10, 4)],
    expectedTotal: 38.0,
  },
  {
    description: "Premium-Kunde erhält 15 % über 50 €",
    customerType: "premium",
    shippingOption: "standard",
    items: [createOrderItem("Maus", 30, 2)],
    expectedTotal: 51.0,
  },
  {
    description: "Mengenbonus von 5 € ab 11 Artikeln",
    customerType: "regular",
    shippingOption: "standard",
    items: [createOrderItem("Stift", 1, 12)],
    expectedTotal: 11.95,
  },
  {
    description: "kein Mengenbonus bei 10 Artikeln",
    customerType: "regular",
    shippingOption: "standard",
    items: [createOrderItem("Stift", 1, 10)],
    expectedTotal: 14.95,
  },
];

describe("calculateTotal", () => {
  it.each(cases)(
    "$description",
    ({ items, customerType, shippingOption, expectedTotal }) => {
      expect(calculateTotal(items, customerType, shippingOption)).toBeCloseTo(
        expectedTotal,
        2,
      );
    },
  );
});

describe("createOrderItem", () => {
  it("lehnt ungültige Positionen sofort ab", () => {
    expect(() => createOrderItem("Ohne Menge", 10, 0)).toThrow(RangeError);
    expect(() => createOrderItem("Gratis", 0, 1)).toThrow(RangeError);
    expect(() => createOrderItem("Defekt", Number.NaN, 1)).toThrow(RangeError);
  });
});
