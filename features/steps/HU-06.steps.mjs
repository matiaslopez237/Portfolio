// Steps de la HU-06 (portfolio con la marca). Necesitan el sitio en BASE_URL (por defecto :8080).
import { Given, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
};
const estilo = (page, sel, prop) =>
  page.$eval(sel, (el, p) => getComputedStyle(el)[p], prop);

// Ancho y alto de un PNG, leídos del encabezado IHDR.
const medidasPng = (buf) => ({ ancho: buf.readUInt32BE(16), alto: buf.readUInt32BE(20) });

Given('que abro el portfolio en la compu', async function () {
  await this.abrir(1440, 900);
});

Given('que abro el portfolio en un celular de {int} px', async function (ancho) {
  this.erroresConsola = [];
  await this.abrir(ancho, 812, true);
});

// CA-06.1
Then('el fondo de la página es {string}', async function (hex) {
  // Desde la HU-12 el cuerpo es hierro fundido y el acero (#1B2128) vive en las placas de las secciones.
  assert.equal(await estilo(this.page, 'main .section', 'backgroundColor'), rgb(hex));
});

Then('el botón principal de WhatsApp usa el acento {string}', async function (hex) {
  assert.equal(await estilo(this.page, '.hero .btn-wa', 'backgroundColor'), rgb(hex));
});

Then('los títulos usan la tipografía {string}', async function (fuente) {
  const familia = await estilo(this.page, 'h1', 'fontFamily');
  assert.match(familia, new RegExp(`^["']?${fuente}["']?`), `h1 usa ${familia}`);
  const cargada = await this.page.evaluate(async (f) => { await document.fonts.ready; return document.fonts.check(`800 40px "${f}"`); }, fuente);
  assert.ok(cargada, `${fuente} no está cargada`);
});

Then('el texto usa la tipografía {string}', async function (fuente) {
  const familia = await estilo(this.page, 'body', 'fontFamily');
  assert.match(familia, new RegExp(`^["']?${fuente}["']?`), `body usa ${familia}`);
});

// CA-06.2
Then('el encabezado muestra el logo de Hefesto Webs', async function () {
  const logo = this.page.locator('.site-header .logo');
  assert.ok(await logo.isVisible(), 'no hay logo visible en el encabezado');
  const nombre = await logo.getAttribute('aria-label') ?? await logo.textContent();
  assert.match(nombre, /Hefesto Webs/);
  assert.ok(await logo.locator('svg').count() > 0, 'el logo no tiene el símbolo SVG');
});

Then('el título de la pestaña incluye {string}', async function (texto) {
  assert.ok((await this.page.title()).includes(texto), await this.page.title());
});

// CA-06.3
Then('{string} incluye {string}', async function (prop, texto) {
  const valor = await this.page.getAttribute(`meta[property="${prop}"]`, 'content');
  assert.ok(valor?.includes(texto), `${prop} = ${valor}`);
});

Then('la imagen {string} de la marca existe y mide {int}x{int}', async function (prop, ancho, alto) {
  const url = await this.page.getAttribute(`meta[property="${prop}"]`, 'content');
  // La URL publicada apunta a GitHub Pages; se prueba el mismo archivo en el servidor local.
  const ruta = new URL(url).pathname.replace(/^\/Portfolio/, '');
  const res = await this.page.request.get(this.baseUrl + ruta);
  assert.equal(res.status(), 200, `no existe ${ruta}`);
  assert.match(ruta, /og-hefesto/, 'la imagen og no es la de la marca');
  assert.deepEqual(medidasPng(await res.body()), { ancho, alto });
});

Then('el JSON-LD nombra el servicio {string}', async function (nombre) {
  const json = JSON.parse(await this.page.textContent('script[type="application/ld+json"]'));
  const servicio = json['@graph'].find(n => n['@type'] === 'ProfessionalService');
  assert.equal(servicio.name, nombre);
});

Then('el favicon es el símbolo de la marca', async function () {
  const href = await this.page.getAttribute('link[rel="icon"]', 'href');
  assert.match(href, /simbolo|favicon/, `favicon: ${href.slice(0, 60)}`);
  const res = await this.page.request.get(new URL(href, this.page.url()).href);
  assert.equal(res.status(), 200);
});

// CA-06.4
Then('el formulario envía a {string}', async function (action) {
  assert.equal(await this.page.getAttribute('#contact-form', 'action'), action);
});

Then('tiene los campos {string}, {string} y {string}', async function (a, b, c3) {
  for (const c of [a, b, c3]) assert.equal(await this.page.locator(`#contact-form [name="${c}"]`).count(), 1, `falta ${c}`);
});

// CA-06.5
Then('el pie tiene un link a {string} que abre en otra pestaña', async function (url) {
  const link = this.page.locator(`footer a[href="${url}"]`);
  assert.equal(await link.count(), 1, 'no hay link a Instagram en el pie');
  assert.equal(await link.getAttribute('target'), '_blank');
  assert.match(await link.getAttribute('rel'), /noopener/);
});

Then('la sección de contacto tiene un link a {string}', async function (url) {
  assert.ok(await this.page.locator(`#contacto a[href="${url}"]`).count() >= 1, 'no hay link a Instagram en contacto');
});

// CA-06.6
Then('no hay scroll horizontal', async function () {
  const sobra = await this.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(sobra <= 0, `sobran ${sobra}px de ancho`);
});

Then('no hay errores en la consola', async function () {
  // PostHog puede fallar sin red; no es un error del sitio.
  const propios = this.erroresConsola.filter(e => !/posthog/i.test(e));
  assert.deepEqual(propios, []);
});

// CA-06.7
Then('todos los links de WhatsApp usan el mismo número', async function () {
  const html = await this.page.content();
  const numeros = new Set([...html.matchAll(/wa\.me\/(\d+)/g)].map(m => m[1]));
  assert.equal(numeros.size, 1, `números distintos: ${[...numeros].join(', ')}`);
});

// HU-13
Then('el logo de la navegación se llama {string}', async function (nombre) {
  const label = await this.page.getAttribute('.site-header .logo', 'aria-label');
  assert.ok(label?.includes(nombre), `aria-label del logo: ${label}`);
});
