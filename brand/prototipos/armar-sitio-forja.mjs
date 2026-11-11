// Arma brand/prototipos/sitio-forja.html: el index.html real + style.css real + la capa "Forja" (hero animado y profundidad).
// Correr: node brand/prototipos/armar-sitio-forja.mjs  (toma index.html y pagina-forja.html actuales)
import { readFileSync, writeFileSync } from 'node:fs';
const P = 'C:/Matias/proyecto/Portfolio/';
let h = readFileSync(P + 'index.html', 'utf8').replace(/\r\n/g, '\n');
const proto = readFileSync(P + 'brand/prototipos/pagina-forja.html', 'utf8');
const rep = (a, b) => { if (!h.includes(a)) throw new Error('no: ' + a.slice(0, 70)); h = h.replace(a, b); };

// Rutas relativas al prototipo y nada que salga de la compu
h = h.replace(/(["'\s,(])assets\//g, '$1../../assets/');
rep('href="style.css"', 'href="../../style.css"');
h = h.replace(/\s*<!-- PostHog Analytics -->\s*<script>[\s\S]*?<\/script>/, '\n  <!-- Prototipo: sin PostHog -->');
rep('<title>', '<title>Prototipo · ');
rep('action="https://formspree.io/f/xojbrbwd"', 'action="#" data-prototipo');
// Sin la aclaración de "puede tardar en cargar" (pedido de Matias, 2026-11-11)
h = h.replace(/\s*<small>Puede tardar unos segundos en cargar\.<\/small>/g, '');

// ── Hero nuevo: foto del taller + logo 3D (el texto del hero es el del sitio) ──
const main = h.match(/      <div class="hero-main">[\s\S]*?\n      <\/div>\n/)[0];
const side = h.match(/      <div class="hero-side hero-in" style="--i:2">([\s\S]*?)\n      <\/div>\n/);
const ficha = side[1].replace(/\s*<svg class="hero-simbolo"[\s\S]*?<\/svg>/, '');
h = h.replace(/    <section class="hero wrap" id="inicio"[\s\S]*?<\/section>\n/, `    <section class="hero hero-forja" id="inicio" aria-labelledby="hero-heading">
      <picture>
        <source media="(max-width: 860px)" srcset="hero/fondo-800.webp" />
        <img class="fondo" id="fondo" src="hero/fondo-1376.webp" alt="" aria-hidden="true" />
      </picture>
      <div class="velo"></div>
      <div class="calor" id="calor"></div>
      <div class="sombra" id="sombra"></div>
      <div class="texto wrap">
${main}      </div>
    </section>

    <section class="ficha-franja wrap" aria-label="Qué hago, para quién y cómo trabajo">${ficha}
    </section>
`);

// Capa del logo que vuela + chispas
rep('  <p id="aviso-pestana" hidden>', `  <div class="vuelo" id="vuelo" aria-hidden="true">
    <div class="pieza" id="pieza">
      <div class="halo" id="halo"></div>
      <img src="hero/logo-520.webp" srcset="hero/logo-260.webp 260w, hero/logo-520.webp 520w" sizes="300px" alt="" />
      <div class="brillo" id="brillo"></div>
    </div>
  </div>
  <canvas class="chispas" id="chispas" aria-hidden="true"></canvas>

  <p id="aviso-pestana" hidden>`);

// ── CSS Forja ──
const css = `
  <style>
  /* ═══ Capa "Forja" del prototipo (se sumaría a style.css en la HU-12) ═══ */
  :root { --header-h: 136px; --slot: 68px; }
  html, body { overflow-x: clip; }
  body::after { content: ''; position: fixed; inset: 0; z-index: 70; pointer-events: none; opacity: .07; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

  /* Barra de navegación al doble */
  .site-header { position: fixed; left: 0; right: 0; background: transparent; transition: background-color .3s, border-color .3s; }
  .site-header.is-scrolled { background: var(--bg); }
  .nav { height: var(--header-h); }
  .logo { gap: 18px; }
  .site-header .logo-simbolo { width: var(--slot); height: var(--slot); opacity: 0; }
  .site-header .logo-simbolo.destello .brasa { animation: destello .9s ease-out; }
  @keyframes destello { 0% { stroke: #fff3c4; filter: drop-shadow(0 0 6px #ff7a1a); } 100% { stroke: #ff7a1a; filter: none; } }
  .site-header .logo-texto { font-size: 46px; white-space: nowrap; }
  .nav-links { font-size: 16px; gap: 34px; }
  .nav-links .btn-sm { min-height: 52px; padding: 0 26px; font-size: 16px; }
  main { padding-top: 0; }

  /* Barra de acero forjado: textura de hoja/lingote y metal que se calienta donde pasa el mouse */
  .site-header { background: transparent; }
  .site-header::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; transition: opacity .35s;
    background:
      linear-gradient(100deg, transparent 0%, rgba(255,255,255,.03) 38%, rgba(255,255,255,.075) 47%, rgba(255,255,255,.025) 56%, transparent 75%),
      linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.18)),
      var(--metal, none) center / auto 100% repeat-x,
      #232a32;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1px 0 rgba(0,0,0,.6), inset 0 -3px 6px -3px rgba(0,0,0,.5), 0 14px 30px -18px rgba(0,0,0,.9);
    opacity: .82; }
  .site-header.is-scrolled::before { opacity: 1; }
  .site-header.is-scrolled { background: transparent; border-bottom-color: transparent; }
  .site-header .calor-nav { position: absolute; inset: 0; z-index: -1; pointer-events: none; mix-blend-mode: screen; opacity: var(--calor, 0);
    background: radial-gradient(ellipse var(--cw, 220px) 120% at var(--cx, 50%) 55%, rgba(255,236,190,.55) 0%, rgba(255,140,40,.42) 22%, rgba(190,50,12,.32) 48%, rgba(90,20,8,.18) 66%, transparent 82%); }
  .site-header .calor-nav::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 2px;
    background: radial-gradient(ellipse calc(var(--cw, 220px) * .8) 100% at var(--cx, 50%) 50%, rgba(255,190,110,.9), rgba(255,100,20,.5) 40%, transparent 75%); }
  .nav-links a:not(.btn), .logo-texto { transition: color .5s, text-shadow .5s; }
  .nav-links a.caliente:not(.btn) { color: #ffe9cc; text-shadow: 0 0 12px rgba(255,140,40,.65); }
  .logo.caliente .logo-texto { text-shadow: 0 0 16px rgba(255,140,40,.55); }
  .nav-links .btn-wa.caliente { box-shadow: 0 0 0 1px #ffb366, 0 0 26px -2px rgba(255,122,26,.8); background: #ff8a33; }

  /* Hero con el taller */
  .hero-forja { position: relative; height: 100svh; min-height: 680px; overflow: hidden; display: block; padding: 0; max-width: none; }
  .hero-forja .fondo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 75% 50%; transform-origin: 70% 60%; will-change: transform, filter; }
  .hero-forja .velo { position: absolute; inset: 0; background: linear-gradient(90deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 82%, transparent) 34%, transparent 62%), linear-gradient(0deg, var(--bg) 0%, transparent 22%); }
  .hero-forja .texto { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: center; padding-top: var(--header-h); }
  .hero-forja .hero-main { max-width: 640px; }
  .sombra { position: absolute; z-index: 1; width: 200px; height: 30px; border-radius: 50%; background: radial-gradient(closest-side, rgba(0,0,0,.75), transparent); pointer-events: none; transform: translate(-50%, -50%); }
  .calor { position: absolute; z-index: 1; width: 260px; height: 90px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,122,26,.35), transparent); mix-blend-mode: screen; pointer-events: none; transform: translate(-50%, -50%); }
  .vuelo { position: fixed; left: 0; top: 0; z-index: 55; width: 300px; height: 300px; pointer-events: none; perspective: 900px; will-change: transform; }
  .pieza { position: absolute; inset: 0; transform-style: preserve-3d; will-change: transform, opacity; }
  .pieza img { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 18px 24px rgba(0,0,0,.55)); }
  .brillo { position: absolute; left: 51.5%; top: 47%; width: 12%; height: 40%; border-radius: 50%; transform: translate(-50%, -50%) rotate(17deg); background: radial-gradient(closest-side, rgba(255,236,190,.95), rgba(255,140,40,.65) 45%, rgba(255,90,10,0) 100%); mix-blend-mode: screen; filter: blur(6px); opacity: 0; }
  .halo { position: absolute; left: 51%; top: 48%; width: 46%; height: 62%; border-radius: 50%; transform: translate(-50%, -50%) rotate(17deg); background: radial-gradient(closest-side, rgba(255,122,26,.45), transparent); mix-blend-mode: screen; filter: blur(14px); opacity: 0; }
  canvas.chispas { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 56; pointer-events: none; }

  /* La ficha pasa a una franja debajo del hero */
  .ficha-franja { padding-top: clamp(40px, 6vw, 72px); padding-bottom: clamp(24px, 4vw, 40px); }
  .ficha-franja .ficha { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 0 32px; border-top: 1px solid var(--line-strong); }
  .ficha-franja .ficha div { display: block; padding: 22px 0; border-bottom: 0; }
  .ficha-franja .ficha dt { margin-bottom: 8px; }
  .ficha-franja .firma { margin-top: 8px; }

  /* Luz ambiente por sección */
  .section { isolation: isolate; }
  .section::after { content: ''; position: absolute; z-index: -1; top: 8%; width: 70vw; height: 70vw; max-width: 900px; max-height: 900px; border-radius: 50%; pointer-events: none;
    background: radial-gradient(closest-side, rgba(255,122,26,.10), rgba(255,122,26,.04) 45%, transparent 70%); filter: blur(10px); left: -32vw; }
  .section:nth-of-type(even)::after { left: auto; right: -32vw; }

  /* Títulos: número fantasma + barra que se calienta */
  .section-head { position: relative; }
  .section-head h2::after { background: #6b3a1c; }
  .section-head.encendida h2::after { animation: barra-rojo 1.4s ease-out forwards; }
  @keyframes barra-rojo { 0% { background: #6b3a1c; } 35% { background: #ffe1b0; box-shadow: 0 0 18px 4px rgba(255,140,40,.8); } 100% { background: #FF7A1A; box-shadow: none; } }
  .fantasma { position: absolute; z-index: -1; left: -.05em; top: -.32em; font-family: 'Archivo', sans-serif; font-weight: 800; font-stretch: 70%; font-variation-settings: "wdth" 70; font-size: clamp(150px, 20vw, 280px); line-height: .8; color: transparent; -webkit-text-stroke: 1.5px rgba(154,166,178,.16); pointer-events: none; will-change: transform; }
  .section { padding-top: clamp(130px, 14vw, 190px); }

  /* Metal */
  .metal, .showcase, .a-medida, .form, .plan { position: relative; border-radius: 16px; background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0) 30%), var(--surface);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.09), inset 0 -1px 0 rgba(0,0,0,.4), 0 1px 0 rgba(0,0,0,.3), 0 24px 48px -28px rgba(0,0,0,.8); }
  .showcase::after, .a-medida::after, .form::after, .plan::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .25s; background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,.07), transparent 60%); }
  .showcase:hover::after, .a-medida:hover::after, .form:hover::after, .plan:hover::after { opacity: 1; }

  /* Trabajos: equipos en 3D */
  .devices { perspective: 1400px; }
  .devices > * { transition: transform .2s linear; }
  .devices { transform-style: preserve-3d; }
  .showcase .devices { transform: rotateX(var(--rx, 12deg)) rotateY(var(--ry, -9deg)); transition: transform .2s linear; }
  .frame-phone { transform: translateZ(50px); }

  /* Planes: piezas forjadas, la del medio al rojo */
  .planes { gap: 20px; border-top: 0; align-items: stretch; }
  .plan, .plan:first-child, .plan:last-child { padding: 32px 28px 28px; }
  .plan + .plan { border-left: 0; }
  .plan h3 { font-size: clamp(26px, 2.3vw, 32px); white-space: nowrap; }
  .plan:nth-child(2) { box-shadow: inset 0 1px 0 rgba(255,255,255,.09), 0 0 0 1px rgba(255,122,26,.55), 0 0 40px -6px rgba(255,122,26,.35), 0 30px 60px -30px rgba(0,0,0,.9); }
  .plan:nth-child(2) .plan-list li::before { background: var(--accent); }
  .plan.encendida .plan-desde b { animation: precio-rojo 1.6s ease-out; }
  @keyframes precio-rojo { 0% { color: var(--text); } 30% { color: #ffd49a; text-shadow: 0 0 22px rgba(255,140,40,.7); } 100% { color: var(--text); text-shadow: none; } }

  /* Cómo trabajo: la línea de forja sobre el borde de los pasos */
  .pasos { position: relative; }
  .pasos .linea { position: absolute; left: 0; right: 0; top: -2px; height: 3px; pointer-events: none; }
  .pasos .linea i { position: absolute; inset: 0 auto 0 0; width: calc(var(--avance, 0) * 100%); border-radius: 2px; background: linear-gradient(90deg, #6b3a1c, #FF7A1A 80%, #ffe1b0); box-shadow: 0 0 14px rgba(255,122,26,.6); }
  .pasos li::before { transition: color .6s, text-shadow .6s; }
  .pasos li.caliente::before { color: var(--text); text-shadow: 0 0 18px rgba(255,140,40,.55); }

  /* Contacto: el taller de fondo y brasas */
  #contacto { isolation: isolate; }
  #contacto::before { content: ''; position: absolute; z-index: -2; top: 0; bottom: 0; left: calc(50% - 50vw); width: 100vw; height: auto; background: url('hero/fondo-1376.webp') 80% 70% / cover; filter: brightness(.33) saturate(.7); }
  #contacto::after { z-index: -1; left: calc(50% - 50vw); width: 100vw; max-width: none; height: 100%; max-height: none; top: 0; border-radius: 0; filter: none; background: linear-gradient(90deg, var(--bg) 15%, color-mix(in srgb, var(--bg) 70%, transparent) 55%, color-mix(in srgb, var(--bg) 40%, transparent)); }
  .cta-brasa { position: relative; display: inline-flex; }
  .cta-brasa canvas { position: absolute; left: -40px; top: -70px; width: calc(100% + 80px); height: calc(100% + 90px); pointer-events: none; }
  .btn-wa:hover { box-shadow: 0 0 0 1px var(--accent), 0 10px 34px -6px rgba(255,122,26,.65); }

  /* Botón "Ver sitio": acero, con el borde que se enciende */
  .panel-link .link-arrow { min-height: 48px; padding: 0 22px; gap: 10px; border-radius: 4px; font-weight: 700; color: var(--text);
    background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0) 60%), var(--surface-2);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.12), inset 0 0 0 1px var(--line-strong), 0 10px 24px -14px rgba(0,0,0,.9);
    transition: box-shadow .2s, transform .12s; }
  .panel-link .link-arrow .link-text { text-decoration: none; }
  .panel-link .link-arrow:hover { box-shadow: inset 0 1px 0 rgba(255,255,255,.12), inset 0 0 0 1px var(--accent), 0 0 22px -6px rgba(255,122,26,.55); }
  .panel-link .link-arrow:active { transform: scale(.97); }
  /* Placas remachadas y hierro fundido */
  /* Fondo de hierro fundido */
  html { background: #13181d; }
  body { background-color: #13181d;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.006 .009' numOctaves='3' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .6  0 0 0 0 .66  0 0 0 0 .72  0 0 0 .32 -.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)'/%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.09' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .7 -.3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E"); }

  /* Placas remachadas: cada sección es un cuadro de acero */
  .section { max-width: 1280px; margin: 28px auto; padding: clamp(96px, 10vw, 140px) clamp(28px, 5vw, 72px) clamp(72px, 8vw, 110px);
    border-radius: 22px; overflow: hidden;
    background: linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,.18)), var(--bg);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.10), inset 0 0 0 1px rgba(255,255,255,.035), inset 0 -2px 0 rgba(0,0,0,.45),
      0 0 0 1px #0c1014, 0 2px 0 1px rgba(255,255,255,.03), 0 30px 60px -30px rgba(0,0,0,.95); }
  .section::before { display: none; }
  .section::after { top: -10%; }
  .remaches { position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: inherit;
    --r: radial-gradient(circle at 40% 36%, #c4cdd6 0 1.2px, #7a8590 2.6px, #3b444e 4.6px, #0b0f12 6px, transparent 6.8px);
    background: var(--r) 16px 16px / 16px 16px no-repeat, var(--r) calc(100% - 16px) 14px / 16px 16px no-repeat,
                var(--r) 14px calc(100% - 16px) / 16px 16px no-repeat, var(--r) calc(100% - 16px) calc(100% - 16px) / 16px 16px no-repeat; }
  .ficha-franja { max-width: 1280px; margin: 28px auto 0; padding: clamp(36px, 5vw, 56px) clamp(28px, 5vw, 72px); border-radius: 22px; position: relative; overflow: hidden;
    background: linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,0) 30%), var(--bg);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.10), inset 0 -2px 0 rgba(0,0,0,.45), 0 0 0 1px #0c1014, 0 30px 60px -30px rgba(0,0,0,.95); }
  .ficha-franja .ficha { border-top: 0; }
  #trabajos { padding-top: clamp(96px, 10vw, 140px); }
  #contacto::before { left: 0; width: 100%; }
  #contacto::after { left: 0; width: 100%; }
  .footer { border-top: 0; }
  @media (max-width: 860px) {
    .section, .ficha-franja { margin: 14px 10px; padding-left: 20px; padding-right: 20px; border-radius: 16px; }
    .section { padding-top: 84px; padding-bottom: 60px; }
    .remaches { background-size: 13px 13px; }
  }

  .aparece { opacity: 0; transform: translateY(18px); transition: opacity .7s cubic-bezier(.23,1,.32,1), transform .7s cubic-bezier(.23,1,.32,1); }
  .aparece.visto { opacity: 1; transform: none; }

  @media (max-width: 1000px) { .planes { grid-template-columns: minmax(0,1fr); } }
  @media (max-width: 860px) {
    :root { --header-h: 96px; --slot: 48px; }
    .logo { gap: 12px; }
    .site-header .logo-texto { font-size: 24px; }
    .nav-links .btn-sm { min-height: 48px; }
    .hero-forja .fondo { height: 58%; object-position: 76% 92%; -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent); mask-image: linear-gradient(180deg, #000 70%, transparent); }
    .hero-forja .velo { background: linear-gradient(0deg, var(--bg) 42%, transparent 60%); }
    .hero-forja .texto { justify-content: flex-end; padding-bottom: 40px; }
    .hero-forja h1 { font-size: clamp(42px, 12vw, 56px); }
    .ficha-franja .ficha { grid-template-columns: minmax(0,1fr); }
    .fantasma { font-size: 120px; top: -.25em; }
    .pasos .linea { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .site-header .logo-simbolo { opacity: 1; }
    .aparece { opacity: 1; transform: none; transition: none; }
    .showcase .devices { transform: rotateX(6deg) rotateY(-6deg); }
    .section-head.encendida h2::after, .plan.encendida .plan-desde b { animation: none; }
    .section-head h2::after { background: var(--accent); }
  }
  </style>`;
rep('</head>', css + '\n</head>');

// ── JS: el del hero del prototipo, apuntado al logo real de la nav ──
let jsHero = proto.match(/<script>\n\(\(\) => \{\n  const \$ = \(id\) => document\.getElementById\(id\);[\s\S]*?\n<\/script>/)[0];
jsHero = jsHero
  .replace("const hero = $('hero'),", "const hero = $('inicio'),")
  .replace("const sombra = $('sombra'), calor = $('calor'), slot = $('slot'), nav = $('nav');", "const sombra = $('sombra'), calor = $('calor'), slot = document.querySelector('.site-header .logo-simbolo'), nav = $('nav');")
  .replace("const slotSvg = slot.querySelector('svg');", "const slotSvg = slot;")
  .replace("for (const k of Object.keys(aj)) $('a-' + k).addEventListener('input', (e) => { aj[k] = +e.target.value; });", '')
  .replace("const h1 = document.querySelector('.texto h1').getBoundingClientRect();", "const h1 = document.querySelector('.hero-forja h1').getBoundingClientRect();")
  .replace("if (fundido >= 0.99 && !llego) { llego = true; slot.classList.remove('destello'); void slot.offsetWidth; slot.classList.add('destello'); }", "if (fundido >= 0.99 && !llego) { llego = true; slot.classList.remove('destello'); void slot.getBoundingClientRect(); slot.classList.add('destello'); }")
  .replace("    nav.classList.toggle('solida', scrollY > 12);\n", '');
if (!jsHero.includes("$('inicio')")) throw new Error('no se adaptó el JS del hero');

const jsResto = `
<script>
(() => {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));


  // Textura de metal gastado para la barra: rayones, picaduras y manchas generados al azar (sin imágenes externas).
  (() => {
    const W = 1600, H = 160, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    let semilla = 11; const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
    const base = g.createLinearGradient(0, 0, 0, H); base.addColorStop(0, '#323b45'); base.addColorStop(.5, '#272f38'); base.addColorStop(1, '#1e252d');
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    // Manchas y zonas gastadas (más claras y más oscuras)
    for (let i = 0; i < 70; i++) {
      const x = azar() * W, y = azar() * H, r = 20 + azar() * 120, claro = azar() < .45;
      const m = g.createRadialGradient(x, y, 0, x, y, r);
      m.addColorStop(0, claro ? 'rgba(170,182,195,.07)' : 'rgba(5,8,11,.22)'); m.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = m; g.fillRect(x - r, y - r, r * 2, r * 2);
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

  // El formulario del prototipo no envía nada.
  document.addEventListener('submit', (e) => { if (e.target.matches('[data-prototipo]')) { e.preventDefault(); e.stopImmediatePropagation(); alert('Prototipo: el formulario no envía.'); } }, true);

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
</script>`;
rep('</body>', jsHero + '\n' + jsResto + '\n</body>');
// En el hero real no hay panel de ajustes: valores fijos
h = h.replace("const aj = { curva: 0.85, giro: 20, chispas: 1, flote: 10, tramo: 0.75 };", "const aj = { curva: 0.85, giro: 20, chispas: 1, flote: 10, tramo: 0.75 }; // valores elegidos en el prototipo");
writeFileSync(P + 'brand/prototipos/sitio-forja.html', h);
console.log('ok', (h.length / 1024).toFixed(0) + ' KB');
