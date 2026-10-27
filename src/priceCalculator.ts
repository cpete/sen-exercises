import type { Order, Receipt } from "./order";

/**
 * Verantwortung: Preise, Rabatte, Steuern und Versand berechnen.
 * Geheimnis dieses Moduls: die konkreten Geschäftsregeln (Prozentsätze, Schwellen).
 * Offener Punkt: if/else im Rabatt verletzt das Open-Closed-Prinzip.
 */
export class PriceCalculator {
  calculate(order: Order): Receipt {
    const subtotal = this.subtotal(order);
    const discount = Math.round((subtotal * this.discountPercent(order, subtotal)) / 100);
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

  private subtotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  }

  private discountPercent(order: Order, subtotalCents: number): number {
    let percent = 0;
    if (order.customerType === "premium") {
      percent = 10;
    } else if (order.customerType === "student") {
      percent = 5;
    }
    if (subtotalCents >= 50000) {
      percent += 5;
    }
    return percent;
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
