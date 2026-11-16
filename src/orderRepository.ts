import { MySqlConnection } from "./db";
import type { Order, Receipt } from "./order";

export class OrderRepository {
  save(
    order: Pick<Order, "id" | "customerEmail" | "items">,
    receipt: Pick<Receipt, "totalCents">,
  ): void {
    const db = new MySqlConnection();
    db.execute(
      "INSERT INTO orders (id, email, total_cents) VALUES ('" +
        order.id + "', '" + order.customerEmail + "', " + receipt.totalCents + ")",
    );
    for (const item of order.items) {
      db.execute(
        "INSERT INTO order_items (order_id, sku, qty) VALUES ('" +
          order.id + "', '" + item.sku + "', " + item.quantity + ")",
      );
    }
  }
}
