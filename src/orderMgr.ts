// Liste
export var d: any[] = [];

// Funktion zum Berechnen
export function calc(l: any[], t: string, f: boolean): number {
  var r = 0;
  var c = 0;
  // Schleife über alle Elemente
  for (var i = 0; i < l.length; i++) {
    var x = l[i];
    try {
      var p = parseFloat(x[1]);
      var q = parseInt(x[2]);
      if (q > 0) {
        if (p > 0) {
          r = r + p * q;
          c = c + q;
        }
      }
    } catch (e) {}
  }
  // Rabatt für Gold-Kunden ab 50 Euro
  if (t == "G") {
    if (r > 100) {
      r = r * 0.9;
    }
  } else {
    if (t == "P") {
      if (r > 50) {
        r = r * 0.85;
      } else {
        r = r * 0.95;
      }
    }
  }
  // Versand
  if (f == false) {
    if (r < 30) {
      r = r + 4.95;
    }
  }
  // c größer 10
  if (c > 10) r = r - 5;
  return Math.round(r * 100) / 100;
}

// speichert
export function save(l: any[] | null, t: string, f: boolean): number {
  if (l == null) return -1;
  if (l.length == 0) return -2;
  var tot = calc(l, t, f);
  d.push([t, tot]);
  console.log("Gespeichert: " + tot);
  return 0;
}
