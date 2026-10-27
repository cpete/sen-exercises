import type { Order, Receipt } from "../order";
import type { OrderRepository } from "../orderRepository";
import type { MySqlConnection } from "./db";

/** Adapter: setzt den Port OrderRepository mit MySQL um. Die Verbindung wird hereingereicht. */
export class MySqlOrderRepository implements OrderRepository {
  constructor(private readonly db: MySqlConnection) {}

  save(order: Order, receipt: Receipt): void {
    this.db.execute(
      `INSERT INTO orders (id, email, total_cents) VALUES ('${order.id}', '${order.customerEmail}', ${receipt.totalCents})`,
    );
    for (const item of order.items) {
      this.db.execute(
        `INSERT INTO order_items (order_id, sku, qty) VALUES ('${order.id}', '${item.sku}', ${item.quantity})`,
      );
    }
  }
}
