// Steps de la HU-05 (número nuevo de WhatsApp en el portfolio).
import { Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

Then('todos los links de WhatsApp van a {string}', async function (numero) {
  const hrefs = await this.page.$$eval('a[href*="wa.me/"]', as => as.map(a => a.getAttribute('href')));
  assert.ok(hrefs.length > 0, 'no hay links de WhatsApp');
  const otros = hrefs.filter(h => !h.startsWith(`https://wa.me/${numero}`));
  assert.deepEqual(otros, [], 'links con otro número');
});

Then('el teléfono del JSON-LD es {string}', async function (tel) {
  const json = JSON.parse(await this.page.textContent('script[type="application/ld+json"]'));
  const telefonos = json['@graph'].map(n => n.telephone).filter(Boolean);
  assert.ok(telefonos.length > 0, 'el JSON-LD no tiene teléfono');
  assert.deepEqual([...new Set(telefonos)], [tel]);
});

Then('la página no contiene {string} ni {string}', async function (a, b) {
  const html = await this.page.content();
  for (const viejo of [a, b]) assert.ok(!html.includes(viejo), `todavía aparece ${viejo}`);
});
