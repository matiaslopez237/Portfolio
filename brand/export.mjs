// Genera las exportaciones PNG de la marca (HU-03, CA-03.4) a partir de los SVG de brand/logo.
// Si cambia el nombre o el logo, se edita el SVG y se vuelve a correr:  node brand/export.mjs
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const dir = new URL('./', import.meta.url);
const leer = (f) => readFileSync(new URL(f, dir), 'utf8');
const tokens = JSON.parse(leer('tokens.json'));
const c = tokens.color;
const simbolo = leer('logo/simbolo.svg');
const simboloChico = leer('logo/simbolo-chico.svg');
const logo = leer('logo/logo.svg');
mkdirSync(new URL('export/', dir), { recursive: true });

const fuentes = `<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..800&family=Public+Sans:wght@400;500;700&display=swap" rel="stylesheet">`;
const pagina = (w, h, cuerpo) => `<!DOCTYPE html><html><head><meta charset="utf-8">${fuentes}<style>
  *{margin:0;box-sizing:border-box} html,body{width:${w}px;height:${h}px;background:${c.fondo};overflow:hidden}
  .centro{width:100%;height:100%;display:grid;place-items:center} svg{display:block}
</style></head><body>${cuerpo}</body></html>`;
const conTamano = (svg, px) => svg.replace('<svg ', `<svg width="${px}" height="${px}" `);

const piezas = [
  // Foto de perfil: el símbolo al ~58% para que no se corte en el círculo.
  { archivo: 'perfil-instagram.png', w: 1080, h: 1080, html: `<div class="centro">${conTamano(simbolo, 620)}</div>` },
  { archivo: 'perfil-whatsapp.png', w: 640, h: 640, html: `<div class="centro">${conTamano(simbolo, 368)}</div>` },
  // Íconos chicos: versión de trazo grueso.
  { archivo: 'favicon-32.png', w: 32, h: 32, html: `<div class="centro">${conTamano(simboloChico, 30)}</div>` },
  { archivo: 'apple-touch-icon.png', w: 180, h: 180, html: `<div class="centro">${conTamano(simboloChico, 128)}</div>` },
  // Imagen para compartir el link (Open Graph).
  {
    archivo: 'og.png', w: 1200, h: 630, html: `
    <div style="position:relative;width:100%;height:100%;padding:72px 80px;font-family:'Public Sans',sans-serif;color:${c.texto}">
      ${logo.replace('<svg ', '<svg width="520" height="120" ')}
      <p style="margin-top:56px;font-family:'Archivo',sans-serif;font-variation-settings:'wdth' 70;font-weight:800;text-transform:uppercase;font-size:88px;line-height:.9">Tu página,<br><span style="color:${c.acento}">forjada</span> a medida.</p>
      <p style="position:absolute;left:80px;bottom:64px;font-size:24px;color:${c.textoSecundario}">Páginas y tiendas para negocios · San Rafael, Mendoza → todo el país</p>
      <div style="position:absolute;right:80px;bottom:56px;width:56px;height:8px;border-radius:2px;background:${c.acento}"></div>
    </div>` },
];

const browser = await chromium.launch();
for (const p of piezas) {
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h }, deviceScaleFactor: 1 });
  await page.setContent(pagina(p.w, p.h, p.html), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL('export/' + p.archivo, dir).pathname.replace(/^\/([A-Z]:)/, '$1'), type: 'png', omitBackground: false });
  console.log('✓', p.archivo, `${p.w}×${p.h}`);
  await page.close();
}
await browser.close();
