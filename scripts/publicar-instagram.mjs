// Publicación automática en Instagram (HU-10).
// Busca en brand/instagram/calendario.md qué post toca hoy (hora de Argentina), toma su imagen publicada en
// GitHub Pages y su texto de textos.md, y lo publica en @efestowebs con la API oficial de Instagram.
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
const LIMITE_TEXTO = 2200;
const LIMITE_HASHTAGS = 30;

// ── Lógica pura (la cubren los tests) ──

/** Posts que tocan en `fecha` según el calendario, sin los ya publicados, en orden de número. */
export function elegirPublicaciones({ calendario, textos, publicados = {}, fecha, baseImagenes = BASE_IMAGENES }) {
  const numeros = calendario.split('\n')
    .map(l => l.split('|').map(s => s.trim()))
    .filter(c => c[1] === fecha && c[3] === 'Post')
    .map(c => Number((c[4].match(/Post (\d+)/) || [])[1]))
    .filter(n => Number.isInteger(n) && !publicados[n])
    .sort((a, b) => a - b);
  const porPost = textosPorPost(textos);
  return numeros.map(n => {
    const texto = porPost.get(n);
    if (!texto) throw new Error(`El post ${n} está en el calendario pero no tiene texto en textos.md`);
    return { n, imagenUrl: `${baseImagenes}post-${n}.png`, texto };
  });
}

/** Falla si el texto supera los límites de Instagram. */
export function validarTexto(texto) {
  const largo = [...texto].length;
  if (largo > LIMITE_TEXTO) throw new Error(`El texto tiene ${largo} caracteres (máximo 2.200)`);
  const hashtags = (texto.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  if (hashtags > LIMITE_HASHTAGS) throw new Error(`El texto tiene ${hashtags} hashtags (máximo 30)`);
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

// ── Línea de comandos ──

function hoyEnArgentina() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

async function principal() {
  const args = process.argv.slice(2);
  const prueba = args.includes('--prueba');
  const fecha = (args.find(a => a.startsWith('--fecha=')) ?? '').slice(8) || hoyEnArgentina();
  const raiz = (rel) => fileURLToPath(new URL('../' + rel, import.meta.url));
  const rutaPublicados = raiz('brand/instagram/publicados.json');
  const publicados = existsSync(rutaPublicados) ? JSON.parse(readFileSync(rutaPublicados, 'utf8')) : {};

  const posts = elegirPublicaciones({
    calendario: readFileSync(raiz('brand/instagram/calendario.md'), 'utf8'),
    textos: readFileSync(raiz('brand/instagram/textos.md'), 'utf8'),
    publicados, fecha,
  });
  if (!posts.length) { console.log(`${fecha}: no hay post para publicar hoy.`); return; }

  const { IG_USER_ID: igUserId, IG_ACCESS_TOKEN: token } = process.env;
  if (!prueba && (!igUserId || !token)) throw new Error('Faltan IG_USER_ID o IG_ACCESS_TOKEN (se cargan en GitHub › Settings › Secrets)');

  for (const p of posts) {
    validarTexto(p.texto);
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
