import { describe, expect, it } from "vitest";
import { BulkDiscount } from "../src/discounts/bulkDiscount";
import { CustomerTypeDiscount } from "../src/discounts/customerTypeDiscount";
import { OrderService } from "../src/orderService";
import { OrderValidator } from "../src/orderValidator";
import { PriceCalculator } from "../src/priceCalculator";
import { FakeNotifier, InMemoryOrderRepository, SilentLogger, makeOrder } from "./fakes";

// Das Problem aus der Überleitung ist gelöst: placeOrder() ist ohne DB und ohne Mailserver testbar.

function setup() {
  const repository = new InMemoryOrderRepository();
  const notifier = new FakeNotifier();
  const service = new OrderService(
    new OrderValidator(),
    new PriceCalculator([new CustomerTypeDiscount(), new BulkDiscount()]),
    repository,
    notifier,
    new SilentLogger(),
  );
  return { service, repository, notifier };
}

describe("OrderService.placeOrder", () => {
  it("speichert die Bestellung, benachrichtigt den Kunden und liefert den Beleg", () => {
    const { service, repository, notifier } = setup();

    const receipt = service.placeOrder(makeOrder());

    expect(receipt.totalCents).toBe(2879);
    expect(repository.saved).toHaveLength(1);
    expect(repository.saved[0]?.receipt).toEqual(receipt);
    expect(notifier.confirmations).toEqual(["T-1"]);
  });

  it("speichert und benachrichtigt NICHT, wenn die Bestellung ungültig ist", () => {
    const { service, repository, notifier } = setup();

    expect(() => service.placeOrder(makeOrder({ items: [] }))).toThrow(/Ungültige Bestellung/);

    expect(repository.saved).toHaveLength(0);
    expect(notifier.confirmations).toHaveLength(0);
  });
});
