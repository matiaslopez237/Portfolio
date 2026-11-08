// Genera las piezas de WhatsApp Business (HU-05) desde las plantillas y brand/whatsapp/contenido.json:
// el QR del chat, las 3 tarjetas del catálogo (800×800) y el flyer (1080×1920).
// Correr:  node brand/whatsapp/generar.mjs
import { chromium } from 'playwright';
import QRCode from 'qrcode';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const aqui = new URL('./', import.meta.url);
const ruta = (rel) => fileURLToPath(new URL(rel, aqui));
const datos = JSON.parse(readFileSync(new URL('contenido.json', aqui), 'utf8'));
mkdirSync(new URL('catalogo/', aqui), { recursive: true });

// QR: abre el chat con el mensaje listo. Colores de la marca (módulos acero sobre texto claro) y margen para que se lea bien.
const linkChat = `https://wa.me/${datos.numero}?text=${encodeURIComponent(datos.mensajeQr)}`;
await QRCode.toFile(ruta('qr-whatsapp.png'), linkChat, { width: 660, margin: 3, errorCorrectionLevel: 'M', color: { dark: '#1b2128ff', light: '#eef1f4ff' } });
console.log('✓ qr-whatsapp.png →', linkChat);

const nombres = Object.fromEntries(datos.catalogo.map(p => [p.precio, p.nombre]));
const piezas = [
  ...datos.catalogo.map(p => ({
    plantilla: 'catalogo', w: 800, h: 800, salida: `catalogo/${p.id}.png`,
    datos: { nombre: p.nombre, ideal: p.ideal, items: p.items, precioTexto: datos.precios[p.precio] },
  })),
  {
    plantilla: 'flyer', w: 1080, h: 1920, salida: 'flyer.png',
    datos: {
      precios: Object.entries(datos.precios).map(([k, v]) => [nombres[k], v]),
      numeroVisible: datos.numeroVisible,
      horario: 'Lunes a sábado de 9 a 21',
    },
  },
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
