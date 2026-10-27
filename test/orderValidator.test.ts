import { describe, expect, it } from "vitest";
import { OrderValidator } from "../src/orderValidator";
import { makeOrder } from "./fakes";

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
