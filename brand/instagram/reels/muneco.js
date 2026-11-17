// HU-15 · Muñeco 2D de Hefesto con codo (hoja de partes v4), dibujado en un canvas.
// prepararMuneco(cfg): carga las piezas sueltas (mascota/partes-v4, sacadas con recortar-partes CRUDO=1),
//   recorta el brazo en el codo, tapa los círculos grises y ubica ojos y boca. Se llama una vez.
// dibujarMuneco(g, M, t, estado): dibuja un cuadro. Devuelve dónde está la cabeza del martillo (para las chispas).
(() => {
  const cargar = (src) => new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => mal(new Error('no carga ' + src)); i.src = src; });
  const lienzo = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return { c, g: c.getContext('2d'), w, h }; };
  const deImagen = (img) => { const L = lienzo(img.width, img.height); L.g.drawImage(img, 0, 0); return L; };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const tramo = (t, a, b) => clamp((t - a) / (b - a));
  const suave = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

  // Manchas de un color dentro de una pieza (grises de articulaciones, hueco oscuro de la boca)
  function manchas(L, prueba, min = 60) {
    const { w, h } = L, q = L.g.getImageData(0, 0, w, h).data, m = new Uint8Array(w * h), vis = new Uint8Array(w * h), res = [];
    for (let i = 0; i < w * h; i++) m[i] = q[i * 4 + 3] > 200 && prueba(q[i * 4], q[i * 4 + 1], q[i * 4 + 2]) ? 1 : 0;
    for (let s = 0; s < m.length; s++) {
      if (!m[s] || vis[s]) continue; const pila = [s], px = []; vis[s] = 1; let sx = 0, sy = 0, x0 = w, x1 = 0, y0 = h, y1 = 0;
      while (pila.length) { const k = pila.pop(), x = k % w, y = (k / w) | 0; px.push(k); sx += x; sy += y; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        for (const v of [k - 1, k + 1, k - w, k + w]) if (v >= 0 && v < m.length && m[v] && !vis[v] && Math.abs((v % w) - x) <= 1) { vis[v] = 1; pila.push(v); } }
      const n = px.length; if (n >= min) res.push({ x: sx / n, y: sy / n, n, r: Math.sqrt(n / Math.PI), w: x1 - x0 + 1, h: y1 - y0 + 1, px });
    }
    return res;
  }
  const gris = (r, g, b) => Math.abs(r - g) < 14 && Math.abs(g - b) < 14 && r > 95 && r < 200;
  const oscuro = (r, g, b) => Math.abs(r - g) < 16 && Math.abs(g - b) < 16 && r > 45 && r < 115;

  // Tapa un círculo gris (y su contorno) con la piel que lo rodea, fundiendo el borde (sin disco ni anillo)
  function tapar(L, m) {
    const im = L.g.getImageData(0, 0, L.w, L.h), q = im.data, R = m.r + 8;   // r es el gris; el contorno oscuro llega hasta ~r+7
    let sr = 0, sg = 0, sb = 0, n = 0;
    for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) { const d = Math.hypot(x - m.x, y - m.y), i = (y * L.w + x) * 4;
      if (d > R + 3 && d < R + 9 && q[i + 3] > 220 && q[i] > q[i + 2] + 40 && q[i] > 150) { sr += q[i]; sg += q[i + 1]; sb += q[i + 2]; n++; } }
    if (!n) return;
    sr /= n; sg /= n; sb /= n;
    for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) { const i = (y * L.w + x) * 4, d = Math.hypot(x - m.x, y - m.y);
      if (!q[i + 3] || d > R + 4) continue;
      const f = d <= R ? 1 : 1 - (d - R) / 4;          // en el borde se mezcla con lo que había
      q[i] += (sr - q[i]) * f; q[i + 1] += (sg - q[i + 1]) * f; q[i + 2] += (sb - q[i + 2]) * f; }
    L.g.putImageData(im, 0, 0);
  }

  // Desvanece una pieza más allá de una línea (para que en el codo las dos piezas se fundan, sin corte)
  function desvanecer(L, dentro) {
    const im = L.g.getImageData(0, 0, L.w, L.h), q = im.data;
    for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) { const i = (y * L.w + x) * 4; if (q[i + 3]) q[i + 3] *= dentro(x, y); }
    L.g.putImageData(im, 0, 0);
  }

  // Cara (boca y ojos) sobre la cabeza: la usan el muñeco v4 y el v5 (HU-16). hueco = mancha oscura de la boca.
  function prepararCara(I, cfg, hueco) {
    // Boca. Antes se agrandaba hasta tapar el hueco y se recortaba con su forma: los labios quedaban 1,6 veces más
    // anchos que el hueco y casi no se veía abrir. Ahora: el hueco gris de la barba se rellena con la piel de la cara
    // (y su contorno oscuro también) y la boca va encima en su tamaño real: labios del ancho del hueco.
    const mascaraBoca = lienzo(I.cabeza.w, I.cabeza.h);
    { const W = I.cabeza.w, im = I.cabeza.g.getImageData(0, 0, W, I.cabeza.h), q = im.data;
      const esPiel = (i) => q[i + 3] > 200 && q[i] > 180 && q[i + 1] > 120 && q[i + 1] < 190 && q[i + 2] > 75 && q[i + 2] < 150 && q[i] - q[i + 2] > 55;
      let sr = 0, sg = 0, sb = 0, n = 0;
      for (let y = 0; y < I.cabeza.h; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; if (Math.hypot(x - hueco.x, y - hueco.y) < 70 && esPiel(i)) { sr += q[i]; sg += q[i + 1]; sb += q[i + 2]; n++; } }
      const piel = n ? [sr / n, sg / n, sb / n] : [222, 158, 110];
      const en = new Uint8Array(W * I.cabeza.h); for (const k of hueco.px) en[k] = 1;
      // También el contorno del hueco (4 px), pero creciendo solo hacia los costados y hacia abajo:
      // el borde de arriba del hueco es la línea del bigote y no se toca (antes se borraba y la boca "tapaba" el bigote).
      // (el contorno es marrón con antialias: entra todo lo que no sea barba naranja ni piel)
      const naranja = (k) => q[k * 4] > 185 && q[k * 4 + 1] < 145 && q[k * 4 + 2] < 90;
      for (let paso = 0; paso < 4; paso++) {
        const nuevo = en.slice();
        for (let k = W; k < en.length; k++) if (!en[k] && q[k * 4 + 3] > 0 && !naranja(k) && !esPiel(k * 4) && (en[k - 1] || en[k + 1] || en[k - W])) nuevo[k] = 1;
        en.set(nuevo);
      }
      // El hueco se rellena con el naranja de la barba (no con piel): con la boca cerrada quedaba un "mentón pelado"
      // de piel lisa debajo de los labios. Así se ve la boca con su margen chico de piel y alrededor, barba.
      const esBarba = (i) => q[i + 3] > 200 && q[i] > 185 && q[i + 1] < 145 && q[i + 2] < 90;
      let br = 0, bg = 0, bb = 0, nb = 0;
      for (let y = 0; y < I.cabeza.h; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4, d = Math.hypot(x - hueco.x, y - hueco.y); if (d > hueco.w * 0.6 && d < hueco.w * 1.1 && y > hueco.y && esBarba(i)) { br += q[i]; bg += q[i + 1]; bb += q[i + 2]; nb++; } }
      const relleno = cfg.huecoConPiel ? piel : nb ? [br / nb, bg / nb, bb / nb] : piel;
      for (let k = 0; k < en.length; k++) if (en[k]) { q[k * 4] = relleno[0]; q[k * 4 + 1] = relleno[1]; q[k * 4 + 2] = relleno[2]; }
      I.cabeza.g.putImageData(im, 0, 0);
      // Máscara de la boca = esa misma zona: la boca se dibuja solo ahí y su margen de piel no pisa el bigote
      const mi = mascaraBoca.g.createImageData(W, I.cabeza.h);
      for (let k = 0; k < en.length; k++) if (en[k]) mi.data[k * 4 + 3] = 255;
      const tmp = lienzo(W, I.cabeza.h); tmp.g.putImageData(mi, 0, 0);
      mascaraBoca.g.filter = 'blur(0.8px)'; mascaraBoca.g.drawImage(tmp.c, 0, 0); mascaraBoca.g.filter = 'none'; }
    // Labios de cada boca: la caja de lo que no es piel (sirve para centrar y para medir el ancho)
    for (const B of Object.values(I.boca)) {
      const q = B.g.getImageData(0, 0, B.w, B.h).data; let x0 = B.w, x1 = 0, y0 = B.h, y1 = 0;
      for (let y = 0; y < B.h; y++) for (let x = 0; x < B.w; x++) { const i = (y * B.w + x) * 4, r = q[i], g = q[i + 1], b = q[i + 2];
        if (q[i + 3] > 200 && !(r > 170 && g > 110 && g < 200 && b > 60 && b < 160 && r - b > 50 && r - g > 25 && r - g < 75)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
      B.labios = { w: x1 - x0 + 1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, arriba: y0 };
    }
    // Una sola escala para todas las bocas (si no, "salta" de tamaño al cambiar de forma)
    const escalaBoca = hueco.w * (cfg.anchoBoca ?? 0.86) / I.boca.cerrada.labios.w;
    // Ojos: dónde coinciden los ojos abiertos con la cabeza (para el parpadeo), y máscara de borde suave
    const qc = I.cabeza.g.getImageData(0, 0, I.cabeza.w, I.cabeza.h).data, oa = I.ojos.abiertos, qo = oa.g.getImageData(0, 0, oa.w, oa.h).data;
    // Los ojos de la hoja vienen más grandes que los de la cabeza: se busca a la vez la escala y el lugar
    let ojosPos = { e: Infinity, x: 0, y: 0, s: 1 };
    for (let s = 0.4; s <= 1.0001; s += 0.02) {
      const w = Math.round(oa.w * s), h = Math.round(oa.h * s); if (w > I.cabeza.w) break;
      const ch = lienzo(w, h); ch.g.drawImage(oa.c, 0, 0, w, h); const qs = ch.g.getImageData(0, 0, w, h).data, mx = Math.round(w * 0.12), my = Math.round(h * 0.15);
      for (let oy = Math.round(I.cabeza.h * 0.15); oy < I.cabeza.h * 0.5; oy++) for (let ox = 0; ox <= I.cabeza.w - w; ox++) {
        let e = 0, n = 0; for (let y = my; y < h - my; y += 2) for (let x = mx; x < w - mx; x += 2) { const a = ((y + oy) * I.cabeza.w + x + ox) * 4, o = (y * w + x) * 4; e += Math.abs(qc[a] - qs[o]) + Math.abs(qc[a + 1] - qs[o + 1]) + Math.abs(qc[a + 2] - qs[o + 2]); n++; }
        if (e / n < ojosPos.e) ojosPos = { e: e / n, x: ox, y: oy, s };
      }
    }
    const mo = lienzo(oa.w, oa.h); mo.g.filter = 'blur(5px)'; mo.g.fillStyle = '#fff'; mo.g.beginPath(); mo.g.ellipse(oa.w / 2, oa.h / 2, oa.w / 2 - 8, oa.h / 2 - 7, 0, 0, Math.PI * 2); mo.g.fill();

    return { hueco, ojosPos, escalaBoca, mascaraBoca, mascaraOjos: mo, capa: lienzo(I.cabeza.w, I.cabeza.h) };
  }

  window.prepararMuneco = async (cfg) => {
    const ruta = (n) => cfg.carpeta + 'pieza-' + n + '.png';
    const P = cfg.piezas, I = {};
    for (const k of ['cuerpo', 'cabeza', 'brazo', 'antebrazo']) I[k] = deImagen(await cargar(ruta(P[k])));
    I.ojos = {}; for (const [k, n] of Object.entries(P.ojos)) I.ojos[k] = deImagen(await cargar(ruta(n)));
    I.boca = {}; for (const [k, n] of Object.entries(P.boca)) I.boca[k] = deImagen(await cargar(ruta(n)));

    // Anclajes. El hombro del cuerpo y el codo del antebrazo vienen de la hoja (al recortar ya se borró / pintó ese gris).
    const cuello = manchas(I.cuerpo, gris).sort((a, b) => b.n - a.n)[0];
    const hombroC = cfg.hombro;
    const gb = manchas(I.brazo, gris, 300).sort((a, b) => a.y - b.y);              // hombro, codo (y muñeca, que no se usa)
    const [hombroB, codoB] = gb;
    const codoA = { ...cfg.codo, r: Math.sqrt(cfg.codo.n / Math.PI) };
    const hueco = manchas(I.cabeza, oscuro, 200).sort((a, b) => b.n - a.n)[0];
    if (!cuello || !hombroB || !codoB || !hueco) throw new Error('no encontré las articulaciones del muñeco');

    // Cuerpo: limpia los restos del muñón del hombro (tiras de piel y el borde del círculo gris que quedaron al recortar).
    // En esa zona solo queda lo oscuro (el chaleco y su contorno); el brazo, que va detrás, ocupa el resto.
    { const rH = Math.sqrt(hombroC.n / Math.PI), im = I.cuerpo.g.getImageData(0, 0, I.cuerpo.w, I.cuerpo.h), q = im.data;
      for (let y = 0; y < I.cuerpo.h; y++) for (let x = 0; x < I.cuerpo.w; x++) {
        const i = (y * I.cuerpo.w + x) * 4;
        if (q[i + 3] && x > hombroC.x - rH * 1.6 && Math.hypot(x - hombroC.x, y - hombroC.y) < rH * 2.6 && Math.max(q[i], q[i + 1], q[i + 2]) > 110) q[i + 3] = 0;
      }
      I.cuerpo.g.putImageData(im, 0, 0); }
    // Brazo superior: termina redondo en el codo; antebrazo: se funde a la izquierda del codo
    desvanecer(I.brazo, (x, y) => (y > codoB.y && Math.hypot(x - codoB.x, y - codoB.y) > codoB.r * 1.3) ? 0 : 1);
    desvanecer(I.antebrazo, (x, y) => 1 - suave((codoA.x - x) / (codoA.r * 1.1)));
    tapar(I.brazo, hombroB); tapar(I.brazo, codoB); tapar(I.antebrazo, codoA);

    return { cfg, I, cuello, hombroC, hombroB, codoB, codoA, ...prepararCara(I, cfg, hueco) };
  };

  // Ángulos del brazo en el tiempo t (grados, + = horario). Reposo: codo afuera y martillo en alto.
  function angulos(t, golpes) {
    let a1 = -22 + Math.sin(t * 1.7) * 2, a2 = 8;
    for (const t0 of golpes) { const k = t - t0;
      if (k > -0.45 && k <= -0.08) { const e = suave(tramo(k, -0.45, -0.08)); a1 += -48 * e; a2 += -38 * e; }            // levanta
      else if (k > -0.08 && k < 0.6) { const baja = suave(tramo(k, -0.08, 0.06)), vuelve = k < 0.06 ? baja : 1 - suave(tramo(k, 0.25, 0.6));
        a1 += -48 * (1 - baja) + 14 * vuelve; a2 += -38 * (1 - baja) + 42 * vuelve; } }                                    // baja de golpe y vuelve
    return { a1, a2 };
  }

  // Posiciones en pantalla de todo el muñeco en el tiempo t
  function pose(M, t, golpes) {
    const { cfg, I, hombroC, hombroB, codoB } = M, S = cfg.escala, SB = S * (cfg.escalaBrazo ?? 1);
    const resp = Math.sin(t * 2.1) * 3;
    const bx = 540 - I.cuerpo.w / 2 * S + (cfg.desplX ?? 0), by = (cfg.piso ?? 2000) - I.cuerpo.h * S + resp;
    const { a1, a2 } = angulos(t, golpes), r1 = a1 * Math.PI / 180;
    const hx = bx + hombroC.x * S, hy = by + hombroC.y * S;
    const dx = (codoB.x - hombroB.x) * SB, dy = (codoB.y - hombroB.y) * SB;
    const cx = hx + dx * Math.cos(r1) - dy * Math.sin(r1), cy = hy + dx * Math.sin(r1) + dy * Math.cos(r1);
    const af = a1 + a2 - 50;   // el antebrazo de la hoja apunta a la derecha: se gira para que apunte arriba en diagonal
    return { S, SB, bx, by, a1, hx, hy, cx, cy, af };
  }
  // Un punto de una pieza (coordenadas de la hoja) llevado a la pantalla
  const aPantalla = (px, py, ax, ay, ang, esc, x, y) => { const r = ang * Math.PI / 180, ux = (x - ax) * esc, uy = (y - ay) * esc; return { x: px + ux * Math.cos(r) - uy * Math.sin(r), y: py + ux * Math.sin(r) + uy * Math.cos(r) }; };
  const cabezaMartillo = (M, p) => aPantalla(p.cx, p.cy, M.codoA.x, M.codoA.y, p.af, p.SB, M.I.antebrazo.w * 0.89, 40);

  // Cabeza apoyada en el cuello (cx, cy en pantalla), con escala EC, ojos y boca. La usan el muñeco v4 y el v5.
  function dibujarCabeza(g, M, t, cx, cy, EC, { boca, ojos, habla }) {
    const { cfg, I, hueco, ojosPos } = M;
    const giro = Math.sin(t * 3.1) * (habla ? 1.6 : 0.6);
    g.save(); g.translate(cx, cy); g.rotate(giro * Math.PI / 180); g.scale(EC, EC); g.translate(-hueco.x, -hueco.y - (cfg.bocaSobreCuello ?? 14));
    g.drawImage(I.cabeza.c, 0, 0);
    const capa = M.capa;
    if (ojos !== 'abiertos' && I.ojos[ojos]) {      // parpadeo: los ojos de la hoja, con borde suave
      const O = I.ojos[ojos]; capa.g.clearRect(0, 0, capa.w, capa.h);
      capa.g.drawImage(O.c, 0, 0); capa.g.globalCompositeOperation = 'destination-in'; capa.g.drawImage(M.mascaraOjos.c, 0, 0); capa.g.globalCompositeOperation = 'source-over';
      g.drawImage(capa.c, 0, 0, O.w, O.h, ojosPos.x, ojosPos.y, O.w * ojosPos.s, O.h * ojosPos.s);
    }
    const B = I.boca[boca] ?? I.boca.cerrada, e = M.escalaBoca;   // boca en su tamaño real, centrada en el hueco
    // El labio de arriba queda fijo justo debajo del bigote y la boca abre hacia abajo (como la mandíbula):
    // centrada, las bocas altas (a, o) crecían hacia arriba y pisaban la nariz.
    const techo = hueco.y - hueco.h / 2 + (cfg.labioBajoBigote ?? 3);
    capa.g.clearRect(0, 0, capa.w, capa.h);
    capa.g.drawImage(B.c, hueco.x - B.labios.cx * e, techo - B.labios.arriba * e, B.w * e, B.h * e);
    capa.g.globalCompositeOperation = 'destination-in'; capa.g.drawImage(M.mascaraBoca.c, 0, 0); capa.g.globalCompositeOperation = 'source-over';
    g.drawImage(capa.c, 0, 0);
    g.restore();
  }

  window.dibujarMuneco = (g, M, t, { boca = 'cerrada', ojos = 'abiertos', habla = false, golpes = [] } = {}) => {
    const { cfg, I, cuello, hombroB, codoA } = M, p = pose(M, t, golpes);
    const pieza = (L, px, py, ax, ay, ang, esc) => { g.save(); g.translate(px, py); g.rotate(ang * Math.PI / 180); g.scale(esc, esc); g.translate(-ax, -ay); g.drawImage(L.c, 0, 0); g.restore(); };
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    // 1) brazo superior (detrás del cuerpo: el chaleco tapa el hombro), 2) cuerpo, 3) antebrazo con martillo
    pieza(I.brazo, p.hx, p.hy, hombroB.x, hombroB.y, p.a1, p.SB);
    g.drawImage(I.cuerpo.c, p.bx, p.by, I.cuerpo.w * p.S, I.cuerpo.h * p.S);
    pieza(I.antebrazo, p.cx, p.cy, codoA.x, codoA.y, p.af, p.SB);
    // 4) cabeza apoyada en el cuello, con ojos y boca
    dibujarCabeza(g, M, t, p.bx + cuello.x * p.S, p.by + cuello.y * p.S, p.S * (cfg.escalaCabeza ?? 1), { boca, ojos, habla });
    // Dónde está la cabeza del martillo ahora y en el instante de cada golpe (para las chispas)
    const golpe = {}; for (const t0 of golpes) golpe[t0] = cabezaMartillo(M, pose(M, t0 + 0.06, golpes));
    return { martillo: cabezaMartillo(M, p), golpe };
  };

  // ───────────── HU-16 · Muñeco v5: dos brazos y manos con gestos ─────────────
  // Piezas sueltas de mascota/partes-v5b (recortar-partes CRUDO=1). La cara (cabeza, ojos, bocas) sigue siendo la de la v4.
  // El brazo de la izquierda de la pantalla es el espejo del de la derecha (RN-16.2).
  const rad = (a) => a * Math.PI / 180, deg = (a) => a * 180 / Math.PI;
  // Círculos grises de las articulaciones (descarta la cabeza del martillo, que también es gris pero rectangular)
  const esCirculo = (m) => Math.abs(m.w - m.h) <= Math.max(m.w, m.h) * 0.3 && m.n / (m.w * m.h) > 0.65 && m.n / (m.w * m.h) < 0.9;
  const circulos = (L) => manchas(L, gris, 150).filter(esCirculo);
  // Puntos de una pieza (para saber hasta dónde llega la mano en pantalla) y su centro de masa
  function contorno(L) {
    const q = L.g.getImageData(0, 0, L.w, L.h).data, pts = []; let sx = 0, sy = 0, n = 0;
    for (let y = 0; y < L.h; y += 3) for (let x = 0; x < L.w; x += 3) if (q[(y * L.w + x) * 4 + 3] > 128) { sx += x; sy += y; n++; if (y % 6 === 0 && x % 6 === 0) pts.push([x, y]); }
    return { pts, cx: sx / n, cy: sy / n };
  }

  window.prepararMunecoV5 = async (cfg) => {
    const ruta = (c, n) => c + 'pieza-' + n + '.png', P = cfg.piezas, I = { ojos: {}, boca: {}, manos: {} };
    I.cuerpo = deImagen(await cargar(ruta(cfg.carpeta, P.cuerpo)));
    I.brazo = deImagen(await cargar(ruta(cfg.carpeta, P.brazo)));
    for (const [k, n] of Object.entries(P.manos)) I.manos[k] = deImagen(await cargar(ruta(cfg.carpeta, n)));
    const C = cfg.cara;
    I.cabeza = deImagen(await cargar(ruta(C.carpeta, C.cabeza)));
    for (const [k, n] of Object.entries(C.ojos)) I.ojos[k] = deImagen(await cargar(ruta(C.carpeta, n)));
    for (const [k, n] of Object.entries(C.boca)) I.boca[k] = deImagen(await cargar(ruta(C.carpeta, n)));

    // Cuerpo: cuello (el círculo de más arriba) y los dos hombros
    const cc = circulos(I.cuerpo).sort((a, b) => a.y - b.y);
    if (cc.length < 3) throw new Error(`v5: el cuerpo tiene ${cc.length} círculos grises (se esperan 3: cuello y hombros). Manchas grises: ${JSON.stringify(manchas(I.cuerpo, gris, 150).map(m => [Math.round(m.x), Math.round(m.y), m.w, m.h, m.n]))}`);
    const cuello = cc[0], [hIzq, hDer] = cc.slice(1, 3).sort((a, b) => a.x - b.x);
    tapar(I.cuerpo, hIzq); tapar(I.cuerpo, hDer);
    // Brazo de arriba: hombro (arriba) y codo (abajo)
    const cb = circulos(I.brazo).sort((a, b) => a.y - b.y);
    if (cb.length < 2) throw new Error('v5: el brazo de arriba necesita 2 círculos grises (hombro y codo)');
    const hombroB = cb[0], codoB = cb.at(-1);
    tapar(I.brazo, hombroB); tapar(I.brazo, codoB);
    const brazo = { hombro: hombroB, codo: codoB, largo: Math.hypot(codoB.x - hombroB.x, codoB.y - hombroB.y), nat: deg(Math.atan2(codoB.y - hombroB.y, codoB.x - hombroB.x)) };
    // Manos: el codo es el círculo de la pieza; en el brazo entero de "reposo" es el de más abajo y se borra lo que está arriba
    const manos = {};
    for (const [k, L] of Object.entries(I.manos)) {
      const cm = circulos(L), recortar = (cfg.recortarEnCodo ?? []).includes(k);
      if (!cm.length) throw new Error(`v5: la mano "${k}" no tiene el círculo gris del codo`);
      const codo = recortar ? cm.sort((a, b) => b.y - a.y)[0] : cm.sort((a, b) => b.n - a.n)[0];
      if (recortar) desvanecer(L, (x, y) => y >= codo.y || Math.hypot(x - codo.x, y - codo.y) < codo.r * 1.5 ? 1 : 0);
      tapar(L, codo);
      const { pts, cx, cy } = contorno(L);
      const martillo = k === 'martillo' ? manchas(L, gris, 150).filter(m => !esCirculo(m)).sort((a, b) => b.n - a.n)[0] ?? null : null;
      manos[k] = { L, codo, pts, nat: deg(Math.atan2(cy - codo.y, cx - codo.x)), martillo };
    }
    const hueco = manchas(I.cabeza, oscuro, 200).sort((a, b) => b.n - a.n)[0];
    return { v5: true, cfg, I, cuello, hombros: { izq: hIzq, der: hDer }, brazo, manos, ...prepararCara(I, cfg, hueco) };
  };

  // Dónde va cada pieza en pantalla. poses = { der: { sup, ant, mano }, izq: {...} } (de gestos.js)
  function poseV5(M, t, poses) {
    const { cfg, I } = M, S = cfg.escala, resp = Math.sin(t * 2.1) * 3;
    const bx = 540 - I.cuerpo.w / 2 * S + (cfg.desplX ?? 0), by = (cfg.piso ?? 2000) - I.cuerpo.h * S + resp;
    const brazos = {};
    for (const lado of ['der', 'izq']) {
      const p = poses[lado], h = M.hombros[lado], hx = bx + h.x * S, hy = by + h.y * S;
      const ex = hx + Math.cos(rad(p.sup)) * M.brazo.largo * S, ey = hy + Math.sin(rad(p.sup)) * M.brazo.largo * S;
      // El lado izquierdo va espejado; la mano además puede pedir espejo propio (p.espejo, por ejemplo en "explica")
      const espejo = lado === 'izq', espejoMano = espejo !== !!p.espejo, mano = M.manos[p.mano] ?? M.manos.reposo;
      // Con espejo, la dirección natural de la pieza pasa a ser 180 - nat
      const giro = (dir, nat, esp) => esp ? dir - 180 + nat : dir - nat;
      brazos[lado] = { espejo, espejoMano, hx, hy, ex, ey, rotBrazo: giro(p.sup, M.brazo.nat, espejo), mano, rotMano: giro(p.ant, mano.nat, espejoMano) };
    }
    return { S, bx, by, brazos };
  }
  // Un punto de una pieza (coordenadas de la pieza) llevado a pantalla, con giro y espejo
  const aPantallaV5 = (px, py, ax, ay, rot, esc, espejo, x, y) => { const r = rad(rot), ux = (x - ax) * esc * (espejo ? -1 : 1), uy = (y - ay) * esc; return { x: px + ux * Math.cos(r) - uy * Math.sin(r), y: py + ux * Math.sin(r) + uy * Math.cos(r) }; };
  const puntoMartillo = (P) => { const b = P.brazos.der, m = b.mano.martillo; return m ? aPantallaV5(b.ex, b.ey, b.mano.codo.x, b.mano.codo.y, b.rotMano, P.S, b.espejoMano, m.x, m.y) : null; };
  window.martilloV5 = (M, t, poses) => puntoMartillo(poseV5(M, t, poses));

  window.dibujarMunecoV5 = (g, M, t, { boca = 'cerrada', ojos = 'abiertos', habla = false, poses } = {}) => {
    const { cfg, I, cuello } = M, P = poseV5(M, t, poses);
    const pieza = (L, px, py, ax, ay, ang, esc, espejo) => { g.save(); g.translate(px, py); g.rotate(rad(ang)); g.scale(espejo ? -esc : esc, esc); g.translate(-ax, -ay); g.drawImage(L.c, 0, 0); g.restore(); };
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    // 1) cuerpo, 2) antebrazos con la mano, 3) brazos de arriba (su punta redonda tapa la unión del codo), 4) cabeza
    g.drawImage(I.cuerpo.c, P.bx, P.by, I.cuerpo.w * P.S, I.cuerpo.h * P.S);
    for (const b of Object.values(P.brazos)) pieza(b.mano.L, b.ex, b.ey, b.mano.codo.x, b.mano.codo.y, b.rotMano, P.S, b.espejoMano);
    for (const b of Object.values(P.brazos)) pieza(I.brazo, b.hx, b.hy, M.brazo.hombro.x, M.brazo.hombro.y, b.rotBrazo, P.S, b.espejo);
    // Hasta dónde llega cada mano en pantalla (para el chequeo de la zona de las manos, CA-16.7)
    const manos = {};
    for (const [lado, b] of Object.entries(P.brazos)) {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const [x, y] of b.mano.pts) { const q = aPantallaV5(b.ex, b.ey, b.mano.codo.x, b.mano.codo.y, b.rotMano, P.S, b.espejoMano, x, y); x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); }
      manos[lado] = { x0, x1, y0, y1 };
    }
    dibujarCabeza(g, M, t, P.bx + cuello.x * P.S, P.by + cuello.y * P.S, cfg.escalaCabeza, { boca, ojos, habla });
    return { martillo: puntoMartillo(P), manos };
  };
})();
