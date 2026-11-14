// Steps de la HU-12 (sitio Forja). Necesitan el sitio en BASE_URL (por defecto :8080).
import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

const esperar = (ms) => new Promise(r => setTimeout(r, ms));
const centro = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

Given('que abro el portfolio con movimiento reducido', async function () {
  if (this.page) await this.page.context().close();
  const ctx = await this.browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  this.page = await ctx.newPage();
  await this.page.goto(this.baseUrl + '/', { waitUntil: 'networkidle' });
  this.logoInicial = await this.page.$eval('#vuelo', el => el.getBoundingClientRect().toJSON());
});

When('bajo hasta pasar el hero', async function () {
  await this.page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, document.getElementById('inicio').offsetHeight * 1.3); });
  await esperar(1800);
});

// CA-12.2
Then('se ven la foto del taller y el logo 3D en el inicio', async function () {
  await esperar(600);
  const r = await this.page.evaluate(() => {
    const f = document.querySelector('#inicio .fondo'), v = document.getElementById('vuelo'), img = v?.querySelector('img');
    return { foto: !!f && f.complete && f.naturalWidth > 0 && /taller|fondo/.test(f.currentSrc), logo: !!img && img.complete && img.naturalWidth > 0 && +getComputedStyle(v.querySelector('.pieza')).opacity > 0.9 };
  });
  assert.ok(r.foto, 'no se ve la foto del taller');
  assert.ok(r.logo, 'no se ve el logo 3D');
});

Then('el símbolo de la barra está vacío y se ve el molde', async function () {
  const r = await this.page.evaluate(() => ({
    simbolo: +getComputedStyle(document.querySelector('.site-header .logo-simbolo')).opacity,
    molde: document.querySelector('.site-header .logo-hueco') ? +getComputedStyle(document.querySelector('.site-header .logo-hueco')).opacity : -1,
  }));
  assert.ok(r.simbolo < 0.1, `el símbolo plano ya se ve (${r.simbolo})`);
  assert.ok(r.molde > 0.9, `el molde no se ve (${r.molde})`);
});

// CA-12.3
Then('al 0, 30, 60 y 100% del hero el botón de WhatsApp se puede tocar y el título no está tapado', async function () {
  const alto = await this.page.$eval('#inicio', el => el.offsetHeight);
  for (const f of [0, 0.3, 0.6, 1]) {
    await this.page.evaluate(y => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, y); }, Math.round(alto * f));
    await esperar(700);
    const r = await this.page.evaluate(() => {
      const visible = (el) => { const b = el.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight; };
      const libre = (el) => { const b = el.getBoundingClientRect(); const p = [[.5, .5], [.15, .5], [.85, .5]].map(([x, y]) => [b.left + b.width * x, b.top + b.height * y]).filter(([, y]) => y > 0 && y < innerHeight);
        return p.every(([x, y]) => { const e = document.elementFromPoint(x, y); return e && (el.contains(e) || e === el); }); };
      const btn = document.querySelector('#inicio .btn-wa'), h1 = document.querySelector('#inicio h1');
      return { btn: !visible(btn) || libre(btn), h1: !visible(h1) || libre(h1) };
    });
    assert.ok(r.btn, `al ${f * 100}% algo tapa el botón de WhatsApp`);
    assert.ok(r.h1, `al ${f * 100}% algo tapa el título`);
  }
});

// CA-12.4
Then('el logo 3D terminó sobre el símbolo de la barra', async function () {
  const r = await this.page.evaluate(() => ({ v: document.getElementById('vuelo').getBoundingClientRect().toJSON(), s: document.querySelector('.site-header .logo-simbolo').getBoundingClientRect().toJSON() }));
  const a = centro(r.v), b = centro(r.s);
  assert.ok(Math.abs(a.x - b.x) <= 4 && Math.abs(a.y - b.y) <= 4, `el logo quedó a ${Math.round(a.x - b.x)},${Math.round(a.y - b.y)} px del símbolo`);
});

Then('el símbolo plano de la barra se ve', async function () {
  // El fundido termina cuando el logo llega (la animación sigue al scroll con inercia): se espera hasta 4 s.
  await this.page.waitForFunction(() => +getComputedStyle(document.querySelector('.site-header .logo-simbolo')).opacity > 0.9, null, { timeout: 4000 }).catch(() => {});
  const o = await this.page.$eval('.site-header .logo-simbolo', el => +getComputedStyle(el).opacity);
  assert.ok(o > 0.9, `opacidad del símbolo: ${o}`);
});

// CA-12.5
Then('el logo 3D no se movió', async function () {
  const ahora = await this.page.$eval('#vuelo', el => el.getBoundingClientRect().toJSON());
  const visible = await this.page.$eval('#vuelo .pieza', el => +getComputedStyle(el).opacity);
  // Con movimiento reducido el logo se queda en el hero (se va con el scroll) o no se muestra; nunca vuela a la barra.
  const s = await this.page.$eval('.site-header .logo-simbolo', el => el.getBoundingClientRect().toJSON());
  const a = centro(ahora), b = centro(s);
  assert.ok(visible < 0.1 || Math.hypot(a.x - b.x, a.y - b.y) > 40, 'el logo voló a la barra con movimiento reducido');
});

// CA-12.6
Then('el logo 3D no tapa el título', async function () {
  await esperar(600);
  const r = await this.page.evaluate(() => {
    const a = document.getElementById('vuelo').getBoundingClientRect(), h = document.querySelector('#inicio h1').getBoundingClientRect();
    const op = +getComputedStyle(document.querySelector('#vuelo .pieza')).opacity;
    return { pisa: op > 0.1 && !(a.bottom <= h.top || a.top >= h.bottom || a.right <= h.left || a.left >= h.right) };
  });
  assert.ok(!r.pisa, 'el logo 3D se pisa con el título');
});

Then('el nombre de la barra está en una sola línea', async function () {
  const r = await this.page.$eval('.site-header .logo-texto', el => ({ alto: el.getBoundingClientRect().height, linea: parseFloat(getComputedStyle(el).fontSize) * 1.5 }));
  assert.ok(r.alto <= r.linea, `el nombre ocupa ${Math.round(r.alto)} px (más de una línea)`);
});

// CA-12.7
When('paso el mouse por el link {string}', async function (texto) {
  await this.page.evaluate(() => scrollTo(0, 1400));
  await esperar(800);
  await this.page.hover(`.nav-links a:text-is("${texto}")`);
  await esperar(400);
});

When('llevo el foco con el teclado al link {string}', async function (texto) {
  await this.page.mouse.move(700, 600);
  await this.page.focus(`.nav-links a:text-is("${texto}")`);
  await esperar(400);
});

Then('el link {string} queda caliente', async function (texto) {
  const caliente = await this.page.$eval(`.nav-links a:text-is("${texto}")`, el => el.classList.contains('caliente'));
  assert.ok(caliente, `el link ${texto} no se calentó`);
});

// CA-12.8
Then('cada sección es una placa con remaches', async function () {
  const r = await this.page.$$eval('main .section', ss => ss.map(s => ({ id: s.id, remaches: !!s.querySelector('.remaches'), radio: parseFloat(getComputedStyle(s).borderTopLeftRadius) })));
  assert.ok(r.length >= 5, `hay ${r.length} secciones`);
  const malas = r.filter(s => !s.remaches || s.radio < 12).map(s => s.id);
  assert.deepEqual(malas, [], 'secciones sin placa');
});

Then('la página no dice {string}', async function (texto) {
  assert.ok(!(await this.page.content()).includes(texto), `todavía dice "${texto}"`);
});
