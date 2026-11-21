// HU-17 · Graba un sitio real en tamaño celular para el teléfono del reel (RN-17.4).
// Saca capturas de pantalla bajando de a 40 px entre las "paradas" del guion y anota, en cada parada,
// dónde está el botón de WhatsApp visible y el mensaje que trae escrito.
// No toca nada ni manda mensajes: los pedidos a WhatsApp se bloquean.
// Uso: node brand/instagram/reels/grabar-sitio.mjs R3   (lee "sitio": { url, paradas } de guiones.json)
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ANCHO = 390, ALTO = 844, ESCALA = 2, PASO = 40;
const WHATSAPP = /^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|chat\.whatsapp\.com)\//;

export async function grabarSitio({ url, paradas, salida }) {
  mkdirSync(salida, { recursive: true });
  for (const f of readdirSync(salida)) if (/^f-\d+\.jpg$/.test(f)) rmSync(join(salida, f));
  const b = await chromium.launch();
  let bloqueados = 0;
  try {
    const ctx = await b.newContext({ viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: ESCALA, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'es-AR' });
    await ctx.route(WHATSAPP, (r) => { bloqueados++; return r.abort(); });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    // Botones de WhatsApp visibles en la pantalla (coordenadas de la pantalla del celular, en px CSS)
    const botones = () => p.evaluate((re) => [...document.querySelectorAll('a[href]')]
      .filter(a => new RegExp(re).test(a.href))
      .map(a => { const r = a.getBoundingClientRect(), u = new URL(a.href); return { x: r.x, y: r.y, w: r.width, h: r.height, fijo: getComputedStyle(a).position === 'fixed', mensaje: u.searchParams.get('text') ?? '' }; })
      .filter(r => r.w > 0 && r.h > 0 && r.y >= 0 && r.y + r.h <= innerHeight && r.x >= 0 && r.x + r.w <= innerWidth), WHATSAPP.source);
    const todos = await p.evaluate((re) => [...document.querySelectorAll('a[href]')].some(a => new RegExp(re).test(a.href)), WHATSAPP.source);
    if (!todos) throw new Error(`no encontré un botón de WhatsApp en ${url}`);

    const frames = [], marcas = [];
    const ir = async (y) => { await p.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, y); }, y); await p.waitForTimeout(120); };
    const capturar = async (y) => {
      const archivo = `f-${String(frames.length).padStart(3, '0')}.jpg`;
      await p.screenshot({ path: join(salida, archivo), type: 'jpeg', quality: 86 });
      frames.push({ scroll: y, archivo });
    };
    const orden = [...paradas];
    await ir(orden[0]); await p.waitForTimeout(400); await capturar(orden[0]);
    for (let i = 1; i < orden.length; i++) {
      const a = orden[i - 1], z = orden[i], n = Math.ceil(Math.abs(z - a) / PASO);
      for (let k = 1; k <= n; k++) {
        const y = Math.round(a + (z - a) * k / n);
        await ir(y);
        if (k === n) await p.waitForTimeout(400);   // en la parada se espera a que todo termine de aparecer
        await capturar(y);
      }
    }
    // en cada parada: el botón de WhatsApp visible (el que no es flotante, si hay; si no, el flotante)
    for (const y of [...new Set(paradas)]) {
      await ir(y);
      const vis = await botones();
      const elegido = vis.find(v => !v.fijo && v.mensaje) ?? vis.find(v => v.mensaje) ?? vis[0];
      if (elegido) marcas.push({ parada: y, ...elegido });
    }
    const real = await p.evaluate(() => scrollY);
    const info = { url, anchoCss: ANCHO, altoCss: ALTO, escala: ESCALA, frames, botones: marcas, grabado: new Date().toISOString().slice(0, 10), ultimoScrollReal: real };
    writeFileSync(join(salida, 'sitio.json'), JSON.stringify(info, null, 1));
    return { ...info, bloqueados };
  } finally {
    await b.close();
  }
}

// Uso desde la consola
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const id = process.argv[2];
  const aqui = new URL('./', import.meta.url);
  const reel = JSON.parse(readFileSync(new URL('guiones.json', aqui), 'utf8')).reels.find(r => r.id === id);
  if (!reel?.sitio) { console.error(`el reel "${id}" no tiene "sitio": { url, paradas } en guiones.json`); process.exit(1); }
  const r = await grabarSitio({ ...reel.sitio, salida: fileURLToPath(new URL(`${id}/sitio/`, aqui)) });
  console.log(`✓ ${r.frames.length} capturas de ${r.url}; botones: ${r.botones.map(b => `${b.parada} → "${b.mensaje}"`).join(' · ')}; ${r.bloqueados} pedidos a WhatsApp bloqueados`);
}
