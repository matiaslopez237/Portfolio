// Arma una imagen de cómo se ve el perfil con la grilla de 9 y las destacadas (HU-04, para revisar CA-04.7).
// Correr después de generar.mjs:  node brand/instagram/vista-perfil.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { writeFileSync, unlinkSync } from 'node:fs';
const aqui = new URL('./', import.meta.url);
const orden = [9, 8, 7, 6, 5, 4, 3, 2, 1]; // Instagram muestra primero el último publicado
const dest = ['trabajos', 'planes', 'proceso', 'preguntas', 'contacto'];
const nombres = { trabajos: 'Trabajos', planes: 'Planes', proceso: 'Proceso', preguntas: 'Preguntas', contacto: 'Contacto' };
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box} body{width:540px;background:#fff;font-family:-apple-system,"Segoe UI",Roboto,sans-serif;color:#111}
.top{display:flex;align-items:center;gap:22px;padding:22px 18px 10px}.av{width:86px;height:86px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #fff,0 0 0 3.5px #ddd}
.av img{width:100%;height:100%;object-fit:cover}.st{display:flex;gap:26px;font-size:14px;text-align:center}.st b{display:block;font-size:17px}
.bio{padding:0 18px;font-size:14px;line-height:1.4}.bio b{display:block}.lnk{color:#00376b;font-weight:600}
.dest{display:flex;gap:16px;padding:16px 18px 14px;overflow:hidden}.dest figure{display:grid;justify-items:center;gap:5px;font-size:12px}
.dest .c{width:64px;height:64px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 1.5px #fff,0 0 0 2.5px #ccc}.dest img{width:100%;height:100%;object-fit:cover}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}.grid img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
</style></head><body>
<div class="top"><div class="av"><img src="../export/perfil-instagram.png"></div><div class="st"><span><b>9</b>posts</span><span><b>—</b>seguidores</span><span><b>—</b>seguidos</span></div></div>
<div class="bio"><b>Hefesto Webs</b>Páginas web forjadas a medida para negocios 🔨<br>Por Matias Lopez · Ing. en Sistemas<br>San Rafael, Mendoza → todo el país<br><span class="lnk">matiaslopez237.github.io/Portfolio</span></div>
<div class="dest">${dest.map(d => `<figure><div class="c"><img src="destacadas/${d}.png"></div>${nombres[d]}</figure>`).join('')}</div>
<div class="grid">${orden.map(n => `<img src="archivo/posts/post-${n}.png">`).join('')}</div></body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 540, height: 900 }, deviceScaleFactor: 2 });
// Se escribe como archivo temporal junto a las imágenes, así el navegador puede leerlas.
const temporal = new URL('_vista-temporal.html', aqui);
writeFileSync(temporal, html);
await page.goto(temporal.href, { waitUntil: 'load' });
await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
await page.screenshot({ path: fileURLToPath(new URL('vista-perfil.png', aqui)), fullPage: true });
await browser.close();
unlinkSync(temporal);
console.log('✓ vista-perfil.png');
