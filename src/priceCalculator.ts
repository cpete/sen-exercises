import type { Order, Receipt } from "./order";

export class PriceCalculator {
  calculate(order: Order): Receipt {
    let subtotal = 0;
    for (const item of order.items) {
      subtotal += item.unitPriceCents * item.quantity;
    }

    // Rabattlogik: Kundentyp + Mengenrabatt (Prozent)
    let percent = 0;
    if (order.customerType === "premium") {
      percent = 10;
    } else if (order.customerType === "student") {
      percent = 5;
    } else {
      percent = 0;
    }
    if (subtotal >= 50000) {
      percent = percent + 5;
    }
    const discount = Math.round((subtotal * percent) / 100);
    const net = subtotal - discount;

    // Mehrwertsteuer in Basispunkten (1900 = 19 %)
    let vatBps = 0;
    if (order.country === "DE") {
      vatBps = 1900;
    } else if (order.country === "AT") {
      vatBps = 2000;
    } else if (order.country === "CH") {
      vatBps = 810;
    }
    const vat = Math.round((net * vatBps) / 10000);

    // Versand
    let shipping = 0;
    if (order.country === "CH") {
      shipping = 1499;
    } else if (net < 5000) {
      shipping = 499;
    }

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
}
