import { describe, expect, it } from "vitest";
import { BlackFridayDiscount } from "../src/discounts/blackFridayDiscount";
import { BulkDiscount } from "../src/discounts/bulkDiscount";
import { CustomerTypeDiscount } from "../src/discounts/customerTypeDiscount";
import { PriceCalculator } from "../src/priceCalculator";
import { makeOrder } from "./fakes";

const standardCalculator = () => new PriceCalculator([new CustomerTypeDiscount(), new BulkDiscount()]);

describe("PriceCalculator (gleiche Fälle wie im Startcode)", () => {
  it("Regulärer Kunde DE, kleine Bestellung: Versandkosten, keine Rabatte", () => {
    expect(standardCalculator().calculate(makeOrder())).toMatchObject({
      subtotalCents: 2000, discountCents: 0, netCents: 2000,
      vatCents: 380, shippingCents: 499, totalCents: 2879,
    });
  });

  it("Premium DE, 600 EUR: 10 % + 5 % Mengenrabatt, kein Versand", () => {
    const items = [{ sku: "B-1", name: "Teuer", unitPriceCents: 60000, quantity: 1 }];
    expect(standardCalculator().calculate(makeOrder({ customerType: "premium", items }))).toMatchObject({
      subtotalCents: 60000, discountCents: 9000, netCents: 51000,
      vatCents: 9690, shippingCents: 0, totalCents: 60690,
    });
  });

  it("Student AT: 5 % Rabatt, 20 % MwSt., versandkostenfrei ab 50 EUR netto", () => {
    const items = [{ sku: "C-1", name: "Buch", unitPriceCents: 2000, quantity: 3 }];
    expect(standardCalculator().calculate(makeOrder({ customerType: "student", country: "AT", items }))).toMatchObject({
      discountCents: 300, netCents: 5700, vatCents: 1140, shippingCents: 0, totalCents: 6840,
    });
  });

  it("Schweiz: 8,1 % MwSt. und pauschal 14,99 EUR Versand", () => {
    const items = [{ sku: "D-1", name: "Uhr", unitPriceCents: 10000, quantity: 1 }];
    expect(standardCalculator().calculate(makeOrder({ country: "CH", items }))).toMatchObject({
      netCents: 10000, vatCents: 810, shippingCents: 1499, totalCents: 12309,
    });
  });
});

describe("OCP: neue Rabattregel ohne Änderung bestehender Klassen", () => {
  it("Black Friday gibt 10 % zusätzlich, solange aktiv", () => {
    const calculator = new PriceCalculator([
      new CustomerTypeDiscount(),
      new BulkDiscount(),
      new BlackFridayDiscount(() => true),
    ]);
    expect(calculator.calculate(makeOrder())).toMatchObject({
      discountCents: 200, netCents: 1800, vatCents: 342, shippingCents: 499, totalCents: 2641,
    });
  });

  it("Black Friday wirkt nicht, wenn inaktiv", () => {
    const calculator = new PriceCalculator([new BlackFridayDiscount(() => false)]);
    expect(calculator.calculate(makeOrder()).discountCents).toBe(0);
  });
});
