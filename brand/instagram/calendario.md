# Calendario de publicaciones (HU-04, corrido en la HU-09)

Arranca el **miércoles 11 de noviembre de 2026** (el lunes 9 no se publicó). Ritmo: **3 posts por semana** (lunes, miércoles y viernes) e **historias** martes y jueves. Los posts salen en orden del 1 al 12, para que la grilla quede en columnas. Horario: **19:00** (hora de Argentina); ajustalo con las estadísticas después de 2 semanas.

**Cómo salen:** los posts 1 a 3 están programados a mano en Meta Business Suite. Del post 4 en adelante los publica solo el workflow de la HU-10, que lee las filas "Post" de esta tabla. Las historias se suben a mano.

## Semana 1 · Presentación

| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-11 | Miércoles | Post | Post 1 · Presentación | Quién sos y qué hacés |
| 2026-11-12 | Jueves | Historia | Repost del post 1 + encuesta | Encuesta: "¿Tu negocio tiene página web? Sí / Todavía no" |
| 2026-11-13 | Viernes | Post | Post 2 · Bacssa | Primer trabajo real |

## Semana 2 · Cómo trabajás

| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-16 | Lunes | Post | Post 3 · Landing Page | Primer plan con precio |
| 2026-11-17 | Martes | Historia | `historias/historia-ejemplo.png` | "¿Tu negocio todavía no tiene página?" con link a WhatsApp |
| 2026-11-18 | Miércoles | Post | Post 4 · Cómo trabajo | Los 4 pasos |
| 2026-11-19 | Jueves | Historia | Detrás de escena | Foto o video de tu pantalla mientras trabajás (sin datos de clientes) |
| 2026-11-20 | Viernes | Post | Post 5 · Quiropraxia | Trabajo para un profesional de salud |

## Semana 3 · Completar la grilla

| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-23 | Lunes | Post | Post 6 · Tienda WhatsApp | Segundo plan |
| 2026-11-24 | Martes | Historia | Caja de preguntas | "Preguntame lo que quieras sobre páginas web": las respuestas van a la destacada Preguntas |
| 2026-11-25 | Miércoles | Post | Post 7 · Consejo | Las 3 cosas que una página tiene que tener |
| 2026-11-26 | Jueves | Historia | Respuestas de la caja de preguntas | Respondé 2 o 3 preguntas con la plantilla `historia.html` |
| 2026-11-27 | Viernes | Post | Post 8 · Zenti | Trabajo de tienda con pagos |

## Semana 4 · Mantener el ritmo

| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-11-30 | Lunes | Post | Post 9 · Tienda con pagos | Tercer plan: la grilla de 9 queda completa |
| 2026-12-01 | Martes | Historia | Recordatorio de planes | Las 3 imágenes de planes seguidas, con link a WhatsApp |
| 2026-12-02 | Miércoles | Post | Post 10 · Tienda online con panel | Trabajo real, sin el nombre del cliente |
| 2026-12-03 | Jueves | Historia | Flyer de WhatsApp | `brand/whatsapp/flyer.png`, con el QR para escribir |
| 2026-12-04 | Viernes | Post | Post 11 · Café (proyecto de muestra) | Ejemplo para gastronomía |

## Semana 5 · Cierre del primer ciclo

| Fecha | Día | Formato | Pieza | Idea |
| --- | --- | --- | --- | --- |
| 2026-12-07 | Lunes | Post | Post 12 · Consejo: dominio propio | Por qué tu negocio necesita su propio dominio |
| 2026-12-08 | Martes | Historia | Repost del post 12 + encuesta | "¿Tu negocio ya tiene dominio propio? Sí / No" |

## Para los posts nuevos (13 en adelante)
Se agregan a `brand/instagram/contenido.json` y a `textos.md` con el mismo formato, se corre `node brand/instagram/generar.mjs` y se suma la fila "Post" acá. Las capturas disponibles están en `assets/proyectos/`.
