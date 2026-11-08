# HU-04: Kit de Instagram

**Historia:** Como dueño del estudio, quiero el perfil de Instagram y las primeras publicaciones listas para subir, para abrir la cuenta de Efesto Webs con una grilla prolija desde el día uno.
**Estado de la spec:** Borrador

## Objetivo
Dejar todo listo para crear la cuenta e ir publicando sin pensar cada vez: textos del perfil, portadas de destacadas, plantillas editables de posts e historias, los primeros 9 posts (imagen y texto) y un calendario del primer mes. Todo con la identidad de `DESIGN.md` (HU-03).

## Reglas
- **RN-04.1 (identidad):** colores, tipografías y logo de `DESIGN.md` y `brand/tokens.json`. Sin colores fuera de la paleta.
- **RN-04.2 (contenido real):** solo trabajos reales y sus datos (Bacssa, Zenti, Quiropraxia, la tienda con panel sin nombre del cliente y el Café como "proyecto de muestra"), precios vigentes ("desde $150.000 / $350.000 / $900.000") y el proceso real. Nada de opiniones de clientes, cifras de resultados ni "el mejor del país".
- **RN-04.3 (límites de Instagram):** bio de 150 caracteres o menos; texto de cada post de 2.200 caracteres o menos y como máximo 30 hashtags (se usan entre 5 y 10).
- **RN-04.4 (formatos):** posts de 1080×1350 (4:5), historias y portadas de destacadas de 1080×1920 (9:16).
- **RN-04.5 (zona segura de historias):** nada importante en los 250 px de arriba ni de abajo, que tapan la barra y la respuesta de Instagram. En las portadas de destacadas, el ícono va centrado, porque Instagram las muestra en un círculo.
- **RN-04.6 (voz):** la de `brand/marca.html` › Tono de voz: voseo, cercano y profesional, frases cortas y el resultado para el negocio primero.
- **RN-04.7 (cuentas):** crear la cuenta, reservar el @ y publicar lo hace Matias. La IA no entra a Instagram.

## Casos límite
- **`@efestowebs` no está disponible:** se usa la variante que consiga Matias (`@efesto.webs`, `@efestowebs.ar`…) y se cambia en los textos.
- **Zenti caído (Render):** el post muestra la captura, pero el texto no promete un link que no anda.
- **Captura de la tienda:** solo la portada sin el nombre del cliente (la de `assets/proyectos/tienda-*`).
- **Precios que cambian:** las plantillas toman los precios de un solo lugar, así se actualizan todos juntos.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-04.1 | Dado `brand/instagram/perfil.md`, entonces tiene nombre, @, categoría, link y una bio de 150 caracteres o menos | Chequeo automático |
| CA-04.2 | Dadas las portadas de destacadas, entonces hay 5 PNG de 1080×1920 (Trabajos, Planes, Proceso, Preguntas, Contacto) | Chequeo automático |
| CA-04.3 | Dados los primeros posts, entonces hay 9 PNG de 1080×1350 | Chequeo automático |
| CA-04.4 | Dado `brand/instagram/textos.md`, entonces cada uno de los 9 posts tiene su texto (2.200 caracteres o menos) y entre 5 y 10 hashtags | Chequeo automático |
| CA-04.5 | Dadas las plantillas de post e historia, entonces existen como HTML editable y solo usan colores de `brand/tokens.json` | Chequeo automático |
| CA-04.6 | Dado `brand/instagram/calendario.md`, entonces cubre 4 semanas con fecha, formato y pieza de cada publicación | Chequeo automático |
| CA-04.7 | Dada la grilla de los 9 posts, cuando Matias la ve como en el perfil, entonces se ve coherente y prolija | Checklist |
| CA-04.8 | Dados los textos, entonces no prometen nada que no se cumpla y los datos son reales | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-04.7: ¿La grilla de 9 se ve coherente y prolija? — firmado:
- [ ] CA-04.8: ¿Los textos dicen solo cosas reales que podés cumplir? — firmado:

## Preguntas abiertas
- ¿Querés que el calendario arranque una fecha en particular? (Si no, arranca el lunes siguiente a terminar la historia.)

## Historial
- 2026-11-07: creada.
