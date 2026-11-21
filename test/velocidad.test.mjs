// Tests de la HU-17 (RN-17.9): acelerar la voz de un reel. Correr: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acelerar } from '../brand/instagram/reels/velocidad.mjs';

const palabras = [{ texto: 'Esto', inicio: 0, fin: 0.3 }, { texto: 'espanta', inicio: 0.6, fin: 1.5 }];
const energia = Array.from({ length: 60 }, (_, i) => i / 60);   // 2 s a 30 cuadros por segundo

test('CA-17.8: con velocidad 1,5 cada palabra empieza y termina 1,5 veces antes', () => {
  const r = acelerar({ palabras, energia }, 1.5);
  assert.deepEqual(r.palabras.map(p => [p.texto, p.inicio, p.fin]), [['Esto', 0, 0.2], ['espanta', 0.4, 1]]);
});

test('CA-17.8: la energía se acorta en la misma proporción (30 cuadros por segundo)', () => {
  const r = acelerar({ palabras, energia }, 1.5);
  assert.equal(r.energia.length, 40);
  assert.equal(r.energia[20], energia[30]);   // el cuadro 20 nuevo es el 30 de antes
});

test('CA-17.8: con velocidad 1 (o sin velocidad) no cambia nada', () => {
  assert.deepEqual(acelerar({ palabras, energia }, 1), { palabras, energia });
  assert.deepEqual(acelerar({ palabras, energia }), { palabras, energia });
});

test('CA-17.8: velocidades fuera de rango avisan (ffmpeg atempo acepta de 0,5 a 2)', () => {
  assert.throws(() => acelerar({ palabras, energia }, 2.5), /velocidad/);
  assert.throws(() => acelerar({ palabras, energia }, 0), /velocidad/);
});
