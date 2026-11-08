// Steps de la HU-08 (pulido del portfolio).
import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

const tienePrecio = (t) => /\$\s?\d{1,3}(\.\d{3})+/.test(t);

// CA-08.1
Then('en cada plan el precio está justo después del nombre', async function () {
  const planes = await this.page.$$eval('.plan', ps => ps.map(p => {
    const h3 = p.querySelector('h3');
    return { nombre: h3?.textContent.trim(), siguiente: h3?.nextElementSibling?.textContent ?? '' };
  }));
  assert.equal(planes.length, 3);
  for (const p of planes) assert.ok(tienePrecio(p.siguiente), `${p.nombre}: después del nombre viene "${p.siguiente.trim().slice(0, 40)}"`);
});

Then('cada plan muestra su precio una sola vez', async function () {
  const conteos = await this.page.$$eval('.plan', ps => ps.map(p => (p.innerText.match(/\$\s?\d{1,3}(\.\d{3})+/g) || []).length));
  assert.deepEqual(conteos, [1, 1, 1]);
});

Then('el botón de WhatsApp es lo último de cada plan', async function () {
  const ultimos = await this.page.$$eval('.plan', ps => ps.map(p => {
    const botones = [...p.querySelectorAll('a, button')];
    const ultimo = botones.at(-1);
    return ultimo?.classList.contains('btn-wa') && ultimo.href.includes('wa.me') && p.lastElementChild.contains(ultimo);
  }));
  assert.deepEqual(ultimos, [true, true, true]);
});

// CA-08.2
Then('en cada plan el precio está a menos de {int} px del nombre', async function (max) {
  const distancias = await this.page.$$eval('.plan', ps => ps.map(p => {
    const h3 = p.querySelector('h3').getBoundingClientRect();
    const precio = [...p.querySelectorAll('*')].find(el => el.children.length === 0 && /\$\s?\d/.test(el.textContent));
    return precio ? precio.getBoundingClientRect().top - h3.bottom : Infinity;
  }));
  for (const d of distancias) assert.ok(d < max, `el precio está a ${Math.round(d)} px del nombre`);
});

// CA-08.3
Then('el inicio tiene el símbolo de la marca como decoración', async function () {
  const s = await this.page.$eval('.hero', h => {
    const el = h.querySelector('.hero-simbolo');
    if (!el) return null;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return { oculto: el.getAttribute('aria-hidden'), ancho: r.width, opacidad: +cs.opacity, svg: !!el.querySelector('svg') || el.tagName === 'svg' };
  });
  assert.ok(s, 'no hay .hero-simbolo en el inicio');
  assert.equal(s.oculto, 'true', 'el símbolo no tiene aria-hidden="true"');
  assert.ok(s.svg, 'el símbolo no es un SVG');
  assert.ok(s.ancho >= 200 && s.opacidad > 0, `símbolo de ${Math.round(s.ancho)} px con opacidad ${s.opacidad}`);
});

Then('el símbolo no tapa el título', async function () {
  const ok = await this.page.$eval('.hero h1', h1 => {
    const r = h1.getBoundingClientRect();
    const puntos = [[0.2, 0.3], [0.5, 0.5], [0.8, 0.7]].map(([x, y]) => document.elementFromPoint(r.left + r.width * x, r.top + r.height * y));
    return puntos.every(el => el && h1.contains(el));
  });
  assert.ok(ok, 'algo tapa el título');
});

// CA-08.4
Then('los {int} números de {string} miden al menos {int} px y usan {string}', async function (n, _seccion, min, fuente) {
  const nums = await this.page.$$eval('.pasos li', lis => lis.map(li => {
    const cs = getComputedStyle(li, '::before');
    return { tam: parseFloat(cs.fontSize), fuente: cs.fontFamily, contenido: cs.content };
  }));
  assert.equal(nums.length, n);
  for (const x of nums) {
    assert.ok(x.contenido !== 'none', 'el paso no tiene número');
    assert.ok(x.tam >= min, `número de ${x.tam}px`);
    assert.match(x.fuente, new RegExp(fuente));
  }
});

// CA-08.5
Then('las líneas entre secciones están alineadas con el contenido', async function () {
  const malas = await this.page.$$eval('.section', ss => ss.map(s => {
    const cs = getComputedStyle(s), b = getComputedStyle(s, '::before'), r = s.getBoundingClientRect();
    const contenido = [r.left + parseFloat(cs.paddingLeft), r.right - parseFloat(cs.paddingRight)];
    if (parseFloat(cs.borderTopWidth) > 0) return `${s.id}: la línea es el borde de la sección (incluye el margen)`;
    if (b.content === 'none' || b.content === 'normal') return null; // sección sin línea (Trabajos)
    const linea = [r.left + parseFloat(b.left), r.right - parseFloat(b.right)];
    return Math.abs(linea[0] - contenido[0]) > 1 || Math.abs(linea[1] - contenido[1]) > 1
      ? `${s.id}: línea ${linea.map(Math.round)} vs contenido ${contenido.map(Math.round)}` : null;
  }).filter(Boolean));
  assert.deepEqual(malas, []);
});

// CA-08.6
When('bajo hasta el final', async function () {
  await this.page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, document.documentElement.scrollHeight); });
  await this.page.waitForTimeout(400);
});

Then('el botón flotante no tapa el último link del pie', async function () {
  const r = await this.page.evaluate(() => {
    const caja = (el) => { const b = el.getBoundingClientRect(); return { l: b.left, r: b.right, t: b.top, b: b.bottom }; };
    const fab = document.querySelector('.fab');
    const visible = fab && getComputedStyle(fab).visibility === 'visible' && +getComputedStyle(fab).opacity > 0;
    const links = [...document.querySelectorAll('.footer a, .footer p')];
    return { visible, fab: fab && caja(fab), links: links.map(caja) };
  });
  if (!r.visible) return; // si el botón está oculto al final, no tapa nada
  const tapa = r.links.filter(a => !(a.r <= r.fab.l || a.l >= r.fab.r || a.b <= r.fab.t || a.t >= r.fab.b));
  assert.equal(tapa.length, 0, `el botón tapa ${tapa.length} elemento(s) del pie`);
});
