# HU-18: Reels "algo que se cae" (cámara de seguridad + texto)

**Historia:** Como dueño del estudio, quiero reels cortos que arranquen con un video de algo a punto de caerse, como de cámara de seguridad, y después un mensaje en texto, para frenar el scroll de gente que no me conoce y que me escriban por WhatsApp.
**Estado de la spec:** Aprobada (Matias, 2026-11-27)

## Contexto
- El R4 tuvo 79 % de gente que lo pasó de largo (lo normal es 57 %) y lo miraron 4,2 s en promedio (Buzzfy, 2026-11-26).
- Matias vio reels de otros estudios web con este formato: un huevo que rueda por una mesa, filmado como cámara de seguridad, y cuando cae aparece un mensaje en texto, una frase por segundo más o menos. En los comentarios festejaban el gancho, aunque no tuviera mucha relación con el mensaje.
- Se copia el **formato**, no el video ni los textos de otros.
- Es un formato para **alternar** con los reels de Hefesto (HU-15 a HU-17), no los reemplaza.

## Objetivo
Un armador de reels de este formato y dos primeros reels para comparar:

| Reel | Gancho | Mensaje |
|---|---|---|
| R7 | Caída sin relación con el mensaje (por ejemplo, el huevo) | Texto del estudio, 4 o 5 frases |
| R8 | Caída que se conecta con el mensaje (por ejemplo, "así se cae una venta…") | Texto del estudio, 4 o 5 frases |

## Reglas
- **RN-18.1 (clip):** el video de la caída es de un banco libre (Pexels o Pixabay, licencia que permite usarlo sin pagar ni pedir permiso) o lo graba Matias con el celular. Nunca un video de otro creador ni de Instagram. En `brand/instagram/caidas/fuentes.md` queda de dónde salió cada clip, con su link y licencia.
- **RN-18.2 (cámara de seguridad):** al clip se le agrega el aspecto de cámara de seguridad: colores apagados o blanco y negro, grano, "CAM 0X ● REC" y fecha y hora que avanzan en una esquina. Sin el logo de ninguna marca de cámaras.
- **RN-18.3 (estructura):**
  - la caída pasa en los primeros **3 s**;
  - al caer, corte seco a fondo oscuro (o al cuadro congelado y oscurecido) y aparecen las frases, **una por vez, de 1 a 1,5 s cada una**, grandes y centradas;
  - la última frase es el cierre: "Hefesto Webs · WhatsApp 260 466-1138" (o @hefestowebs);
  - duración total de **6 a 12 s**, sin colita muerta al final (que Instagram lo repita y se vuelva a ver).
- **RN-18.4 (sonido):** sin voz. El sonido del clip (si tiene) se deja hasta la caída; después, silencio o un golpe corto. La música la puede agregar Matias al publicar.
- **RN-18.5 (contenido real y marca):** frases cortas en la voz de la marca (voseo, sin jerga), sin cifras inventadas ni promesas de resultados. Tipografías y colores de `brand/tokens.json`.
- **RN-18.6 (texto del reel):** igual que RN-17.7: palabra clave en los primeros 125 caracteres, de 3 a 5 hashtags y un pedido de mandarlo o guardarlo.
- **RN-18.7 (cómo se mide):** a las 48 h, con Buzzfy: cuántos lo pasan de largo, cuánto lo miran, comentarios y compartidos. Se compara R7 contra R8 y contra los reels de Hefesto.

## Casos límite
- **No hay un clip libre que sirva:** Matias graba uno con el celular (un huevo o un vaso en el borde de la mesa, con el celular fijo).
- **El clip tiene gente reconocible o una marca a la vista:** no se usa, o se recorta.
- **La caída pasa después de los 3 s:** se recorta el principio del clip.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-18.1 | Dados R7 y R8, entonces cada uno es un MP4 H.264 de 1080×1920, de 6 a 12 s y de menos de 20 MB | Escenario BDD |
| CA-18.2 | Dado cada reel, entonces la caída (el corte a las frases) pasa antes de los 3 s | Escenario BDD |
| CA-18.3 | Dadas las frases, entonces cada una dura de 1 a 1,5 s, tiene 8 palabras o menos y queda dentro de la zona segura | Escenario BDD |
| CA-18.4 | Dado el último tramo, entonces muestra "Hefesto Webs" y el WhatsApp 260 466-1138 | Escenario BDD |
| CA-18.5 | Dado cada clip, entonces figura en `fuentes.md` con su link y licencia | Escenario BDD |
| CA-18.6 | Dado el texto de cada reel en `textos.md`, entonces cumple RN-18.6 | Escenario BDD |
| CA-18.7 | Dados R7 y R8, cuando Matias los ve en el celular, entonces el gancho da ganas de ver qué pasa y las frases se leen sin apuro | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-18.7: ¿El gancho da ganas de ver qué pasa y las frases se leen bien? — firma: ____

## Preguntas abiertas
1. ¿Los textos de R7 y R8? Se proponen después de elegir los clips.
2. ¿Fondo de las frases: negro liso o el último cuadro del clip congelado y oscurecido?

## Historial
- 2026-11-27: creada a partir de reels de otros estudios web que vio Matias (huevo rodando, cámara de seguridad, texto al caer).
- 2026-11-27: aprobada por Matias. Los 3 clips de Pexels propuestos (tostada, frasco, huevos de Pascua) no le gustan: "demasiado armados". Se busca algo que se vea natural, con suspenso.
