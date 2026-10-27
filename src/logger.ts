/** Abstraktion für Protokollierung (ISP: bewusst nur eine Methode). */
export interface Logger {
  info(message: string): void;
}
