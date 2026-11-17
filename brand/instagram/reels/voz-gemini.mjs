// HU-15 · Voz de Hefesto con Gemini TTS (Google AI Studio, uso gratuito con límites).
// La clave NO va en el repo: se lee de la variable GEMINI_API_KEY o del archivo ~/.claves/gemini.txt, y nunca se imprime.
// Uso:
//   node brand/instagram/reels/voz-gemini.mjs              → muestras: R1/voces/gemini-<voz>.mp3
//   node brand/instagram/reels/voz-gemini.mjs --reel R1    → voz del reel: R1/voz.mp3, R1/palabras.json y R1/energia.json
// Gemini no da el tiempo de cada palabra: se calcula con las pausas del audio (ver alinear()).
import ffmpeg from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const API = 'https://generativelanguage.googleapis.com/v1beta';
const aqui = new URL('./', import.meta.url), ruta = (r) => fileURLToPath(new URL(r, aqui));
export const ESTILO = 'Leé esto en español rioplatense (Argentina), con voseo, como un herrero de unos 40 años: voz grave, cálida y segura, ritmo ágil de reel de Instagram, sonando natural y cercano, no como locutor:';

function clave() {
  const archivo = `${homedir()}/.claves/gemini.txt`;
  const c = (process.env.GEMINI_API_KEY ?? (existsSync(archivo) ? readFileSync(archivo, 'utf8') : '')).trim();
  if (!c) { console.error(`Falta la clave de Gemini: guardala en ${archivo}.`); process.exit(1); }
  return c;
}

async function pedir(url, cuerpo) {
  const k = clave();
  const r = await fetch(url, { method: cuerpo ? 'POST' : 'GET', headers: { 'x-goog-api-key': k, 'Content-Type': 'application/json' }, body: cuerpo && JSON.stringify(cuerpo) });
  const j = await r.json();
  if (!r.ok) throw new Error(`Gemini respondió ${r.status}: ${j.error?.message ?? 'error'}`.replaceAll(k, '***'));
  return j;
}

// El nombre del modelo de voz cambia con las versiones: se usa el más nuevo que diga "tts" (prefiriendo "flash")
async function modeloTTS() {
  const { models = [] } = await pedir(`${API}/models?pageSize=1000`);
  const tts = models.map(m => m.name).filter(n => /tts/i.test(n)).sort().reverse();
  if (!tts.length) throw new Error('Tu cuenta no tiene ningún modelo de voz (TTS) disponible.');
  return tts.find(n => /flash/i.test(n)) ?? tts[0];
}

/**
 * Pide el audio a Gemini. Devuelve PCM de 16 bits mono y su frecuencia.
 * El tono va en una sección de notas, separada de la sección TRANSCRIPT (lo único que se lee), como recomienda Google:
 * pegado al texto, Gemini lo leía en voz alta. El modelo de voz no acepta systemInstruction.
 * Con estilo = null se pide solo el texto (sirve de referencia para controlar la duración).
 */
async function generar(modelo, texto, voz, estilo = ESTILO) {
  const prompt = estilo == null ? texto
    : `### DIRECTOR'S NOTES (do not read aloud)\n${estilo.replace(/:$/, '.')}\n\n### TRANSCRIPT (read only this, word for word)\n${texto}`;
  const j = await pedir(`${API}/${modelo}:generateContent`, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voz } } } },
  });
  const parte = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!parte) throw new Error(`Gemini no devolvió audio para la voz ${voz}`);
  return { pcm: Buffer.from(parte.inlineData.data, 'base64'), tasa: Number(/rate=(\d+)/.exec(parte.inlineData.mimeType ?? '')?.[1] ?? 24000) };
}

/**
 * Gemini a veces termina con un golpe de ruido (estática) después de la última palabra: un sonido muy corto
 * (menos de 0,4 s) que viene después de un silencio de 0,2 s o más. Se corta desde ese silencio y se apaga suave.
 */
export function sacarRuidoFinal({ pcm, tasa }) {
  const ener = energia({ pcm, tasa }), fps = 30, voz = ener.map(v => v > 0.06);
  let fin = voz.lastIndexOf(true) + 1, cortes = 0;
  while (fin > 0) {
    let i = fin - 1; while (i >= 0 && voz[i]) i--;                       // inicio del último tramo con sonido
    let j = i; while (j >= 0 && !voz[j]) j--;                             // antes de eso, el silencio
    if (fin - (i + 1) < 0.4 * fps && i - j >= 0.2 * fps && j >= 0) { fin = j + 1; cortes++; } else break;
  }
  if (!cortes) return { pcm, tasa, cortado: 0 };
  const hasta = Math.min(pcm.length / 2, Math.round((fin / fps + 0.15) * tasa)), fundido = Math.round(0.08 * tasa);
  const out = Buffer.from(pcm.subarray(0, hasta * 2));
  for (let k = 0; k < fundido && k < hasta; k++) { const pos = (hasta - 1 - k) * 2; out.writeInt16LE(Math.round(out.readInt16LE(pos) * (k / fundido)), pos); }
  return { pcm: out, tasa, cortado: (pcm.length / 2 - hasta) / tasa };
}

function aMp3({ pcm, tasa }, destino) {
  const tmp = destino + '.pcm'; writeFileSync(tmp, pcm);
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(tasa), '-ac', '1', '-i', tmp, '-b:a', '160k', destino]);
  rmSync(tmp);
}

/** Energía de la voz cada 1/30 s (0 a 1): sirve para abrir la boca solo cuando suena. */
export function energia({ pcm, tasa }, fps = 30) {
  const n = pcm.length / 2, paso = Math.round(tasa / fps), res = [];
  for (let i = 0; i < n; i += paso) { let s = 0, c = 0; for (let j = i; j < Math.min(n, i + paso); j++) { const v = pcm.readInt16LE(j * 2) / 32768; s += v * v; c++; } res.push(Math.sqrt(s / c)); }
  const max = Math.max(...res) || 1;
  return res.map(v => Math.round((v / max) * 1000) / 1000);
}

/**
 * Tiempo de cada palabra a partir de las pausas: las frases (cortadas en . ? ! :) se ubican en los silencios más
 * cercanos a donde "deberían" caer por su largo, y dentro de cada frase las palabras se reparten por cantidad de letras.
 */
export function alinear(texto, ener, fps = 30) {
  const voz = ener.map(v => v > 0.06), t = (i) => i / fps;
  const ini = voz.indexOf(true), fin = voz.lastIndexOf(true) + 1;
  // silencios de 0,15 s o más dentro del habla
  const pausas = []; let s = -1;
  for (let i = ini; i < fin; i++) { if (!voz[i] && s < 0) s = i; if (voz[i] && s >= 0) { if (i - s >= Math.round(0.15 * fps)) pausas.push({ a: t(s), b: t(i) }); s = -1; } }
  const frases = texto.match(/[^.?!:]+[.?!:]?/g).map(x => x.trim()).filter(Boolean);
  const largos = frases.map(f => f.replace(/[^\p{L}\p{N}]/gu, '').length), total = largos.reduce((a, b) => a + b, 0);
  const T0 = t(ini), T1 = t(fin), cortes = []; let acum = 0, desde = 0;
  for (let k = 0; k < frases.length - 1; k++) {
    acum += largos[k]; const esperado = T0 + (T1 - T0) * acum / total;
    let mejor = -1;
    for (let j = desde; j < pausas.length; j++) if (mejor < 0 || Math.abs((pausas[j].a + pausas[j].b) / 2 - esperado) < Math.abs((pausas[mejor].a + pausas[mejor].b) / 2 - esperado)) mejor = j;
    if (mejor >= 0 && Math.abs((pausas[mejor].a + pausas[mejor].b) / 2 - esperado) < 1.2) { cortes.push(pausas[mejor]); desde = mejor + 1; }
    else cortes.push({ a: esperado, b: esperado });
  }
  const palabras = [];
  frases.forEach((f, k) => {
    const a = k ? cortes[k - 1].b : T0, b = k < cortes.length ? cortes[k].a : T1;
    const toks = f.split(/\s+/), pesos = toks.map(w => w.replace(/[^\p{L}\p{N}]/gu, '').length + 1.5), suma = pesos.reduce((x, y) => x + y, 0);
    let c = a;
    toks.forEach((w, i) => { const d = (b - a) * pesos[i] / suma; palabras.push({ texto: w.replace(/[^\p{L}\p{N}]/gu, ''), inicio: Math.round(c * 1000) / 1000, fin: Math.round((c + d * 0.92) * 1000) / 1000 }); c += d; });
  });
  return palabras;
}

// ── Línea de comandos ──
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const l = process.argv.indexOf('--limpiar');
  if (l > 0) {
    const id = process.argv[l + 1], dir = ruta(`${id}/`);
    const reel = JSON.parse(readFileSync(ruta('guiones.json'), 'utf8')).reels.find(r => r.id === id);
    const pcm = execFileSync(ffmpeg, ['-loglevel', 'error', '-i', dir + 'voz.mp3', '-f', 's16le', '-ac', '1', '-ar', '24000', '-'], { maxBuffer: 1 << 28 });
    const audio = sacarRuidoFinal({ pcm, tasa: 24000 });
    if (!audio.cortado) { console.log(`${id}: la voz no tiene ruido al final`); process.exit(0); }
    aMp3(audio, dir + 'voz.mp3');
    const ener = energia(audio), palabras = alinear(reel.lineas.map(x => x.texto).join(' '), ener);
    writeFileSync(dir + 'energia.json', JSON.stringify(ener)); writeFileSync(dir + 'palabras.json', JSON.stringify(palabras, null, 1));
    console.log(`${id}: ruido final quitado (${audio.cortado.toFixed(2)} s); voz de ${(ener.length / 30).toFixed(1)} s`); process.exit(0);
  }
  const modelo = await modeloTTS();
  console.log('modelo:', modelo);
  const i = process.argv.indexOf('--reel');
  if (i > 0) {
    const id = process.argv[i + 1];
    const reel = JSON.parse(readFileSync(ruta('guiones.json'), 'utf8')).reels.find(r => r.id === id);
    const voz = reel.voz.replace(/^gemini:/, ''), texto = reel.lineas.map(l => l.texto).join(' ');
    const dir = ruta(`${id}/`); mkdirSync(dir, { recursive: true });
    const audio = sacarRuidoFinal(await generar(modelo, texto, voz, reel.estiloVoz ?? ESTILO));
    if (audio.cortado) console.log(`ruido final quitado: ${audio.cortado.toFixed(2)} s`);
    aMp3(audio, dir + 'voz.mp3');
    const ener = energia(audio);
    const palabras = alinear(texto, ener);
    writeFileSync(dir + 'energia.json', JSON.stringify(ener));
    writeFileSync(dir + 'palabras.json', JSON.stringify(palabras, null, 1));
    console.log(`${id}: ${palabras.length} palabras, ${(ener.length / 30).toFixed(1)} s de audio`);
  } else {
    const TEXTO = '¿Tenés un negocio? Tu página tiene que tener tres cosas, sí o sí. Uno: un botón de WhatsApp. Si tienen que buscar tu número, se van.';
    const dir = ruta('R1/voces/'); mkdirSync(dir, { recursive: true });
    for (const voz of ['Algenib', 'Charon', 'Orus']) { aMp3(await generar(modelo, TEXTO, voz), dir + `gemini-${voz}.mp3`); console.log(`✓ gemini-${voz}.mp3`); }
  }
}
