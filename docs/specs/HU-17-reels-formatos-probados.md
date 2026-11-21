# HU-17: Reels con formatos probados

**Historia:** Como dueño del estudio, quiero 4 reels armados sobre formatos que ya funcionan en cuentas chicas del rubro, para llegar a más gente que no me conoce y que me escriban por WhatsApp.
**Estado de la spec:** Aprobada (Matias, 2026-11-20)

## Contexto (datos de Buzzfy, 2026-11-20)
- La cuenta tiene 9 seguidores, casi todos conocidos de Matias (vienen de su Instagram personal). Por eso los "me gusta" de los seguidores no sirven para saber si un reel funciona. Lo que importa es el **alcance a no seguidores** (hoy 66 de 69 cuentas), los compartidos, los guardados y los clics al link (hoy 0).
- Informe de Buzzfy de nicho "Marketing" (150 reels, 56 de cuentas chicas). En cuentas chicas rinden más:
  - el formato tutorial o demostración en pantalla;
  - los comienzos de antes y después, de resultado primero y de "regalo gratis";
  - una duración de menos de 20 s;
  - el pedido de "guardalo o mandáselo".
- Manual de Buzzfy: ganar los primeros 3 s, que den ganas de mandarlo, subtítulos siempre y de 1 a 5 hashtags.
- En español hay pocos reels del rubro y casi todos son de alguien hablando a cámara con comienzos flojos.
- Se copia el **formato**, nunca el contenido ni las frases de otros creadores.

## Objetivo
4 reels nuevos con el muñeco v5 (HU-16), uno por cada lugar "Reel por hacer" del calendario:

| Reel | Formato | Idea | Día propuesto |
|---|---|---|---|
| R3 | Resultado primero + demostración | "Así pide turno un paciente en 10 segundos": el recorrido real en quiropraxiacipolletti.com en un celular, del botón hasta que se abre WhatsApp | Mié 02/12 |
| R4 | Problema + lista | "3 errores que espantan clientes": no dice qué hacés en la primera pantalla, tarda en cargar con datos del celular, no muestra tus servicios | Sáb 05/12 |
| R5 | Antes y después | Quiropraxia Cipolletti: de atender solo por Instagram y WhatsApp a tener su página | Mié 09/12 |
| R6 | Regalo gratis | "Comentá PÁGINA y te mando la lista para revisar tu web": checklist gratis, enviada a mano por mensaje privado | Sáb 12/12 |

## Reglas
- **RN-17.1 (lo de antes sigue igual):** valen RN-15.1 a RN-15.7 y las reglas de la HU-16:
  - todo gratis y sin cámara;
  - voz de Gemini;
  - zona segura;
  - identidad Forja;
  - el CTA fijo;
  - programar solo con el OK de Matias.
- **RN-17.2 (duración):** cada reel dura de **15 a 20 s**, dentro del límite de 15 a 25 s de RN-15.5.
- **RN-17.3 (gancho en 3 s):** en los primeros 3 s ya se ve y se lee la promesa o el resultado, sin saludo. El texto del gancho aparece desde el segundo 0.
- **RN-17.4 (grabación del sitio):** R3 y R5 muestran el sitio real en un celular. La grabación se hace con Playwright en tamaño de celular sobre la página pública. Se graba solo el recorrido hasta el link de WhatsApp: no se manda ningún mensaje ni se llena ningún formulario.
- **RN-17.5 (contenido real):** solo datos de `PRODUCT.md` y de los sitios reales. Ninguna cifra de resultados ("más clientes", "x% más ventas") ni opiniones de clientes. Los 3 errores del R4 son distintos de los del R1 y del C2 (que ya cubren celular, botón de WhatsApp y dónde y cuándo), para no repetir el tema (cambio aprobado por Matias el 2026-11-20).
- **RN-17.6 (regalo del R6):** la lista es una imagen (1080×1350) con 5 a 8 puntos que un dueño de negocio puede revisar solo, en el estilo Forja, sin jerga técnica. Queda en `brand/instagram/recursos/`. Matias la manda a mano a quien comente PÁGINA: no se usan respuestas automáticas (piden Buzzfy MAX).
- **RN-17.7 (texto de cada reel):**
  - va en `textos.md` y nombra la palabra clave en los primeros 125 caracteres;
  - usa de 3 a 5 hashtags;
  - cierra pidiendo guardar o mandar (R3, R4, R5) o comentar PÁGINA (R6).
- **RN-17.8 (cómo se mide):** a las 48 h de cada reel se corre `ig_reel_checkup` de Buzzfy (mientras dure el acceso) y se anotan alcance a no seguidores, compartidos, guardados y clics en `brand/instagram/estrategia/`. Sin juzgar por los "me gusta" de conocidos.

## Casos límite
- **El sitio tarda o está caído al grabar:** se vuelve a grabar. Quiropraxia tiene dominio propio y no está en Render, así que no debería dormirse.
- **Aparece un cartel de cookies o similar en la grabación:** se rechaza o se cierra antes de grabar el recorrido.
- **No hay un "antes" real para el R5:** se hace como "sin página / con página" del mismo negocio, mostrando que antes solo tenía Instagram o WhatsApp, siempre que Matias confirme que es cierto.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-17.1 | Dados R3 a R6, entonces cada uno es un MP4 de 1080×1920, de 15 a 20 s y de menos de 20 MB | Chequeo automático |
| CA-17.2 | Dado cada reel, entonces tiene subtítulo o texto de gancho visible desde el segundo 0 y la primera línea del guion termina antes de los 3 s | Chequeo automático |
| CA-17.3 | Dados los subtítulos de R3 a R6, entonces cumplen CA-15.3 (1,5 s o más, 12 palabras o menos, en la zona segura) y el último tramo muestra el CTA fijo | Chequeo automático |
| CA-17.4 | Dado el texto de cada reel en `textos.md`, entonces tiene de 3 a 5 hashtags y su palabra clave en los primeros 125 caracteres | Chequeo automático |
| CA-17.5 | Dado el R6, entonces la lista existe en 1080×1350 y el texto del reel pide comentar PÁGINA | Chequeo automático |
| CA-17.6 | Dados R3 y R5, cuando Matias los ve en el celular, entonces la grabación del sitio se lee bien y no muestra nada roto ni datos de nadie | Checklist |
| CA-17.7 | Dados los 4 reels, cuando Matias los ve, entonces el gancho se entiende en 3 s, la mascota se ve bien y no hay ninguna afirmación inventada | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-17.6: ¿La grabación del sitio en R3 y R5 se lee bien y no muestra nada roto? — firma: ____
- [ ] CA-17.7: ¿Los 4 ganchos se entienden en 3 s y no hay nada inventado? — firma: ____

## Decisiones (Matias, 2026-11-20)
- **R5 = Quiropraxia, "sin página / con página":** Bacssa todavía no usa la página nueva y no se sabe cuándo la va a usar, así que no se muestra.
  - Quiropraxia antes solo tenía Instagram y WhatsApp. El antes se muestra como un perfil de Instagram genérico con un mensaje de WhatsApp ("¿Qué días atienden? ¿Cuánto sale?"), sin capturas inventadas del negocio.
  - El después es su página real.
  - El R3 también usa Quiropraxia, pero con otro ángulo: el R3 muestra cómo se pide turno y el R5 el cambio de no tener página a tenerla. Entre los dos hay una semana.
- **Verificación con BDD:**
  - `features/HU-17-reels.feature` con un escenario por CA medible, con steps de cucumber;
  - tests de node para el código nuevo (la grabación del sitio con Playwright y lo que cambie en `render.mjs`);
  - commits `test(HU-17): [RED] …` → `feat(HU-17): [GREEN] …`.
- **Sin reels de prueba:** se publican normales con el publicador actual de la HU-10. No se cambia el publicador.

## Preguntas abiertas
Ninguna.

## Historial
- 2026-11-20: creada a partir de la auditoría de Buzzfy y el análisis de formatos. Matias eligió hacer los 4.
- 2026-11-20: Matias respondió las preguntas: R5 con Bacssa (o Quiropraxia sin/con página), verificación con BDD + TDD y publicación normal, sin reels de prueba.
- 2026-11-20: el R4 cambia a 3 errores nuevos (el original repetía el tema del R1 y del C2). La primera línea del R5 pasa a "Antes, todo por WhatsApp." para terminar antes de los 3 s.
