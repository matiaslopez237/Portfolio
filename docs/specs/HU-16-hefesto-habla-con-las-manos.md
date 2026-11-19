# HU-16: Hefesto habla con las manos

**Historia:** Como dueño del estudio, quiero que Hefesto hable moviendo las dos manos, sin tener el martillo todo el tiempo, para que los reels se vean más vivos y menos repetidos.
**Estado de la spec:** Implementada (falta firmar CA-16.8 y el checklist del logo con el R3)

## Objetivo
Hoy el muñeco (HU-15, hoja v4) tiene un solo brazo articulado, que además sostiene el martillo todo el tiempo. El otro brazo viene pegado al cuerpo. Con una hoja de partes nueva (v5) que traiga **los dos brazos sueltos y manos vacías con gestos**, el código mueve los dos brazos y cada línea del guion puede llevar un gesto. Se estrena en el R3. El R1 y el R2 no cambian.

## Reglas
- **RN-16.1 (lo de la HU-15 sigue igual):** RN-15.1 a RN-15.6 siguen valiendo: todo gratis y sin cámara, contenido real, voz Gemini, formato 1080×1920 de 15 a 25 s, zona segura e identidad Forja.
- **RN-16.2 (hoja v5):** la genera Matias en Gemini con el prompt del anexo y la imagen de referencia `mascota/hefesto-mascota.jpg`. Trae:
  - el cuerpo sin ningún brazo, con un círculo gris en cada hombro;
  - la parte de arriba de cada brazo, sola, con un círculo gris en el hombro y otro en el codo;
  - el antebrazo con la mano de cada lado en cada gesto de RN-16.3.

  La cabeza, los ojos y las bocas se siguen tomando de la v4.
  **Espejo:** si la hoja trae una pieza de un solo lado (por ejemplo, un único brazo de arriba), la del otro lado se saca espejándola en el código. No hace falta pedirla de nuevo.
- **RN-16.3 (gestos):** cada línea de `guiones.json` puede llevar `"gesto"` con uno de estos valores:

  | Gesto | Qué hace |
  |---|---|
  | `reposo` | Brazos relajados al costado. Es el gesto por defecto. |
  | `palma` | Una mano abierta hacia la cámara. |
  | `señala` | El índice señala hacia arriba, a los subtítulos o a las cajitas. |
  | `explica` | Los dos brazos abiertos hacia afuera y un poco abajo, con las palmas para arriba. |
  | `uno`, `dos`, `tres` | Una mano levantada mostrando 1, 2 o 3 dedos. Va con las líneas que hacen aparecer las cajitas numeradas. |

  Cuando una línea no lleva gesto, se mantiene el de la línea anterior.
- **RN-16.4 (movimiento al hablar):** mientras la voz suena, las manos se mueven un poco solas (unos pocos grados) para que no quede rígido. Cuando cambia el gesto, pasa al siguiente con una transición suave de 0,3 s o más, nunca de golpe.
- **RN-16.5 (martillo a veces):** en los reels v5 Hefesto habla con las manos vacías. El martillo aparece solo en las líneas que llevan `"accion": "martillo"`: en esa línea el brazo derecho cambia a la pieza con el martillo, da el golpe con chispas (igual que en la HU-15) y después vuelve a la mano vacía. Ninguna línea sin esa acción muestra el martillo. Es opcional: un reel puede no usarlo nunca.
- **RN-16.6 (compatibilidad):** cada reel elige su muñeco con `"muneco": "v4"` o `"muneco": "v5"`. Si no lo dice, usa el v4, así el R1 y el R2 se renderizan igual que hoy.
- **RN-16.7 (martillazo al logo, aprobada 2026-11-19):** en una línea con `"accion": "martillo"` que nombra la marca, el golpe cae sobre el logo 3D de Hefesto Webs (`recursos/logo-3d.webp`, el mismo del cierre), en el momento en que dice "Hefesto" (elección de Matias).
  - El logo aparece al costado de Hefesto, a la altura de la cintura, justo donde pega el martillo. Aparece en forma suave 0,3 s antes del golpe.
  - Con el golpe: chispas, y el logo se pone "al rojo" (brillo naranja) y se enfría en alrededor de 1 s, como el gancho del reel.
  - Como "Hefesto" se dice apenas empieza la línea, Hefesto agarra y levanta el martillo al final de la línea anterior.
  - Cuando entra el cierre, el logo crece y viaja hasta el lugar del logo grande del cierre y queda ahí: nunca se ven dos logos a la vez (elección de Matias).
  - Si la línea del martillo no dice "Hefesto", el golpe sigue como hasta ahora, sin logo.
  - El logo no tapa el subtítulo ni las cajitas y no se sale del cuadro.

## Casos límite
- **Gemini dibuja los brazos de otro tamaño que el cuerpo** (ya pasó en la v4, con un 19 % de más): cada pieza lleva su propia escala en la configuración, como el `escalaBrazo` de la v4.
- **Una mano sale mal** (dedos de más o de menos, o girada): no se edita la imagen. Se vuelve a generar la hoja entera. Si falla una sola mano, ese gesto queda afuera hasta la próxima hoja y el render avisa si un guion lo usa.
- **Una línea muy corta** (1,5 s) con cambio de gesto: la transición de 0,3 s entra igual y el gesto queda quieto al menos 1 s.
- **Un gesto que no existe en el guion** (por ejemplo `"saluda"`): el render se corta antes de generar la voz, con un mensaje que lista los gestos válidos.
- **El martillo "aparece" en la mano:** el cambio de pieza se hace durante la transición del gesto (con el brazo en movimiento), no con el brazo quieto, para que no se note que salta. Si igual se nota, se decide en el checklist (CA-16.8).
- **Martillo en una línea corta** (menos de 1,5 s): no entra subir, golpear y volver. El render avisa y no lo dibuja a medias.
- **Una mano que sube y tapa los subtítulos o las cajitas:** ningún gesto puede llevar la mano por encima del límite de abajo de las cajitas.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-16.1 | Dada la hoja v5 recortada, entonces hay una pieza PNG transparente por parte (cuerpo, brazo de arriba, una mano por cada gesto de RN-16.3 y el antebrazo con martillo; el otro lado sale espejado), cada brazo y antebrazo tiene sus círculos grises en las puntas, y el cuerpo tiene 2 círculos grises en los hombros | Chequeo automático |
| CA-16.2 | Dado un guion v5 con `"gesto": "señala"` en una línea, cuando se calcula la pose en la mitad de esa línea, entonces los brazos están en la pose de "señala" y no en la de reposo | Test (node) |
| CA-16.3 | Dado un cambio de gesto entre dos líneas, cuando se calculan las poses cuadro a cuadro, entonces ningún ángulo salta más de lo que permite una transición de 0,3 s | Test (node) |
| CA-16.4 | Dado un tramo con voz y sin cambio de gesto, cuando se calculan las poses, entonces las manos se mueven (el ángulo varía) pero no más de unos pocos grados | Test (node) |
| CA-16.5 | Dado un guion con un gesto que no existe, cuando se corre el render, entonces se corta antes de generar la voz con un mensaje que lista los gestos válidos | Test (node) |
| CA-16.9 | Dado un reel v5 con `"accion": "martillo"` en una línea, cuando se calculan las poses, entonces el brazo derecho usa la pieza con martillo solo durante esa línea, el golpe cae dentro de ella, y en las demás líneas no hay martillo | Test (node) |
| CA-16.10 | Dado un reel v5 con martillo en una línea que dice "Hefesto", cuando se calculan las poses, entonces el golpe cae al empezar esa palabra (±1 cuadro) y el martillo ya está levantado antes de que empiece la línea | Test (node) |
| CA-16.11 | Dado ese reel, el logo aparece antes del golpe, en el instante del golpe está donde pega el martillo (±30 px), y hasta el cierre queda dentro del video y debajo del texto | Chequeo automático |
| CA-16.12 | Dado ese reel, cuando entra el cierre el logo viaja hasta el logo del cierre, y en ningún cuadro se ven dos logos | Chequeo automático |
| CA-16.6 | Dado un reel sin `"muneco"` (R1, R2), cuando se renderiza, entonces usa el muñeco v4 y sus muestras quedan iguales a las de antes del cambio | Chequeo automático |
| CA-16.7 | Dado un reel v5, en todos los cuadros las manos quedan dentro del video y por debajo de los subtítulos y las cajitas | Chequeo automático |
| CA-16.8 | Dado el R3 con el muñeco v5, cuando Matias lo ve en el celular, entonces los gestos acompañan lo que dice, se ven naturales y no dan "cosa" | Checklist |

## Forma de verificar (decisión de Matias, 2026-11-17)
Historia liviana: tests de node (`test/gestos.test.mjs`, `npm run test:unit`) para la lógica de gestos, martillo y validación, y chequeos en `scripts/check.mjs` para las piezas, la compatibilidad y la zona de las manos. Sin escenarios `.feature` ni commits [RED] → [GREEN]: un solo commit `feat(HU-16)`. Lo visual se juzga con muestras y el checklist.

## Checklist (lo firma Matias)
- [ ] CA-16.11/16.12: ¿El martillazo al logo se entiende y el viaje del logo al cierre queda bien? — firmado:
- [ ] CA-16.8: ¿En el R3, los gestos acompañan lo que dice, se ven naturales y no dan "cosa"? — firmado:

## Preguntas abiertas
- ~~**Martillo al cierre**~~: resuelto, martillo solo en las líneas que lo piden (RN-16.5).
- ~~**Gestos**~~: resuelto, los 4 gestos más contar con los dedos (`uno`, `dos`, `tres`) en RN-16.3.

## Anexo: prompt de la hoja v5 (para Gemini)
Copia de lo que está en `brand/instagram/reels/prompts-gemini.md` (sección "Hoja de partes v5").

> Using the attached character as the exact reference (same face, red hair and beard, tan skin, dark tank top, brown leather apron, dark pants, brown boots, same 2D cartoon style with thick dark outlines and flat colors), create a **cut-out puppet parts sheet** for 2D animation. **Landscape, high resolution.** Solid pure green background (#00FF00). Every part separated by wide green gaps, nothing touching, nothing overlapping, nothing cut off at the edges. Front view, no background shadows, no text, no labels. **The hammer appears ONLY in part 15.**
>
> Draw **exactly these 15 parts and nothing else**:
>
> 1. **Body** without head and **without both arms**. A flat gray circle (#999999) on the neck stump and a flat gray circle covering each empty shoulder socket (two shoulder circles).
> 2. and 3. **Upper arms alone** (left and right): from the shoulder down to the elbow ONLY, pointing straight down. One gray circle at the very top end (shoulder) and one at the very bottom end (elbow). The circles sit AT THE ENDS of the piece.
> 4. and 5. **Forearm + relaxed hand** (left and right): from the elbow to the hand, forearm pointing straight down, hand relaxed and slightly open, with the leather wristband. Gray circle at the elbow end (top).
> 6. and 7. **Forearm + open palm facing the camera** (left and right): forearm pointing straight up, fingers together, palm toward the viewer. Gray circle at the elbow end (bottom).
> 8. and 9. **Forearm + pointing hand** (left and right): forearm pointing straight up, index finger extended upward, the other fingers closed. Gray circle at the elbow end (bottom).
> 10. and 11. **Forearm + explaining hand** (left and right): forearm horizontal pointing toward the center of the body, hand open with the palm facing sideways (up), like explaining something. Gray circle at the elbow end (outer end).
> 12. to 14. **Counting hand, character's right arm only**: forearm pointing straight up, palm facing the camera (never the back of the hand). Part 12 shows **exactly one finger up (index)**, part 13 **exactly two fingers up (index and middle)**, part 14 **exactly three fingers up (index, middle and ring)**; the other fingers are folded and the thumb holds them. Gray circle at the elbow end (bottom).
> 15. **Forearm + fist holding the hammer, character's right arm only**: from the elbow to the fist, with leather wristband, forearm pointing straight up, hammer upright (head up). **The fist is seen from the front: the fingers wrapped around the handle face the camera.** Gray circle at the elbow end (bottom).
>
> **Hands:** exactly five fingers each, clearly drawn, same size as the hands in the reference. **Proportions:** upper arm plus forearm together are exactly as long as the arms in the reference (shoulder to wrist), same thickness and muscle size. All gray circles are the same size so the joints line up.

## Historial
- 2026-11-17: creada a pedido de Matias (que Hefesto hable sin el martillo y moviendo las manos).
- 2026-11-17: Matias decide que los reels v5 van sin martillo (RN-16.5, CA-16.5).
- 2026-11-17: Matias suma los gestos de contar 1-2-3 (RN-16.3, CA-16.1, partes 12 a 14 del prompt).
- 2026-11-17: Matias cambia RN-16.5: el martillo vuelve, pero solo en las líneas con `"accion": "martillo"` (CA-16.9, parte 15 del prompt).
- 2026-11-17: aprobada por Matias. El prompt de la hoja v5 pasa a `brand/instagram/reels/prompts-gemini.md`.
- 2026-11-17: hoja v5 generada por Matias (`mascota/hoja-partes-v5.jpg`, 14 piezas). Trae un solo brazo de arriba y un solo brazo explicando: el otro lado se espeja (RN-16.2, CA-16.1).
- 2026-11-17: Matias completa la hoja (`mascota/hoja-partes-v5b.jpg`, 16 piezas): suma un antebrazo suelto explicando y el brazo explicando del otro lado. Es la que se usa.
- 2026-11-17: Matias decide verificar en forma liviana (tests de node y chequeos, sin BDD ni RED/GREEN).
- 2026-11-17: implementada. Muñeco v5 en `muneco.js` (prepararMunecoV5 / dibujarMunecoV5) con la cara de la v4; lógica de gestos en `gestos.js`. Piezas: `partes-v5b` recortadas con PURO=1 (sin el procesado de la v4); "reposo" sale del brazo entero cortado en el codo; el lado izquierdo es espejo del derecho; en "explica" la mano va espejada para abrirse hacia afuera (antes los brazos se cruzaban sobre la panza). El muñeco v5 va corrido 50 px a la izquierda, como el v4, para que el martillo no se salga del cuadro al volver del golpe. Un gesto dura hasta que empieza la línea siguiente (la última, hasta 0,5 s después de la voz): así la línea del cierre, que se dice en 1,1 s, alcanza para el martillo. Reel de prueba P16 (voz del R2, no se publica). 8/8 tests de gestos, 36/36 tests y 62/62 chequeos en verde. Muestras de R1 y R2 iguales byte a byte a las de antes.
- 2026-11-17: DEF-03 (visto por Matias en el P16): la mano relajada estaba al revés (pulgar hacia afuera) y los antebrazos quedaban detrás del bíceps. Arreglo: reposo va espejado; los antebrazos se dibujan delante del brazo de arriba con la punta del codo fundida (como la v4); los parches de las articulaciones de la v5 usan borde fino y la mediana de la piel (había una mancha oscura en el codo). Muestras de R1 y R2 siguen iguales byte a byte.
- 2026-11-17: ajuste pedido por Matias: "explica" con los brazos más arriba y más abiertos. Para que entre en el cuadro, Hefesto pasa a estar corrido 28 px a la izquierda (antes 50); al volver del golpe el codo baja pegado al cuerpo; el golpe gira siempre hacia afuera y baja casi vertical; el martillo aparece más tarde en la transición (al 75 %). Manos de x=9 a x=1077.
- 2026-11-17: DEF-04 (visto por Matias): detrás del hombro asomaba el muñón de piel del cuerpo, como un segundo hombro. Arreglo: el cuerpo pierde los muñones (piel, círculo y contorno) y el hombro lo pone la punta redonda del brazo de arriba.
- 2026-11-18: hombros armados por Matias en el posador: 21 px más afuera y 16 px más arriba, en espejo (hombroX/hombroY en muneco-v5.json). Para que las manos sigan entrando en el cuadro: en el martillazo el codo baja pegado al cuerpo también al bajar; en los cambios de gesto en que el antebrazo pasa en horizontal hacia afuera, el codo baja durante el giro; "explica" queda en 64/50. Manos de x=18 a x=1020.
- 2026-11-18: DEF-05 (visto por Matias): los brazos temblaban cada pocos segundos. Causa: el movimiento al hablar se prendía y apagaba de golpe en cada pausa entre palabras (saltos de 3 a 5° en un cuadro; la cabeza también). Arreglo: el movimiento sigue un nivel de voz continuo (nivelVoz, con 0,3 s de entrada y salida). Test nuevo en CA-16.4. En el P16, fuera de los cambios de gesto, el salto máximo entre cuadros es 0,4°.
- 2026-11-18: mejora 2 de la revisión de animación (aprobada por Matias): el codo arranca primero y la mano lo sigue 2 cuadros después, se pasa hasta 5° y se asienta; los giros grandes duran más (0,35 a 0,55 s). Test nuevo en CA-16.3. La mejora 1 (bíceps detrás del cuerpo) se descartó.
- 2026-11-18: DEF-06 (visto por Matias): la mano del martillo estaba al revés y el martillazo pegaba en la rodilla. Arreglo: la mano del martillo va espejada; el golpe cae hacia afuera, al costado y a la altura de la cintura, con el codo pegado solo cuando el martillo pasa en horizontal. Manos de x=18 a x=1046.
- 2026-11-18: propuesta de Matias: el martillazo cae sobre el logo de Hefesto Webs cuando lo nombra. Borrador de RN-16.7 y CA-16.10 a CA-16.12 (golpe en "Hefesto"; el logo se pone al rojo y viaja al cierre).
- 2026-11-19: Matias aprueba RN-16.7 y CA-16.10 a CA-16.12.
- 2026-11-19: RN-16.7 implementada. El golpe cae al empezar "Hefesto" (en el P16, 19,44 s) y el martillo se agarra 1,1 s antes, al final de la línea anterior. Logo de 170 px a la cintura, a la derecha (golpe a 46°): aparece 0,3 s antes, se pone al rojo y se enfría en 1 s, y al entrar el cierre viaja 0,5 s hasta el logo del cierre; el texto del cierre entra cuando el logo llegó. Medido en el P16: a 3 px de donde pega el martillo, 0 cuadros fuera del video, 0 tapando texto, 0 con dos logos. Ojo: el logo queda abajo a la derecha, cerca de donde Instagram pone sus botones; se revisa en el celular (checklist).
- 2026-11-19: Matias aprueba la posición del logo (abajo a la derecha, a la cintura).
