# HU-06: Portfolio con la marca

**Historia:** Como dueño del estudio, quiero que el portfolio se vea y se presente como Efesto Webs, para que quien llegue desde Instagram o WhatsApp reconozca la misma marca y confíe.
**Estado de la spec:** Aprobada

## Objetivo
Aplicar la identidad de `DESIGN.md` (colores "Barra al rojo", Archivo condensada + Public Sans, logo del hexágono, movimiento "hierro al rojo") al sitio actual (`index.html` + `style.css`), sin cambiar su contenido ni su estructura de secciones. También se suman el nombre en los metadatos (título, Open Graph, JSON-LD), el favicon y la imagen para compartir de la marca, y el link a Instagram.

**Fuera de esta historia:**
- **Número nuevo de WhatsApp:** va en la HU-05. Acá se sigue usando el actual.
- **Dominio propio (CNAME):** se agrega cuando Matias lo registre (HU-02, CA-02.7).

## Reglas
- **RN-06.1 (identidad):** solo los colores, tipografías, radios y movimiento de `DESIGN.md` / `brand/tokens.json`. El naranja (brasa) se usa únicamente donde lo permite `DESIGN.md`: el CTA de WhatsApp, una palabra clave y el detalle del logo. Solo modo oscuro.
- **RN-06.2 (contenido):** se mantienen los textos, los proyectos, los precios (150/350/900 mil) y las secciones actuales. Solo cambian el aspecto, la marca y los metadatos. Nada inventado.
- **RN-06.3 (no romper):** Formspree mantiene `action="https://formspree.io/f/xojbrbwd"` y los campos `nombre`, `contacto` y `proyecto`. El snippet de PostHog se queda en el `<head>`.
- **RN-06.4 (marca y firma):** se presenta como "Efesto Webs", con la firma "por Matias Lopez". El trato sigue siendo personal ("escribime").
- **RN-06.5 (accesibilidad):** el texto tiene contraste AA. Hay foco visible y se respeta `prefers-reduced-motion`.
- **RN-06.6 (publicar):** el push a GitHub Pages se hace solo con el OK de Matias.

## Casos límite
- **Sin JavaScript o con movimiento reducido:** el contenido se ve completo, sin animaciones.
- **Pantalla de 375 px:** no hay scroll horizontal y el logo sigue entrando en el encabezado.
- **Link compartido por WhatsApp:** la vista previa muestra la imagen `og` de la marca (1200×630) y el título nuevo.
- **Caché de la vista previa:** WhatsApp y Facebook guardan la imagen vieja por un tiempo; se aclara y no se toma como error.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-06.1 | Dado el sitio, cuando se abre, entonces usa el fondo `#1B2128`, el acento `#FF7A1A` y las tipografías Archivo y Public Sans | Escenario BDD |
| CA-06.2 | Dado el encabezado, entonces muestra el logo de Efesto Webs y el `<title>` incluye "Efesto Webs" | Escenario BDD |
| CA-06.3 | Dados los metadatos, entonces `og:site_name`, `og:image` (1200×630 de la marca) y el JSON-LD nombran a Efesto Webs, y el favicon es el símbolo | Escenario BDD + chequeo de medidas |
| CA-06.4 | Dado el formulario, cuando se carga el sitio, entonces conserva el action de Formspree y los campos `nombre`, `contacto` y `proyecto` | Escenario BDD |
| CA-06.5 | Dado el pie (y el contacto), entonces hay un link a `instagram.com/efestowebs` que abre en otra pestaña | Escenario BDD |
| CA-06.6 | Dado un celular de 375 px, entonces no hay scroll horizontal ni errores en la consola | Escenario BDD |
| CA-06.7 | Dados los links de WhatsApp, entonces todos usan el mismo número (así, en la HU-05, se cambia con un solo reemplazo) | Escenario BDD |
| CA-06.8 | Dado el sitio con la marca, cuando Matias lo ve en la compu y en su celular, entonces se siente igual que el Instagram y la guía de marca | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-06.8: ¿El sitio se ve como Efesto Webs, en la compu y en el celular? — firmado:

## Preguntas abiertas
- Ninguna por ahora. El número y el dominio quedan fuera, como se explica en el Objetivo.

## Historial
- 2026-11-08: creada.
- 2026-11-08: aprobada por Matias.
- 2026-11-08: implementada; escenarios en verde (7/7). Falta la firma de CA-06.8.
