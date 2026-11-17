// HU-16 · Gestos de Hefesto (muñeco v5): qué pose tiene cada brazo en cada momento del reel.
// Lógica pura (sin dibujo): la usan reel.html en el navegador y los tests de node (test/gestos.test.mjs).
// Ángulos en grados de pantalla: 0 = hacia la derecha, 90 = hacia abajo, -90 = hacia arriba.
// "der" es el brazo del lado derecho de la pantalla; el izquierdo es su espejo (ángulo 180 - a).
(() => {
  const GESTOS = ['reposo', 'palma', 'señala', 'explica', 'uno', 'dos', 'tres'];
  const MUNECOS = ['v4', 'v5'];
  const TRANSICION = 0.35;        // s que tarda en pasar de un gesto a otro (RN-16.4: 0,3 s o más)
  const ANTES = 0.15;             // la transición arranca un poco antes de que empiece la línea
  const MARTILLO_MIN = 1.5;       // una línea con martillo tiene que durar al menos esto (subir, golpear y volver)

  // Pose de cada brazo: dirección del brazo de arriba (sup), del antebrazo (ant) y qué mano lleva
  // reposo va espejado: la pieza es un brazo del lado izquierdo de la hoja (con el pulgar hacia el cuerpo de ese lado)
  const REPOSO = { sup: 84, ant: 93, mano: 'reposo', espejo: true };
  const POSES = {
    reposo:  { der: REPOSO, izq: REPOSO },
    palma:   { der: { sup: 62, ant: -76, mano: 'palma' }, izq: REPOSO },
    'señala': { der: { sup: 60, ant: -102, mano: 'señala' }, izq: REPOSO },
    // explica: las dos manos abiertas hacia afuera y un poco abajo, palmas arriba (la pieza apunta hacia adentro: va espejada)
    explica: { der: { sup: 72, ant: 48, mano: 'explica', espejo: true }, izq: { sup: 72, ant: 48, mano: 'explica', espejo: true } },
    uno:     { der: { sup: 60, ant: -84, mano: 'uno' }, izq: REPOSO },
    dos:     { der: { sup: 60, ant: -84, mano: 'dos' }, izq: REPOSO },
    tres:    { der: { sup: 60, ant: -84, mano: 'tres' }, izq: REPOSO },
    martillo: { der: { sup: 64, ant: -88, mano: 'martillo' }, izq: REPOSO },
  };

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const suave = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const tramo = (t, a, b) => clamp((t - a) / (b - a));
  // Interpola ángulos por el camino más corto (de -88 a 160 pasa por 180, no por 90)
  const difAng = (a, b) => ((b - a + 540) % 360) - 180;
  const mezclarAng = (a, b, f) => a + difAng(a, b) * f;

  // Revisa el guion antes de generar la voz (CA-16.5). Devuelve el muñeco que usa.
  function validarGuion(reel) {
    const muneco = reel.muneco ?? 'v4';
    if (!MUNECOS.includes(muneco)) throw new Error(`${reel.id}: muñeco "${muneco}" no existe. Válidos: ${MUNECOS.join(', ')}`);
    reel.lineas.forEach((l, i) => {
      if (l.gesto === undefined) return;
      if (muneco !== 'v5') throw new Error(`${reel.id}, línea ${i + 1}: los gestos solo valen con "muneco": "v5"`);
      if (!GESTOS.includes(l.gesto)) throw new Error(`${reel.id}, línea ${i + 1}: el gesto "${l.gesto}" no existe. Gestos válidos: ${GESTOS.join(', ')}`);
    });
    return muneco;
  }

  // Arma el plan del reel a partir de los tiempos de cada línea:
  // lineas = [{ ini, fin, gesto?, martillo?, golpe? }] (golpe = momento del martillazo, dentro de la línea)
  function planGestos(lineas) {
    let anterior = 'reposo';
    return lineas.map((l, i) => {
      if (l.martillo) {
        if (l.fin - l.ini < MARTILLO_MIN) throw new Error(`línea ${i + 1}: dura ${(l.fin - l.ini).toFixed(1)} s y el martillo necesita ${MARTILLO_MIN} s (subir, golpear y volver)`);
        const golpe = clamp(l.golpe ?? (l.ini + l.fin) / 2, l.ini + 0.6, l.fin - 0.6);
        return { ini: l.ini, fin: l.fin, gesto: 'martillo', golpe };
      }
      anterior = l.gesto ?? anterior;
      return { ini: l.ini, fin: l.fin, gesto: anterior };
    });
  }

  // Golpe de martillo (brazo derecho): lleva el martillo atrás (hacia la cabeza, sin salirse del cuadro), baja de golpe
  // hacia afuera y abajo (el yunque) y vuelve
  function golpe(p, t, t0) {
    const k = t - t0; let { sup, ant } = p;
    if (k > -0.45 && k <= -0.08) { const e = suave(tramo(k, -0.45, -0.08)); sup += -14 * e; ant += -24 * e; }
    else if (k > -0.08 && k < 0.6) {
      const baja = suave(tramo(k, -0.08, 0.06)), vuelve = k < 0.06 ? baja : 1 - suave(tramo(k, 0.25, 0.6));
      sup += -14 * (1 - baja) + 14 * vuelve;
      ant = mezclarAng(ant - 24 * (1 - baja), 62, vuelve);
    }
    return { ...p, sup, ant };
  }

  // Pose de los dos brazos en el instante t. habla: si la voz está sonando (las manos se mueven un poco).
  function poseBrazos(plan, t, { habla = false } = {}) {
    // Gesto vigente y el anterior (para la transición)
    let i = plan.findIndex((l, k) => t < (plan[k + 1]?.ini ?? Infinity) - ANTES);
    if (i < 0) i = plan.length - 1;
    const actual = plan[i], previo = plan[i - 1];
    const desde = previo ? POSES[previo.gesto] : POSES.reposo, hacia = POSES[actual.gesto];
    const f = previo ? suave(tramo(t, actual.ini - ANTES, actual.ini - ANTES + TRANSICION)) : 1;
    const res = {};
    for (const lado of ['der', 'izq']) {
      const a = desde[lado], b = hacia[lado];
      const m = f < 0.5 ? a : b;
      let p = { sup: mezclarAng(a.sup, b.sup, f), ant: mezclarAng(a.ant, b.ant, f), mano: m.mano, espejo: !!m.espejo };
      // Martillazo: en la línea del martillo, y también al salir de ella (la vuelta del golpe)
      for (const l of plan) if (l.gesto === 'martillo' && lado === 'der' && Math.abs(t - l.golpe) < 0.6) p = golpe(p, t, l.golpe);
      // Movimiento al hablar (RN-16.4): pocos grados, distinto en cada brazo
      if (habla) {
        const s = lado === 'der' ? 1 : -1;
        p.sup += 2.5 * Math.sin(t * 2.3 + (s > 0 ? 0 : 1.7));
        p.ant += 4 * Math.sin(t * 3.1 + (s > 0 ? 0.6 : 2.4));
      }
      if (lado === 'izq') { p.sup = 180 - p.sup; p.ant = 180 - p.ant; }
      res[lado] = p;
    }
    return res;
  }

  const api = { GESTOS, MUNECOS, POSES, TRANSICION, MARTILLO_MIN, validarGuion, planGestos, poseBrazos, difAng };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else globalThis.Gestos = api;
})();
