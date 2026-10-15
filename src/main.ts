import { OrderService } from "./orderService";
import type { Order } from "./order";

// Nur für die Demo: Die Infrastruktur ist simuliert, daher "erreichbar" machen.
process.env.DB_HOST ??= "demo-db";
process.env.SMTP_HOST ??= "demo-smtp";

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

const service = new OrderService();
const receipt = service.placeOrder(order);
console.log(receipt);
