import type { Order } from "./order";

/**
 * Strategie-Schnittstelle für Rabatte (OCP): Neue Rabattregeln sind neue Klassen,
 * der PriceCalculator wird dafür nicht mehr verändert.
 * Rückgabe: Rabatt in Prozentpunkten, die sich über alle Policies addieren.
 */
export interface DiscountPolicy {
  discountPercent(order: Order, subtotalCents: number): number;
}
