// Capa "Forja" (HU-12): animación del logo, barra de metal que se calienta, texturas, placas y efectos de las secciones.
// Con prefers-reduced-motion no hay animaciones (ver forja.css). Sin JS el sitio se ve igual de completo.
(() => {
  const $ = (id) => document.getElementById(id);
  const hero = $('inicio'), fondo = $('fondo'), vuelo = $('vuelo'), pieza = $('pieza'), brillo = $('brillo'), halo = $('halo');
  const sombra = $('sombra'), calor = $('calor'), slot = document.querySelector('.site-header .logo-simbolo'), nav = $('nav');
  const slotSvg = slot; const hueco = document.querySelector('.site-header .logo-hueco');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const aj = { curva: 0.85, giro: 20, chispas: 1, flote: 10, tramo: 0.75 }; // valores elegidos en el prototipo
  

  // ── utilidades de easing ──
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const tramo = (t, a, b) => clamp((t - a) / (b - a));

  // Dónde cae un punto de la foto (en proporción) con object-fit: cover y object-position.
  const FOTO = { w: 1376, h: 768 }, YUNQUE = { x: 0.76, y: 0.585 }; // parte de arriba del yunque
  function puntoFoto(px, py) {
    const r = fondo.getBoundingClientRect(), cs = getComputedStyle(fondo);
    const esc = Math.max(r.width / FOTO.w, r.height / FOTO.h);
    const w = FOTO.w * esc, h = FOTO.h * esc;
    const [ox, oy] = cs.objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const x0 = (r.width - w) * ox, y0 = (r.height - h) * oy;
    return { x: r.left + x0 + px * w, y: r.top + y0 + py * h, esc: w };
  }

  // ── chispas ──
  const cv = $('chispas'), cx = cv.getContext('2d');
  let chispas = [];
  function ajustarCanvas() { const dpr = Math.min(devicePixelRatio, 2); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  ajustarCanvas(); addEventListener('resize', ajustarCanvas);
  function emitir(x, y, n, fuerza) {
    for (let i = 0; i < n && chispas.length < 90; i++) {
      const ang = -Math.PI / 2 + (Math.random() - .5) * 2.2;
      const v = (1.2 + Math.random() * 2.6) * fuerza;
      chispas.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 0.5, vida: 0, max: 40 + Math.random() * 45, r: .6 + Math.random() * 1.4 });
    }
  }
  function dibujarChispas() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    cx.globalCompositeOperation = 'lighter';
    chispas = chispas.filter(c => c.vida < c.max);
    for (const c of chispas) {
      c.vida++; c.vy += 0.09; c.vx *= 0.985; c.x += c.vx; c.y += c.vy;
      const t = c.vida / c.max;
      const col = t < .25 ? '255,240,200' : t < .6 ? '255,160,60' : '220,70,20';
      cx.strokeStyle = `rgba(${col},${(1 - t).toFixed(2)})`;
      cx.lineWidth = c.r; cx.beginPath(); cx.moveTo(c.x, c.y); cx.lineTo(c.x - c.vx * 1.6, c.y - c.vy * 1.6); cx.stroke();
    }
    cx.globalCompositeOperation = 'source-over';
  }

  // ── estado ──
  let p = 0, inicio = performance.now(), llego = false, ruido = 0.8;

  function cuadro(ahora) {
    const t = (ahora - inicio) / 1000;
    const alto = hero.offsetHeight * aj.tramo;
    const objetivo = reducido ? 0 : clamp(scrollY / alto);
    p += (objetivo - p) * 0.14;                       // inercia: el logo sigue al scroll con suavidad
    if (Math.abs(objetivo - p) < 0.0005) p = objetivo;

    // Origen: flotando sobre el yunque. Destino: el símbolo de la nav.
    const y = puntoFoto(YUNQUE.x, YUNQUE.y);
    const celular = innerWidth <= 860;
    const h1 = document.querySelector('.hero-forja h1').getBoundingClientRect();
    let tamIni = celular ? clamp(y.esc * 0.17, 120, 190) : clamp(y.esc * 0.17, 160, 300);
    const s = slot.getBoundingClientRect();
    const tamFin = s.width * 1.04;
    const ini = { x: y.x, y: y.y - tamIni * 0.6 };
    // Nunca encima del texto: en compu, a la derecha del título; en celular, arriba del título.
    if (!celular) ini.x = Math.max(ini.x, h1.right + 32 + tamIni / 2);
    else { const techo = h1.top - 16; if (ini.y + tamIni / 2 > techo) { const sobra = ini.y + tamIni / 2 - techo; tamIni = Math.max(100, tamIni - sobra); ini.y = techo - tamIni / 2; } }
    const fin = { x: s.left + s.width / 2, y: s.top + s.height / 2 };

    // Fases
    const fLevanta = easeOut(tramo(p, 0, 0.18));
    const fVuelo = easeInOut(tramo(p, 0.12, 0.88));
    const fEncastre = tramo(p, 0.84, 1);

    // Flote tipo ítem: sube y baja, y se balancea; se apaga al despegar.
    const flote = reducido ? 0 : (1 - fLevanta);
    const bob = Math.sin(t * 2.2) * aj.flote * flote;
    const balanceo = Math.sin(t * 1.1) * 12 * flote;

    // Trayectoria en arco (bezier cuadrática): primero sube, después planea hacia la nav.
    // curva 0 = línea recta; curva 1 = sube primero y después planea por arriba, lejos del texto.
    const ctrl = { x: lerp((ini.x + fin.x) / 2, ini.x, aj.curva), y: lerp((ini.y + fin.y) / 2, fin.y, aj.curva) };
    const u = fVuelo, mu = 1 - u;
    let x = mu * mu * ini.x + 2 * mu * u * ctrl.x + u * u * fin.x;
    let yy = mu * mu * (ini.y - 34 * fLevanta) + 2 * mu * u * ctrl.y + u * u * fin.y;
    yy += bob;

    // Tamaño: se achica más rápido al principio; al encastrar se pasa apenas y se acomoda.
    let tam = lerp(tamIni, tamFin, easeOut(fVuelo));
    tam *= 1 + Math.sin(Math.PI * fEncastre) * 0.14 * (fEncastre < 1 ? 1 : 0);

    // Giro 3D: se inclina hacia donde va y se endereza al llegar.
    const giroY = balanceo + aj.giro * Math.sin(Math.PI * fVuelo);
    const giroX = -aj.giro * 0.45 * Math.sin(Math.PI * fVuelo);
    const giroZ = -9 * Math.sin(Math.PI * fVuelo);

    vuelo.style.width = vuelo.style.height = tam + 'px';
    vuelo.style.transform = `translate(${x - tam / 2}px, ${yy - tam / 2}px)`;
    pieza.style.transform = `rotateX(${giroX}deg) rotateY(${giroY}deg) rotateZ(${giroZ}deg)`;

    // Fundido final con el logo plano de la nav.
    const fundido = reducido ? 1 : tramo(p, 0.93, 0.995);
    pieza.style.opacity = 1 - fundido;
    slotSvg.style.opacity = fundido;
    hueco.style.setProperty('--hueco', (1 - fundido).toFixed(3));
    hueco.classList.toggle('tibio', p > 0.72 && fundido < 0.99);
    if (fundido >= 0.99 && !llego) { llego = true; slot.classList.remove('destello'); void slot.getBoundingClientRect(); slot.classList.add('destello'); }
    if (fundido < 0.5) llego = false;

    // Hierro al rojo: se enciende al cargar, después respira con parpadeos; se aviva al despegar y se enfría en el viaje.
    const encendido = clamp(t / 0.6) * (1 + 0.6 * Math.exp(-Math.pow((t - 0.9) / 0.35, 2)));
    ruido += (Math.random() - 0.5) * 0.25; ruido = clamp(ruido, 0.55, 1.05);
    const parpadeo = reducido ? 0.85 : ruido + (Math.random() < 0.015 ? 0.4 : 0);
    const aviva = 1 + 0.6 * Math.sin(Math.PI * tramo(p, 0, 0.3));
    const enfria = 1 - 0.7 * fVuelo;
    const calorActual = encendido * parpadeo * aviva * enfria;
    brillo.style.opacity = clamp(calorActual, 0, 1.2);
    halo.style.opacity = clamp(calorActual * 0.9, 0, 1);

    // Sombra de contacto y calor sobre el yunque: siguen el flote y se apagan al despegar.
    const sombraOn = 1 - fLevanta;
    sombra.style.left = calor.style.left = (y.x - hero.getBoundingClientRect().left) + 'px';
    sombra.style.top = calor.style.top = (y.y - hero.getBoundingClientRect().top) + 'px';
    const altura = (bob + aj.flote) / (2 * aj.flote || 1);
    sombra.style.width = tamIni * (0.75 + 0.25 * (1 - altura)) * (1 + fLevanta) + 'px';
    sombra.style.opacity = (0.55 + 0.3 * (1 - altura)) * sombraOn;
    calor.style.width = tamIni * 1.1 + 'px';
    calor.style.opacity = clamp(calorActual * 0.8 * sombraOn, 0, 1);

    // Fondo: profundidad (se aleja y se oscurece).
    fondo.style.transform = `translateY(${p * 60}px) scale(${1 + 0.06 * p})`;
    fondo.style.filter = `brightness(${1 - 0.4 * p})`;

    // Chispas desde la parte de abajo de la barra al rojo.
    if (!reducido && aj.chispas > 0) {
      const r = pieza.getBoundingClientRect();
      const ex = r.left + r.width * 0.47, ey = r.top + r.height * 0.66;
      const tasa = aj.chispas * (0.12 + (parpadeo > 1 ? 0.6 : 0) + 1.4 * Math.sin(Math.PI * tramo(p, 0, 0.3))) * (1 - fVuelo) * clamp(t / 0.6);
      if (Math.random() < tasa) emitir(ex, ey, 1 + (Math.random() < 0.3 ? 2 : 0), 0.6 + tamIni / 400);
    }
    if (fVuelo >= 0.98) chispas = [];
    dibujarChispas();
    requestAnimationFrame(cuadro);
  }
  requestAnimationFrame(cuadro);
})();

(() => {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));



  // Fondo de hierro fundido sin cortes: cada mancha que toca un borde se dibuja también del lado opuesto.
  (() => {
    const T = 640, c = document.createElement('canvas'); c.width = c.height = T; const g = c.getContext('2d');
    let s = 29; const azar = () => (s = (s * 16807) % 2147483647) / 2147483647;
    g.fillStyle = '#13181d'; g.fillRect(0, 0, T, T);
    const mancha = (x, y, r, color) => { for (const dx of [-T, 0, T]) for (const dy of [-T, 0, T]) {
      const cx = x + dx, cy = y + dy; if (cx + r < 0 || cx - r > T || cy + r < 0 || cy - r > T) continue;
      const m = g.createRadialGradient(cx, cy, 0, cx, cy, r); m.addColorStop(0, color); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(cx - r, cy - r, r * 2, r * 2); } };
    for (let i = 0; i < 90; i++) mancha(azar() * T, azar() * T, 60 + azar() * 180, azar() < .5 ? 'rgba(120,135,150,' + (.025 + azar() * .045).toFixed(3) + ')' : 'rgba(0,0,0,' + (.08 + azar() * .14).toFixed(3) + ')');
    for (let i = 0; i < 260; i++) mancha(azar() * T, azar() * T, 4 + azar() * 22, azar() < .5 ? 'rgba(150,160,175,.04)' : 'rgba(0,0,0,.12)');
    // Grano: es ruido por píxel, así que empalma solo
    const img = g.getImageData(0, 0, T, T), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (azar() - .5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
    document.documentElement.style.setProperty('--hierro', 'url(' + c.toDataURL('image/webp', .82) + ')');
  })();

  // Textura de metal gastado para la barra: rayones, picaduras y manchas generados al azar (sin imágenes externas).
  (() => {
    const W = 1600, H = 160, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    let semilla = 11; const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
    const base = g.createLinearGradient(0, 0, 0, H); base.addColorStop(0, '#323b45'); base.addColorStop(.5, '#272f38'); base.addColorStop(1, '#1e252d');
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    // Manchas y zonas gastadas (más claras y más oscuras)
    for (let i = 0; i < 70; i++) {
      const x0 = azar() * W, y = azar() * H, r = 20 + azar() * 120, claro = azar() < .45;
      for (const x of [x0 - W, x0, x0 + W]) { if (x + r < 0 || x - r > W) continue;
        const m = g.createRadialGradient(x, y, 0, x, y, r);
        m.addColorStop(0, claro ? 'rgba(170,182,195,.07)' : 'rgba(5,8,11,.22)'); m.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = m; g.fillRect(x - r, y - r, r * 2, r * 2); }
    }
    // Vetas verticales oscuras (como el óxido escurrido de la referencia)
    for (let i = 0; i < 9; i++) { const x = azar() * W, w = 4 + azar() * 18; const v = g.createLinearGradient(x - w, 0, x + w, 0);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(.5, 'rgba(6,9,12,' + (.12 + azar() * .18).toFixed(2) + ')'); v.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = v; g.fillRect(x - w, 0, w * 2, H); }
    // Rayones finos en varias direcciones (cepillado circular + rayones sueltos)
    g.lineCap = 'round';
    for (let i = 0; i < 3400; i++) {
      const x = azar() * W, y = azar() * H, largo = 8 + azar() * (azar() < .1 ? 160 : 50);
      const ang = (azar() < .6 ? -0.35 + azar() * .7 : azar() * Math.PI);
      const claro = azar() < .7;
      g.strokeStyle = claro ? 'rgba(215,225,235,' + (.045 + azar() * .1).toFixed(3) + ')' : 'rgba(0,0,0,' + (.05 + azar() * .1).toFixed(3) + ')';
      g.lineWidth = azar() < .92 ? .6 : 1.2;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(ang) * largo, y + Math.sin(ang) * largo); g.stroke();
    }
    // Picaduras: hueco oscuro con un borde de luz
    for (let i = 0; i < 46; i++) {
      const x = azar() * W, y = azar() * H, rx = .8 + azar() * 2.6, ry = rx * (.5 + azar() * .6);
      g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.ellipse(x, y, rx, ry, azar() * 3, 0, Math.PI * 2); g.fill();
      g.strokeStyle = 'rgba(200,210,220,.22)'; g.lineWidth = .6; g.beginPath(); g.ellipse(x + .4, y + .5, rx + .6, ry + .5, 0, .2, 2.4); g.stroke();
    }
    // Grano fino
    const img = g.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (azar() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    g.putImageData(img, 0, 0);
    document.documentElement.style.setProperty('--metal', 'url(' + c.toDataURL('image/webp', .8) + ')');
  })();

  // Metal que se calienta en la barra: sube rápido al pasar el mouse y se enfría despacio.
  (() => {
    const header = document.querySelector('.site-header');
    const capa = document.createElement('div'); capa.className = 'calor-nav'; capa.setAttribute('aria-hidden', 'true'); header.prepend(capa);
    const objetivos = [...header.querySelectorAll('.nav-links a, .logo')];
    let calor = 0, meta = 0, cx = 0, cw = 220, cxMeta = 0, cwMeta = 220, activo = null;
    function apuntar(el) {
      const r = el.getBoundingClientRect(), h = header.getBoundingClientRect();
      cxMeta = r.left + r.width / 2 - h.left; cwMeta = Math.max(160, r.width * 2.2);
      if (calor < 0.05) { cx = cxMeta; cw = cwMeta; }
    }
    objetivos.forEach(el => {
      el.addEventListener('pointerenter', () => { activo = el; apuntar(el); meta = el.classList.contains('btn') ? 1 : 0.85; el.classList.add('caliente'); });
      el.addEventListener('pointerleave', () => { if (activo === el) activo = null; meta = 0; setTimeout(() => { if (activo !== el) el.classList.remove('caliente'); }, 450); });
      el.addEventListener('focus', () => { activo = el; apuntar(el); meta = 0.85; el.classList.add('caliente'); });
      el.addEventListener('blur', () => { meta = 0; el.classList.remove('caliente'); });
    });
    (function paso() {
      // Calentar es rápido (~0,25 s); enfriar es lento (~1,4 s), como el metal.
      calor += (meta - calor) * (meta > calor ? 0.18 : 0.035);
      if (meta === 0 && calor < 0.01) calor = 0;
      cx += (cxMeta - cx) * 0.2; cw += (cwMeta - cw) * 0.2;
      // Mientras se enfría, el resplandor se achica y se vuelve más rojo oscuro.
      capa.style.setProperty('--calor', calor.toFixed(3));
      capa.style.setProperty('--cx', cx.toFixed(1) + 'px');
      capa.style.setProperty('--cw', (cw * (0.75 + 0.25 * calor)).toFixed(1) + 'px');
      capa.style.filter = 'hue-rotate(' + ((1 - calor) * -12).toFixed(1) + 'deg) saturate(' + (1 + (1 - calor) * 0.3).toFixed(2) + ')';
      requestAnimationFrame(paso);
    })();
  })();


  // Remaches en las esquinas de cada placa
  document.querySelectorAll('.section, .ficha-franja').forEach(s => { const r = document.createElement('span'); r.className = 'remaches'; r.setAttribute('aria-hidden', 'true'); s.append(r); });

  // Números fantasma en cada título de sección
  document.querySelectorAll('.section-head').forEach((s, i) => { const f = document.createElement('span'); f.className = 'fantasma'; f.setAttribute('aria-hidden', 'true'); f.textContent = String(i + 1).padStart(2, '0'); s.prepend(f); });
  const fantasmas = [...document.querySelectorAll('.fantasma')];

  // Aparición y encendido, una vez
  const marcar = ['.section-head', '.showcase', '.rubros li', '.plan', '.a-medida', '.pasos li', '.contacto-texto', '.form', '.ficha-franja'];
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visto');
    if (e.target.classList.contains('section-head')) e.target.classList.add('encendida');
    if (e.target.classList.contains('plan')) setTimeout(() => e.target.classList.add('encendida'), 250);
    io.unobserve(e.target);
  }), { threshold: 0.25 });
  document.querySelectorAll(marcar.join(',')).forEach((el) => { el.classList.add('aparece'); io.observe(el); });
  document.querySelectorAll('.plan').forEach((el, i) => { el.style.transitionDelay = (i * 90) + 'ms'; });

  // Brillo del metal que sigue al mouse
  document.querySelectorAll('.showcase, .a-medida, .form, .plan').forEach(el => el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // Línea de forja en "Cómo trabajo"
  const pasos = document.querySelector('.pasos');
  const linea = document.createElement('div'); linea.className = 'linea'; linea.setAttribute('aria-hidden', 'true'); linea.innerHTML = '<i></i>'; pasos.prepend(linea);

  // Brasas alrededor del botón de contacto
  const cta = document.querySelector('#contacto .btn-wa');
  const envoltura = document.createElement('span'); envoltura.className = 'cta-brasa'; cta.replaceWith(envoltura); envoltura.append(cta);
  const cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); envoltura.prepend(cv);
  const cx = cv.getContext('2d'); let brasas = [], visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);
  function medir() { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2); cv.width = r.width * d; cv.height = r.height * d; cx.setTransform(d, 0, 0, d, 0, 0); }
  medir(); addEventListener('resize', medir);

  const showcase = document.querySelector('.showcase'), devicesSel = () => showcase.querySelector('.panel:not([hidden]) .devices');
  let mouseEq = null;
  showcase.addEventListener('pointermove', (e) => { const r = showcase.getBoundingClientRect(); mouseEq = { x: (e.clientX - r.left) / r.width - .5, y: (e.clientY - r.top) / r.height - .5 }; });
  showcase.addEventListener('pointerleave', () => { mouseEq = null; });

  function cuadro() {
    if (!reducido) {
      const d = devicesSel();
      if (d) {
        const r = d.getBoundingClientRect(); const k = clamp(1 - Math.abs((r.top + r.height / 2) - innerHeight / 2) / innerHeight);
        let rx = 12 - 9 * k, ry = -9 + 6.5 * k; if (mouseEq) { rx = 3 - mouseEq.y * 7; ry = mouseEq.x * 9; }
        d.style.setProperty('--rx', rx.toFixed(2) + 'deg'); d.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      }
      for (const f of fantasmas) { const s = f.parentElement.getBoundingClientRect(); f.style.transform = 'translateY(' + ((s.top - innerHeight / 2) * 0.07).toFixed(1) + 'px)'; }
    }
    const rp = pasos.getBoundingClientRect();
    const avance = reducido ? 1 : clamp((innerHeight * 0.8 - rp.top) / (rp.height + innerHeight * 0.2));
    pasos.style.setProperty('--avance', avance.toFixed(3));
    const items = [...pasos.querySelectorAll('li')];
    items.forEach((p, i) => p.classList.toggle('caliente', innerWidth <= 860 ? p.getBoundingClientRect().top < innerHeight * 0.7 : avance >= i / items.length + 0.02));

    const w = cv.clientWidth, h2 = cv.clientHeight;
    if (visible && !reducido) {
      if (Math.random() < 0.18 && brasas.length < 26) brasas.push({ x: 40 + Math.random() * (w - 80), y: h2 - 22, vx: (Math.random() - .5) * .3, vy: -(.25 + Math.random() * .55), vida: 0, max: 90 + Math.random() * 90, r: .8 + Math.random() * 1.6 });
      cx.clearRect(0, 0, w, h2); cx.globalCompositeOperation = 'lighter';
      brasas = brasas.filter(b => b.vida < b.max);
      for (const b of brasas) { b.vida++; b.x += b.vx + Math.sin(b.vida / 14) * .25; b.y += b.vy; const t = b.vida / b.max, a = Math.sin(Math.PI * t);
        cx.fillStyle = 'rgba(255,' + (150 - 70 * t | 0) + ',40,' + (a * .9).toFixed(2) + ')'; cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, Math.PI * 2); cx.fill(); }
      cx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(cuadro);
  }
  requestAnimationFrame(cuadro);
})();
