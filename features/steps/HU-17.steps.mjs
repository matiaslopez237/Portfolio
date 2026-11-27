// Steps de la HU-17 (reels con formatos probados). Revisan los archivos que deja render.mjs y textos.md.
import { Given, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpeg from 'ffmpeg-static';

const raiz = new URL('../../', import.meta.url);
const ruta = (r) => fileURLToPath(new URL(r, raiz));
const leer = (r) => readFileSync(ruta(r), 'utf8').replace(/\r\n/g, '\n');
const json = (r) => JSON.parse(leer(r));
const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// MP4 → códec, medidas, duración y peso (con el ffmpeg del proyecto)
function infoVideo(r) {
  const f = ruta(r);
  if (!existsSync(f)) return null;
  const err = spawnSync(ffmpeg, ['-hide_banner', '-i', f], { encoding: 'utf8' }).stderr;
  const v = /Video: (\w+)[^\n]*?, (\d{3,5})x(\d{3,5})/.exec(err), d = /Duration: (\d+):(\d+):([\d.]+)/.exec(err);
  return { codec: v?.[1], w: +v?.[2], h: +v?.[3], dur: d ? +d[1] * 3600 + +d[2] * 60 + +d[3] : NaN, mb: statSync(f).size / 1048576 };
}
// Medidas de un PNG (ancho y alto del encabezado IHDR)
function medidasPng(r) {
  const b = readFileSync(ruta(r));
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
// Texto del reel en textos.md: el bloque ```texto``` debajo de "## Reel Rn · …"
function textoDelReel(id) {
  const md = leer('brand/instagram/textos.md');
  const m = new RegExp(`^## Reel ${id} · [^\\n]*\\n+\`\`\`texto\\n([\\s\\S]*?)\\n\`\`\``, 'm').exec(md);
  return m ? m[1] : null;
}

Given('el reel {string}', function (id) {
  this.reel = id;
  this.guion = json('brand/instagram/reels/guiones.json').reels.find(r => r.id === id);
  assert.ok(this.guion, `no hay un reel "${id}" en guiones.json`);
  this.dir = `brand/instagram/reels/${id}/`;
});

// ── CA-17.1 ──
Then('el video es un MP4 H.264 de 1080×1920', function () {
  this.video = infoVideo(this.dir + this.reel + '.mp4');
  assert.ok(this.video, `falta ${this.dir}${this.reel}.mp4`);
  assert.equal(this.video.codec, 'h264');
  assert.deepEqual([this.video.w, this.video.h], [1080, 1920]);
});
Then('dura entre {int} y {int} segundos', function (min, max) {
  assert.ok(this.video.dur >= min && this.video.dur <= max, `dura ${this.video.dur.toFixed(1)} s`);
});
Then('pesa menos de {int} MB', function (mb) {
  assert.ok(this.video.mb < mb, `pesa ${this.video.mb.toFixed(1)} MB`);
});

// ── CA-17.2 ──
Then('el gancho se ve desde el segundo 0', function () {
  const s = json(this.dir + 'subtitulos.json');
  assert.equal(s.ganchoDesde, 0, `el gancho aparece recién en t=${s.ganchoDesde}`);
});
Then('la primera línea del guion termina antes de los {int} segundos', function (seg) {
  const s = json(this.dir + 'subtitulos.json');
  assert.ok(s.primeraLinea, 'subtitulos.json no trae primeraLinea');
  assert.ok(s.primeraLinea.fin < seg, `la primera línea termina en ${s.primeraLinea.fin.toFixed(2)} s`);
});

// ── CA-17.3 ──
Then('cada subtítulo dura al menos 1,5 s y tiene 12 palabras o menos', function () {
  const malos = [];
  for (const c of json(this.dir + 'subtitulos.json').chunks) {
    if (c.fin - c.ini < 1.5) malos.push(`"${c.texto}" dura ${(c.fin - c.ini).toFixed(2)} s`);
    if (c.palabras > 12) malos.push(`"${c.texto}" tiene ${c.palabras} palabras`);
  }
  assert.deepEqual(malos, []);
});
Then('el teléfono, si aparece, queda dentro de la zona segura sin tapar el subtítulo', function () {
  const usa = this.guion.lineas.some(l => l.pantalla);
  if (!usa) return;
  const f = this.dir + 'telefono.json';
  assert.ok(existsSync(ruta(f)), 'el reel usa el teléfono y falta telefono.json');
  const t = json(f);
  assert.ok(t.caja.y0 >= 250 && t.caja.y1 <= 1920 - 250, `el teléfono va de y=${t.caja.y0} a y=${t.caja.y1}`);
  assert.ok(t.caja.x0 >= 0 && t.caja.x1 <= 1080, `el teléfono va de x=${t.caja.x0} a x=${t.caja.x1}`);
  assert.equal(t.cuadrosTapaTexto, 0, `el teléfono tapa el subtítulo en ${t.cuadrosTapaTexto} cuadros`);
});
Then('el último tramo de 3 s o más es el cierre con el WhatsApp y @hefestowebs', function () {
  const s = json(this.dir + 'subtitulos.json');
  assert.ok(s.cierre, 'subtitulos.json no trae el cierre');
  assert.ok(s.total - s.cierre >= 3, `el cierre dura ${(s.total - s.cierre).toFixed(2)} s`);
  const cta = (/<div id="cta">[\s\S]*?<\/div><\/div>/.exec(leer('brand/instagram/reels/reel.html')) ?? [''])[0];
  assert.ok(cta.includes('260 466-1138') && cta.includes('@hefestowebs'), 'al cierre le falta el número o el @');
});

// ── CA-17.4 ──
Then('su texto en textos.md tiene entre {int} y {int} hashtags', function (min, max) {
  this.texto = textoDelReel(this.reel);
  assert.ok(this.texto, `falta "## Reel ${this.reel} · …" con su bloque de texto en textos.md`);
  const n = (this.texto.match(/#[\p{L}\d_]+/gu) ?? []).length;
  assert.ok(n >= min && n <= max, `tiene ${n} hashtags`);
});
Then('nombra su palabra clave en los primeros {int} caracteres', function (n) {
  assert.ok(this.guion.clave, `el reel ${this.reel} no define "clave" en guiones.json`);
  assert.ok(sinTildes(this.texto.slice(0, n)).includes(sinTildes(this.guion.clave)), `"${this.guion.clave}" no está en los primeros ${n} caracteres`);
});

// ── CA-17.5 ──
Then('la lista para revisar tu web existe y mide {int}×{int}', function (w, h) {
  const f = 'brand/instagram/recursos/lista-revisa-tu-web.png';
  assert.ok(existsSync(ruta(f)), 'falta ' + f);
  assert.deepEqual(Object.values(medidasPng(f)), [w, h]);
});
Then('su texto pide comentar {string}', function (palabra) {
  const t = textoDelReel(this.reel) ?? '';
  assert.match(t, new RegExp(`coment[aá] ${palabra}`, 'i'));
});

// ── CA-17.9 (arranque con golpe) ──
const arranque = (w) => {
  const s = json(w.dir + 'subtitulos.json');
  assert.ok(s.arranque, 'subtitulos.json no trae "arranque" (el reel tiene que pedir "arranque": "golpe")');
  return { ...s.arranque, voz: s.voz };
};
Then('la voz arranca antes de los 0,5 segundos', function () {
  const a = arranque(this);
  assert.ok(a.voz < 0.5, `la voz arranca a los ${a.voz} s`);
});
Then('en el primer cuadro ya hay texto a la vista', function () {
  assert.ok(arranque(this).textoCuadro0 > 0.5, 'en el cuadro 0 no se ve texto');
});
Then('el texto entra golpeando y salen chispas en el primer medio segundo', function () {
  const a = arranque(this);
  assert.ok(Math.abs(a.escala0 - a.escala04) > 0.1, `el texto no cambia de tamaño (${a.escala0} → ${a.escala04})`);
  assert.ok(a.chispas > 0, 'no hay chispas en el primer medio segundo');
});
