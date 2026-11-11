# HU-13: Cambio de nombre a Hefesto Webs

**Historia:** Como dueño del estudio, quiero que la marca se escriba "Hefesto Webs", con H como el dios en español, para que el nombre sea correcto y la gente lo encuentre como lo conoce.
**Estado de la spec:** Aprobada

## Objetivo
Pasar la marca de "Efesto Webs" a **"Hefesto Webs"** en todo lo que está vivo:
- **Sitio:** el portfolio y sus metadatos.
- **Logo:** las letras trazadas.
- **Piezas de redes:** las de Instagram y WhatsApp.
- **Documentos de marca y estrategia.**
- **Cuentas:** que cambie Matias, con su OK.

El símbolo (hexágono, `</>` y yunque) no cambia.

### Disponibilidad (verificada el 2026-11-11)
| Qué | Resultado | Cómo |
| --- | --- | --- |
| `hefestowebs.com.ar` | Libre | RDAP de NIC.ar (404) |
| `hefestowebs.com` | Libre | RDAP de Verisign (404) |
| `hefestoweb.com.ar` | Libre | RDAP de NIC.ar (404) |
| `hefesto.com.ar` / `hefesto.com` | Ocupados | RDAP (200) |
| `@hefestowebs` y `@hefesto.webs` en Instagram | Sin perfil | Instagram muestra "Esta página no está disponible" (no garantiza que el @ se pueda tomar; se confirma al cambiarlo) |

## Reglas
- **RN-13.1 (forma del nombre):** "Hefesto Webs" en textos; "HEFESTO WEBS" en el logo y los títulos en mayúsculas; usuario `@hefestowebs`; firma "por Matias Lopez".
- **RN-13.2 (qué se cambia):** todo lo que está vivo:
  - `index.html`, `style.css`
  - `PRODUCT.md`, `DESIGN.md`, `CLAUDE.md`
  - `brand/marca.html`, `brand/tokens.json`, el logo (`brand/trazar-logo.mjs` → `brand/logo/*.svg`) y las exportaciones (`brand/export/*`)
  - `brand/instagram/` (contenido, perfil, textos, plantillas, piezas generadas, estrategia)
  - `brand/whatsapp/` (perfil, mensajes, plantillas, piezas)
  - el prototipo del hero
  - el workflow y el script de publicación
  - los tests y chequeos que nombran la marca
- **RN-13.3 (qué no se cambia):** los registros históricos quedan como se escribieron. Eso incluye las specs cerradas, el historial de la trazabilidad, `brand/nombres*.md` y las exploraciones `brand/direcciones*.html` y `brand/logos-herrero*.html`. Al historial de la HU-02 se le agrega la decisión, y a `brand/nombres.md`, una nota.
- **RN-13.4 (Instagram):** el link del sitio pasa a `instagram.com/hefestowebs` recién cuando Matias haya cambiado el @. Hasta entonces se mantiene `efestowebs`, para no romper el link.
- **RN-13.5 (cuentas):** cambiar el @ y el nombre en Instagram, el nombre en WhatsApp Business y el del portfolio comercial de Meta lo hace Matias, o la IA con su OK explícito para cada uno. Instagram permite cambiar el nombre 2 veces cada 14 días; el último cambio fue el 2026-11-08.
- **RN-13.6 (publicar):** el push del sitio con el nombre nuevo se hace solo con el OK de Matias.

## Casos límite
- **`@hefestowebs` resulta tomado al intentar el cambio:** se prueba `@hefesto.webs` y se avisa antes de seguir. Los textos usan el @ que se consiga.
- **El @ viejo queda libre:** Instagram no redirige `@efestowebs` al nuevo, y otra persona podría tomarlo. La cuenta todavía no tiene publicaciones ni seguidores, así que el riesgo es bajo. Se puede reservar con una cuenta secundaria si Matias quiere.
- **Imágenes con el nombre viejo:** se regeneran todas (posts, destacadas, catálogo, flyer, foto de perfil, og). El logo 3D de Gemini no tiene texto y no cambia.
- **Vista previa del link compartido:** WhatsApp y Facebook pueden mostrar la imagen vieja por un tiempo.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-13.1 | Dados los archivos vivos de RN-13.2, entonces no queda "Efesto" sin H (salvo `@efestowebs` mientras siga RN-13.4) | Chequeo automático |
| CA-13.2 | Dado el sitio, entonces el título, `og:site_name`, el JSON-LD y el logo de la nav dicen "Hefesto Webs" | Escenario BDD |
| CA-13.3 | Dado el logo (`brand/logo/logo.svg` y `logo-1color.svg`), entonces las letras trazadas dicen HEFESTO WEBS y el texto accesible es "Hefesto Webs" | Chequeo automático |
| CA-13.4 | Dadas las piezas generadas (posts, destacadas, historias, catálogo, flyer, perfil, og), entonces se regeneraron después del cambio y miden lo mismo que antes | Chequeo automático |
| CA-13.5 | Dada la suite completa, entonces `npm test`, `npm run test:unit` y `npm run check` siguen en verde | Escenario BDD + chequeo |
| CA-13.6 | Dados `brand/nombres.md` y la spec de la HU-02, entonces registran la decisión con fecha y la disponibilidad verificada | Chequeo automático |
| CA-13.7 | Dadas las cuentas, cuando Matias las cambia, entonces Instagram (@ y nombre), WhatsApp Business y el portfolio de Meta dicen "Hefesto Webs" | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-13.7: ¿Instagram, WhatsApp Business y Meta ya dicen Hefesto Webs? — firmado:

## Preguntas abiertas
- Ninguna.

## Historial
- 2026-11-11: creada a pedido de Matias ("pongámoslo con H"), con la disponibilidad verificada. La HU-12 (hero) sigue después con el nombre nuevo. Los carruseles pasan a la HU-14 y los reels a la HU-15.
- 2026-11-11: aprobada por Matias.
