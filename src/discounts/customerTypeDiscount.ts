import type { DiscountPolicy } from "../discountPolicy";
import type { Order } from "../order";

export class CustomerTypeDiscount implements DiscountPolicy {
  discountPercent(order: Order): number {
    switch (order.customerType) {
      case "premium":
        return 10;
      case "student":
        return 5;
      case "regular":
        return 0;
    }
  }
}
