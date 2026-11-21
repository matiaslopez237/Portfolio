// HU-17 (RN-17.9): voz más ágil.
// La aceleración la hace ffmpeg (atempo, sin cambiar el tono). Acá se acortan los silencios largos del audio crudo
// (PCM de 16 bits, un canal): Gemini a veces hace pausas dramáticas en el medio de una frase.
// Después, render.mjs vuelve a ubicar las palabras y la boca sobre la voz final.
const VENTANA = 0.01;   // s por ventana para medir si hay sonido
const UMBRAL = 0.06;    // nivel (relativo al máximo) por debajo del cual es silencio, igual que en voz-gemini.mjs

export function acortarPausas({ pcm, tasa }, { pausaMax = 0.25, inicioMax = 0.1 } = {}) {
  const n = pcm.length / 2, paso = Math.max(1, Math.round(tasa * VENTANA)), niveles = [];
  for (let i = 0; i < n; i += paso) {
    let s = 0, c = 0;
    for (let j = i; j < Math.min(n, i + paso); j++) { const v = pcm.readInt16LE(j * 2) / 32768; s += v * v; c++; }
    niveles.push(Math.sqrt(s / c));
  }
  const max = Math.max(...niveles) || 1, suena = niveles.map(v => v / max > UMBRAL);
  const primera = suena.indexOf(true);
  if (primera < 0) return { pcm, tasa, quitado: 0 };
  // tramos a quitar (en ventanas): el silencio del principio que pase de inicioMax, y de cada pausa del medio
  // lo que pase de pausaMax (se saca del centro, así la voz entra y sale igual que antes)
  const quitar = [];
  const ini = Math.round(inicioMax / VENTANA);
  if (primera > ini) quitar.push([0, primera - ini]);
  const ultima = suena.lastIndexOf(true), maxV = Math.round(pausaMax / VENTANA);
  for (let i = primera; i <= ultima; i++) {
    if (suena[i]) continue;
    let j = i; while (j <= ultima && !suena[j]) j++;
    const largo = j - i;
    if (largo > maxV) { const a = i + Math.floor(maxV / 2); quitar.push([a, a + (largo - maxV)]); }
    i = j;
  }
  if (!quitar.length) return { pcm, tasa, quitado: 0 };
  const partes = []; let desde = 0, quitado = 0;
  for (const [a, b] of quitar) {
    const sa = Math.min(n, a * paso), sb = Math.min(n, b * paso);
    partes.push(pcm.subarray(desde * 2, sa * 2)); quitado += (sb - sa) / tasa; desde = sb;
  }
  partes.push(pcm.subarray(desde * 2));
  return { pcm: Buffer.concat(partes), tasa, quitado };
}
