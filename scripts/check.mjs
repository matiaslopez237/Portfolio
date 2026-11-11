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

  // ── HU-03: Identidad visual ──
  {
    ca: 'CA-03.1', desc: 'brand/direcciones.html: 3 direcciones con selector, cada una con logo, post, historia y perfil',
    run: () => {
      const h = leerOpcional('brand/direcciones.html'); if (!h) throw new Error('no existe brand/direcciones.html');
      if (!h.includes('proto-picker')) throw new Error('falta el selector');
      const dirs = h.split('data-direccion=').slice(1);
      if (dirs.length !== 3) throw new Error(`hay ${dirs.length} direcciones`);
      const piezas = ['logo', 'post', 'historia', 'perfil'];
      const faltan = dirs.flatMap((d, i) => piezas.filter(p => !d.includes(`data-pieza="${p}"`)).map(p => `${i + 1}:${p}`));
      if (faltan.length) throw new Error('faltan piezas: ' + faltan.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-03.2', desc: 'Paleta elegida (brand/tokens.json): texto y secundario ≥ 4.5:1, acento ≥ 3:1 sobre el fondo',
    run: () => {
      const t = JSON.parse(leerOpcional('brand/tokens.json') ?? 'null'); if (!t) throw new Error('no existe brand/tokens.json');
      const c = t.color ?? {};
      const pares = [['texto', 4.5], ['textoSecundario', 4.5], ['acento', 3]];
      const malos = pares.filter(([k, min]) => !(c[k] && c.fondo && contraste(c[k], c.fondo) >= min)).map(([k, min]) => `${k} (${c[k] && c.fondo ? contraste(c[k], c.fondo).toFixed(2) : 'falta'} < ${min})`);
      if (malos.length) throw new Error(malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-03.3', desc: 'Logos SVG válidos: logo.svg, simbolo.svg y logo-1color.svg',
    run: () => {
      const malos = ['logo.svg', 'simbolo.svg', 'logo-1color.svg'].filter(f => {
        const s = leerOpcional('brand/logo/' + f); return !(s && /<svg[\s>]/.test(s) && /viewBox="[^"]+"/.test(s));
      });
      if (malos.length) throw new Error('faltan o no son válidos: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-03.4', desc: 'Exportaciones PNG con medidas exactas',
    run: () => {
      const esperadas = { 'perfil-instagram.png': [1080, 1080], 'perfil-whatsapp.png': [640, 640], 'favicon-32.png': [32, 32], 'apple-touch-icon.png': [180, 180], 'og.png': [1200, 630] };
      const malos = Object.entries(esperadas).filter(([f, [w, h]]) => { const d = medidasPng('brand/export/' + f); return !d || d[0] !== w || d[1] !== h; })
        .map(([f, [w, h]]) => { const d = medidasPng('brand/export/' + f); return `${f} (${d ? d.join('×') : 'falta'}, esperado ${w}×${h})`; });
      if (malos.length) throw new Error(malos.join('; '));
      return true;
    },
  },
  {
    ca: 'CA-03.5', desc: 'brand/marca.html tiene Paleta, Tipografías, Logo (usos correctos e incorrectos) y Tono de voz',
    run: () => {
      const h = leerOpcional('brand/marca.html'); if (!h) throw new Error('no existe brand/marca.html');
      const faltan = ['Paleta', 'Tipografías', 'Logo', 'Usos correctos', 'Usos incorrectos', 'Tono de voz'].filter(s => !new RegExp(`<h[23][^>]*>\\s*${s}`, 'i').test(h));
      if (faltan.length) throw new Error('faltan secciones: ' + faltan.join(', '));
      return true;
    },
  },

  // ── HU-04: Kit de Instagram ──
  {
    ca: 'CA-04.1', desc: 'brand/instagram/perfil.md: nombre, @, categoría, link y bio ≤ 150 caracteres',
    run: () => {
      const p = leerOpcional('brand/instagram/perfil.md'); if (!p) throw new Error('no existe brand/instagram/perfil.md');
      const faltan = ['Nombre', 'Usuario', 'Categoría', 'Link'].filter(k => !new RegExp(`^- \\*\\*${k}:\\*\\* \\S`, 'm').test(p));
      if (faltan.length) throw new Error('faltan: ' + faltan.join(', '));
      const bio = p.match(/```bio\n([\s\S]*?)\n```/); if (!bio) throw new Error('falta el bloque ```bio');
      const largo = [...bio[1]].length; if (largo > 150) throw new Error(`la bio tiene ${largo} caracteres`);
      return true;
    },
  },
  {
    ca: 'CA-04.2', desc: '5 portadas de destacadas PNG de 1080×1920',
    run: () => {
      const malos = ['trabajos', 'planes', 'proceso', 'preguntas', 'contacto'].map(n => `brand/instagram/destacadas/${n}.png`)
        .filter(f => { const d = medidasPng(f); return !d || d[0] !== 1080 || d[1] !== 1920; });
      if (malos.length) throw new Error('faltan o miden mal: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-04.3', desc: '9 posts PNG de 1080×1350',
    run: () => {
      const malos = Array.from({ length: 9 }, (_, i) => `brand/instagram/posts/post-${i + 1}.png`)
        .filter(f => { const d = medidasPng(f); return !d || d[0] !== 1080 || d[1] !== 1350; });
      if (malos.length) throw new Error('faltan o miden mal: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-04.4', desc: 'textos.md: 9 posts con texto ≤ 2.200 caracteres y 5 a 10 hashtags',
    run: () => {
      const t = leerOpcional('brand/instagram/textos.md'); if (!t) throw new Error('no existe brand/instagram/textos.md');
      const bloques = [...t.matchAll(/^## Post (\d+)[^\n]*\n[\s\S]*?```texto\n([\s\S]*?)\n```/gm)];
      if (bloques.length < 9) throw new Error(`hay ${bloques.length} textos`); // desde la HU-09 hay más de 9
      const malos = bloques.filter(([, , txt]) => { const h = (txt.match(/#[\p{L}\p{N}_]+/gu) || []).length; return [...txt].length > 2200 || h < 5 || h > 10; }).map(b => 'post ' + b[1]);
      if (malos.length) throw new Error('fuera de límites: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-04.5', desc: 'Plantillas HTML de post e historia que solo usan colores de brand/tokens.json',
    run: () => {
      const t = JSON.parse(leer('brand/tokens.json'));
      const permitidos = new Set([...Object.values(t.color), ...Object.values(t.colorClaro)].filter(v => /^#/.test(v)).map(v => v.toLowerCase()));
      const malos = [];
      for (const f of ['brand/instagram/plantillas/post.html', 'brand/instagram/plantillas/historia.html']) {
        const h = leerOpcional(f); if (!h) { malos.push(f + ' (falta)'); continue; }
        const fuera = [...new Set((h.match(/#[0-9a-f]{6}\b/gi) || []).map(c => c.toLowerCase()))].filter(c => !permitidos.has(c));
        if (fuera.length) malos.push(`${f}: ${fuera.join(' ')}`);
        if (/rgba?\(/i.test(h)) malos.push(f + ': usa rgb()/rgba()');
      }
      if (malos.length) throw new Error(malos.join('; '));
      return true;
    },
  },
  {
    ca: 'CA-04.6', desc: 'calendario.md cubre 4 semanas con fecha, formato y pieza',
    run: () => {
      const c = leerOpcional('brand/instagram/calendario.md'); if (!c) throw new Error('no existe brand/instagram/calendario.md');
      const semanas = (c.match(/^## Semana [1-4]\b/gm) || []).length;
      const filas = c.split('\n').filter(l => /^\| \d{4}-\d{2}-\d{2} \|/.test(l));
      const malas = filas.filter(l => l.split('|').slice(1, -1).map(s => s.trim()).filter(Boolean).length < 3);
      if (semanas !== 4) throw new Error(`hay ${semanas} semanas`);
      if (filas.length < 12 || malas.length) throw new Error(`${filas.length} publicaciones, ${malas.length} incompletas`);
      return true;
    },
  },

  // ── HU-05: WhatsApp Business ──
  {
    ca: 'CA-05.2', desc: 'brand/whatsapp/perfil.md: nombre, categoría, horario lun-sáb 9 a 21, email, sitio y descripción ≤ 512',
    run: () => {
      const p = leerOpcional('brand/whatsapp/perfil.md'); if (!p) throw new Error('no existe brand/whatsapp/perfil.md');
      const faltan = ['Nombre', 'Categoría', 'Horario', 'Email', 'Sitio web'].filter(k => !new RegExp(`^- \\*\\*${k}:\\*\\* \\S`, 'm').test(p));
      if (faltan.length) throw new Error('faltan: ' + faltan.join(', '));
      if (!/^- \*\*Horario:\*\* Lunes a sábado de 9 a 21/m.test(p)) throw new Error('el horario no es lunes a sábado de 9 a 21');
      const d = p.match(/```descripcion\n([\s\S]*?)\n```/); if (!d) throw new Error('falta el bloque ```descripcion');
      const largo = [...d[1]].length; if (largo > 512) throw new Error(`la descripción tiene ${largo} caracteres`);
      return true;
    },
  },
  {
    ca: 'CA-05.3', desc: 'Catálogo: 3 PNG de 800×800 y textos dentro de los límites (nombre ≤ 75, descripción ≤ 5.000)',
    run: () => {
      const c = contenidoWa();
      if (c.catalogo?.length !== 3) throw new Error(`hay ${c.catalogo?.length ?? 0} productos`);
      const malos = [];
      for (const p of c.catalogo) {
        const d = medidasPng(`brand/whatsapp/catalogo/${p.id}.png`);
        if (!d || d[0] !== 800 || d[1] !== 800) malos.push(`${p.id}.png falta o mide mal`);
        if ([...p.nombre].length > 75) malos.push(`${p.id}: nombre largo`);
        if (!p.descripcion || [...p.descripcion].length > 5000) malos.push(`${p.id}: descripción vacía o larga`);
        if (c.precios[p.precio] == null) malos.push(`${p.id}: precio sin definir`);
      }
      if (malos.length) throw new Error(malos.join('; '));
      return true;
    },
  },
  {
    ca: 'CA-05.4', desc: 'mensajes.md: bienvenida y ausencia ≤ 1.024 y al menos 4 respuestas rápidas (atajo ≤ 25)',
    run: () => {
      const m = leerOpcional('brand/whatsapp/mensajes.md'); if (!m) throw new Error('no existe brand/whatsapp/mensajes.md');
      const malos = [];
      for (const b of ['bienvenida', 'ausencia']) {
        const x = m.match(new RegExp('```' + b + '\\n([\\s\\S]*?)\\n```'));
        if (!x) malos.push(`falta ${b}`); else if ([...x[1]].length > 1024) malos.push(`${b} larga`);
      }
      const rapidas = [...m.matchAll(/^### \/(\S+)\n+```respuesta\n([\s\S]*?)\n```/gm)];
      if (rapidas.length < 4) malos.push(`hay ${rapidas.length} respuestas rápidas`);
      for (const [, atajo, txt] of rapidas) if (atajo.length > 25 || [...txt].length > 1024) malos.push(`/${atajo} fuera de límite`);
      if (malos.length) throw new Error(malos.join('; '));
      return true;
    },
  },
  {
    ca: 'CA-05.5', desc: 'Flyer PNG de 1080×1920 con precios vigentes, número nuevo y QR del chat',
    run: () => {
      const d = medidasPng('brand/whatsapp/flyer.png');
      if (!d || d[0] !== 1080 || d[1] !== 1920) throw new Error('flyer.png falta o mide mal');
      const c = contenidoWa();
      if (c.numero !== '5492604661138') throw new Error('el número de contenido.json no es el nuevo');
      if (Object.values(c.precios).join() !== '$150.000,$350.000,$900.000') throw new Error('precios: ' + Object.values(c.precios).join(' '));
      const q = medidasPng('brand/whatsapp/qr-whatsapp.png'); if (!q) throw new Error('falta el QR (qr-whatsapp.png)');
      const h = leerOpcional('brand/whatsapp/plantillas/flyer.html') ?? '';
      if (!/qr/i.test(h) || !/precios/.test(h)) throw new Error('la plantilla del flyer no usa el QR o los precios');
      return true;
    },
  },
  {
    ca: 'CA-05.6', desc: 'Plantillas de WhatsApp (catálogo y flyer) solo con colores de brand/tokens.json',
    run: () => {
      const t = JSON.parse(leer('brand/tokens.json'));
      const permitidos = new Set([...Object.values(t.color), ...Object.values(t.colorClaro)].filter(v => /^#/.test(v)).map(v => v.toLowerCase()));
      const malos = [];
      for (const f of ['brand/whatsapp/plantillas/catalogo.html', 'brand/whatsapp/plantillas/flyer.html']) {
        const h = leerOpcional(f); if (!h) { malos.push(f + ' (falta)'); continue; }
        const fuera = [...new Set((h.match(/#[0-9a-f]{6}\b/gi) || []).map(c => c.toLowerCase()))].filter(c => !permitidos.has(c));
        if (fuera.length) malos.push(`${f}: ${fuera.join(' ')}`);
        if (/rgba?\(/i.test(h)) malos.push(f + ': usa rgb()/rgba()');
      }
      if (malos.length) throw new Error(malos.join('; '));
      return true;
    },
  },

  // ── HU-09: Posts de la semana 4 y calendario corrido ──
  {
    ca: 'CA-09.1', desc: 'Posts 10, 11 y 12 en PNG de 1080×1350',
    run: () => {
      const malos = [10, 11, 12].map(n => `brand/instagram/posts/post-${n}.png`)
        .filter(f => { const d = medidasPng(f); return !d || d[0] !== 1080 || d[1] !== 1350; });
      if (malos.length) throw new Error('faltan o miden mal: ' + malos.join(', '));
      return true;
    },
  },
  {
    ca: 'CA-09.2', desc: 'textos.md: posts 10 a 12 con texto ≤ 2.200 caracteres y 5 a 10 hashtags',
    run: () => {
      const b = textosPorPost();
      const malos = [10, 11, 12].filter(n => {
        const txt = b.get(n); if (!txt) return true;
        const h = (txt.match(/#[\p{L}\p{N}_]+/gu) || []).length;
        return [...txt].length > 2200 || h < 5 || h > 10;
      });
      if (malos.length) throw new Error('faltan o fuera de límites: ' + malos.map(n => 'post ' + n).join(', '));
      return true;
    },
  },
  {
    ca: 'CA-09.3', desc: 'El post 11 dice "proyecto de muestra" en la imagen y en el texto',
    run: () => {
      const c = JSON.parse(leer('brand/instagram/contenido.json'));
      const p = c.posts.find(x => x.n === 11); if (!p) throw new Error('no está el post 11 en contenido.json');
      const enImagen = /proyecto de muestra/i.test(JSON.stringify(p));
      const enTexto = /proyecto de muestra/i.test(textosPorPost().get(11) ?? '');
      if (!enImagen || !enTexto) throw new Error(`imagen: ${enImagen ? 'sí' : 'no'} · texto: ${enTexto ? 'sí' : 'no'}`);
      return true;
    },
  },
  {
    ca: 'CA-09.4', desc: 'calendario.md: post 1 el 2026-11-11 y posts 1 a 12 en orden, lunes, miércoles y viernes',
    run: () => {
      const posts = postsDelCalendario();
      const nums = posts.map(p => p.n);
      if (nums.join() !== Array.from({ length: 12 }, (_, i) => i + 1).join()) throw new Error('orden de posts: ' + nums.join(', '));
      if (posts[0].fecha !== '2026-11-11') throw new Error('el post 1 sale el ' + posts[0].fecha);
      const mal = posts.filter(p => ![1, 3, 5].includes(new Date(p.fecha + 'T12:00:00Z').getUTCDay())).map(p => `post ${p.n} (${p.fecha})`);
      if (mal.length) throw new Error('no caen lunes, miércoles o viernes: ' + mal.join(', '));
      return true;
    },
  },

  // ── HU-10: Publicación automática en Instagram ──
  {
    ca: 'CA-10.6', desc: 'Workflow diario a las 22:00 UTC, lanzable a mano, solo con los secrets IG_USER_ID e IG_ACCESS_TOKEN',
    run: () => {
      const w = leerOpcional('.github/workflows/publicar-instagram.yml'); if (!w) throw new Error('no existe .github/workflows/publicar-instagram.yml');
      const malos = [];
      if (!/cron:\s*['"]0 22 \* \* \*['"]/.test(w)) malos.push('falta el cron "0 22 * * *"');
      if (!/workflow_dispatch/.test(w)) malos.push('no se puede lanzar a mano (workflow_dispatch)');
      const secrets = [...new Set([...w.matchAll(/secrets\.([A-Z0-9_]+)/g)].map(m => m[1]))].sort();
      if (secrets.join() !== 'IG_ACCESS_TOKEN,IG_USER_ID') malos.push('secrets usados: ' + (secrets.join(', ') || 'ninguno'));
      if (malos.length) throw new Error(malos.join('; '));
      return true;
    },
  },
  {
    ca: 'CA-10.7', desc: 'Ningún token o clave de Meta/Instagram escrito en los archivos del repositorio',
    run: async () => {
      const { execSync } = await import('node:child_process');
      const archivos = execSync('git ls-files --cached --others --exclude-standard', { cwd: new URL('..', import.meta.url) }).toString().split('\n')
        .filter(f => f && !/\.(png|jpe?g|ttf|woff2?|ico)$/i.test(f) && !f.startsWith('node_modules/'));
      const patron = /\b(EAA[A-Za-z0-9]{30,}|IGAA[A-Za-z0-9_-]{30,}|IGQ[A-Za-z0-9_-]{30,})\b|access_token=(?!\$\{|['"]?\s*\+)[A-Za-z0-9]{20,}/;
      const con = archivos.filter(f => { const t = leerOpcional(f); return t && patron.test(t); });
      if (con.length) throw new Error('posible token en: ' + con.join(', '));
      return true;
    },
  },
];

// Texto de cada post de brand/instagram/textos.md, por número.
function textosPorPost() {
  const t = leerOpcional('brand/instagram/textos.md'); if (!t) throw new Error('no existe brand/instagram/textos.md');
  return new Map([...t.matchAll(/^## Post (\d+)[^\n]*\n[\s\S]*?```texto\n([\s\S]*?)\n```/gm)].map(m => [+m[1], m[2]]));
}

// Filas "Post" de brand/instagram/calendario.md, ordenadas por fecha: [{ fecha, n }].
function postsDelCalendario() {
  const c = leerOpcional('brand/instagram/calendario.md'); if (!c) throw new Error('no existe brand/instagram/calendario.md');
  return c.split('\n').map(l => l.split('|').map(s => s.trim()))
    .filter(cols => /^\d{4}-\d{2}-\d{2}$/.test(cols[1] ?? '') && cols[3] === 'Post')
    .map(cols => ({ fecha: cols[1], n: +((cols[4].match(/Post (\d+)/) || [])[1]) }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function contenidoWa() {
  const j = leerOpcional('brand/whatsapp/contenido.json'); if (!j) throw new Error('no existe brand/whatsapp/contenido.json');
  return JSON.parse(j);
}

function leerOpcional(ruta) { try { return leer(ruta); } catch { return null; } }

// Contraste WCAG entre dos colores hex.
function contraste(a, b) {
  const lum = (hex) => {
    const n = hex.replace('#', '');
    const [r, g, bl] = [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

// Ancho y alto de un PNG leyendo su encabezado (IHDR), sin dependencias.
function medidasPng(ruta) {
  try {
    const buf = readFileSync(new URL('../' + ruta, import.meta.url));
    if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
    return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  } catch { return null; }
}

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
