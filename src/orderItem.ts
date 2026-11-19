export interface OrderItem {
  readonly name: string;
  readonly unitPrice: number;
  readonly quantity: number;
}

/** Legt eine Bestellposition an. Ungültige Werte werden sofort abgelehnt (fail fast). */
export function createOrderItem(
  name: string,
  unitPrice: number,
  quantity: number,
): OrderItem {
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
    throw new RangeError(`Einzelpreis muss positiv sein, war: ${unitPrice}`);
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError(
      `Menge muss eine positive ganze Zahl sein, war: ${quantity}`,
    );
  }
  return { name, unitPrice, quantity };
}

export function subtotalOf(item: OrderItem): number {
  return item.unitPrice * item.quantity;
}
