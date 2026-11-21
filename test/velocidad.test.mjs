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
