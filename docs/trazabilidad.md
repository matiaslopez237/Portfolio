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
| HU-02 | CA-02.6 | Checklist (firma Matias) | pendiente | Nombre provisorio hasta que Matias lo confirme |
| HU-02 | CA-02.7 | Checklist (firma Matias) | pendiente | Registrar @ y dominio |
| HU-03 | CA-03.1 | Chequeo `scripts/check.mjs` | ✓ | `brand/direcciones.html` (ronda 2) · ronda 1 en `brand/direcciones-ronda1.html` |
| HU-03 | CA-03.2 | Chequeo `scripts/check.mjs` | ✓ | `brand/tokens.json` (15,5 / 6,7 / 6,4 : 1) |
| HU-03 | CA-03.3 | Chequeo `scripts/check.mjs` | ✓ | `brand/logo/*.svg` (trazos, `brand/trazar-logo.mjs`) |
| HU-03 | CA-03.4 | Chequeo `scripts/check.mjs` | ✓ | `brand/export/*.png` (`brand/export.mjs`) |
| HU-03 | CA-03.5 | Chequeo `scripts/check.mjs` | ✓ | `brand/marca.html` |
| HU-03 | CA-03.6 | Checklist (firma Matias) | pendiente | Dirección elegida: Barra al rojo + Hexágono con </> |
| HU-03 | CA-03.7 | Checklist (firma Matias) | pendiente | Logo en 32 px y en círculo (`brand/marca.html` › Logo) |

## Huecos
- HU-03: CA-03.6 y CA-03.7 sin firmar.
- HU-02: CA-02.6 y CA-02.7 sin firmar (nombre provisorio; falta registrar @ y dominio).
- HU-07: ninguno. Commits [RED] c33a038 → [GREEN] (este). Las piezas viejas de WhatsApp (catalogo.html, flyer.html) tienen los precios anteriores: se rehacen en HU-05.
- HU-01: ninguno.
