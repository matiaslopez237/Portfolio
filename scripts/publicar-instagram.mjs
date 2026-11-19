// Publicación automática en Instagram (HU-10).
// Busca en brand/instagram/calendario.md qué post toca hoy (hora de Argentina), toma su imagen publicada en
// GitHub Pages y su texto de textos.md, y lo publica en @hefestowebs con la API oficial de Instagram.
//
// Uso:
//   node scripts/publicar-instagram.mjs --prueba                 muestra qué publicaría hoy, sin llamar a Instagram
//   node scripts/publicar-instagram.mjs --prueba --fecha=2026-11-18
//   node scripts/publicar-instagram.mjs                          publica de verdad (necesita IG_USER_ID e IG_ACCESS_TOKEN)
//
// El token nunca se escribe en el código ni se muestra en los logs: llega por variable de entorno
// (en GitHub, desde Settings › Secrets). Ver docs/specs/HU-10-publicacion-automatica-instagram.md.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const BASE_IMAGENES = 'https://matiaslopez237.github.io/Portfolio/brand/instagram/posts/';
export const BASE_CARRUSELES = 'https://matiaslopez237.github.io/Portfolio/brand/instagram/carruseles/';
export const BASE_REELS = 'https://matiaslopez237.github.io/Portfolio/brand/instagram/reels/';
const LIMITE_TEXTO = 2200;
const LIMITE_HASHTAGS = 5;   // Instagram lo bajó de 30 a 5 por publicación desde el 18-19/12/2025 (DEF-02)

// ── Lógica pura (la cubren los tests) ──

/** Cuántos días atrás se busca lo que quedó sin publicar (DEF-01: GitHub atrasa las corridas programadas). */
export const DIAS_ATRASO = 2;

/** La fecha AAAA-MM-DD de `dias` días antes. */
function diasAntes(fecha, dias) {
  const d = new Date(fecha + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - dias);
  return d.toISOString().slice(0, 10);
}

/**
 * Lo que toca publicar en `fecha` según el calendario, sin lo ya publicado, más lo que quedó pendiente
 * de hasta DIAS_ATRASO días antes (RN-10.8), del más viejo al más nuevo.
 * Por día: posts de una imagen (HU-10, en orden de número) y después carruseles (HU-14).
 * `carruseles` es { C1: cantidadDeSlides, ... } y sale de contenido.json.
 */
export function elegirPublicaciones({ fecha, diasAtraso = DIAS_ATRASO, ...resto }) {
  // DEF-07: en Windows (git con core.autocrlf) los .md quedan con finales CRLF; se pasan a LF antes de leerlos
  for (const k of ['calendario', 'textos']) if (typeof resto[k] === 'string') resto[k] = resto[k].replace(/\r\n/g, '\n');
  const dias = [];
  for (let n = diasAtraso; n >= 0; n--) dias.push(diasAntes(fecha, n));
  return dias.flatMap(dia => delDia({ ...resto, fecha: dia }));
}

function delDia({ calendario, textos, publicados = {}, fecha, baseImagenes = BASE_IMAGENES, carruseles = {}, baseCarruseles = BASE_CARRUSELES, baseReels = BASE_REELS }) {
  const filas = calendario.split('\n').map(l => l.split('|').map(s => s.trim())).filter(c => c[1] === fecha);
  const numeros = filas
    .filter(c => c[3] === 'Post')
    .map(c => Number((c[4].match(/Post (\d+)/) || [])[1]))
    .filter(n => Number.isInteger(n) && !publicados[n])
    .sort((a, b) => a - b);
  const porPost = textosPorPost(textos);
  const posts = numeros.map(n => {
    const texto = porPost.get(n);
    if (!texto) throw new Error(`El post ${n} está en el calendario pero no tiene texto en textos.md`);
    return { n, imagenUrl: `${baseImagenes}post-${n}.png`, texto };
  });
  const porCarrusel = textosPorCarrusel(textos);
  const carr = filas
    .filter(c => c[3] === 'Carrusel')
    .map(c => (c[4].match(/Carrusel (C\d+)/) || [])[1])
    .filter(id => id && !publicados[id])
    .map(id => {
      const n = carruseles[id];
      if (!n) throw new Error(`El carrusel ${id} está en el calendario pero no tiene slides en contenido.json`);
      const texto = porCarrusel.get(id);
      if (!texto) throw new Error(`El carrusel ${id} está en el calendario pero no tiene texto en textos.md`);
      return { id, tipo: 'carrusel', imagenes: Array.from({ length: n }, (_, i) => `${baseCarruseles}${id}/slide-${i + 1}.png`), texto };
    });
  // Reels (HU-15): el video está en Pages, en reels/<id>/<id>.mp4
  const porReel = textosPorReel(textos);
  const reels = filas
    .filter(c => c[3] === 'Reel')
    .map(c => (c[4].match(/Reel (R\d+)/) || [])[1])
    .filter(id => id && !publicados[id])
    .map(id => {
      const texto = porReel.get(id);
      if (!texto) throw new Error(`El reel ${id} está en el calendario pero no tiene texto en textos.md`);
      return { id, tipo: 'reel', videoUrl: `${baseReels}${id}/${id}.mp4`, texto };
    });
  return [...posts, ...carr, ...reels];
}

/** Falla si el texto supera los límites de Instagram. */
export function validarTexto(texto) {
  const largo = [...texto].length;
  if (largo > LIMITE_TEXTO) throw new Error(`El texto tiene ${largo} caracteres (máximo 2.200)`);
  const hashtags = (texto.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  if (hashtags > LIMITE_HASHTAGS) throw new Error(`El texto tiene ${hashtags} hashtags (máximo ${LIMITE_HASHTAGS}, límite de Instagram)`);
}

function textosPorReel(md) {
  return new Map([...md.matchAll(/^## Reel (R\d+)[^\n]*\n[\s\S]*?```texto\n([\s\S]*?)\n```/gm)].map(m => [m[1], m[2]]));
}
function textosPorCarrusel(md) {
  return new Map([...md.matchAll(/^## Carrusel (C\d+)[^\n]*\n[\s\S]*?```texto\n([\s\S]*?)\n```/gm)].map(m => [m[1], m[2]]));
}

function textosPorPost(md) {
  return new Map([...md.matchAll(/^## Post (\d+)[^\n]*\n[\s\S]*?```texto\n([\s\S]*?)\n```/gm)].map(m => [Number(m[1]), m[2]]));
}

// ── API de Instagram ──

/** Tokens de "Instagram Login" van a graph.instagram.com; los de "Facebook Login" (EAA…) a graph.facebook.com. */
function hostApi(token) {
  if (process.env.IG_API_HOST) return process.env.IG_API_HOST.replace(/\/$/, '');
  const version = process.env.IG_API_VERSION ? '/' + process.env.IG_API_VERSION : '';
  return (token.startsWith('EAA') ? 'https://graph.facebook.com' : 'https://graph.instagram.com') + version;
}

async function llamar(fetch, url, opciones, token) {
  const r = await fetch(url, opciones);
  const json = await r.json().catch(() => ({}));
  if (!r.ok || json.error) {
    const mensaje = (json.error?.message ?? `respuesta ${r.status}`).replaceAll(token, '***');
    throw new Error(`Instagram rechazó la llamada: ${mensaje}`);
  }
  return json;
}

/** Crea el contenedor con la imagen y el texto, espera a que esté listo y lo publica. Devuelve el id del post. */
export async function publicarEnInstagram({ igUserId, token, imagenUrl, texto, fetch = globalThis.fetch, esperaMs = 3000, intentos = 10 }) {
  const api = hostApi(token);
  const form = (datos) => ({ method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...datos, access_token: token }).toString() });

  const { id: contenedor } = await llamar(fetch, `${api}/${igUserId}/media`, form({ image_url: imagenUrl, caption: texto }), token);

  for (let i = 0; ; i++) {
    const { status_code: estado } = await llamar(fetch, `${api}/${contenedor}?fields=status_code&access_token=${encodeURIComponent(token)}`, {}, token);
    if (estado === 'FINISHED') break;
    if (estado === 'ERROR' || estado === 'EXPIRED') throw new Error(`El contenedor de Instagram quedó en estado ${estado}: no se publicó`);
    if (i >= intentos) throw new Error('El contenedor de Instagram no estuvo listo a tiempo: no se publicó');
    await new Promise(r => setTimeout(r, esperaMs));
  }

  const { id } = await llamar(fetch, `${api}/${igUserId}/media_publish`, form({ creation_id: contenedor }), token);
  return id;
}

/** Publica un carrusel: un contenedor por imagen, el contenedor del carrusel con sus hijos y la publicación (HU-14). */
export async function publicarCarrusel({ igUserId, token, imagenes, texto, fetch = globalThis.fetch, esperaMs = 3000, intentos = 10 }) {
  if (imagenes.length < 2 || imagenes.length > 10) throw new Error('Un carrusel tiene que tener entre 2 y 10 imágenes');
  const api = hostApi(token);
  const form = (datos) => ({ method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...datos, access_token: token }).toString() });
  const hijos = [];
  for (const imagen of imagenes) hijos.push((await llamar(fetch, `${api}/${igUserId}/media`, form({ image_url: imagen, is_carousel_item: 'true' }), token)).id);
  const { id: contenedor } = await llamar(fetch, `${api}/${igUserId}/media`, form({ media_type: 'CAROUSEL', children: hijos.join(','), caption: texto }), token);
  for (let i = 0; ; i++) {
    const { status_code: estado } = await llamar(fetch, `${api}/${contenedor}?fields=status_code&access_token=${encodeURIComponent(token)}`, {}, token);
    if (estado === 'FINISHED') break;
    if (estado === 'ERROR' || estado === 'EXPIRED') throw new Error(`El contenedor del carrusel quedó en estado ${estado}: no se publicó`);
    if (i >= intentos) throw new Error('El contenedor del carrusel no estuvo listo a tiempo: no se publicó');
    await new Promise(r => setTimeout(r, esperaMs));
  }
  const { id } = await llamar(fetch, `${api}/${igUserId}/media_publish`, form({ creation_id: contenedor }), token);
  return id;
}

/** Comprueba la conexión sin publicar: lee el usuario de la cuenta con el token. */
/**
 * Publica un reel (HU-15): crea el contenedor REELS con la URL pública del video y el texto, espera a que
 * Instagram termine de procesar el video (puede tardar minutos) y lo publica. Si el proceso falla, no publica.
 */
export async function publicarReel({ igUserId, token, videoUrl, texto, fetch = globalThis.fetch, esperaMs = 10000, intentos = 60 }) {
  const api = hostApi(token);
  const form = (datos) => ({ method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...datos, access_token: token }).toString() });
  const { id: contenedor } = await llamar(fetch, `${api}/${igUserId}/media`, form({ media_type: 'REELS', video_url: videoUrl, caption: texto }), token);
  for (let i = 0; ; i++) {
    const { status_code: estado } = await llamar(fetch, `${api}/${contenedor}?fields=status_code&access_token=${encodeURIComponent(token)}`, {}, token);
    if (estado === 'FINISHED') break;
    if (estado === 'ERROR' || estado === 'EXPIRED') throw new Error(`Instagram no pudo procesar el video del reel (estado ${estado}): no se publicó`);
    if (i >= intentos) throw new Error('Instagram no terminó de procesar el video del reel a tiempo: no se publicó');
    await new Promise(r => setTimeout(r, esperaMs));
  }
  const { id } = await llamar(fetch, `${api}/${igUserId}/media_publish`, form({ creation_id: contenedor }), token);
  return id;
}

export async function verificarCuenta({ igUserId, token, fetch = globalThis.fetch }) {
  return llamar(fetch, `${hostApi(token)}/${igUserId}?fields=username&access_token=${encodeURIComponent(token)}`, { method: 'GET' }, token);
}

// ── Línea de comandos ──

function hoyEnArgentina() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

async function principal() {
  const args = process.argv.slice(2);
  const prueba = args.includes('--prueba');
  if (args.includes('--verificar')) {
    const { IG_USER_ID: id, IG_ACCESS_TOKEN: tk } = process.env;
    if (!id || !tk) throw new Error('Faltan IG_USER_ID o IG_ACCESS_TOKEN (se cargan en GitHub › Settings › Secrets)');
    const cuenta = await verificarCuenta({ igUserId: id, token: tk });
    console.log(`✓ Conexión OK con Instagram: @${cuenta.username} (no se publicó nada)`);
    return;
  }
  const fecha = (args.find(a => a.startsWith('--fecha=')) ?? '').slice(8) || hoyEnArgentina();
  const raiz = (rel) => fileURLToPath(new URL('../' + rel, import.meta.url));
  const rutaPublicados = raiz('brand/instagram/publicados.json');
  const publicados = existsSync(rutaPublicados) ? JSON.parse(readFileSync(rutaPublicados, 'utf8')) : {};

  const contenido = JSON.parse(readFileSync(raiz('brand/instagram/contenido.json'), 'utf8'));
  const carruseles = Object.fromEntries((contenido.carruseles ?? []).map(c => [c.id, c.slides.length]));
  const posts = elegirPublicaciones({
    calendario: readFileSync(raiz('brand/instagram/calendario.md'), 'utf8'),
    textos: readFileSync(raiz('brand/instagram/textos.md'), 'utf8'),
    publicados, fecha, carruseles,
  });
  if (!posts.length) { console.log(`${fecha}: no hay post para publicar hoy.`); return; }

  const { IG_USER_ID: igUserId, IG_ACCESS_TOKEN: token } = process.env;
  if (!prueba && (!igUserId || !token)) throw new Error('Faltan IG_USER_ID o IG_ACCESS_TOKEN (se cargan en GitHub › Settings › Secrets)');

  for (const p of posts) {
    validarTexto(p.texto);
    if (p.tipo === 'reel') {
      const video = await fetch(p.videoUrl, { method: 'HEAD' }).catch(() => null), videoOk = video?.ok === true;
      if (prueba) {
        console.log(`[prueba] ${fecha} · reel ${p.id}\n  video: ${p.videoUrl} (${videoOk ? 'responde' : 'NO responde'})\n  texto (${[...p.texto].length} caracteres):\n${p.texto.replace(/^/gm, '    ')}`);
        continue;
      }
      if (!videoOk) throw new Error(`El video del reel ${p.id} no está publicado en ${p.videoUrl}: hacé push antes de que le toque`);
      const id = await publicarReel({ igUserId, token, videoUrl: p.videoUrl, texto: p.texto });
      publicados[p.id] = { estado: 'publicado', fecha, id };
      writeFileSync(rutaPublicados, JSON.stringify(publicados, null, 2) + '\n');
      console.log(`✓ ${fecha} · reel ${p.id} publicado en Instagram (id ${id})`);
      continue;
    }
    if (p.tipo === 'carrusel') {
      const faltan = [];
      for (const url of p.imagenes) { const r = await fetch(url, { method: 'HEAD' }).catch(() => null); if (!r?.ok) faltan.push(url); }
      if (prueba) {
        console.log(`[prueba] ${fecha} · carrusel ${p.id} (${p.imagenes.length} slides${faltan.length ? `, ${faltan.length} todavía no están en Pages` : ''})\n  texto (${[...p.texto].length} caracteres):\n${p.texto.replace(/^/gm, '    ')}`);
        continue;
      }
      if (faltan.length) throw new Error(`Faltan imágenes del carrusel ${p.id} en Pages: ${faltan.join(', ')}`);
      const id = await publicarCarrusel({ igUserId, token, imagenes: p.imagenes, texto: p.texto });
      publicados[p.id] = { estado: 'publicado', fecha, id };
      writeFileSync(rutaPublicados, JSON.stringify(publicados, null, 2) + '\n');
      console.log(`✓ ${fecha} · carrusel ${p.id} publicado en Instagram (id ${id})`);
      continue;
    }
    const imagen = await fetch(p.imagenUrl, { method: 'HEAD' }).catch(() => null);
    const imagenOk = imagen?.ok === true;
    if (prueba) {
      console.log(`[prueba] ${fecha} · post ${p.n}\n  imagen: ${p.imagenUrl} (${imagenOk ? 'responde' : 'NO responde'})\n  texto (${[...p.texto].length} caracteres):\n${p.texto.replace(/^/gm, '    ')}`);
      continue;
    }
    if (!imagenOk) throw new Error(`La imagen del post ${p.n} no está publicada en ${p.imagenUrl}: hacé push antes de que le toque`);
    const id = await publicarEnInstagram({ igUserId, token, imagenUrl: p.imagenUrl, texto: p.texto });
    publicados[p.n] = { estado: 'publicado', fecha, id };
    writeFileSync(rutaPublicados, JSON.stringify(publicados, null, 2) + '\n');
    console.log(`✓ ${fecha} · post ${p.n} publicado en Instagram (id ${id})`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  principal().catch(e => { console.error('✗ ' + e.message); process.exit(1); });
}
