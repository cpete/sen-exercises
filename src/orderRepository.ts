import type { Order } from "./types";

/** Ersetzt die frühere öffentliche, veränderliche Variable `d`. */
export interface OrderRepository {
  save(order: Order): void;
  findAll(): readonly Order[];
}

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders: Order[] = [];

  save(order: Order): void {
    this.orders.push(order);
  }

  findAll(): readonly Order[] {
    return [...this.orders];
  }
}
