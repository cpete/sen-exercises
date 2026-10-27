// Simulierte MySQL-Anbindung. Sie verhält sich wie die echte Infrastruktur:
// Ohne laufende Datenbank (Umgebungsvariable DB_HOST) schlägt der Verbindungsaufbau fehl.
// ==> Alles, was diese Klasse direkt erzeugt, ist ohne Datenbank nicht testbar.

export class MySqlConnection {
  constructor() {
    if (!process.env.DB_HOST) {
      throw new Error("ECONNREFUSED: keine MySQL-Datenbank erreichbar (DB_HOST nicht gesetzt)");
    }
  }

  execute(sql: string): void {
    console.log(`[SQL] ${sql}`);
  }
}
