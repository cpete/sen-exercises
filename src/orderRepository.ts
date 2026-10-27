import type { Order, Receipt } from "./order";

/**
 * Abstraktion (Port), die der Fachkern besitzt (DIP).
 * Der Fachkern definiert, WAS er braucht. Die Infrastruktur entscheidet, WIE.
 */
export interface OrderRepository {
  save(order: Order, receipt: Receipt): void;
}
