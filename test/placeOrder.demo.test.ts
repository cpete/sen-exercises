import { expect, it } from "vitest";
import { OrderService } from "../src/orderService";

// ÜBERLEITUNG ZU BLOCK 2:  npm run test:demo
// Dieser Test ist vollkommen vernünftig formuliert und scheitert trotzdem,
// weil placeOrder() selbst `new MySqlConnection()` und `new SmtpMailer()` aufruft.
it("placeOrder speichert und liefert einen Beleg", () => {
  const service = new OrderService();
  const receipt = service.placeOrder({
    id: "T-42",
    customerEmail: "kunde@example.com",
    customerType: "regular",
    country: "DE",
    items: [{ sku: "A-1", name: "Artikel", unitPriceCents: 1000, quantity: 2 }],
  });
  expect(receipt.totalCents).toBe(2879);
});
