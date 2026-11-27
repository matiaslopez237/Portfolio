// Tests de la HU-17 (RN-17.9): voz más ágil. Correr: npm run test:unit
// acortarPausas trabaja sobre el audio crudo (PCM de 16 bits, un canal); la aceleración la hace ffmpeg (atempo).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acortarPausas } from '../brand/instagram/reels/velocidad.mjs';

const TASA = 8000;
// arma un audio con tramos de [segundos, sonido?]: el sonido es un tono, el silencio son ceros
function audio(tramos) {
  const muestras = [];
  for (const [seg, suena] of tramos) for (let i = 0; i < Math.round(seg * TASA); i++) muestras.push(suena ? Math.round(12000 * Math.sin(i / 3)) : 0);
  const b = Buffer.alloc(muestras.length * 2); muestras.forEach((v, i) => b.writeInt16LE(v, i * 2)); return b;
}
const dur = (pcm) => pcm.length / 2 / TASA;

test('CA-17.8: una pausa de 0,9 s en el medio queda de 0,25 s y el sonido no se toca', () => {
  const r = acortarPausas({ pcm: audio([[0.3, 1], [0.9, 0], [0.3, 1]]), tasa: TASA }, { pausaMax: 0.25 });
  assert.ok(Math.abs(dur(r.pcm) - 0.85) < 0.03, `dura ${dur(r.pcm).toFixed(3)} s`);
  assert.ok(Math.abs(r.quitado - 0.65) < 0.03, `quitó ${r.quitado.toFixed(3)} s`);
});

test('CA-17.8: las pausas cortas (de 0,25 s o menos) quedan como están', () => {
  const pcm = audio([[0.3, 1], [0.2, 0], [0.3, 1]]);
  const r = acortarPausas({ pcm, tasa: TASA }, { pausaMax: 0.25 });
  assert.equal(r.pcm.length, pcm.length);
  assert.equal(r.quitado, 0);
});

test('CA-17.8: el silencio del principio queda en 0,1 s como mucho', () => {
  const r = acortarPausas({ pcm: audio([[0.5, 0], [0.3, 1]]), tasa: TASA }, { pausaMax: 0.25 });
  assert.ok(dur(r.pcm) <= 0.41, `dura ${dur(r.pcm).toFixed(3)} s`);
});

// RN-17.9: con la voz acelerada, los gestos también: el martillo se levanta en PREPARAR / velocidad
import { createRequire } from 'node:module';
const { planGestos } = createRequire(import.meta.url)('../brand/instagram/reels/gestos.js');
test('CA-17.8: con velocidad 1,5 el martillo se prepara en 1,1 / 1,5 s antes de "Hefesto" (sin velocidad, sigue pidiendo 1,1 s)', () => {
  const lineas = [{ ini: 1, fin: 2 }, { ini: 2, fin: 4, martillo: true, marca: 2.2 }];
  assert.throws(() => planGestos(lineas), /no hay tiempo para levantar el martillo/);
  const plan = planGestos(lineas, { velocidad: 1.5 });
  assert.ok(Math.abs(plan[1].golpe - plan[1].desde - 1.1 / 1.5) < 1e-9, `se prepara en ${(plan[1].golpe - plan[1].desde).toFixed(3)} s`);
});

test('CA-17.8: los tiempos de la voz original se pasan a la voz recortada (las palabras se ubican antes de recortar)', () => {
  // sonido de 0 a 0,3 s, silencio hasta 1,2 s, sonido hasta 1,5 s: se quitan 0,65 s del medio del silencio
  const r = acortarPausas({ pcm: audio([[0.3, 1], [0.9, 0], [0.3, 1]]), tasa: TASA }, { pausaMax: 0.25 });
  assert.ok(Math.abs(r.mover(0.2) - 0.2) < 0.02, `0,2 s queda en ${r.mover(0.2)}`);
  assert.ok(Math.abs(r.mover(1.3) - 0.65) < 0.03, `1,3 s queda en ${r.mover(1.3)}`);
  assert.ok(r.mover(0.8) >= r.mover(0.4) && r.mover(0.8) <= r.mover(1.3), 'un momento dentro del silencio quitado queda entre los dos sonidos');
});
