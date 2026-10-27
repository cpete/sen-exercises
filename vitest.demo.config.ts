import { defineConfig } from "vitest/config";

// Nur für die Überleitung: Dieser Test SCHEITERT absichtlich (keine DB, kein Mailserver).
export default defineConfig({
  test: {
    include: ["test/**/*.demo.test.ts"],
  },
});
