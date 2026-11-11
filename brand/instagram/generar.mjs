// Genera las piezas de Instagram (HU-04) desde las plantillas y brand/instagram/contenido.json.
// Correr:  node brand/instagram/generar.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const aqui = new URL('./', import.meta.url);
const ruta = (rel) => fileURLToPath(new URL(rel, aqui));
const datos = JSON.parse(readFileSync(new URL('contenido.json', aqui), 'utf8'));
for (const d of ['posts', 'destacadas', 'historias']) mkdirSync(new URL(d + '/', aqui), { recursive: true });

const piezas = [
  ...datos.posts.map(p => ({
    plantilla: 'post', w: 1080, h: 1350, salida: `posts/post-${p.n}.png`,
    datos: p.precio ? { ...p, precioTexto: datos.precios[p.precio] } : p,
  })),
  ...datos.destacadas.map(icono => ({ plantilla: 'historia', w: 1080, h: 1920, salida: `destacadas/${icono}.png`, datos: { tipo: 'destacada', icono } })),
  { plantilla: 'historia', w: 1080, h: 1920, salida: 'historias/historia-ejemplo.png', datos: datos.historiaEjemplo },
];

// En Windows el antivirus a veces bloquea el archivo un instante: se reintenta antes de fallar.
async function guardar(destino, png, intentos = 5) {
  for (let i = 1; ; i++) {
    try { writeFileSync(destino, png); return; }
    catch (e) { if (i >= intentos) throw e; await new Promise(r => setTimeout(r, 400 * i)); }
  }
}

const browser = await chromium.launch();
for (const p of piezas) {
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1 });
  const url = new URL(`plantillas/${p.plantilla}.html`, aqui);
  url.hash = encodeURIComponent(JSON.stringify(p.datos));
  await page.goto(url.href, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await guardar(ruta(p.salida), await page.screenshot({ type: 'png' }));
  console.log('✓', p.salida);
  await page.close();
}
await browser.close();
