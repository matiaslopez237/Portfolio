// Tests de la HU-16 (Hefesto habla con las manos). Correr: npm run test:unit
// Prueban la lógica de gestos (brand/instagram/reels/gestos.js) sin dibujar ni renderizar video.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { validarGuion, planGestos, poseBrazos, nivelVoz, POSES, GESTOS, difAng } = createRequire(import.meta.url)('../brand/instagram/reels/gestos.js');

// Tres líneas de 2 s: reposo, "señala" y "palma"
const lineas = [
  { ini: 1.5, fin: 3.5 },
  { ini: 3.5, fin: 5.5, gesto: 'señala' },
  { ini: 5.5, fin: 7.5, gesto: 'palma' },
];
const cerca = (a, b, tol = 0.5) => Math.abs(difAng(a, b)) <= tol;

test('CA-16.2: en la mitad de una línea con "señala", el brazo derecho está en la pose de señalar', () => {
  const pose = poseBrazos(planGestos(lineas), 4.5);
  assert.equal(pose.der.mano, 'señala');
  assert.ok(cerca(pose.der.ant, POSES['señala'].der.ant), `antebrazo en ${pose.der.ant}`);
  assert.ok(!cerca(pose.der.ant, POSES.reposo.der.ant, 20), 'no tiene que quedar en reposo');
});

test('CA-16.2: una línea sin gesto mantiene el de la anterior', () => {
  const plan = planGestos([...lineas, { ini: 7.5, fin: 9.5 }]);
  assert.equal(plan[3].gesto, 'palma');
});

test('CA-16.3: al cambiar de gesto, ningún ángulo salta de golpe (la transición dura 0,3 s o más)', () => {
  const plan = planGestos(lineas);
  let maxSalto = 0, cuadrosMoviendo = 0;
  for (let f = 3.2 * 30; f < 3.9 * 30; f++) {
    const a = poseBrazos(plan, f / 30), b = poseBrazos(plan, (f + 1) / 30);
    const salto = Math.max(Math.abs(difAng(a.der.ant, b.der.ant)), Math.abs(difAng(a.der.sup, b.der.sup)));
    maxSalto = Math.max(maxSalto, salto); if (salto > 0.5) cuadrosMoviendo++;
  }
  const total = Math.abs(difAng(POSES.reposo.der.ant, POSES['señala'].der.ant));
  assert.ok(cuadrosMoviendo >= 9, `el cambio dura ${cuadrosMoviendo} cuadros (0,3 s son 9)`);
  assert.ok(maxSalto < total / 4, `el salto más grande entre dos cuadros es ${maxSalto.toFixed(1)}° de ${total}°`);
});

test('CA-16.4: mientras habla sin cambiar de gesto, las manos se mueven pero solo unos pocos grados', () => {
  const plan = planGestos(lineas);
  const angs = []; for (let t = 4.0; t < 5.2; t += 1 / 30) angs.push(poseBrazos(plan, t, { habla: true }).der.ant);
  const rango = Math.max(...angs) - Math.min(...angs);
  assert.ok(rango > 1, `se mueve ${rango.toFixed(1)}°`);
  assert.ok(rango <= 10, `se mueve ${rango.toFixed(1)}° (máximo 10)`);
  const quieto = poseBrazos(plan, 4.5).der.ant;
  assert.equal(poseBrazos(plan, 4.9).der.ant, quieto, 'sin voz no se mueve');
});

test('CA-16.4: con pausas entre palabras, los brazos no saltan de un cuadro al otro (sin temblequeo)', () => {
  const plan = planGestos(lineas);
  // palabras de 0,3 s con pausas de 0,25 s entre medio, durante la línea de "señala" (sin cambio de gesto)
  const palabras = []; for (let t = 3.6; t < 5.3; t += 0.55) palabras.push({ ini: t, fin: t + 0.3 });
  let maxSalto = 0;
  // (desde 4,1 s: antes está el cambio de gesto, que con el desfase codo/mano termina hacia 4 s)
  for (let f = 4.1 * 30; f < 5.2 * 30; f++) {
    const a = poseBrazos(plan, f / 30, { habla: nivelVoz(palabras, f / 30) }), b = poseBrazos(plan, (f + 1) / 30, { habla: nivelVoz(palabras, (f + 1) / 30) });
    for (const lado of ['der', 'izq']) maxSalto = Math.max(maxSalto, Math.abs(difAng(a[lado].ant, b[lado].ant)), Math.abs(difAng(a[lado].sup, b[lado].sup)));
  }
  assert.ok(maxSalto < 1, `el salto más grande entre dos cuadros es ${maxSalto.toFixed(2)}° (máximo 1°)`);
  assert.equal(nivelVoz(palabras, 4.2), 1, 'en una pausa entre palabras el nivel sigue en 1');
  assert.equal(nivelVoz(palabras, 0), 0, 'antes de la voz no se mueve');
});

test('CA-16.3: el codo arranca antes que la mano, y la mano se pasa un poco y se asienta en la pose', () => {
  const plan = planGestos(lineas), t0 = 3.5 - 0.15, ant = (t) => poseBrazos(plan, t).der.ant, sup = (t) => poseBrazos(plan, t).der.sup;
  // en el primer cuadro del cambio el codo ya se mueve y la mano todavía no
  assert.ok(Math.abs(difAng(sup(t0 + 0.05), sup(t0))) > 0.05, 'el codo tiene que arrancar');
  assert.equal(ant(t0 + 0.05), ant(t0), 'la mano tiene que esperar');
  // la mano se pasa del destino y vuelve: termina exactamente en la pose
  const destino = POSES['señala'].der.ant, recorrido = []; for (let t = t0; t < t0 + 1; t += 1 / 30) recorrido.push(difAng(destino, ant(t)));
  // cuánto se pasa más allá del destino, en el sentido del giro
  const sentido = Math.sign(difAng(ant(t0), destino)), pasada = Math.max(...recorrido.map(x => x * sentido));
  assert.ok(Math.abs(difAng(destino, ant(t0 + 1))) < 0.01, 'termina en la pose');
  assert.ok(pasada > 1 && pasada <= 5.01, `se pasa ${pasada.toFixed(1)}° (entre 1° y 5°)`);
});

test('CA-16.5: un gesto que no existe frena el guion con la lista de gestos válidos', () => {
  const reel = { id: 'RX', muneco: 'v5', lineas: [{ texto: 'Hola.', gesto: 'saluda' }] };
  assert.throws(() => validarGuion(reel), (e) => e.message.includes('"saluda" no existe') && GESTOS.every(g => e.message.includes(g)));
});

test('CA-16.5: los gestos solo valen con el muñeco v5, y R1/R2 (sin "muneco") siguen con el v4', () => {
  assert.throws(() => validarGuion({ id: 'RX', lineas: [{ texto: 'Hola.', gesto: 'palma' }] }), /solo valen con "muneco": "v5"/);
  assert.equal(validarGuion({ id: 'R1', lineas: [{ texto: 'Hola.', accion: 'martillo' }] }), 'v4');
  assert.throws(() => validarGuion({ id: 'RX', muneco: 'v9', lineas: [] }), /Válidos: v4, v5/);
});

test('CA-16.9: el martillo aparece solo en su línea y el golpe cae dentro de ella', () => {
  const plan = planGestos([...lineas, { ini: 7.5, fin: 10, martillo: true, golpe: 9 }, { ini: 10, fin: 12 }]);
  const linea = plan[3];
  assert.ok(linea.golpe > linea.ini && linea.golpe < linea.fin);
  for (let t = 1.5; t < 12; t += 1 / 30) {
    const mano = poseBrazos(plan, t).der.mano, dentro = t >= linea.ini && t < linea.fin - 0.15;
    // el cambio de pieza va en la transición, que cruza el borde de la línea: hasta 0,2 s antes de que empiece y después de que termine
    if (mano === 'martillo') assert.ok(t > linea.ini - 0.2 && t < linea.fin + 0.2, `martillo fuera de su línea en t=${t.toFixed(2)}`);
    if (dentro && t > linea.ini + 0.1) assert.equal(mano, 'martillo', `sin martillo en su línea en t=${t.toFixed(2)}`);
    assert.notEqual(poseBrazos(plan, t).izq.mano, 'martillo');
  }
  // En el golpe el antebrazo baja hacia el yunque (deja de apuntar para arriba)
  assert.ok(!cerca(poseBrazos(plan, 9.1).der.ant, POSES.martillo.der.ant, 40));
  // Después de la línea vuelve al gesto que tenía antes (palma)
  assert.equal(poseBrazos(plan, 11).der.mano, 'palma');
});

test('CA-16.9: una línea con martillo de menos de 1,5 s avisa en vez de dibujarlo a medias', () => {
  assert.throws(() => planGestos([{ ini: 0, fin: 1.2, martillo: true }]), /el martillo necesita 1.5 s/);
});

test('CA-16.10: el golpe al logo cae cuando dice "Hefesto" y el martillo ya está levantado antes de que empiece la línea', () => {
  // línea del cierre: empieza en 7,5 s y "Hefesto" se dice en 7,7 s
  const plan = planGestos([...lineas, { ini: 7.5, fin: 10, martillo: true, marca: 7.7 }]);
  const linea = plan[3];
  assert.equal(linea.logo, true);
  assert.ok(Math.abs(linea.golpe - 7.7) <= 1 / 30, `el golpe cae en ${linea.golpe} y "Hefesto" en 7,7`);
  const alEmpezar = poseBrazos(plan, 7.5).der;
  assert.equal(alEmpezar.mano, 'martillo', 'cuando empieza la línea ya tiene el martillo en la mano');
  assert.ok(Math.abs(difAng(poseBrazos(plan, 7.2).der.ant, POSES.martillo.der.ant)) < 10, 'el martillo ya está levantado antes de la línea');
  // en el golpe el antebrazo apunta hacia abajo y afuera (no hacia arriba)
  const enGolpe = poseBrazos(plan, 7.7 + 0.1).der.ant;
  assert.ok(enGolpe > 20 && enGolpe < 70, `en el golpe el antebrazo apunta a ${enGolpe.toFixed(0)}° (abajo y afuera: entre 20° y 70°)`);
});

test('CA-16.10: si no hay tiempo para levantar el martillo antes de "Hefesto", avisa', () => {
  assert.throws(() => planGestos([{ ini: 0, fin: 0.6 }, { ini: 0.6, fin: 3, martillo: true, marca: 0.8 }]), /no hay tiempo para levantar el martillo/);
});
