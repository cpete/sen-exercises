// Reine Datentypen des Bestellsystems. Alle Geldbeträge in Cent (ganze Zahlen),
// damit keine Rundungsfehler durch Fließkommazahlen entstehen.

export type CustomerType = "regular" | "premium" | "student";
export type Country = "DE" | "AT" | "CH";

export interface OrderItem {
  sku: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerType: CustomerType;
  country: Country;
  items: OrderItem[];
}

export interface Receipt {
  orderId: string;
  subtotalCents: number;
  discountCents: number;
  netCents: number;
  vatCents: number;
  shippingCents: number;
  totalCents: number;
}
