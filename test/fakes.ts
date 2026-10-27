import type { Logger } from "../src/logger";
import type { Notifier } from "../src/notifier";
import type { Order, Receipt } from "../src/order";
import type { OrderRepository } from "../src/orderRepository";

// Handgeschriebene Test-Doubles: kein Mock-Framework nötig, weil die Interfaces schlank sind.

export class InMemoryOrderRepository implements OrderRepository {
  readonly saved: Array<{ order: Order; receipt: Receipt }> = [];

  save(order: Order, receipt: Receipt): void {
    this.saved.push({ order, receipt });
  }
}

export class FakeNotifier implements Notifier {
  readonly confirmations: string[] = [];

  sendConfirmation(order: Order): void {
    this.confirmations.push(order.id);
  }
}

export class SilentLogger implements Logger {
  info(): void {}
}

export function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "T-1",
    customerEmail: "kunde@example.com",
    customerType: "regular",
    country: "DE",
    items: [{ sku: "A-1", name: "Artikel", unitPriceCents: 1000, quantity: 2 }],
    ...overrides,
  };
}
