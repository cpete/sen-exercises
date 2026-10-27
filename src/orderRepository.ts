import { MySqlConnection } from "./db";
import type { Order, Receipt } from "./order";

/**
 * Verantwortung: Bestellungen persistieren.
 * Geheimnis: SQL-Schema und Datenbanktechnologie. Kein anderes Modul schreibt SQL.
 * Noch offen: Die Verbindung wird hier hart mit `new` erzeugt.
 */
export class OrderRepository {
  save(order: Order, receipt: Receipt): void {
    const db = new MySqlConnection();
    db.execute(
      `INSERT INTO orders (id, email, total_cents) VALUES ('${order.id}', '${order.customerEmail}', ${receipt.totalCents})`,
    );
    for (const item of order.items) {
      db.execute(
        `INSERT INTO order_items (order_id, sku, qty) VALUES ('${order.id}', '${item.sku}', ${item.quantity})`,
      );
    }
  }
}
