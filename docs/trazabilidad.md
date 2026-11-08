# Trazabilidad (modo liviano)

Historia → Spec → Criterio → Cómo se verifica → Estado. Generada con la skill `trazabilidad`. No se marcan coberturas que no se encontraron.

| HU | CA | Cómo se verifica | Estado | Evidencia |
| --- | --- | --- | --- | --- |
| HU-01 | CA-01.1 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · `PRODUCT.md` § Marca |
| HU-01 | CA-01.2 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · § Marca › Personalidad |
| HU-01 | CA-01.3 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · § Marca › Ubicación y alcance |
| HU-01 | CA-01.4 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · § Marca › Canales |
| HU-01 | CA-01.5 | Checklist (firma Matias) | ✓ firmado 2026-11-07 | `docs/specs/HU-01-brief-de-marca.md` |
| HU-01 | CA-01.6 | Checklist (firma Matias) | ✓ firmado 2026-11-07 | `docs/specs/HU-01-brief-de-marca.md` |
| HU-07 | CA-07.1 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · `index.html` #planes |
| HU-07 | CA-07.2 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · JSON-LD de `index.html` |
| HU-07 | CA-07.3 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · 3 tarjetas de #planes |
| HU-07 | CA-07.4 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · `PRODUCT.md` |
| HU-02 | CA-02.1 | Chequeo `scripts/check.mjs` | ✓ | `brand/nombres.md` § Candidatos (14) |
| HU-02 | CA-02.2 | Chequeo `scripts/check.mjs` | ✓ | Formato con descriptor "Webs" (RN-02.1 modificada) |
| HU-02 | CA-02.3 | Chequeo `scripts/check.mjs` | ✓ | `brand/nombres.md` § Lista corta (4) |
| HU-02 | CA-02.4 | Chequeo `scripts/check.mjs` | ✓ | RDAP NIC.ar y Verisign + búsqueda web, 2026-11-07 |
| HU-02 | CA-02.5 | Chequeo `scripts/check.mjs` | ✓ | `PRODUCT.md` › Marca › Tipo: Efesto Webs (provisorio) |
| HU-02 | CA-02.6 | Checklist (firma Matias) | ✓ | Firmado 2026-11-08 |
| HU-02 | CA-02.7 | Checklist (firma Matias) | pendiente | @efestowebs ✓ (2026-11-08) · falta dominio efestowebs.com.ar |
| HU-03 | CA-03.1 | Chequeo `scripts/check.mjs` | ✓ | `brand/direcciones.html` (ronda 2) · ronda 1 en `brand/direcciones-ronda1.html` |
| HU-03 | CA-03.2 | Chequeo `scripts/check.mjs` | ✓ | `brand/tokens.json` (15,5 / 6,7 / 6,4 : 1) |
| HU-03 | CA-03.3 | Chequeo `scripts/check.mjs` | ✓ | `brand/logo/*.svg` (trazos, `brand/trazar-logo.mjs`) |
| HU-03 | CA-03.4 | Chequeo `scripts/check.mjs` | ✓ | `brand/export/*.png` (`brand/export.mjs`) |
| HU-03 | CA-03.5 | Chequeo `scripts/check.mjs` | ✓ | `brand/marca.html` |
| HU-03 | CA-03.6 | Checklist (firma Matias) | ✓ firmado 2026-11-07 | Dirección elegida: Barra al rojo + Hexágono con </> |
| HU-03 | CA-03.7 | Checklist (firma Matias) | ✓ firmado 2026-11-07 | Logo en 32 px y en círculo (`brand/marca.html` › Logo) |
| HU-04 | CA-04.1 | Chequeo `scripts/check.mjs` | ✓ | `brand/instagram/perfil.md` (bio ≤ 150) |
| HU-04 | CA-04.2 | Chequeo `scripts/check.mjs` | ✓ | `brand/instagram/destacadas/*.png` |
| HU-04 | CA-04.3 | Chequeo `scripts/check.mjs` | ✓ | `brand/instagram/posts/post-1..9.png` (`generar.mjs`) |
| HU-04 | CA-04.4 | Chequeo `scripts/check.mjs` | ✓ | `brand/instagram/textos.md` |
| HU-04 | CA-04.5 | Chequeo `scripts/check.mjs` | ✓ | `brand/instagram/plantillas/{post,historia}.html` |
| HU-04 | CA-04.6 | Chequeo `scripts/check.mjs` | ✓ | `brand/instagram/calendario.md` (desde 2026-11-09) |
| HU-04 | CA-04.7 | Checklist (firma Matias) | ✓ firmado 2026-11-07 | `brand/instagram/vista-perfil.png` |
| HU-04 | CA-04.8 | Checklist (firma Matias) | ✓ firmado 2026-11-07 | `brand/instagram/textos.md` |
| HU-06 | CA-06.1 | Escenario BDD (colores y tipografías) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.2 | Escenario BDD (logo y título) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.3 | Escenario BDD (og, JSON-LD y favicon) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.4 | Escenario BDD (Formspree intacto) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.5 | Escenario BDD (link a Instagram) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.6 | Escenario BDD (375 px sin scroll ni errores) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.7 | Escenario BDD (un solo número de WhatsApp) | ✓ | `features/HU-06-portfolio-con-la-marca.feature` · `npm test` |
| HU-06 | CA-06.8 | Checklist (firma Matias) | ✓ firmado 2026-11-08 | `docs/specs/HU-06-portfolio-con-la-marca.md` |
| HU-05 | CA-05.1 | Escenario BDD (número nuevo, sin el viejo) | ✓ | `features/HU-05-whatsapp-business.feature` · `npm test` |
| HU-05 | CA-05.2 | Chequeo `scripts/check.mjs` | ✓ | `brand/whatsapp/perfil.md` |
| HU-05 | CA-05.3 | Chequeo `scripts/check.mjs` | ✓ | `brand/whatsapp/catalogo/*.png` · `contenido.json` |
| HU-05 | CA-05.4 | Chequeo `scripts/check.mjs` | ✓ | `brand/whatsapp/mensajes.md` |
| HU-05 | CA-05.5 | Chequeo `scripts/check.mjs` | ✓ | `brand/whatsapp/flyer.png` · `qr-whatsapp.png` |
| HU-05 | CA-05.6 | Chequeo `scripts/check.mjs` | ✓ | `brand/whatsapp/plantillas/*.html` |
| HU-05 | CA-05.7 | Checklist (firma Matias) | pendiente | Cargar perfil, catálogo y mensajes en la app y verlos en el celular |

## Huecos
- HU-05: CA-05.7 sin firmar. Commits [RED] a4be5b1 → [GREEN] (este). Sin publicar: el push espera el OK de Matias. Faltan definir plazos y formas de pago (quedan fuera de los mensajes).
- HU-06: ninguno. Commits [RED] 90c99d7 → [GREEN] ff3990f. Pendiente de mirar en un celular real ya publicado. Fuera de la historia: número nuevo (HU-05) y dominio (HU-02).
- HU-04: ninguno.
- HU-03: ninguno. Pendiente de verificar en un celular real (firmado viendo en la notebook).
- HU-02: CA-02.7 pendiente (falta registrar el dominio efestowebs.com.ar; el @ ya está).
- HU-07: ninguno. Commits [RED] c33a038 → [GREEN] (este). Las piezas viejas de WhatsApp se reemplazaron en la HU-05.
- HU-01: ninguno.
