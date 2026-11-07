# HU-07: Precios nuevos y análisis en todos los planes

**Historia:** Como dueño del estudio, quiero actualizar los precios de referencia y que los tres planes incluyan el análisis de visitas, para que la oferta sea más accesible en la entrada y el análisis sea parte de todos los planes.
**Estado de la spec:** Aprobada

## Objetivo
Cambiar los precios "desde" de los tres planes y sumar "Estadísticas de visitas y comportamiento" a todos, en el mismo valor y con la misma redacción en todos los lugares donde aparecen.

## Reglas
- **RN-07.1:** Precios de referencia en ARS: **Landing Page desde $150.000**, **Tienda WhatsApp desde $350.000**, **Tienda con pagos desde $900.000**.
- **RN-07.2:** Los tres planes incluyen **"Estadísticas de visitas y comportamiento"**.
- **RN-07.3:** Se siguen mostrando como "Desde $X", sin descuentos (regla vigente de `PRODUCT.md`).
- **RN-07.4:** El precio y el análisis son iguales en la página (tarjetas), en los datos estructurados para Google (JSON-LD) y en `PRODUCT.md`.

## Casos límite
- **Formato del número:** en la página con punto de miles (`$150.000`); en el JSON-LD sin puntos (`150000`).
- **"Todo lo de Landing Page":** Tienda WhatsApp y Tienda con pagos lo dicen, pero el análisis se agrega igual como línea visible en cada una, para que se lea sin deducir.
- **Piezas de WhatsApp viejas** (`catalogo.html`, `flyer.html`, PNG del catálogo): tienen los precios anteriores. No se tocan acá: se rehacen con la marca nueva en HU-05.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-07.1 | Dada la sección Planes de `index.html`, entonces muestra $150.000, $350.000 y $900.000, y ningún precio anterior ($255.000, $500.000, $800.000) | Chequeo automático |
| CA-07.2 | Dado el JSON-LD de `index.html`, entonces los `minPrice` son 150000, 350000 y 900000 | Chequeo automático |
| CA-07.3 | Dadas las 3 tarjetas de planes, entonces cada una lista "Estadísticas de visitas y comportamiento" | Chequeo automático |
| CA-07.4 | Dado `PRODUCT.md`, entonces lista los precios nuevos y dice que los tres planes incluyen el análisis | Chequeo automático |

## Historial
- 2026-11-07: creada y aprobada a partir del pedido de Matias (precios 255→150, 500→350, 800→900; análisis en los tres planes).
