// Simulierter SMTP-Client. Ohne Mailserver (Umgebungsvariable SMTP_HOST) schlägt der
// Verbindungsaufbau fehl, genau wie bei der echten Infrastruktur.

export class SmtpMailer {
  constructor() {
    if (!process.env.SMTP_HOST) {
      throw new Error("ECONNREFUSED: kein SMTP-Server erreichbar (SMTP_HOST nicht gesetzt)");
    }
  }

  send(to: string, subject: string, body: string): void {
    console.log(`[MAIL] an ${to} | ${subject} | ${body}`);
  }
}
