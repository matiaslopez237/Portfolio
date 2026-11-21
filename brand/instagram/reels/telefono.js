// HU-17 · Teléfono del reel: muestra un sitio real (capturas de grabar-sitio.mjs), un chat o una imagen.
// Lógica pura (sin dibujo): la usan reel.html en el navegador y los tests de node (test/telefono.test.mjs).
// En el guion, cada línea puede llevar "pantalla":
//   { "sitio": <scroll> }                 el sitio en esa posición (tiene que ser una de las "paradas" del reel)
//   { "sitio": <scroll>, "toque": true }  además, un dedo toca el botón de WhatsApp visible
//   { "chat": "sitio" }                    el chat que abre el botón, con el mensaje que el sitio trae escrito
//   { "chat": { contacto, mensajes } }     un chat armado (por ejemplo, el "antes" del R5)
//   { "imagen": { archivo, difuminada } }  una imagen (por ejemplo, la lista del R6)
//   false                                  el teléfono se va
// Sin "pantalla", la línea mantiene la de la anterior.
(() => {
  const TRANSICION = 0.4;    // s que tarda en entrar o salir, y en mezclar una pantalla con otra
  const ANTES = 0.15;        // las transiciones arrancan un poco antes de la línea
  const SCROLL_MAX = 0.9;    // s que tarda el scroll como mucho (si la línea es corta, el 60 % de la línea)
  const TOQUE = 0.6;         // s que dura la animación del dedo
  const CLAVES = ['sitio', 'toque', 'chat', 'imagen'];

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const suave = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const tramo = (t, a, b) => clamp((t - a) / (b - a));
  const tipoDe = (p) => !p ? null : 'sitio' in p ? 'sitio' : 'chat' in p ? 'chat' : 'imagen';

  // Revisa las pantallas del guion antes de generar la voz. Avisa con el número de línea.
  function validarPantallas(reel) {
    const paradas = reel.sitio?.paradas ?? [];
    reel.lineas.forEach((l, i) => {
      if (!('pantalla' in l) || l.pantalla === false) return;
      const p = l.pantalla, n = `línea ${i + 1}`;
      if (!p || typeof p !== 'object') throw new Error(`${n}: "pantalla" tiene que ser un objeto o false`);
      const raras = Object.keys(p).filter(k => !CLAVES.includes(k));
      if (raras.length) throw new Error(`${n}: no conozco la pantalla "${raras.join('", "')}" (usá ${CLAVES.join(', ')})`);
      const tipos = ['sitio', 'chat', 'imagen'].filter(k => k in p);
      if (tipos.length !== 1) throw new Error(`${n}: cada pantalla lleva una sola de "sitio", "chat" o "imagen"`);
      if ('sitio' in p) {
        if (!reel.sitio?.url) throw new Error(`${n}: usa "sitio" pero el reel no define "sitio": { url, paradas }`);
        if (!paradas.includes(p.sitio)) throw new Error(`${n}: el scroll ${p.sitio} no está en las paradas del sitio (${paradas.join(', ')})`);
      }
      if ('toque' in p && !('sitio' in p)) throw new Error(`${n}: "toque" va solo con "sitio"`);
      if ('chat' in p) {
        if (p.chat === 'sitio') { if (!reel.sitio?.url) throw new Error(`${n}: el chat "sitio" necesita el "sitio" del reel`); }
        else if (!Array.isArray(p.chat?.mensajes) || !p.chat.mensajes.length || p.chat.mensajes.some(m => !m.texto)) throw new Error(`${n}: el chat necesita al menos un mensaje con texto`);
      }
      if ('imagen' in p && !p.imagen?.archivo) throw new Error(`${n}: la imagen necesita "archivo"`);
    });
    return true;
  }

  // lineas: [{ ini, fin, pantalla }] (tiempos de la voz). Devuelve un tramo por línea con la pantalla que rige.
  function planTelefono(lineas) {
    let actual = null, scrollPrevio = 0, inicio = 0;
    return lineas.map((l) => {
      if ('pantalla' in l) { if (tipoDe(l.pantalla || null) !== tipoDe(actual) || l.pantalla !== actual) inicio = l.ini; actual = l.pantalla || null; }
      // inicio: cuándo empezó esta pantalla (sirve para que los mensajes de un chat aparezcan de a uno)
      const tramoL = { ini: l.ini, fin: l.fin, inicio, pantalla: actual, tipo: tipoDe(actual), desde: scrollPrevio, toque: !!(actual && 'pantalla' in l && actual.toque) };
      if (tramoL.tipo === 'sitio') scrollPrevio = actual.sitio;
      tramoL.scroll = tramoL.tipo === 'sitio' ? actual.sitio : scrollPrevio;
      return tramoL;
    });
  }

  // Scroll de un tramo en el momento t (de "desde" a su parada, suave, y llega antes del final de la línea)
  function scrollEn(l, t) {
    if (l.tipo !== 'sitio') return l.scroll;
    const dur = Math.min(SCROLL_MAX, (l.fin - l.ini) * 0.6);
    return l.desde + (l.scroll - l.desde) * suave(tramo(t, l.ini, l.ini + dur));
  }

  function estadoTelefono(plan, t) {
    let i = plan.findIndex(l => t < l.fin);
    if (i < 0) i = plan.length - 1;
    // la línea siguiente "gana" un poco antes (ANTES) para que la transición arranque con anticipación
    if (plan[i + 1] && t >= plan[i + 1].ini - ANTES && plan[i + 1].tipo !== plan[i].tipo) i++;
    const l = plan[i], prev = plan[i - 1];
    const tIni = l.ini - (prev && prev.tipo !== l.tipo ? ANTES : 0);
    // visible: entra o sale en TRANSICION s
    const vAntes = prev?.tipo ? 1 : 0, vAhora = l.tipo ? 1 : 0;
    const f = suave(tramo(t, tIni, tIni + TRANSICION));
    const visible = vAntes === vAhora ? vAhora : vAntes + (vAhora - vAntes) * f;
    const base = { visible, inicio: l.tipo ? l.inicio : prev?.inicio ?? 0, tipo: l.tipo ?? prev?.tipo ?? null, pantalla: l.pantalla ?? prev?.pantalla ?? null, scroll: scrollEn(l, t), toque: null, mezcla: 1, anterior: null };
    if (!l.tipo && prev) base.scroll = scrollEn(prev, t);
    // mezcla entre dos pantallas distintas, las dos visibles
    if (prev && prev.tipo && l.tipo && prev.tipo !== l.tipo) {
      base.mezcla = f;
      base.anterior = { tipo: prev.tipo, pantalla: prev.pantalla, inicio: prev.inicio, scroll: scrollEn(prev, t) };
    }
    // el dedo toca cuando el scroll ya llegó
    if (l.toque) {
      const llega = l.ini + Math.min(SCROLL_MAX, (l.fin - l.ini) * 0.6) + 0.1;
      const ini = Math.min(llega, l.fin - TOQUE);
      if (t >= ini && t < l.fin && scrollEn(l, t) === l.scroll) base.toque = clamp((t - ini) / TOQUE);
    }
    return base;
  }

  // Captura más cercana a un scroll
  function frameParaScroll(frames, scroll) {
    let mejor = 0;
    frames.forEach((f, i) => { if (Math.abs(f.scroll - scroll) < Math.abs(frames[mejor].scroll - scroll)) mejor = i; });
    return mejor;
  }

  const api = { validarPantallas, planTelefono, estadoTelefono, frameParaScroll, TRANSICION };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.Telefono = api;
})();
