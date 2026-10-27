import type { DiscountPolicy } from "./discountPolicy";
import type { Order, Receipt } from "./order";

/**
 * Die Rabattregeln kommen von außen (Constructor Injection).
 * Der Calculator kennt nur die Abstraktion DiscountPolicy: offen für Erweiterung, geschlossen für Änderung.
 */
export class PriceCalculator {
  constructor(private readonly discounts: readonly DiscountPolicy[]) {}

  calculate(order: Order): Receipt {
    const subtotal = order.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
    const percent = this.discounts.reduce((sum, d) => sum + d.discountPercent(order, subtotal), 0);
    const discount = Math.round((subtotal * percent) / 100);
    const net = subtotal - discount;
    const vat = Math.round((net * this.vatBasisPoints(order)) / 10000);
    const shipping = this.shipping(order, net);

    return {
      orderId: order.id,
      subtotalCents: subtotal,
      discountCents: discount,
      netCents: net,
      vatCents: vat,
      shippingCents: shipping,
      totalCents: net + vat + shipping,
    };
  }

  private vatBasisPoints(order: Order): number {
    switch (order.country) {
      case "DE":
        return 1900;
      case "AT":
        return 2000;
      case "CH":
        return 810;
    }
  }

  private shipping(order: Order, netCents: number): number {
    if (order.country === "CH") {
      return 1499;
    }
    return netCents < 5000 ? 499 : 0;
  }
}
