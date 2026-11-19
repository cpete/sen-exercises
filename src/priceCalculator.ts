import { type OrderItem, subtotalOf } from "./orderItem";
import type { CustomerType, ShippingOption } from "./types";

const GOLD_DISCOUNT_MIN_SUBTOTAL = 100;
const GOLD_DISCOUNT_RATE = 0.1;

const PREMIUM_HIGH_DISCOUNT_MIN_SUBTOTAL = 50;
const PREMIUM_HIGH_DISCOUNT_RATE = 0.15;
const PREMIUM_BASE_DISCOUNT_RATE = 0.05;

const FREE_SHIPPING_MIN_AMOUNT = 30;
const SHIPPING_COST = 4.95;

const BULK_BONUS_MIN_QUANTITY = 11;
const BULK_BONUS = 5;

/**
 * Berechnet den Endpreis einer Bestellung.
 *
 * Reihenfolge (fachlich vorgegeben):
 * Warenwert → Kundenrabatt → Versandkosten → Mengenbonus → Rundung auf Cent.
 */
export function calculateTotal(
  items: readonly OrderItem[],
  customerType: CustomerType,
  shippingOption: ShippingOption,
): number {
  const subtotal = sumSubtotals(items);
  const discounted = applyCustomerDiscount(subtotal, customerType);
  const withShipping = addShippingCost(discounted, shippingOption);
  const total = applyBulkBonus(withShipping, totalQuantity(items));
  return roundToCents(total);
}

function sumSubtotals(items: readonly OrderItem[]): number {
  return items.reduce((sum, item) => sum + subtotalOf(item), 0);
}

function totalQuantity(items: readonly OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function applyCustomerDiscount(
  subtotal: number,
  customerType: CustomerType,
): number {
  switch (customerType) {
    case "regular":
      return subtotal;
    case "gold":
      return subtotal > GOLD_DISCOUNT_MIN_SUBTOTAL
        ? subtotal * (1 - GOLD_DISCOUNT_RATE)
        : subtotal;
    case "premium": {
      const rate =
        subtotal > PREMIUM_HIGH_DISCOUNT_MIN_SUBTOTAL
          ? PREMIUM_HIGH_DISCOUNT_RATE
          : PREMIUM_BASE_DISCOUNT_RATE;
      return subtotal * (1 - rate);
    }
    default:
      return assertNever(customerType);
  }
}

function addShippingCost(
  amount: number,
  shippingOption: ShippingOption,
): number {
  const isShippingCharged =
    shippingOption === "standard" && amount < FREE_SHIPPING_MIN_AMOUNT;
  return isShippingCharged ? amount + SHIPPING_COST : amount;
}

function applyBulkBonus(amount: number, totalQuantity: number): number {
  return totalQuantity >= BULK_BONUS_MIN_QUANTITY
    ? amount - BULK_BONUS
    : amount;
}

function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Der Compiler meldet hier einen Fehler, sobald ein neuer Kundentyp nicht behandelt wird. */
function assertNever(value: never): never {
  throw new Error(`Unbehandelter Kundentyp: ${String(value)}`);
}
