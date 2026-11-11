# HU-12: Hero "Forja" con logo animado

**Historia:** Como dueño del estudio, quiero que el inicio del portfolio muestre el logo forjado sobre el yunque y que, al bajar, viaje hasta la barra de navegación, para que la marca se recuerde desde el primer segundo.
**Estado de la spec:** Borrador

## Objetivo
Cambiar el inicio del portfolio usando las dos imágenes generadas por Matias con Gemini (2026-11-11):
- **Fondo:** el taller oscuro con el yunque a la derecha (`assets/hero/originales/8duef38duef38due.jpg`, 1376×768).
- **Logo 3D:** el logo de acero con la "/" al rojo (`assets/hero/originales/a2oam8a2oam8a2oa.jpg`, 1024×1024).

El logo 3D aparece apoyado sobre el yunque. Al hacer scroll se achica, gira levemente hasta quedar de frente y viaja hasta el símbolo de la barra de navegación, donde se funde con el logo plano. Se hace con HTML, CSS y el JS del sitio, **sin three.js ni librerías nuevas**: el volumen ya está en la imagen.

## Reglas
- **RN-12.1 (imágenes optimizadas):** el fondo se exporta a WebP en 2 tamaños (1376 y 800 px de ancho). El logo, recortado con fondo transparente (WebP con alfa) en 2 tamaños (520 y 260 px). Peso del hero: hasta 250 KB en compu y 150 KB en celular. Los originales quedan en `assets/hero/originales/` y no los carga la página.
- **RN-12.2 (legibilidad):** el texto va a la izquierda, sobre la parte oscura. Un degradado del color de fondo (#1B2128) asegura el contraste AA del título, el subtítulo y la ficha.
- **RN-12.3 (no tapar):** el título, el subtítulo y los botones de WhatsApp se ven y se pueden tocar durante toda la animación.
- **RN-12.4 (logo de la nav):** el texto "EFESTO WEBS" de la nav se ve siempre. Solo el símbolo de la nav aparece cuando llega el logo 3D. El link de la nav no pierde su nombre accesible.
- **RN-12.5 (movimiento):** la entrada del logo usa el "hierro al rojo" (la "/" brilla y se enfría, una sola vez) y el viaje depende solo del scroll. Sin loops. Con `prefers-reduced-motion`: el logo 3D queda quieto en el inicio, sin viaje, y el símbolo de la nav se ve desde el principio.
- **RN-12.6 (celular):** el fondo se recorta mostrando el yunque, con un degradado más fuerte. El logo 3D es más chico y queda arriba a la derecha, sin tapar el título. Mismo viaje a la nav.
- **RN-12.7 (decorativo):** las dos imágenes son decorativas (`alt=""`, `aria-hidden`). El nombre de la marca lo da el logo de la nav.
- **RN-12.8 (marca):** se actualiza `DESIGN.md` con esta decisión. El hero pasa a tener una foto de fondo: es la única imagen decorativa del sitio y es una excepción aprobada por Matias. El símbolo en líneas finas de la HU-08 se reemplaza por el logo 3D y su escenario (CA-08.3) se adapta.
- **RN-12.9 (no romper):** Formspree, PostHog, número de WhatsApp, precios y todos los escenarios de HU-05, HU-06 y HU-08 siguen en verde.

## Casos límite
- **Imágenes que no cargan:** el inicio se ve igual que hoy (fondo acero liso y logo plano en la nav).
- **Pantallas muy anchas (más de 1600 px):** el fondo no se estira de más; se funde en el color de fondo a los costados.
- **Scroll rápido o ir directo a una sección (#planes):** el logo queda en su estado final, sin saltos raros.
- **Sin JavaScript:** el logo 3D queda quieto en el inicio y el símbolo de la nav visible.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-12.1 | Dadas las imágenes del hero, entonces existen en WebP en los tamaños de RN-12.1, el logo tiene transparencia y el peso total entra en el presupuesto | Chequeo automático |
| CA-12.2 | Dado el inicio arriba de todo, entonces se ven el fondo y el logo 3D, y el símbolo de la nav está oculto | Escenario BDD |
| CA-12.3 | Dado el scroll al 0, 30, 60 y 100% del hero, entonces el botón principal de WhatsApp se puede tocar (nada lo tapa) y el título no está tapado | Escenario BDD |
| CA-12.4 | Dado el scroll al final del hero, entonces el logo 3D terminó sobre el símbolo de la nav (±4 px) y quedó visible el símbolo plano | Escenario BDD |
| CA-12.5 | Dado `prefers-reduced-motion`, cuando hago scroll, entonces el logo 3D no se mueve y el símbolo de la nav se ve desde el principio | Escenario BDD |
| CA-12.6 | Dado un celular de 375 px, entonces no hay scroll horizontal, no hay errores en la consola y el logo 3D no tapa el título | Escenario BDD |
| CA-12.7 | Dada la suite completa, entonces siguen en verde los escenarios de HU-05, HU-06 y HU-08 (CA-08.3 adaptado) y `npm run check` | Escenario BDD + chequeo |
| CA-12.8 | Dado `DESIGN.md`, entonces registra la foto de fondo del hero como decisión aprobada, con fecha | Chequeo automático |
| CA-12.9 | Dado el inicio nuevo, cuando Matias lo ve en la compu y en el celular, entonces se siente "forja", se lee bien y la animación no molesta | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-12.9: ¿El inicio se siente "forja", se lee bien y la animación no molesta, en compu y celular? — firmado:

## Preguntas abiertas
- Ninguna. La composición en celular (RN-12.6) se muestra con captura antes de cerrar, por si Matias prefiere otra.

## Historial
- 2026-11-11: creada con las dos imágenes de Gemini. Se descarta three.js porque el volumen ya está en la imagen. Los carruseles pasan a la HU-13 y los reels a la HU-14.
