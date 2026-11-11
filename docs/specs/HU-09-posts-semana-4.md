# HU-09: Posts de la semana 4 y calendario corrido

**Historia:** Como dueño del estudio, quiero los posts 10, 11 y 12 listos y el calendario ajustado a la fecha real de arranque, para seguir publicando sin cortar el ritmo después de completar la grilla.
**Estado de la spec:** Aprobada

## Objetivo
- **Posts 10 a 12:** imagen 1080×1350 y texto de cada uno, con las mismas plantillas, la misma fuente de datos y las mismas reglas de la HU-04:
  - **Post 10:** Sistema de tienda con panel. Trabajo real, sin el nombre del cliente.
  - **Post 11:** Café. Proyecto de muestra, dicho explícitamente.
  - **Post 12:** Consejo: "Por qué tu negocio necesita su propio dominio".
- **Calendario corrido:** el post 1 no salió el lunes 9, así que todo arranca el **miércoles 11 de noviembre** y sigue lunes, miércoles y viernes.

## Reglas
- **RN-09.1 (como la HU-04):** valen RN-04.1 a RN-04.6 (identidad, contenido real, límites de Instagram, formato 1080×1350, voz).
- **RN-09.2 (datos de los trabajos):** solo lo que dice `index.html` de cada proyecto:
  - **Tienda:** catálogo, carrito, cuentas de usuario, pagos con Mercado Pago y panel para cargar productos y ver pedidos.
  - **Café:** menú digital, galería, reservas y WhatsApp. Siempre como "proyecto de muestra".
- **RN-09.3 (consejo del dominio):** solo afirmaciones generales y verificables (por ejemplo, que da una dirección propia y fácil de recordar y que no depende de una plataforma), sin cifras, precios de dominios ni promesas de posicionamiento en Google.
- **RN-09.4 (orden de la grilla):** los posts siguen el orden 1 → 12. Las fechas se corren todas juntas y no se cambia el contenido de los posts 1 a 9.
- **RN-09.5 (publicar):** programar o publicar en Instagram lo hace Matias, o la IA solo con su OK explícito para esa acción.

## Casos límite
- **Captura de la tienda:** se usa `tienda-desktop.jpg`, que no muestra el nombre del cliente. Si se viera, se usa la versión de celular.
- **Links de Render:** los sitios pueden tardar en cargar. Los textos no prometen un link directo; dicen "link en la bio".

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-09.1 | Dados los posts nuevos, entonces existen `post-10.png`, `post-11.png` y `post-12.png` de 1080×1350 | Chequeo automático |
| CA-09.2 | Dado `textos.md`, entonces los posts 10 a 12 tienen texto (2.200 caracteres o menos) y entre 5 y 10 hashtags | Chequeo automático |
| CA-09.3 | Dado el post 11, entonces la imagen y el texto dicen "proyecto de muestra" | Chequeo automático |
| CA-09.4 | Dado `calendario.md`, entonces el post 1 sale el 2026-11-11 y los posts 1 a 12 salen en orden, lunes, miércoles y viernes | Chequeo automático |
| CA-09.5 | Dados los 3 posts nuevos, cuando Matias los ve, entonces siguen la grilla y dicen solo cosas reales | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-09.5: ¿Los posts 10 a 12 se ven bien en la grilla y dicen solo cosas reales? — firmado:

## Preguntas abiertas
- Ninguna.

## Historial
- 2026-11-10: creada (el post 1 no se publicó el 9; se corre el calendario).
- 2026-11-10: aprobada por Matias.
- 2026-11-10: implementada; posts 10 a 12 y calendario desde el 11/11 (posts 1 a 3 ya programados en Meta Business Suite). Falta la firma de CA-09.5.
