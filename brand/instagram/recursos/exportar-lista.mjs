// HU-17 (RN-17.6): exporta la lista del R6 a PNG de 1080×1350.
// Uso: node brand/instagram/recursos/exportar-lista.mjs
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';

const html = fileURLToPath(new URL('lista-revisa-tu-web.html', import.meta.url));
const png = fileURLToPath(new URL('lista-revisa-tu-web.png', import.meta.url));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: png });
await b.close();
console.log('✓ ' + png);
