// Tests de la HU-17: grabar-sitio.mjs saca las capturas de un sitio en tamaño celular para el teléfono del reel.
// Usan una página de prueba servida en localhost (no salen a internet). Correr: npm run test:unit
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { grabarSitio } from '../brand/instagram/reels/grabar-sitio.mjs';

const conBoton = `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>body{margin:0;font:16px sans-serif}section{height:900px;border-bottom:1px solid #ccc}
#flota{position:fixed;right:20px;bottom:20px;width:60px;height:60px;border-radius:50%;background:#25d366}</style></head><body>
<section><a id="hero" href="https://wa.me/5490000000000?text=Hola%2C%20quiero%20un%20turno" style="display:block;margin:200px 30px;height:50px">Reservar turno</a>
<img src="https://wa.me/pixel.png" alt=""></section><section>Servicios</section><section>Más</section>
<a id="flota" href="https://wa.me/5490000000000?text=Hola%2C%20quiero%20un%20turno" aria-label="WhatsApp"></a></body></html>`;
const sinBoton = `<!doctype html><html><head><meta name="viewport" content="width=device-width"></head><body><p>Sin WhatsApp</p></body></html>`;

let srv, base, dir;
before(async () => {
  srv = createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(req.url.startsWith('/sin') ? sinBoton : conBoton); });
  await new Promise(r => srv.listen(0, r));
  base = `http://localhost:${srv.address().port}`;
  dir = mkdtempSync(join(tmpdir(), 'grabar-sitio-'));
});
after(() => { srv.close(); rmSync(dir, { recursive: true, force: true }); });

test('CA-17.6: captura el sitio en tamaño celular desde la primera parada hasta la última, de a 40 px o menos', { timeout: 60_000 }, async () => {
  const r = await grabarSitio({ url: base + '/', paradas: [0, 600], salida: dir });
  const info = JSON.parse(readFileSync(join(dir, 'sitio.json'), 'utf8'));
  assert.equal(info.anchoCss, 390);
  assert.equal(info.frames[0].scroll, 0);
  assert.equal(info.frames.at(-1).scroll, 600);
  for (let i = 1; i < info.frames.length; i++) assert.ok(info.frames[i].scroll - info.frames[i - 1].scroll <= 40, 'hay un salto de más de 40 px');
  for (const f of info.frames) assert.ok(existsSync(join(dir, f.archivo)), 'falta ' + f.archivo);
  assert.ok(r.bloqueados >= 1, 'no bloqueó los pedidos a WhatsApp');
});

test('CA-17.6: en cada parada guarda dónde está el botón de WhatsApp visible y el mensaje que trae escrito', { timeout: 60_000 }, async () => {
  await grabarSitio({ url: base + '/', paradas: [0, 600], salida: dir });
  const info = JSON.parse(readFileSync(join(dir, 'sitio.json'), 'utf8'));
  const arriba = info.botones.find(b => b.parada === 0), abajo = info.botones.find(b => b.parada === 600);
  assert.equal(arriba.mensaje, 'Hola, quiero un turno');
  assert.ok(arriba.y >= 200 && arriba.y <= 260, `el botón de arriba está en y=${arriba.y}`);
  // abajo el botón de arriba ya no se ve: queda el flotante
  assert.ok(abajo.x > 300 && abajo.w === 60, `el botón de abajo está en x=${abajo.x} (ancho ${abajo.w})`);
});

test('grabar-sitio avisa si el sitio no tiene un botón de WhatsApp', { timeout: 60_000 }, async () => {
  await assert.rejects(grabarSitio({ url: base + '/sin', paradas: [0], salida: dir }), /no encontré un botón de WhatsApp/);
});
