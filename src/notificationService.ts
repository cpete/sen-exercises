import { formatEuro } from "./money";
import { SmtpMailer } from "./mailer";
import type { Order, Receipt } from "./order";

/**
 * Verantwortung: Kunden benachrichtigen.
 * Geheimnis: Mailtext und Versandweg.
 * Noch offen: Der Mailer wird hier hart mit `new` erzeugt.
 */
export class NotificationService {
  sendConfirmation(order: Order, receipt: Receipt): void {
    const mailer = new SmtpMailer();
    mailer.send(
      order.customerEmail,
      `Bestellbestätigung ${order.id}`,
      `Danke für Ihre Bestellung! Gesamtbetrag: ${formatEuro(receipt.totalCents)}`,
    );
  }
}
