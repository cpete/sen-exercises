import { BlackFridayDiscount } from "./discounts/blackFridayDiscount";
import { BulkDiscount } from "./discounts/bulkDiscount";
import { CustomerTypeDiscount } from "./discounts/customerTypeDiscount";
import { ConsoleLogger } from "./infrastructure/consoleLogger";
import { MySqlConnection } from "./infrastructure/db";
import { SmtpMailer } from "./infrastructure/mailer";
import { MySqlOrderRepository } from "./infrastructure/mySqlOrderRepository";
import { SmtpNotifier } from "./infrastructure/smtpNotifier";
import type { Order } from "./order";
import { OrderService } from "./orderService";
import { OrderValidator } from "./orderValidator";
import { PriceCalculator } from "./priceCalculator";

// Nur für die Demo: Die Infrastruktur ist simuliert, daher "erreichbar" machen.
process.env.DB_HOST ??= "demo-db";
process.env.SMTP_HOST ??= "demo-smtp";

// ---------------------------------------------------------------------------
// COMPOSITION ROOT: der einzige Ort, an dem konkrete Klassen verdrahtet werden.
// ---------------------------------------------------------------------------
function createOrderService(): OrderService {
  const isBlackFriday = (): boolean => false; // hier später: echte Datumslogik
  const calculator = new PriceCalculator([
    new CustomerTypeDiscount(),
    new BulkDiscount(),
    new BlackFridayDiscount(isBlackFriday),
  ]);

  return new OrderService(
    new OrderValidator(),
    calculator,
    new MySqlOrderRepository(new MySqlConnection()),
    new SmtpNotifier(new SmtpMailer()),
    new ConsoleLogger(),
  );
}

const order: Order = {
  id: "B-1001",
  customerEmail: "kundin@example.com",
  customerType: "premium",
  country: "DE",
  items: [
    { sku: "KB-01", name: "Mechanische Tastatur", unitPriceCents: 8990, quantity: 2 },
    { sku: "MS-07", name: "Maus", unitPriceCents: 3490, quantity: 1 },
  ],
};

console.log(createOrderService().placeOrder(order));
