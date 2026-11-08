// Genera las piezas de Instagram (HU-04) desde las plantillas y brand/instagram/contenido.json.
// Correr:  node brand/instagram/generar.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
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

const browser = await chromium.launch();
for (const p of piezas) {
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1 });
  const url = new URL(`plantillas/${p.plantilla}.html`, aqui);
  url.hash = encodeURIComponent(JSON.stringify(p.datos));
  await page.goto(url.href, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await page.screenshot({ path: ruta(p.salida), type: 'png' });
  console.log('✓', p.salida);
  await page.close();
}
await browser.close();
