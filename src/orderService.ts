import { NotificationService } from "./notificationService";
import type { Order, Receipt } from "./order";
import { OrderRepository } from "./orderRepository";
import { OrderValidator } from "./orderValidator";
import { PriceCalculator } from "./priceCalculator";

/**
 * Nur noch Ablaufsteuerung (Orchestrierung) und keine Fachdetails mehr.
 * Kohäsion ist hoch, aber die Kopplung an konkrete Klassen (und damit an DB und SMTP)
 * ist weiterhin hoch: die Zusammenstellung geschieht per `new` im Inneren.
 */
export class OrderService {
  private readonly validator = new OrderValidator();
  private readonly calculator = new PriceCalculator();
  private readonly repository = new OrderRepository();
  private readonly notifications = new NotificationService();

  placeOrder(order: Order): Receipt {
    console.log(`[LOG] placeOrder ${order.id} gestartet`);

    const errors = this.validator.validate(order);
    if (errors.length > 0) {
      console.log(`[LOG] placeOrder ${order.id} abgelehnt: ${errors.join("; ")}`);
      throw new Error("Ungültige Bestellung: " + errors.join("; "));
    }

    const receipt = this.calculator.calculate(order);
    this.repository.save(order, receipt);
    this.notifications.sendConfirmation(order, receipt);

    console.log(`[LOG] placeOrder ${order.id} abgeschlossen, Summe ${receipt.totalCents} Cent`);
    return receipt;
  }
}
