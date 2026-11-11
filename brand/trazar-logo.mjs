// Genera brand/logo/logo.svg y logo-1color.svg con las letras convertidas en trazos (HU-03, RN-03.7).
// Así el logo se ve igual en cualquier lado: como <img>, impreso, sin internet o en otra computadora.
// Si cambia el nombre (HU-02 sigue provisorio), se editan NOMBRE / DESCRIPTOR / FIRMA y se corre:
//   node brand/trazar-logo.mjs && node brand/export.mjs
import opentype from 'opentype.js';
import { writeFileSync } from 'node:fs';

const NOMBRE = 'HEFESTO';
const DESCRIPTOR = 'WEBS';
const FIRMA = 'POR MATIAS LOPEZ';
const COLOR = { texto: '#eef1f4', acento: '#ff7a1a', secundario: '#9aa6b2' };

// Google Fonts entrega TTF (que opentype.js puede leer) a navegadores viejos.
async function ttf(familia, eje) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${familia}:${eje}`, { headers: { 'User-Agent': 'Mozilla/4.0' } })).text();
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error('No se encontró TTF para ' + familia);
  return opentype.parse(await (await fetch(url)).arrayBuffer());
}
const archivo = await ttf('Archivo', 'wdth,wght@70,800');
const publica = await ttf('Public+Sans', 'wght@500');

// opentype.js a veces devuelve un punto de control NaN en algunas curvas (pasó con la "B" de WEBS).
// Se arma el path a mano y, si un punto de control es inválido, se usa el punto final de la curva.
const n = (v) => (Math.round(v * 100) / 100).toString();
function pathSeguro(path) {
  return path.commands.map(c => {
    const ok = (v) => Number.isFinite(v);
    if (c.type === 'M' || c.type === 'L') return `${c.type}${n(c.x)} ${n(c.y)}`;
    if (c.type === 'Q') return ok(c.x1) && ok(c.y1) ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}` : `L${n(c.x)} ${n(c.y)}`;
    if (c.type === 'C') return [c.x1, c.y1, c.x2, c.y2].every(ok) ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}` : `L${n(c.x)} ${n(c.y)}`;
    return 'Z';
  }).join('');
}

// Arma el texto letra por letra (con su kerning y el espaciado pedido). Se hace a mano porque
// opentype.js falla con algunas funciones tipográficas avanzadas de Archivo.
const trazo = (font, texto, x, y, size, trackPx) => {
  const escala = size / font.unitsPerEm;
  let cursor = x, d = '', anterior = null;
  for (const ch of texto) {
    const glifo = font.charToGlyph(ch);
    // Algunas versiones de la tipografía devuelven un kerning inválido (NaN) para ciertos pares: se ignora.
    const kern = anterior ? font.getKerningValue(anterior, glifo) : 0;
    if (Number.isFinite(kern)) cursor += kern * escala;
    d += pathSeguro(glifo.getPath(cursor, y, size));
    cursor += glifo.advanceWidth * escala + trackPx;
    anterior = glifo;
  }
  return { d, ancho: cursor - x };
};

const X = 124, BASE = 72, SIZE = 64;
const nombre = trazo(archivo, NOMBRE + ' ', X, BASE, SIZE, 0.5);
const descriptor = trazo(archivo, DESCRIPTOR, X + nombre.ancho, BASE, SIZE, 0.5);
const firma = trazo(publica, FIRMA, X + 2, 98, 13, 2.4);
const ancho = Math.ceil(Math.max(X + nombre.ancho + descriptor.ancho, X + firma.ancho) + 8);

const simbolo = (relleno, acento, unColor) => `
  <g transform="translate(6 10)" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 4 L90 27 V73 L50 96 L10 73 V27 Z" fill="none" stroke="${relleno}" stroke-width="5"/>
    <path d="M36 29 L26 39.5 L36 50 M64 29 L74 39.5 L64 50" fill="none" stroke="${relleno}" stroke-width="5.5"/>
    <path d="M55.5 26 L44.5 53" stroke="${unColor ? relleno : acento}" stroke-width="5.5"/>
    <path d="M24 61 H76 V66.5 C70 67.5 65 69 61 71 V75 H66 V80.5 H34 V75 H39 V71 C35 69 30 67.5 24 65.5 Z" fill="${relleno}"/>
  </g>`;

const svg = (unColor) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} 120" role="img" aria-label="${NOMBRE[0] + NOMBRE.slice(1).toLowerCase()} ${DESCRIPTOR[0] + DESCRIPTOR.slice(1).toLowerCase()}, por Matias Lopez">
  <!-- Generado por brand/trazar-logo.mjs: no editar a mano. Letras en trazos (Archivo 800 ancho 70 + Public Sans 500). ${unColor ? 'Versión a un color: usa currentColor.' : ''} -->${simbolo(unColor ? 'currentColor' : COLOR.texto, COLOR.acento, unColor)}
  <path d="${nombre.d}" fill="${unColor ? 'currentColor' : COLOR.texto}"/>
  <path d="${descriptor.d}" fill="${unColor ? 'currentColor' : COLOR.acento}"/>
  <path d="${firma.d}" fill="${unColor ? 'currentColor' : COLOR.secundario}"/>
</svg>
`;
writeFileSync(new URL('./logo/logo.svg', import.meta.url), svg(false));
writeFileSync(new URL('./logo/logo-1color.svg', import.meta.url), svg(true));
console.log(`✓ logo.svg y logo-1color.svg (viewBox ${ancho}×120, sin tipografías)`);
