// Mundo compartido de los escenarios: abre un navegador limpio por escenario.
// El sitio tiene que estar corriendo (py -m http.server 8080) o BASE_URL apuntar a otro lado.
import { setWorldConstructor, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';

setDefaultTimeout(30_000);

class MundoPortfolio {
  constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:8080';
    this.browser = null;
    this.page = null;
    this.erroresConsola = [];
  }

  async abrir(ancho = 1440, alto = 900, celular = false) {
    if (this.page) await this.page.context().close();
    const ctx = await this.browser.newContext({ viewport: { width: ancho, height: alto }, isMobile: celular, hasTouch: celular });
    this.page = await ctx.newPage();
    this.page.on('pageerror', e => this.erroresConsola.push(e.message));
    this.page.on('console', m => { if (m.type() === 'error') this.erroresConsola.push(m.text()); });
    await this.page.goto(this.baseUrl + '/', { waitUntil: 'networkidle' });
  }
}

setWorldConstructor(MundoPortfolio);

Before(async function () {
  this.browser = await chromium.launch();
});

After(async function () {
  await this.browser?.close();
});
