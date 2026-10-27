/** Geldformatierung an genau einer Stelle (Information Hiding: Cent-Darstellung bleibt intern). */
export function formatEuro(cents: number): string {
  return (cents / 100).toFixed(2) + " EUR";
}
