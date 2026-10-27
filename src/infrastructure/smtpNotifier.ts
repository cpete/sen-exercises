import { formatEuro } from "../money";
import type { Notifier } from "../notifier";
import type { Order, Receipt } from "../order";
import type { SmtpMailer } from "./mailer";

/** Adapter: setzt den Port Notifier per E-Mail um. */
export class SmtpNotifier implements Notifier {
  constructor(private readonly mailer: SmtpMailer) {}

  sendConfirmation(order: Order, receipt: Receipt): void {
    this.mailer.send(
      order.customerEmail,
      `Bestellbestätigung ${order.id}`,
      `Danke für Ihre Bestellung! Gesamtbetrag: ${formatEuro(receipt.totalCents)}`,
    );
  }
}
