// HU-15/HU-16: arma un reel con la mascota: voz (edge-tts) → animación cuadro por cuadro (Playwright) → MP4 (ffmpeg).
// Uso: node brand/instagram/reels/render.mjs R1 [--muestras]   (--muestras: solo saca 4 capturas para revisar)
import { chromium } from 'playwright';
import ffmpeg from 'ffmpeg-static';
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const id = process.argv[2] ?? 'R1', muestras = process.argv.includes('--muestras');
const aqui = new URL('./', import.meta.url), ruta = (r) => fileURLToPath(new URL(r, aqui));
const guiones = JSON.parse(readFileSync(ruta('guiones.json'), 'utf8'));
const reel = guiones.reels.find(r => r.id === id);
if (!reel) { console.error(`no hay un reel "${id}" en guiones.json`); process.exit(1); }
// HU-16: el guion se revisa antes de generar la voz (gestos válidos, muñeco v4 o v5)
const { validarGuion } = createRequire(import.meta.url)('./gestos.js');
let munecoReel;
// HU-17: pantallas del teléfono (sitio, chat, imagen)
const { validarPantallas } = createRequire(import.meta.url)('./telefono.js');
try { munecoReel = validarGuion(reel); validarPantallas(reel); } catch (e) { console.error('✗ ' + e.message); process.exit(1); }
const dir = ruta(`${id}/`);
// HU-17: si el reel muestra un sitio real, se graba en tamaño celular (una vez; con --sitio se vuelve a grabar)
let sitio = null;
if (reel.sitio) {
  if (!existsSync(dir + 'sitio/sitio.json') || process.argv.includes('--sitio')) {
    const { grabarSitio } = await import('./grabar-sitio.mjs');
    const r = await grabarSitio({ ...reel.sitio, salida: dir + 'sitio/' });
    console.log(`sitio: ${r.frames.length} capturas de ${r.url} (${r.bloqueados} pedidos a WhatsApp bloqueados)`);
  }
  sitio = { ...JSON.parse(readFileSync(dir + 'sitio/sitio.json', 'utf8')), base: `/reels/${id}/sitio/` };
}
// Voz: "gemini:<voz>" → Gemini TTS (voz-gemini.mjs, con energia.json para la boca); si no, edge-tts (voz.py)
if (!existsSync(dir + 'palabras.json') || process.argv.includes('--voz')) {
  if (/^gemini:/.test(reel.voz)) execFileSync(process.execPath, [ruta('voz-gemini.mjs'), '--reel', id], { stdio: 'inherit' });
  else execFileSync('py', [ruta('voz.py'), ruta('guiones.json'), id, dir], { stdio: 'inherit' });
}
// Boca: Rhubarb Lip Sync escucha la voz y da la forma de la boca en cada momento (modo fonético: sirve para español).
// Se busca en RHUBARB o en ~/.2d-character-sketch/rhubarb. Si no está, la boca sigue a las palabras y al volumen.
const rhubarb = process.env.RHUBARB ?? `${homedir()}/.2d-character-sketch/rhubarb/rhubarb.exe`;
function bocaDe(mp3, json) {
  if (!existsSync(rhubarb) || (existsSync(json) && statSync(json).mtimeMs >= statSync(mp3).mtimeMs)) return;
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', dir + 'voz.wav']);
  const r = JSON.parse(execFileSync(rhubarb, ['-r', 'phonetic', '-f', 'json', '--machineReadable', dir + 'voz.wav'], { maxBuffer: 1 << 26 }).toString());
  writeFileSync(json, JSON.stringify(r.mouthCues));
  rmSync(dir + 'voz.wav');
  console.log(`boca: ${r.mouthCues.length} formas (Rhubarb)`);
}
bocaDe(dir + 'voz.mp3', dir + 'boca.json');
const leerJson = (f) => existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
// RN-17.9: con "velocidad", la voz se acelera sin cambiar el tono (atempo) y se acortan sus pausas largas.
// Las palabras y la boca se vuelven a ubicar sobre esa voz final (voz-final.mp3). Sin "velocidad", la voz queda como está.
let vozFinal = dir + 'voz.mp3', voz = { palabras: leerJson(dir + 'palabras.json'), energia: leerJson(dir + 'energia.json'), boca: leerJson(dir + 'boca.json') };
if (reel.velocidad) {
  const { acortarPausas } = await import('./velocidad.mjs');
  const { energia, alinear, aMp3 } = await import('./voz-gemini.mjs');
  const pcm = execFileSync(ffmpeg, ['-loglevel', 'error', '-i', dir + 'voz.mp3', '-filter:a', `atempo=${reel.velocidad}`, '-f', 's16le', '-ac', '1', '-ar', '24000', '-'], { maxBuffer: 1 << 28 });
  const a = acortarPausas({ pcm, tasa: 24000 });
  vozFinal = dir + 'voz-final.mp3'; aMp3(a, vozFinal);
  const ener = energia(a);
  bocaDe(vozFinal, dir + 'boca-final.json');
  voz = { palabras: alinear(reel.lineas.map(x => x.texto).join(' '), ener), energia: ener, boca: leerJson(dir + 'boca-final.json') };
  console.log(`voz x${reel.velocidad}: ${(ener.length / 30).toFixed(1)} s (pausas acortadas: ${a.quitado.toFixed(2)} s)`);
}
const datos = {
  sitio,
  boca: voz.boca,
  reel, palabras: voz.palabras,
  energia: voz.energia,
  // Muñeco con codo (hoja v4). Piezas sueltas de mascota/partes-v4 (recortar-partes CRUDO=1); hombro y codo, de piezas.json.
  // escalaBrazo 0.81: el brazo del martillo de la hoja vino 19 % más grande que el brazo del cuerpo (medido: 270 vs 221 px de largo, 94 vs 76 px de ancho)
  muneco: munecoReel === 'v5' ? munecoV5() : (() => { const pz = JSON.parse(readFileSync(ruta('mascota/partes-v4/piezas.json'), 'utf8')).piezas; return {
    carpeta: 'mascota/partes-v4/', piezas: { cuerpo: 4, cabeza: 0, brazo: 2, antebrazo: 11, ojos: { abiertos: 3, medio: 5, cerrados: 6 }, boca: { cerrada: 8, a: 9, o: 12, e: 14, neutra: 15 } },
    hombro: pz['pieza-4'].gris, codo: pz['pieza-11'].gris, escala: 1.5, escalaCabeza: 0.9, escalaBrazo: 0.81, desplX: -50, piso: 2000, bocaSobreCuello: 14 }; })(),
};

// Muñeco v5 (HU-16, hoja v5b): dos brazos con gestos. La configuración está en muneco-v5.json (la comparte posador.html).
function munecoV5() { return JSON.parse(readFileSync(ruta('muneco-v5.json'), 'utf8')); }

// Servidor local mínimo (con file:// el navegador no deja leer los píxeles de las imágenes)
const { createServer } = await import('node:http');
const raizInstagram = fileURLToPath(new URL('../', aqui));
const tipos = { '.jpg': 'image/jpeg', '.js': 'text/javascript', '.html': 'text/html', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.json': 'application/json' };
const srv = createServer((req, res) => {
  const f = raizInstagram + decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
  if (!existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': tipos[f.slice(f.lastIndexOf('.'))] ?? 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0);
const puerto = srv.address().port;

const FPS = 30;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await p.goto(`http://localhost:${puerto}/reels/reel.html`, { waitUntil: 'networkidle' });
const info = await p.evaluate((d) => window.armar(d), datos);
writeFileSync(dir + 'subtitulos.json', JSON.stringify(info, null, 1));
console.log(`${id}: ${info.total.toFixed(1)} s, ${info.chunks.length} subtítulos`);
// Teléfono (HU-17): dónde queda y si tapa el subtítulo (lo lee el escenario CA-17.3)
const tel = await p.evaluate(() => window.medirTelefono());
if (tel) { writeFileSync(dir + 'telefono.json', JSON.stringify(tel, null, 1)); console.log(`teléfono: de y=${tel.caja.y0.toFixed(0)} a y=${tel.caja.y1.toFixed(0)}, ${tel.cuadrosTapaTexto} cuadros tapando el subtítulo`); }
// Muñeco v5: hasta dónde llegan las manos en todo el reel (lo lee el chequeo CA-16.7)
if (munecoReel === 'v5') {
  const manos = await p.evaluate(() => window.medirManos());
  writeFileSync(dir + 'manos.json', JSON.stringify(manos, null, 1));
  // Martillazo al logo (RN-16.7): dónde queda el logo y si alguna vez hay dos (lo leen los chequeos CA-16.11 y CA-16.12)
  const logo = await p.evaluate(() => window.medirLogo());
  if (logo) { writeFileSync(dir + 'logo.json', JSON.stringify(logo, null, 1)); console.log(`logo: a ${logo.distanciaAlGolpe.toFixed(0)} px del golpe, ${logo.cuadrosFuera} cuadros fuera, ${logo.cuadrosTapaTexto} tapando texto, ${logo.cuadrosDosLogos} con dos logos`); }
  console.log(`manos: margen bajo el texto ${manos.margen.toFixed(0)} px (t=${manos.tMargen.toFixed(1)} s), de x=${manos.izquierda.toFixed(0)} a x=${manos.derecha.toFixed(0)}`);
}

if (muestras) {
  const tiempos = munecoReel === 'v5' ? [...info.chunks.map(c => +((c.ini + c.fin) / 2).toFixed(1)), ...(info.golpe ? [info.golpe - 0.2, info.golpe + 0.08] : [])] : [0.5, 3.2, 10, ...(info.golpe ? [info.golpe - 0.2, info.golpe + 0.08] : []), info.total - 1];
  // Se borran las muestras anteriores (si no, quedan mezcladas capturas de otra versión)
  for (const f of readdirSync(dir)) if (/^muestra-.*.png$/.test(f)) rmSync(dir + f);
  // (se espera un cuadro de pantalla: si no, el canvas del muñeco puede salir con la pose del cuadro anterior)
  for (const t of tiempos) { await p.evaluate((x) => { window.cuadro(x); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); }, t); await p.screenshot({ path: dir + `muestra-${t.toFixed(1)}.png` }); }
  // Tira de la cara cada 0,1 s (de 2 a 4,3 s): para revisar que la boca abra y cierre con la voz
  const caras = [];
  for (let i = 0; i < 24; i++) { await p.evaluate((x) => window.cuadro(x), 2 + i * 0.1); caras.push((await p.screenshot({ clip: { x: 400, y: 960, width: 240, height: 200 } })).toString('base64')); }
  await p.setContent(`<body style="margin:0;display:grid;grid-template-columns:repeat(8,240px);background:#000">${caras.map((c, i) => `<div style="position:relative"><img src="data:image/png;base64,${c}"><span style="position:absolute;left:6px;top:4px;color:#fff;font:700 20px Arial">${(2 + i * 0.1).toFixed(1)}</span></div>`).join('')}</body>`);
  await p.setViewportSize({ width: 1920, height: 600 }); await p.screenshot({ path: dir + 'muestra-caras.png' });
  console.log('muestras en', dir); await b.close(); srv.close(); process.exit(0);
}

const total = Math.ceil(info.total * FPS);
const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-itsoffset', String(info.voz), '-i', vozFinal,
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '21', '-c:a', 'aac', '-b:a', '160k',
  '-t', (total / FPS).toFixed(2), '-movflags', '+faststart', dir + `${id}.mp4`], { stdio: ['pipe', 'ignore', 'inherit'] });
for (let f = 0; f < total; f++) {
  await p.evaluate((x) => window.cuadro(x), f / FPS);
  const jpg = await p.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(jpg)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 150 === 0) console.log(`  cuadro ${f}/${total}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await b.close(); srv.close();
console.log(`✓ ${id}.mp4 (${(statSync(dir + `${id}.mp4`).size / 1048576).toFixed(1)} MB)`);
