import { SmtpMailer } from "./mailer";
import type { Order, Receipt } from "./order";

export class NotificationService {
  sendOrderConfirmation(
    order: Pick<Order, "id" | "customerEmail">,
    receipt: Pick<Receipt, "totalCents">,
  ): void {
    const mailer = new SmtpMailer();
    mailer.send(
      order.customerEmail,
      "Bestellbestätigung " + order.id,
      "Danke für Ihre Bestellung! Gesamtbetrag: " + (receipt.totalCents / 100).toFixed(2) + " EUR",
    );
  }
}
