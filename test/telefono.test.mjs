// Tests de la HU-17: el teléfono que muestra un sitio real (o un chat) dentro del reel.
// Prueban la lógica pura de brand/instagram/reels/telefono.js, sin dibujar ni renderizar video. Correr: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { validarPantallas, planTelefono, estadoTelefono, frameParaScroll, TRANSICION } = createRequire(import.meta.url)('../brand/instagram/reels/telefono.js');

// Cinco líneas de 2 s: sin teléfono, sitio arriba, sitio abajo con toque, chat, y se esconde
const lineas = [
  { ini: 1, fin: 3 },
  { ini: 3, fin: 5, pantalla: { sitio: 0 } },
  { ini: 5, fin: 7, pantalla: { sitio: 1900, toque: true } },
  { ini: 7, fin: 9, pantalla: { chat: 'sitio' } },
  { ini: 9, fin: 11, pantalla: false },
];
const plan = planTelefono(lineas);

test('CA-17.3: antes de la primera pantalla el teléfono no se ve; en la mitad de una línea con sitio se ve entero', () => {
  assert.equal(estadoTelefono(plan, 2).visible, 0);
  const e = estadoTelefono(plan, 4);
  assert.equal(e.visible, 1);
  assert.equal(e.tipo, 'sitio');
  assert.equal(e.scroll, 0);
});

test('CA-17.3: una línea sin "pantalla" mantiene la anterior; "pantalla": false lo esconde', () => {
  const p = planTelefono([...lineas.slice(0, 2), { ini: 5, fin: 7 }]);
  assert.equal(estadoTelefono(p, 6).tipo, 'sitio');
  assert.equal(estadoTelefono(plan, 10.5).visible, 0);
});

test('CA-17.3: el teléfono entra y sale suave (nunca salta de 0 a 1 en un cuadro)', () => {
  let maxSalto = 0, prev = estadoTelefono(plan, 0).visible;
  for (let t = 0; t <= 11; t += 1 / 30) { const v = estadoTelefono(plan, t).visible; maxSalto = Math.max(maxSalto, Math.abs(v - prev)); prev = v; }
  assert.ok(maxSalto <= 1 / (TRANSICION * 30) + 1e-6, `salto de ${maxSalto.toFixed(3)} en un cuadro`);
});

test('CA-17.3: el scroll va de 0 a 1900 sin saltos y llega antes de que termine la línea', () => {
  assert.equal(estadoTelefono(plan, 5).scroll, 0);
  assert.equal(estadoTelefono(plan, 6.9).scroll, 1900);
  let prev = 0;
  for (let t = 5; t <= 7; t += 1 / 30) {
    const s = estadoTelefono(plan, t).scroll;
    assert.ok(s >= prev - 1e-9, 'el scroll no puede volver para atrás');
    assert.ok(s - prev <= 120, `salta ${s - prev} px en un cuadro`);
    prev = s;
  }
});

test('CA-17.3: el toque aparece solo en su línea, después de que el scroll llegó', () => {
  assert.equal(estadoTelefono(plan, 4).toque, null);
  const conToque = [];
  for (let t = 5; t < 7; t += 1 / 30) { const e = estadoTelefono(plan, t); if (e.toque !== null) conToque.push(e); }
  assert.ok(conToque.length > 0, 'nunca aparece el toque');
  assert.ok(conToque.every(e => e.scroll === 1900), 'el toque aparece antes de llegar al botón');
  assert.equal(estadoTelefono(plan, 8).toque, null);
});

test('CA-17.3: al pasar del sitio al chat se mezclan las dos pantallas un rato (no corta de golpe)', () => {
  const e = estadoTelefono(plan, 7 + TRANSICION / 2);
  assert.equal(e.tipo, 'chat');
  assert.ok(e.mezcla > 0 && e.mezcla < 1, `mezcla ${e.mezcla}`);
  assert.equal(e.anterior.tipo, 'sitio');
  assert.equal(estadoTelefono(plan, 8.5).mezcla, 1);
});

test('frameParaScroll: elige la captura más cercana al scroll pedido', () => {
  const frames = [{ scroll: 0 }, { scroll: 40 }, { scroll: 80 }, { scroll: 1900 }];
  assert.equal(frameParaScroll(frames, 0), 0);
  assert.equal(frameParaScroll(frames, 55), 1);
  assert.equal(frameParaScroll(frames, 70), 2);
  assert.equal(frameParaScroll(frames, 5000), 3);
});

test('validarPantallas: acepta las pantallas conocidas y avisa con el número de línea si hay un error', () => {
  const reel = (pantallas, sitio) => ({ id: 'RX', ...(sitio ? { sitio } : {}), lineas: pantallas.map(p => ({ texto: 'hola', ...(p === undefined ? {} : { pantalla: p }) })) });
  const sitio = { url: 'https://ejemplo.com', paradas: [0, 1900] };
  assert.doesNotThrow(() => validarPantallas(reel([undefined, { sitio: 0 }, { sitio: 1900, toque: true }, { chat: 'sitio' }, false], sitio)));
  assert.doesNotThrow(() => validarPantallas(reel([{ chat: { contacto: 'Paciente', mensajes: [{ texto: '¿Qué días atienden?' }] } }, { imagen: { archivo: 'recursos/x.png', difuminada: true } }])));
  assert.throws(() => validarPantallas(reel([{ sitio: 0 }])), /línea 1.*"sitio"/);
  assert.throws(() => validarPantallas(reel([{ sitio: 700 }], sitio)), /línea 1.*700.*paradas/);
  assert.throws(() => validarPantallas(reel([undefined, { toque: true }], sitio)), /línea 2/);
  assert.throws(() => validarPantallas(reel([{ chat: { mensajes: [] } }])), /línea 1.*mensaje/);
  assert.throws(() => validarPantallas(reel([{ video: 'x' }])), /línea 1.*video/);
});
