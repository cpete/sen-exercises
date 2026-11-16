import type { Order } from "./order";

export class OrderValidator {
  validate(order: Order): string[] {
    const errors: string[] = [];
    if (!order.id || order.id.trim() === "") {
      errors.push("Bestell-ID fehlt");
    }
    if (!order.customerEmail || order.customerEmail.indexOf("@") < 1) {
      errors.push("E-Mail-Adresse ungültig");
    }
    if (!order.items || order.items.length === 0) {
      errors.push("Bestellung enthält keine Positionen");
    } else {
      for (const item of order.items) {
        if (!item.sku || item.sku.trim() === "") {
          errors.push("Artikelnummer fehlt");
        }
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          errors.push(`Ungültige Menge bei ${item.sku}`);
        }
        if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents <= 0) {
          errors.push(`Ungültiger Preis bei ${item.sku}`);
        }
      }
    }
    return errors;
  }
}
