# HU-12: Sitio "Forja": hero animado, barra de metal y placas

**Historia:** Como dueño del estudio, quiero que el portfolio tenga el diseño Forja que aprobé en el prototipo, para que quien llegue desde Instagram reconozca la marca y vea un sitio que no se parece a ningún otro.
**Estado de la spec:** Borrador

## Objetivo
Pasar al sitio real (`index.html` + `style.css`) el diseño del prototipo `brand/prototipos/sitio-forja.html`, aprobado por Matias entre el 2026-11-11 y el 2026-11-14:

| Parte | Qué lleva |
| --- | --- |
| **Hero** | <ul><li>Foto del taller de fondo</li><li>Logo 3D flotando sobre el yunque, como un ítem que flota y se balancea</li><li>Barra al rojo que parpadea, con chispas</li><li>Al bajar, el logo se despega, vuela en arco, gira, se enfría y encastra en la barra de navegación</li></ul> |
| **Barra de navegación** | <ul><li>El doble de alta: 136 px en compu, 96 px en celular</li><li>Textura de metal gastado</li><li>El metal se calienta donde pasa el mouse</li><li>Molde del logo grabado en la chapa, que se entibia y se llena cuando llega el logo</li></ul> |
| **Ficha** | "Qué hago / Para quién / Cómo trabajo" pasa a una franja de 3 columnas debajo del hero |
| **Secciones** | <ul><li>Placas de acero remachadas sobre fondo de hierro fundido, sin cortes</li><li>Luz de fragua que alterna de lado</li><li>Número fantasma detrás de cada título</li><li>Barra al rojo que se calienta al aparecer</li></ul> |
| **Trabajos** | <ul><li>Compu y celular inclinados en 3D, que se enderezan</li><li>Botón "Ver sitio" de acero</li><li>Sin la aclaración "Puede tardar unos segundos en cargar"</li></ul> |
| **Planes** | Tarjetas de metal; la del medio al rojo y el precio se enciende al aparecer |
| **Cómo trabajo** | Línea de forja que se pone al rojo con el scroll y enciende cada número |
| **Contacto** | Taller oscuro de fondo y brasas alrededor del botón de WhatsApp |

## Reglas
- **RN-12.1 (contenido):** no cambian los textos, proyectos, precios, número de WhatsApp ni secciones. Solo cambian el aspecto y la ubicación de la ficha.
- **RN-12.2 (no romper):**
  - Formspree mantiene su action y los campos `nombre`, `contacto` y `proyecto`.
  - PostHog se queda en el `<head>`.
  - Siguen en verde los escenarios de HU-05, HU-06, HU-08 y HU-13.
  - Los escenarios de la HU-08 que dependen del diseño viejo se adaptan:
    - CA-08.3: el símbolo del inicio pasa a ser el logo 3D.
    - CA-08.5: los separadores pasan a ser placas.
- **RN-12.3 (no tapar):** el título, el subtítulo y los botones de WhatsApp se ven y se pueden tocar en todo momento de la animación.
- **RN-12.4 (rendimiento):**
  - Imágenes en WebP: fondo de 1376 y 800 px, logo de 520 y 260 px.
  - Peso del hero de 250 KB o menos en compu y de 150 KB o menos en celular.
  - Las texturas se generan con código, sin imágenes externas.
  - Sin librerías nuevas: todo con el CSS y el JS del sitio.
- **RN-12.5 (movimiento reducido y sin JS):**
  - Con `prefers-reduced-motion`: el logo queda en la barra desde el principio, sin vuelo, chispas, flote ni brillos que se muevan. Sí se ven texturas, placas y luces.
  - Sin JavaScript: el sitio se ve completo y prolijo, con el logo plano en la barra.
- **RN-12.6 (celular):** la foto queda arriba y el texto abajo, el logo 3D va más chico y sin tapar el título, la barra mide 96 px con el nombre en una línea, y no hay scroll horizontal a 375 px.
- **RN-12.7 (accesibilidad):**
  - Las imágenes y efectos decorativos llevan `aria-hidden`.
  - El link del logo conserva su nombre accesible.
  - El calor de la barra también aparece con el teclado (foco).
- **RN-12.8 (marca):** `DESIGN.md` ya registra la excepción "Instagram y hero" (2026-11-12). Se amplía para incluir las placas, las texturas y la barra de metal en todo el sitio, con la fecha de aprobación del prototipo.
- **RN-12.9 (publicar):** el push se hace solo con el OK de Matias, después de revisar el sitio local.

## Casos límite
- **Imágenes que no cargan:** el sitio se ve con el fondo acero liso y el logo plano en la barra.
- **Pantallas muy anchas (más de 1600 px):** las placas se quedan en 1280 px y el fondo de hierro llena el resto sin cortes.
- **Scroll rápido o entrar directo a `#planes`:** el logo queda en su lugar final, sin saltos.
- **Pantalla táctil:** sin efecto de calor por mouse. La barra se ve con su textura.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-12.1 | Dadas las imágenes del hero, entonces están en WebP en los tamaños de RN-12.4, el logo tiene transparencia y el peso entra en el presupuesto | Chequeo automático |
| CA-12.2 | Dado el inicio arriba de todo, entonces se ven la foto y el logo 3D, y el símbolo de la barra está vacío (molde visible) | Escenario BDD |
| CA-12.3 | Dado el scroll al 0, 30, 60 y 100% del hero, entonces el botón principal de WhatsApp se puede tocar y el título no está tapado | Escenario BDD |
| CA-12.4 | Dado el scroll al final del hero, entonces el logo 3D terminó sobre el símbolo de la barra (±4 px) y el símbolo plano se ve | Escenario BDD |
| CA-12.5 | Dado `prefers-reduced-motion`, cuando hago scroll, entonces el logo 3D no se mueve y el símbolo de la barra se ve desde el principio | Escenario BDD |
| CA-12.6 | Dado un celular de 375 px, entonces no hay scroll horizontal ni errores en la consola, el logo 3D no tapa el título y el nombre de la barra está en una línea | Escenario BDD |
| CA-12.7 | Dada la barra, cuando el mouse o el foco pasa por un link, entonces ese link queda "caliente" | Escenario BDD |
| CA-12.8 | Dadas las secciones, entonces cada una es una placa con remaches y los trabajos ya no dicen "Puede tardar unos segundos en cargar" | Escenario BDD |
| CA-12.9 | Dada la suite completa, entonces `npm test`, `npm run test:unit` y `npm run check` siguen en verde (con CA-08.3 y CA-08.5 adaptados) | Escenario BDD + chequeo |
| CA-12.10 | Dado `DESIGN.md`, entonces registra el diseño Forja del sitio como decisión aprobada, con fecha | Chequeo automático |
| CA-12.11 | Dado el sitio local, cuando Matias lo ve en la compu y en el celular, entonces se ve igual que el prototipo aprobado y la animación no molesta | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-12.11: ¿El sitio se ve como el prototipo y la animación no molesta, en compu y celular? — firmado:

## Preguntas abiertas
- Ninguna. Todo lo visual quedó definido en el prototipo.

## Historial
- 2026-11-11: creada (solo hero, con las imágenes de Gemini).
- 2026-11-11 a 2026-11-14: prototipo del sitio completo aprobado por partes (hero, barra el doble de grande, metal gastado, calor al pasar el mouse, molde del logo, placas remachadas, hierro sin cortes, botón "Ver sitio").
- 2026-11-14: reescrita para cubrir el sitio completo según el prototipo.
