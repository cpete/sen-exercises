import type { Logger } from "../logger";

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}
