// Tests de la HU-10 (publicación automática en Instagram). Correr: npm run test:unit
// Nunca llaman a Instagram: la API se simula con un fetch falso.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elegirPublicaciones, validarTexto, publicarEnInstagram } from '../scripts/publicar-instagram.mjs';

const calendario = `
| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-18 | Miércoles | Post | Post 4 · Cómo trabajo | Los 4 pasos |
| 2026-11-19 | Jueves | Historia | Detrás de escena | ... |
| 2026-11-20 | Viernes | Post | Post 5 · Quiropraxia | ... |
| 2026-11-25 | Miércoles | Post | Post 7 · Consejo | ... |
| 2026-11-25 | Miércoles | Post | Post 6 · Tienda WhatsApp | ... |
`;
const textos = `
## Post 4 · Cómo trabajo

\`\`\`texto
Cómo trabajo, en 4 pasos.
#a #b #c #d #e
\`\`\`

## Post 5 · Quiropraxia

\`\`\`texto
Quiropraxia Cipolletti.
#a #b #c #d #e
\`\`\`

## Post 6 · Tienda

\`\`\`texto
Tienda WhatsApp.
#a #b #c #d #e
\`\`\`

## Post 7 · Consejo

\`\`\`texto
Consejo.
#a #b #c #d #e
\`\`\`
`;
const base = 'https://ejemplo.github.io/Portfolio/brand/instagram/posts/';
const datos = (fecha, publicados = {}) => ({ calendario, textos, publicados, fecha, baseImagenes: base });

// CA-10.1
test('CA-10.1 elige el post del día con su imagen y su texto', () => {
  const r = elegirPublicaciones(datos('2026-11-18'));
  assert.deepEqual(r, [{ n: 4, imagenUrl: base + 'post-4.png', texto: 'Cómo trabajo, en 4 pasos.\n#a #b #c #d #e' }]);
});

// DEF-07: en Windows (git con core.autocrlf) calendario.md y textos.md quedan con finales de línea CRLF
test('CA-10.1 DEF-07: con finales de línea de Windows (CRLF) elige lo mismo y el texto sale sin \\r', () => {
  const crlf = (t) => t.replace(/\n/g, '\r\n');
  const r = elegirPublicaciones({ ...datos('2026-11-18'), calendario: crlf(calendario), textos: crlf(textos) });
  assert.deepEqual(r, [{ n: 4, imagenUrl: base + 'post-4.png', texto: 'Cómo trabajo, en 4 pasos.\n#a #b #c #d #e' }]);
});

test('CA-10.1 dos posts el mismo día salen en orden de número', () => {
  assert.deepEqual(elegirPublicaciones(datos('2026-11-25')).map(p => p.n), [6, 7]);
});

test('CA-10.1 un post sin texto en textos.md es un error', () => {
  const sinTexto = { ...datos('2026-11-18'), textos: '' };
  assert.throws(() => elegirPublicaciones(sinTexto), /post 4.*texto/i);
});

// CA-10.2
test('CA-10.2 un día sin post (o solo con historia) y sin nada atrasado no devuelve nada', () => {
  assert.deepEqual(elegirPublicaciones(datos('2026-11-19', { 4: { estado: 'publicado' } })), []);
  assert.deepEqual(elegirPublicaciones(datos('2026-11-23')), []);
});

// CA-10.3
test('CA-10.3 un post que ya figura en publicados no se repite', () => {
  const r = elegirPublicaciones(datos('2026-11-20', { 5: { estado: 'publicado', fecha: '2026-11-20' } }));
  assert.deepEqual(r.map(p => p.n), [4]);   // el 5 no se repite (el 4 sale por estar atrasado, CA-10.9)
});

// CA-10.4
test('CA-10.4 rechaza textos de más de 2.200 caracteres', () => {
  assert.throws(() => validarTexto('a'.repeat(2201)), /2\.?200/);
});

test('CA-10.4 DEF-02: rechaza más de 5 hashtags (límite de Instagram desde diciembre de 2025)', () => {
  const seis = Array.from({ length: 6 }, (_, i) => '#h' + i).join(' ');
  assert.throws(() => validarTexto(seis), /5/);
});

test('CA-10.4 DEF-02: acepta 5 hashtags', () => {
  assert.doesNotThrow(() => validarTexto('Hola #a #b #c #d #e'));
});

test('CA-10.4 acepta un texto dentro de los límites', () => {
  assert.doesNotThrow(() => validarTexto('Hola #uno #dos'));
});

// CA-10.5
function fetchFalso(respuestas) {
  const llamadas = [];
  const fn = async (url, opciones = {}) => {
    llamadas.push({ url: String(url), metodo: opciones.method ?? 'GET', cuerpo: opciones.body ? String(opciones.body) : '' });
    const r = respuestas.shift();
    return { ok: r.ok ?? true, status: r.status ?? 200, json: async () => r.json };
  };
  fn.llamadas = llamadas;
  return fn;
}

test('CA-10.5 crea el contenedor con la imagen y el texto y después lo publica', async () => {
  const fetch = fetchFalso([
    { json: { id: 'contenedor-1' } },
    { json: { status_code: 'FINISHED' } },
    { json: { id: 'media-99' } },
  ]);
  const id = await publicarEnInstagram({ igUserId: '123', token: 'TOKEN-DE-PRUEBA', imagenUrl: base + 'post-4.png', texto: 'Hola #uno', fetch, esperaMs: 0 });
  assert.equal(id, 'media-99');
  const [crear, estado, publicar] = fetch.llamadas;
  assert.equal(crear.metodo, 'POST');
  assert.match(crear.url, /\/123\/media$/);
  const p = new URLSearchParams(crear.cuerpo);
  assert.equal(p.get('image_url'), base + 'post-4.png');
  assert.equal(p.get('caption'), 'Hola #uno');
  assert.match(estado.url, /contenedor-1/);
  assert.match(publicar.url, /\/123\/media_publish$/);
  assert.equal(new URLSearchParams(publicar.cuerpo).get('creation_id'), 'contenedor-1');
});

test('CA-10.5 si Instagram rechaza, falla con el mensaje de la API y sin mostrar el token', async () => {
  const fetch = fetchFalso([{ ok: false, status: 400, json: { error: { message: 'Invalid OAuth access token' } } }]);
  await assert.rejects(
    publicarEnInstagram({ igUserId: '123', token: 'TOKEN-SECRETO', imagenUrl: base + 'post-4.png', texto: 'x', fetch, esperaMs: 0 }),
    (e) => /Invalid OAuth/.test(e.message) && !e.message.includes('TOKEN-SECRETO'),
  );
});

test('CA-10.5 si el contenedor da error, no se publica', async () => {
  const fetch = fetchFalso([{ json: { id: 'c-2' } }, { json: { status_code: 'ERROR' } }]);
  await assert.rejects(
    publicarEnInstagram({ igUserId: '123', token: 't', imagenUrl: base + 'post-4.png', texto: 'x', fetch, esperaMs: 0 }),
    /contenedor/i,
  );
  assert.equal(fetch.llamadas.some(l => /media_publish/.test(l.url)), false);
});

// ── HU-14: carruseles ──
import { publicarCarrusel } from '../scripts/publicar-instagram.mjs';

const calendarioCarr = `
| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-16 | Lunes | Carrusel | Carrusel C2 · 3 cosas que tu página tiene que tener | Consejos |
`;
const textosCarr = `
## Carrusel C2 · Consejo

\`\`\`texto
Tres cosas.
#a #b #c #d #e
\`\`\`
`;
const baseCarr = 'https://ejemplo.github.io/Portfolio/brand/instagram/carruseles/';

test('CA-14.7 elige el carrusel del día con todas sus imágenes en orden', () => {
  const r = elegirPublicaciones({ calendario: calendarioCarr, textos: textosCarr, fecha: '2026-11-16', carruseles: { C2: 3 }, baseCarruseles: baseCarr });
  assert.deepEqual(r, [{ id: 'C2', tipo: 'carrusel', imagenes: [1, 2, 3].map(n => `${baseCarr}C2/slide-${n}.png`), texto: 'Tres cosas.\n#a #b #c #d #e' }]);
});

test('CA-14.7 un carrusel ya publicado no se repite', () => {
  const r = elegirPublicaciones({ calendario: calendarioCarr, textos: textosCarr, fecha: '2026-11-16', carruseles: { C2: 3 }, baseCarruseles: baseCarr, publicados: { C2: { estado: 'publicado' } } });
  assert.deepEqual(r, []);
});

test('CA-14.7 un carrusel sin slides en contenido.json es un error', () => {
  assert.throws(() => elegirPublicaciones({ calendario: calendarioCarr, textos: textosCarr, fecha: '2026-11-16', carruseles: {}, baseCarruseles: baseCarr }), /C2.*slides/i);
});

test('CA-14.7 publica un carrusel: un contenedor por slide, el carrusel con sus hijos y la publicación', async () => {
  const fetch = fetchFalso([
    { json: { id: 'h1' } }, { json: { id: 'h2' } },
    { json: { id: 'carr' } }, { json: { status_code: 'FINISHED' } },
    { json: { id: 'media-7' } },
  ]);
  const imgs = [baseCarr + 'C2/slide-1.png', baseCarr + 'C2/slide-2.png'];
  const id = await publicarCarrusel({ igUserId: '123', token: 't', imagenes: imgs, texto: 'Hola #uno', fetch, esperaMs: 0 });
  assert.equal(id, 'media-7');
  const [h1, h2, carr, estado, pub] = fetch.llamadas;
  for (const [l, img] of [[h1, imgs[0]], [h2, imgs[1]]]) {
    const p = new URLSearchParams(l.cuerpo);
    assert.match(l.url, /\/123\/media$/);
    assert.equal(p.get('image_url'), img);
    assert.equal(p.get('is_carousel_item'), 'true');
  }
  const pc = new URLSearchParams(carr.cuerpo);
  assert.equal(pc.get('media_type'), 'CAROUSEL');
  assert.equal(pc.get('children'), 'h1,h2');
  assert.equal(pc.get('caption'), 'Hola #uno');
  assert.match(estado.url, /carr/);
  assert.equal(new URLSearchParams(pub.cuerpo).get('creation_id'), 'carr');
});

test('CA-14.7 rechaza carruseles de menos de 2 o más de 10 imágenes', async () => {
  await assert.rejects(publicarCarrusel({ igUserId: '1', token: 't', imagenes: ['a'], texto: 'x', fetch: fetchFalso([]), esperaMs: 0 }), /2 y 10/);
});

// ── HU-10: verificar la conexión sin publicar ──
import { verificarCuenta } from '../scripts/publicar-instagram.mjs';

test('CA-10.5 verificar: lee el usuario de la cuenta con el token, sin publicar', async () => {
  const fetch = fetchFalso([{ json: { id: '178', username: 'hefestowebs' } }]);
  const r = await verificarCuenta({ igUserId: '178', token: 'EAAsecreto', fetch });
  assert.equal(r.username, 'hefestowebs');
  assert.equal(fetch.llamadas.length, 1);
  assert.equal(fetch.llamadas[0].metodo, 'GET');
  assert.match(fetch.llamadas[0].url, /\/178\?fields=username/);
});

test('CA-10.5 verificar: si el token es inválido, falla sin mostrarlo', async () => {
  const fetch = fetchFalso([{ ok: false, status: 400, json: { error: { message: 'Invalid OAuth access token EAAsecreto' } } }]);
  await assert.rejects(verificarCuenta({ igUserId: '178', token: 'EAAsecreto', fetch }), (e) => /Invalid OAuth/.test(e.message) && !e.message.includes('EAAsecreto'));
});

// CA-10.9 · DEF-01: GitHub atrasó la corrida de las 19:00 del 16/11 hasta la 01:19 del 17 y el C2 no salió
test('CA-10.9 DEF-01: la corrida del día siguiente publica el carrusel que quedó pendiente', () => {
  const r = elegirPublicaciones({ calendario: calendarioCarr, textos: textosCarr, fecha: '2026-11-17', carruseles: { C2: 3 }, baseCarruseles: baseCarr });
  assert.deepEqual(r.map(p => p.id), ['C2']);
});

test('CA-10.9 DEF-01: lo atrasado ya publicado no se repite', () => {
  const r = elegirPublicaciones({ calendario: calendarioCarr, textos: textosCarr, fecha: '2026-11-17', carruseles: { C2: 3 }, baseCarruseles: baseCarr, publicados: { C2: { estado: 'publicado' } } });
  assert.deepEqual(r, []);
});

test('CA-10.9 DEF-01: lo pendiente de hasta 2 días antes sale primero, después lo de hoy', () => {
  assert.deepEqual(elegirPublicaciones(datos('2026-11-20')).map(p => p.n), [4, 5]);
});

test('CA-10.9 DEF-01: lo pendiente de más de 2 días atrás no se publica solo', () => {
  assert.deepEqual(elegirPublicaciones({ calendario: calendarioCarr, textos: textosCarr, fecha: '2026-11-19', carruseles: { C2: 3 }, baseCarruseles: baseCarr }), []);
});

// ── HU-15: reels (CA-15.5) ──
import { publicarReel } from '../scripts/publicar-instagram.mjs';

const calendarioReel = `
| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-25 | Miércoles | Reel | Reel R1 · 3 cosas que tu página tiene que tener | Hefesto explica |
`;
const textosReel = `
## Reel R1 · 3 cosas

\`\`\`texto
Tres cosas que tu página tiene que tener.
#a #b #c #d #e
\`\`\`
`;
const baseReels = 'https://ejemplo.github.io/Portfolio/brand/instagram/reels/';

test('CA-15.5 elige el reel del día con la URL pública del video y su texto', () => {
  const r = elegirPublicaciones({ calendario: calendarioReel, textos: textosReel, fecha: '2026-11-25', baseReels });
  assert.deepEqual(r, [{ id: 'R1', tipo: 'reel', videoUrl: baseReels + 'R1/R1.mp4', texto: 'Tres cosas que tu página tiene que tener.\n#a #b #c #d #e' }]);
});

test('CA-15.5 un reel ya publicado no se repite', () => {
  const r = elegirPublicaciones({ calendario: calendarioReel, textos: textosReel, fecha: '2026-11-25', baseReels, publicados: { R1: { estado: 'publicado' } } });
  assert.deepEqual(r, []);
});

test('CA-15.5 un reel sin texto en textos.md es un error', () => {
  assert.throws(() => elegirPublicaciones({ calendario: calendarioReel, textos: '', fecha: '2026-11-25', baseReels }), /R1.*texto/i);
});

test('CA-15.5 publica un reel: contenedor REELS con el video y el texto, espera a que Instagram lo procese y lo publica', async () => {
  const fetch = fetchFalso([
    { json: { id: 'cont-r' } },
    { json: { status_code: 'IN_PROGRESS' } }, { json: { status_code: 'IN_PROGRESS' } }, { json: { status_code: 'FINISHED' } },
    { json: { id: 'media-r1' } },
  ]);
  const id = await publicarReel({ igUserId: '123', token: 't', videoUrl: baseReels + 'R1/R1.mp4', texto: 'Hola #uno', fetch, esperaMs: 0 });
  assert.equal(id, 'media-r1');
  const [cont, , , listo, pub] = fetch.llamadas;
  const p = new URLSearchParams(cont.cuerpo);
  assert.match(cont.url, /\/123\/media$/);
  assert.equal(p.get('media_type'), 'REELS');
  assert.equal(p.get('video_url'), baseReels + 'R1/R1.mp4');
  assert.equal(p.get('caption'), 'Hola #uno');
  assert.match(listo.url, /cont-r\?fields=status_code/);
  assert.match(pub.url, /\/123\/media_publish$/);
  assert.equal(new URLSearchParams(pub.cuerpo).get('creation_id'), 'cont-r');
});

test('CA-15.5 si Instagram no puede procesar el video, falla sin publicar', async () => {
  const fetch = fetchFalso([{ json: { id: 'cont-r' } }, { json: { status_code: 'ERROR' } }]);
  await assert.rejects(publicarReel({ igUserId: '123', token: 't', videoUrl: baseReels + 'R1/R1.mp4', texto: 'x', fetch, esperaMs: 0 }), /ERROR/);
  assert.equal(fetch.llamadas.some(l => /media_publish/.test(l.url)), false);
});
