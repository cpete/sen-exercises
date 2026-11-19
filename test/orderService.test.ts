import { describe, expect, it } from "vitest";
import { createOrderItem } from "../src/orderItem";
import { InMemoryOrderRepository } from "../src/orderRepository";
import { EmptyOrderError, OrderService } from "../src/orderService";

describe("OrderService", () => {
  it("legt die Bestellung mit berechnetem Endpreis ab", () => {
    const repository = new InMemoryOrderRepository();
    const service = new OrderService(repository);

    const order = service.placeOrder(
      [createOrderItem("Monitor", 120, 1)],
      "gold",
      "standard",
    );

    expect(order.total).toBeCloseTo(108.0, 2);
    expect(repository.findAll()).toEqual([order]);
  });

  it("wirft EmptyOrderError ohne Positionen", () => {
    const service = new OrderService(new InMemoryOrderRepository());

    expect(() => service.placeOrder([], "regular", "standard")).toThrow(
      EmptyOrderError,
    );
  });
});
