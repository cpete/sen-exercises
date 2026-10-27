import type { DiscountPolicy } from "../discountPolicy";
import type { Order } from "../order";

/** 5 % Mengenrabatt ab 500 EUR Warenwert. */
export class BulkDiscount implements DiscountPolicy {
  constructor(
    private readonly thresholdCents = 50000,
    private readonly percent = 5,
  ) {}

  discountPercent(_order: Order, subtotalCents: number): number {
    return subtotalCents >= this.thresholdCents ? this.percent : 0;
  }
}
