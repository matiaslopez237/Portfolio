// Chequeos automáticos de criterios de aceptación (modo liviano).
// Cada chequeo lleva el ID del criterio que verifica: así lo encuentra la trazabilidad.
// Correr: npm run check
const chequeos = [
  // { ca: 'CA-01.1', desc: 'PRODUCT.md tiene la sección ## Marca', run: async () => true },
];

let fallas = 0;
for (const c of chequeos) {
  let ok = false, detalle = '';
  try { ok = await c.run(); } catch (e) { detalle = ' — ' + e.message; }
  if (!ok) fallas++;
  console.log(`${ok ? '✓' : '✗'} ${c.ca} ${c.desc}${detalle}`);
}
console.log(`\n${chequeos.length - fallas}/${chequeos.length} criterios en verde`);
process.exit(fallas ? 1 : 0);
