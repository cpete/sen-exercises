import type { DiscountPolicy } from "../discountPolicy";

/**
 * Der OCP-Bonus: eine komplett neue Regel, ohne eine einzige bestehende Klasse zu ändern.
 * Ob heute Black Friday ist, wird von außen hineingereicht (testbar, kein versteckter Date.now()).
 */
export class BlackFridayDiscount implements DiscountPolicy {
  constructor(
    private readonly isActive: () => boolean,
    private readonly percent = 10,
  ) {}

  discountPercent(): number {
    return this.isActive() ? this.percent : 0;
  }
}
