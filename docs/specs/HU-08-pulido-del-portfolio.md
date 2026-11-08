# HU-08: Pulido del portfolio

**Historia:** Como dueño del estudio, quiero que el portfolio muestre el precio rápido, tenga más personalidad de marca y se vea prolijo en todos lados, para que quien entra entienda la oferta enseguida y recuerde a Efesto Webs.
**Estado de la spec:** Aprobada

## Objetivo
Hacer 5 mejoras al diseño aplicado en la HU-06, sin cambiar los textos, los precios, los proyectos ni el formulario:
1. **Precio arriba en los planes:** el "desde $X" aparece debajo del nombre del plan.
2. **Símbolo de la marca en el inicio:** el hexágono con `</>`, grande y discreto en el fondo del inicio.
3. **Menos monotonía:** "Cómo trabajo" pasa a pasos con números grandes, como el post 4 de Instagram.
4. **Separadores alineados:** las líneas entre secciones tienen el mismo ancho que el contenido.
5. **Botón flotante sin tapar:** en el celular, el botón de WhatsApp no tapa el final de las listas ni del pie.

## Reglas
- **RN-08.1 (identidad):** solo lo que define `DESIGN.md`: colores, tipografías y radios. El naranja sigue limitado al CTA, la palabra clave, el detalle del logo y la barra al rojo.
- **RN-08.2 (contenido):** no cambian los textos, precios, proyectos ni secciones. No se agregan opiniones de clientes ni datos nuevos.
- **RN-08.3 (no romper):** Formspree (action y campos), PostHog, número de WhatsApp y todo lo verificado en HU-05, HU-06 y HU-07 sigue en verde.
- **RN-08.4 (símbolo decorativo):** el símbolo del inicio es decoración: no lo lee el lector de pantalla, no tapa ni compite con el título y no se suma al CTA. En el celular se achica o se oculta si molesta.
- **RN-08.5 (movimiento):** no se agregan animaciones nuevas. Sigue habiendo un solo momento animado ("hierro al rojo").
- **RN-08.6 (publicar):** el push se hace solo con el OK de Matias.

## Casos límite
- **Pantalla de 375 px:** sin scroll horizontal. El precio del plan se ve sin bajar más allá del nombre y la frase de para quién es.
- **Lector de pantalla:** el orden de lectura del plan sigue teniendo sentido (nombre → precio → detalle) y el símbolo del fondo se ignora.
- **Precio duplicado:** el precio aparece una sola vez por plan (se mueve, no se copia). El botón "Consultar por WhatsApp" queda al final de la tarjeta.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-08.1 | Dado cada plan, entonces el precio está inmediatamente después del nombre, una sola vez, y el botón de WhatsApp sigue al final | Escenario BDD |
| CA-08.2 | Dado un celular de 375 px, cuando veo un plan, entonces su precio está a menos de 200 px del nombre del plan | Escenario BDD |
| CA-08.3 | Dado el inicio, entonces tiene el símbolo de la marca como decoración (`aria-hidden`), detrás del título y sin taparlo | Escenario BDD |
| CA-08.4 | Dado "Cómo trabajo", entonces los 4 números de paso se ven grandes (al menos 56 px) en la tipografía de títulos | Escenario BDD |
| CA-08.5 | Dadas las líneas entre secciones, entonces empiezan y terminan alineadas con el contenido (±1 px) | Escenario BDD |
| CA-08.6 | Dado un celular de 375 px con todo bajado, entonces el botón flotante no tapa el último link del pie | Escenario BDD |
| CA-08.7 | Dado el sitio pulido, cuando Matias lo ve en la compu y en el celular, entonces se ve con más personalidad, prolijo y sin recargar | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-08.7: ¿Se ve con más personalidad y prolijo, sin quedar recargado? — firmado:

## Preguntas abiertas
- Ninguna.

## Historial
- 2026-11-08: creada a partir de la revisión de diseño posterior a la HU-05.
- 2026-11-08: aprobada por Matias.
- 2026-11-08: implementada; 6 escenarios en verde. El símbolo quedó en la columna derecha, bajo la ficha (absoluto tapaba la firma). Falta la firma de CA-08.7.
