import type { Order, Receipt } from "./order";

/** Abstraktion für Kundenbenachrichtigungen. Ob E-Mail, SMS oder Push, weiß der Fachkern nicht. */
export interface Notifier {
  sendConfirmation(order: Order, receipt: Receipt): void;
}
