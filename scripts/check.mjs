// Chequeos automáticos de criterios de aceptación (modo liviano).
// Cada chequeo lleva el ID del criterio que verifica: así lo encuentra la trazabilidad.
// Correr: npm run check
import { readFileSync } from 'node:fs';

const leer = (ruta) => readFileSync(new URL('../' + ruta, import.meta.url), 'utf8');

// Devuelve el texto de una sección "## Titulo" (hasta el próximo "## ") o null si no existe.
function seccion(md, titulo) {
  const m = md.match(new RegExp(`^## ${titulo}\\s*$([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, 'm'));
  return m ? m[1] : null;
}
function subseccion(md, titulo) {
  const m = md.match(new RegExp(`^### ${titulo}\\s*$([\\s\\S]*?)(?=^##+ |$(?![\\s\\S]))`, 'm'));
  return m ? m[1] : null;
}
const marca = () => seccion(leer('PRODUCT.md'), 'Marca');
const palabras = (linea) => linea.split(':').slice(1).join(':').split(',').map(s => s.replace(/[*.]/g, '').trim()).filter(Boolean);

const chequeos = [
  // ── HU-01: Brief de marca ──
  {
    ca: 'CA-01.1', desc: 'PRODUCT.md tiene ## Marca con sus 6 subsecciones',
    run: () => {
      const m = marca(); if (!m) throw new Error('falta la sección ## Marca');
      const faltan = ['Tipo', 'Ubicación y alcance', 'Personalidad', 'Voz', 'Canales', 'Pistas para nombre y estilo'].filter(t => subseccion(m, t) === null);
      if (faltan.length) throw new Error('faltan: ' + faltan.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-01.2', desc: 'Personalidad tiene exactamente 3 palabras "sí" y 3 "no"',
    run: () => {
      const p = subseccion(marca() ?? '', 'Personalidad'); if (!p) throw new Error('falta ### Personalidad');
      const si = p.split('\n').find(l => /^\s*-\s*\*\*Sí:\*\*/.test(l));
      const no = p.split('\n').find(l => /^\s*-\s*\*\*No:\*\*/.test(l));
      if (!si || !no) throw new Error('faltan las líneas **Sí:** / **No:**');
      const [a, b] = [palabras(si).length, palabras(no).length];
      if (a !== 3 || b !== 3) throw new Error(`hay ${a} "sí" y ${b} "no"`);
      return true;
    },
  },
  {
    ca: 'CA-01.3', desc: 'Ubicación dice "San Rafael, Mendoza" y el alcance de venta',
    run: () => {
      const u = subseccion(marca() ?? '', 'Ubicación y alcance') ?? '';
      return u.includes('San Rafael, Mendoza') && /alcance/i.test(u);
    },
  },
  {
    ca: 'CA-01.4', desc: 'Canales incluye Instagram, WhatsApp Business (número aparte) y el portfolio',
    run: () => {
      const c = subseccion(marca() ?? '', 'Canales') ?? '';
      return /Instagram/.test(c) && /WhatsApp Business/.test(c) && /número/i.test(c) && /portfolio/i.test(c);
    },
  },

  // ── HU-07: Precios nuevos y análisis en todos los planes ──
  {
    ca: 'CA-07.1', desc: 'Planes muestra $150.000, $350.000 y $900.000, sin precios anteriores',
    run: () => {
      const planes = seccionHtml('planes');
      const faltan = ['$150.000', '$350.000', '$900.000'].filter(p => !planes.includes(p));
      const viejos = ['$255.000', '$500.000', '$800.000'].filter(p => planes.includes(p));
      if (faltan.length || viejos.length) throw new Error(`faltan: ${faltan.join(' ') || '—'} · quedan viejos: ${viejos.join(' ') || '—'}`);
      return true;
    },
  },
  {
    ca: 'CA-07.2', desc: 'JSON-LD con minPrice 150000, 350000 y 900000',
    run: () => {
      const ld = leer('index.html').match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      if (!ld) throw new Error('no hay JSON-LD');
      const precios = [...ld[1].matchAll(/"minPrice":\s*(\d+)/g)].map(m => +m[1]);
      if (precios.join() !== '150000,350000,900000') throw new Error('minPrice actuales: ' + precios.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-07.3', desc: 'Las 3 tarjetas de planes listan "Estadísticas de visitas y comportamiento"',
    run: () => {
      const tarjetas = seccionHtml('planes').split('<article class="plan">').slice(1);
      const con = tarjetas.filter(t => t.includes('Estadísticas de visitas y comportamiento')).length;
      if (tarjetas.length !== 3 || con !== 3) throw new Error(`${con} de ${tarjetas.length} tarjetas lo incluyen`);
      return true;
    },
  },
  {
    ca: 'CA-07.4', desc: 'PRODUCT.md tiene los precios nuevos y el análisis en los tres planes',
    run: () => {
      const p = leer('PRODUCT.md');
      return ['$150.000', '$350.000', '$900.000'].every(x => p.includes(x))
        && !['$255.000', '$500.000', '$800.000'].some(x => p.includes(x))
        && /los tres planes incluyen/i.test(p);
    },
  },

  // ── HU-02: Nombre de la marca ──
  {
    ca: 'CA-02.1', desc: 'brand/nombres.md tiene entre 12 y 15 candidatos, cada uno con su por qué',
    run: () => {
      const c = candidatos();
      if (c.length < 12 || c.length > 15) throw new Error(`hay ${c.length} candidatos`);
      const sinPorque = c.filter(f => !f.porque).map(f => f.nombre);
      if (sinPorque.length) throw new Error('sin por qué: ' + sinPorque.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-02.2', desc: 'Todos los candidatos: nombre principal de una palabra (4 a 9 letras, sin tildes, ñ, números ni guiones) + descriptor opcional "Webs"',
    run: () => {
      // RN-02.1 (modificada el 2026-11-07): se permite el descriptor " Webs" después del nombre principal.
      const malos = candidatos().map(f => f.nombre).filter(n => !/^[a-z]{4,9}( Webs)?$/i.test(n));
      if (malos.length) throw new Error('no cumplen: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-02.3', desc: 'La lista corta (3 a 5) tiene estado de .com.ar, .com, @ e INPI',
    run: () => {
      const lc = listaCorta();
      if (lc.length < 3 || lc.length > 5) throw new Error(`la lista corta tiene ${lc.length}`);
      const estado = /^(libre|ocupado|a confirmar)\b/i;
      const malos = lc.filter(f => ![f.comar, f.com, f.arroba, f.inpi].every(v => estado.test(v))).map(f => f.nombre);
      if (malos.length) throw new Error('estados incompletos: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-02.4', desc: 'Todo dato "libre" u "ocupado" tiene fuente y fecha',
    run: () => {
      const malos = listaCorta().filter(f => [f.comar, f.com, f.arroba, f.inpi].some(v => /^(libre|ocupado)/i.test(v)) && !/\d{4}-\d{2}-\d{2}/.test(f.fuente)).map(f => f.nombre);
      if (malos.length) throw new Error('sin fuente/fecha: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-02.5', desc: 'El nombre elegido está en PRODUCT.md › Marca › Tipo y en la lista corta',
    run: () => {
      const tipo = subseccion(marca() ?? '', 'Tipo') ?? '';
      const m = tipo.match(/Nombre elegido:\s*\*\*([^*]+)\*\*/);
      if (!m) throw new Error('falta "Nombre elegido: **X**" en ### Tipo');
      if (!listaCorta().some(f => f.nombre.toLowerCase() === m[1].trim().toLowerCase())) throw new Error(`"${m[1]}" no está en la lista corta`);
      return true;
    },
  },
];

// Filas de una tabla markdown que está debajo de "## Titulo" en brand/nombres.md.
function tablaNombres(titulo) {
  let md; try { md = leer('brand/nombres.md'); } catch { throw new Error('no existe brand/nombres.md'); }
  const s = seccion(md, titulo); if (s === null) throw new Error(`falta ## ${titulo}`);
  return s.split('\n').filter(l => /^\|/.test(l)).slice(2).map(l => l.split('|').slice(1, -1).map(c => c.trim()));
}
const limpiar = (n) => n.replace(/[*`]/g, '').trim();
const candidatos = () => tablaNombres('Candidatos').map(([nombre, porque]) => ({ nombre: limpiar(nombre), porque }));
const listaCorta = () => tablaNombres('Lista corta').map(([nombre, comar, com, arroba, inpi, choque, fuente]) => ({ nombre: limpiar(nombre), comar, com, arroba, inpi, choque, fuente }));

// Texto de una <section id="..."> de index.html.
function seccionHtml(id) {
  const html = leer('index.html');
  const i = html.indexOf(`id="${id}"`);
  if (i < 0) throw new Error(`no existe la sección #${id}`);
  const fin = html.indexOf('</section>', i);
  return html.slice(i, fin);
}

let fallas = 0;
for (const c of chequeos) {
  let ok = false, detalle = '';
  try { ok = await c.run(); } catch (e) { detalle = ' — ' + e.message; }
  if (!ok) fallas++;
  console.log(`${ok ? '✓' : '✗'} ${c.ca} ${c.desc}${detalle}`);
}
console.log(`\n${chequeos.length - fallas}/${chequeos.length} criterios en verde`);
process.exit(fallas ? 1 : 0);
