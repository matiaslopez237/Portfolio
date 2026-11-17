// HU-15: recorta las partes de la mascota de la hoja con fondo verde (hoja-partes-v2.jpg).
// Saca el verde, separa cada pieza por regiones conectadas, las clasifica por posición
// y calcula los puntos de anclaje (hombro, hueco de la boca, ojos). Escribe mascota/partes/*.png y partes.json.
// Correr: node brand/instagram/reels/recortar-partes.mjs
// Otra hoja: HOJA=hoja-partes-v3.png SALIDA=partes-v3 CRUDO=1 node ... (CRUDO: guarda pieza-N.png sin clasificar)
// PURO=1 (HU-16, hoja v5): solo saca el verde; no borra muñones ni pinta articulaciones (el muñeco v5 las busca solo).
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const aqui = new URL('./mascota/', import.meta.url);
const HOJA = process.env.HOJA ?? 'hoja-partes-v2.jpg', CRUDO = !!process.env.CRUDO, PURO = !!process.env.PURO;
const salida = fileURLToPath(new URL((process.env.SALIDA ?? 'partes') + '/', aqui));
mkdirSync(salida, { recursive: true });
const hoja = `data:image/${HOJA.endsWith('.png') ? 'png' : 'jpeg'};base64,` + readFileSync(new URL(HOJA, aqui)).toString('base64');

const b = await chromium.launch();
const p = await b.newPage();
const res = await p.evaluate(async ({ src, PURO }) => {
  const img = await new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
  const W = img.width, H = img.height, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const id = g.getImageData(0, 0, W, H), d = id.data;
  // 1) Verde -> transparente (con borde suave y sin "derrame" verde en los bordes)
  const verde = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const r = d[i * 4], gg = d[i * 4 + 1], bl = d[i * 4 + 2];
    const exceso = gg - Math.max(r, bl);
    if (exceso > 70) { d[i * 4 + 3] = 0; verde[i] = 1; }
    else if (exceso > 25) { d[i * 4 + 3] = Math.round(255 * (1 - (exceso - 25) / 45)); d[i * 4 + 1] = Math.max(r, bl); }
  }
  g.putImageData(id, 0, 0);
  // 2) Regiones conectadas de lo que no es verde
  const etiqueta = new Int32Array(W * H).fill(-1), regiones = [];
  for (let s = 0; s < W * H; s++) {
    if (verde[s] || etiqueta[s] >= 0) continue;
    const pila = [s], r = { x0: W, y0: H, x1: 0, y1: 0, n: 0, id: regiones.length }; etiqueta[s] = r.id;
    while (pila.length) {
      const q = pila.pop(), x = q % W, y = (q / W) | 0; r.n++;
      if (x < r.x0) r.x0 = x; if (x > r.x1) r.x1 = x; if (y < r.y0) r.y0 = y; if (y > r.y1) r.y1 = y;
      for (const v of [q - 1, q + 1, q - W, q + W]) if (v >= 0 && v < W * H && !verde[v] && etiqueta[v] < 0 && Math.abs((v % W) - x) <= 1) { etiqueta[v] = r.id; pila.push(v); }
    }
    regiones.push(r);
  }
  const piezas = regiones.filter(r => r.n > 1500).map(r => ({ ...r, w: r.x1 - r.x0 + 1, h: r.y1 - r.y0 + 1, cx: (r.x0 + r.x1) / 2, cy: (r.y0 + r.y1) / 2 }));
  // 3) Recorte de cada pieza (solo sus píxeles), sin borde verde: se quita el "derrame" y se suaviza el borde
  const recorte = (r) => {
    const cc = document.createElement('canvas'); cc.width = r.w; cc.height = r.h; const gc = cc.getContext('2d');
    const src = g.getImageData(r.x0, r.y0, r.w, r.h), sd = src.data;
    for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) { const k = (y + r.y0) * W + (x + r.x0); if (etiqueta[k] !== r.id) sd[(y * r.w + x) * 4 + 3] = 0; }
    const alfa = new Uint8Array(r.w * r.h); for (let i = 0; i < r.w * r.h; i++) alfa[i] = sd[i * 4 + 3];
    const borde = (x, y, rad) => { for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= r.w || yy >= r.h || alfa[yy * r.w + xx] < 128) return true; } return false; };
    for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) {
      const o = (y * r.w + x) * 4; if (!alfa[y * r.w + x]) continue;
      const m = Math.max(sd[o], sd[o + 2]); if (sd[o + 1] > m + 8) sd[o + 1] = m + 8;          // sin tinte verde
      if (borde(x, y, 1)) sd[o + 3] = 0; else if (borde(x, y, 2)) sd[o + 3] = Math.min(sd[o + 3], 140); // borde comido y suave
    }
    gc.putImageData(src, 0, 0); return { url: cc.toDataURL('image/png'), data: sd, ctx: gc };
  };
  // Las articulaciones grises (hombro) se pintan del color de la piel, para que no se vea el "corte" del muñeco
  const PIEL = [222, 158, 110];
  // Solo se pinta la mancha de la articulación (alrededor de su centro), no el resto del gris (martillo)
  const pintarGris = (r, rec, art) => {
    if (!art) return;
    const radio = Math.sqrt(art.n / Math.PI) * 1.35;
    const im = rec.ctx.getImageData(0, 0, r.w, r.h), q = im.data;
    for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) {
      const i = (y * r.w + x) * 4; if (!q[i + 3] || Math.hypot(x - art.x, y - art.y) > radio) continue;
      if (Math.abs(q[i] - q[i + 1]) < 20 && Math.abs(q[i + 1] - q[i + 2]) < 20 && q[i] > 80 && q[i] < 200) { q[i] = PIEL[0]; q[i + 1] = PIEL[1]; q[i + 2] = PIEL[2]; }
    }
    rec.ctx.putImageData(im, 0, 0); rec.url = rec.ctx.canvas.toDataURL('image/png');
  };
  // Cuerpo: el muñón del hombro (círculo gris y su contorno) se borra; el brazo va detrás y su músculo ocupa ese lugar.
  // Se borra lo que está a la derecha del chaleco: desde el primer píxel no-oscuro de la fila hacia afuera, en la zona del muñón.
  const borrarMunon = (r, rec, art) => {
    if (!art) return;
    const radio = Math.sqrt(art.n / Math.PI) * 2.2;
    const im = rec.ctx.getImageData(0, 0, r.w, r.h), q = im.data;
    const oscuroPx = (i) => q[i] < 85 && q[i + 1] < 85 && q[i + 2] < 90;
    for (let y = Math.max(0, Math.round(art.y - radio)); y < Math.min(r.h, art.y + radio); y++) {
      // borde del chaleco en esta fila: último píxel oscuro a la izquierda del centro del muñón
      let borde = -1; for (let x = Math.round(art.x); x > art.x - radio * 1.6 && x >= 0; x--) if (q[(y * r.w + x) * 4 + 3] > 200 && oscuroPx((y * r.w + x) * 4)) { borde = x; break; }
      const desde = borde >= 0 ? borde + 4 : Math.round(art.x - radio * 0.6);
      for (let x = desde; x < r.w; x++) q[(y * r.w + x) * 4 + 3] = 0;
    }
    rec.ctx.putImageData(im, 0, 0); rec.url = rec.ctx.canvas.toDataURL('image/png');
  };
  // Las piezas chicas (ojos, bocas) se funden con la cabeza: borde suave de 6 px
  const fundirBorde = (r, rec) => {
    const im = rec.ctx.getImageData(0, 0, r.w, r.h), q = im.data, R = 6;
    for (let y = 0; y < r.h; y++) for (let x = 0; x < r.w; x++) {
      const i = (y * r.w + x) * 4; if (!q[i + 3]) continue;
      let dmin = R; for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= r.w || yy >= r.h || !q[(yy * r.w + xx) * 4 + 3]) dmin = Math.min(dmin, Math.hypot(dx, dy)); }
      q[i + 3] = Math.round(q[i + 3] * Math.min(1, dmin / R));
    }
    rec.ctx.putImageData(im, 0, 0); rec.url = rec.ctx.canvas.toDataURL('image/png');
  };
  // Busca el centro de una zona de color dentro de una pieza (gris del hombro, oscuro de la boca)
  // Centro de la mancha MÁS GRANDE de ese color (no el promedio de todas: así no se mezcla con brillos sueltos)
  const centroDe = (r, data, prueba, elegir = (a, b) => b.n > a.n) => {
    const m = new Uint8Array(r.w * r.h), vis = new Uint8Array(r.w * r.h);
    for (let i = 0; i < r.w * r.h; i++) { const o = i * 4; m[i] = data[o + 3] > 200 && prueba(data[o], data[o + 1], data[o + 2]) ? 1 : 0; }
    let mejor = null;
    for (let s0 = 0; s0 < m.length; s0++) {
      if (!m[s0] || vis[s0]) continue;
      const pila = [s0]; vis[s0] = 1; let sx = 0, sy = 0, n = 0;
      while (pila.length) { const q = pila.pop(), x = q % r.w, y = (q / r.w) | 0; sx += x; sy += y; n++;
        for (const v of [q - 1, q + 1, q - r.w, q + r.w]) if (v >= 0 && v < m.length && m[v] && !vis[v] && Math.abs((v % r.w) - x) <= 1) { vis[v] = 1; pila.push(v); } }
      const c = { x: sx / n, y: sy / n, n }; if (n > 400 && (!mejor || elegir(mejor, c))) mejor = c;
    }
    return mejor && mejor.n > 30 ? mejor : null;
  };
  // Gris claro y parejo de la articulación (el martillo es un gris más oscuro y no entra)
  const gris = (r, gg, bl) => Math.abs(r - gg) < 12 && Math.abs(gg - bl) < 12 && r > 95 && r < 190;
  const oscuro = (r, gg, bl) => r < 90 && gg < 90 && bl < 95 && Math.abs(r - bl) < 30;
  return { W, H, piezas: piezas.map(r => {
    const rec = recorte(r);
    // En el cuerpo hay dos articulaciones grises (cuello y hombro derecho): el hombro es la que está más a la derecha
    const info = { gris: centroDe(r, rec.data, gris, r.h > 500 ? (a, b) => b.x > a.x : undefined), oscuro: centroDe(r, rec.data, oscuro) };
    if (PURO) return { ...r, url: rec.url, ...info };
    if (r.h > 500) { info.cuello = centroDe(r, rec.data, gris, (a, b) => b.x < a.x); borrarMunon(r, rec, info.gris); }
    if (r.w > 200 && r.h <= 500) pintarGris(r, rec, info.gris);   // cuerpo y brazos: la articulación del hombro pasa a piel
    else if (r.w < 140 && r.h < 110) fundirBorde(r, rec);   // solo ojos y bocas: borde suave (los brazos sueltos no)
    return { ...r, url: rec.url, ...info };
  }) };
}, { src: hoja, PURO });
await b.close();

// 4) Clasificación por posición en la hoja
const P = res.piezas;
if (CRUDO) {
  const meta = {};
  P.forEach((r, i) => { writeFileSync(salida + 'pieza-' + i + '.png', Buffer.from(r.url.split(',')[1], 'base64')); meta['pieza-' + i] = { x: r.x0, y: r.y0, w: r.w, h: r.h, gris: r.gris, cuello: r.cuello, oscuro: r.oscuro }; });
  writeFileSync(salida + 'piezas.json', JSON.stringify({ hoja: { w: res.W, h: res.H }, piezas: meta }, null, 1));
  console.log(Object.entries(meta).map(([n, m]) => `${n} (${m.x},${m.y}) ${m.w}x${m.h}`).join(String.fromCharCode(10))); process.exit(0);
}
const porArea = [...P].sort((a, b) => b.w * b.h - a.w * a.h);
const cuerpo = porArea[0];
const resto = P.filter(x => x !== cuerpo);
const cabeza = resto.filter(x => x.h > 250).sort((a, b) => a.cx - b.cx)[0];
const chicas = resto.filter(x => x !== cabeza && x.w < 140 && x.h < 110);
const ojos = chicas.filter(x => x.w > 70 && x.cy < cabeza.y1).sort((a, b) => a.cy - b.cy);
const bocas = chicas.filter(x => !ojos.includes(x)).sort((a, b) => a.cx - b.cx);
const brazos = resto.filter(x => x !== cabeza && !chicas.includes(x)).sort((a, b) => a.cy - b.cy);
const nombres = [['cuerpo', cuerpo], ['cabeza', cabeza], ...ojos.map((o, i) => ['ojos-' + ['abiertos', 'medio', 'cerrados'][i], o]),
  ...bocas.map((o, i) => ['boca-' + ['cerrada', 'a', 'o', 'e', 'neutra'][i], o]), ...brazos.map((o, i) => ['brazo-' + (i + 1), o])];
const meta = {};
for (const [n, r] of nombres) {
  writeFileSync(salida + n + '.png', Buffer.from(r.url.split(',')[1], 'base64'));
  meta[n] = { x: r.x0, y: r.y0, w: r.w, h: r.h, gris: r.gris, oscuro: r.oscuro, ...(r.cuello ? { cuello: r.cuello } : {}) };
}
writeFileSync(salida + 'partes.json', JSON.stringify({ hoja: { w: res.W, h: res.H }, partes: meta }, null, 2));
console.log(nombres.map(([n, r]) => `${n} ${r.w}x${r.h}${r.gris ? ' hombro' : ''}${r.oscuro && n === 'cabeza' ? ' boca' : ''}`).join('\n'));
console.log(`piezas: ${P.length} (esperadas 14)`);
