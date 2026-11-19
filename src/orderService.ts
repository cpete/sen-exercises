import type { OrderItem } from "./orderItem";
import type { OrderRepository } from "./orderRepository";
import { calculateTotal } from "./priceCalculator";
import type { CustomerType, Order, ShippingOption } from "./types";

/** Ersetzt den früheren Fehlercode -2. Den Fall -1 (null) verhindert jetzt der Typ. */
export class EmptyOrderError extends Error {
  constructor() {
    super("Eine Bestellung muss mindestens eine Position enthalten.");
    this.name = "EmptyOrderError";
  }
}

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  /** Berechnet den Endpreis und legt die Bestellung ab. */
  placeOrder(
    items: readonly OrderItem[],
    customerType: CustomerType,
    shippingOption: ShippingOption,
  ): Order {
    if (items.length === 0) {
      throw new EmptyOrderError();
    }
    const order: Order = {
      customerType,
      total: calculateTotal(items, customerType, shippingOption),
    };
    this.orderRepository.save(order);
    return order;
  }
}
