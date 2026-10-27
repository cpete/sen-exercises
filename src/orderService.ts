import type { Logger } from "./logger";
import type { Notifier } from "./notifier";
import type { Order, Receipt } from "./order";
import type { OrderRepository } from "./orderRepository";
import type { OrderValidator } from "./orderValidator";
import type { PriceCalculator } from "./priceCalculator";

/**
 * Reine Orchestrierung. Alle Abhängigkeiten kommen per Konstruktor (Constructor Injection).
 * Diese Klasse enthält kein einziges `new` einer Abhängigkeit.
 *
 * Bewusste Entscheidung: OrderValidator und PriceCalculator sind konkrete Klassen ohne
 * Seiteneffekte. Dafür braucht es kein Interface (YAGNI). Interfaces gibt es dort,
 * wo Infrastruktur oder Variation im Spiel ist.
 */
export class OrderService {
  constructor(
    private readonly validator: OrderValidator,
    private readonly calculator: PriceCalculator,
    private readonly repository: OrderRepository,
    private readonly notifier: Notifier,
    private readonly logger: Logger,
  ) {}

  placeOrder(order: Order): Receipt {
    this.logger.info(`placeOrder ${order.id} gestartet`);

    const errors = this.validator.validate(order);
    if (errors.length > 0) {
      this.logger.info(`placeOrder ${order.id} abgelehnt: ${errors.join("; ")}`);
      throw new Error("Ungültige Bestellung: " + errors.join("; "));
    }

    const receipt = this.calculator.calculate(order);
    this.repository.save(order, receipt);
    this.notifier.sendConfirmation(order, receipt);

    this.logger.info(`placeOrder ${order.id} abgeschlossen, Summe ${receipt.totalCents} Cent`);
    return receipt;
  }
}
