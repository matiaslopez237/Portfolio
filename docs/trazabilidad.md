# Trazabilidad (modo liviano)

Historia → Spec → Criterio → Cómo se verifica → Estado. Generada con la skill `trazabilidad`. No se marcan coberturas que no se encontraron.

| HU | CA | Cómo se verifica | Estado | Evidencia |
| --- | --- | --- | --- | --- |
| HU-01 | CA-01.1 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · `PRODUCT.md` § Marca |
| HU-01 | CA-01.2 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · § Marca › Personalidad |
| HU-01 | CA-01.3 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · § Marca › Ubicación y alcance |
| HU-01 | CA-01.4 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · § Marca › Canales |
| HU-01 | CA-01.5 | Checklist (firma Matias) | pendiente | `docs/specs/HU-01-brief-de-marca.md` |
| HU-01 | CA-01.6 | Checklist (firma Matias) | pendiente | `docs/specs/HU-01-brief-de-marca.md` |
| HU-07 | CA-07.1 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · `index.html` #planes |
| HU-07 | CA-07.2 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · JSON-LD de `index.html` |
| HU-07 | CA-07.3 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · 3 tarjetas de #planes |
| HU-07 | CA-07.4 | Chequeo `scripts/check.mjs` | ✓ | `npm run check` · `PRODUCT.md` |

## Huecos
- HU-07: ninguno. Commits [RED] c33a038 → [GREEN] (este). Las piezas viejas de WhatsApp (catalogo.html, flyer.html) tienen los precios anteriores: se rehacen en HU-05.
- HU-01: checklist CA-01.5 y CA-01.6 sin firmar.
