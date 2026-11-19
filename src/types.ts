/** Ersetzt die früheren Strings "N", "G", "P". */
export type CustomerType = "regular" | "gold" | "premium";

/** Ersetzt das frühere Flag-Argument `f: boolean`. */
export type ShippingOption = "standard" | "free";

export interface Order {
  readonly customerType: CustomerType;
  readonly total: number;
}
