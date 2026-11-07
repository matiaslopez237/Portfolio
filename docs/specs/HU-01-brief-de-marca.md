# HU-01: Brief de marca

**Historia:** Como dueño del estudio, quiero dejar por escrito qué es y qué transmite mi marca, para que el nombre, el logo y las piezas (HU-02 a HU-06) salgan de decisiones claras y no del gusto del momento.
**Estado de la spec:** Implementada

## Objetivo
Definir la base de la marca antes de elegir nombre o estilo: qué tipo de marca es, desde dónde trabaja, qué personalidad tiene y qué no quiere ser, cómo habla y en qué canales vive. Queda en la sección `## Marca` de `PRODUCT.md`, que es la fuente que leen las demás historias.

## Reglas
- **RN-01.1:** Las palabras de personalidad salen de las respuestas de Matias; no se inventan ni se completan "por defecto".
- **RN-01.2:** Ya decidido: estudio con nombre propio, nombre corto de una palabra, firma "por Matias Lopez" y estilo visual **nuevo** (distinto del portfolio actual).
- **RN-01.3:** El brief no elige nombre, colores ni tipografías: eso es HU-02 y HU-03. Solo deja las pistas (por ejemplo, "transmitir confianza" o "evitar lo infantil").
- **RN-01.4:** No contradice lo ya definido en `PRODUCT.md` (público, objetivo de WhatsApp, precios, sin opiniones inventadas). Si algo cambia, se actualiza ahí mismo y se anota en el Historial.
- **RN-01.5:** Ubicación: San Rafael, Mendoza.

## Casos límite
- **Sin referencias visuales:** se anota "sin referencias", y en HU-03 se proponen direcciones para elegir viendo.
- **Una palabra "sí" que choca con una "no"** (por ejemplo, "divertido" y "poco serio"): se pregunta cuál pesa más antes de escribir.
- **Alcance fuera de San Rafael:** si querés clientes de otras provincias o de afuera, se anota, porque cambia si el nombre puede tener referencias locales (HU-02).
- **Número nuevo todavía sin activar:** el brief igual se cierra; el número se pide en HU-05.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-01.1 | Dado `PRODUCT.md`, cuando se cierra la historia, entonces tiene una sección `## Marca` con las subsecciones Tipo, Ubicación y alcance, Personalidad, Voz, Canales y Pistas para nombre y estilo | Chequeo automático |
| CA-01.2 | Dada la sección Personalidad, entonces lista exactamente 3 palabras "sí" y 3 palabras "no" | Chequeo automático |
| CA-01.3 | Dada la sección Ubicación y alcance, entonces dice "San Rafael, Mendoza" y hasta dónde querés vender | Chequeo automático |
| CA-01.4 | Dada la sección Canales, entonces incluye Instagram, WhatsApp Business con número aparte y el portfolio | Chequeo automático |
| CA-01.5 | Dado el brief terminado, cuando Matias lo lee, entonces siente que lo representa | Checklist |
| CA-01.6 | Dado el brief, entonces no contradice lo definido en `PRODUCT.md` (público, objetivo, precios, sin opiniones inventadas) | Checklist |

## Checklist (lo firma Matias)
- [x] CA-01.5: ¿El brief te representa? — firmado: 2026-11-07
- [x] CA-01.6: ¿No contradice nada de lo que ya estaba definido? — firmado: 2026-11-07

## Preguntas abiertas (se responden durante la historia)
- Las 3 palabras que sí y las 3 que no.
- ¿Querés vender solo en San Rafael y Mendoza, en toda Argentina o también afuera?
- ¿Hay alguna marca (de cualquier rubro) cuyo estilo te guste?

## Historial
- 2026-11-07: creada.
- 2026-11-07: aprobada por Matias.
- 2026-11-07: implementada; checklist firmado por Matias.
