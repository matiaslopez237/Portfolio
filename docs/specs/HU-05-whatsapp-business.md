# HU-05: WhatsApp Business

**Historia:** Como dueño del estudio, quiero el WhatsApp Business de Efesto Webs configurado y el número nuevo en todos lados, para que cada consulta llegue al número del estudio y se atienda con la misma marca.
**Estado de la spec:** Aprobada

## Objetivo
Dejar listo todo lo necesario para WhatsApp Business con el número nuevo **+54 9 260 466-1138** (`wa.me/5492604661138`):
- **Perfil:** nombre, descripción, categoría, horario y links.
- **Catálogo:** los 3 planes, con imagen y texto.
- **Mensajes automáticos:** bienvenida, ausencia y respuestas rápidas.
- **Flyer** de la marca.
- **Número nuevo** en el portfolio y en `PRODUCT.md`.

Las piezas se generan con la identidad de `DESIGN.md`, igual que las de Instagram (HU-04).

## Reglas
- **RN-05.1 (número):** todos los links y textos usan `5492604661138`. El número viejo (`2995560164`) no puede quedar en el sitio ni en las piezas nuevas.
- **RN-05.2 (identidad):** colores, tipografías y logo de `DESIGN.md` / `brand/tokens.json`. Las piezas usan solo colores de la paleta.
- **RN-05.3 (contenido real):** precios vigentes ("desde $150.000 / $350.000 / $900.000"), lo que incluye cada plan según `index.html` y nada de opiniones, cifras ni promesas que no se cumplan.
- **RN-05.4 (límites de WhatsApp Business):**
  - Descripción del perfil: 512 caracteres o menos.
  - Mensajes de bienvenida y ausencia: 1.024 caracteres o menos.
  - Atajo de respuesta rápida: 25 caracteres o menos.
  - Producto del catálogo: nombre de 75 caracteres o menos y descripción de 5.000 o menos.
- **RN-05.5 (formatos):** tarjetas del catálogo de 800×800 y flyer de 1080×1920 (historia y estado de WhatsApp).
- **RN-05.6 (fuente única):** los textos y precios de las piezas salen de `brand/whatsapp/contenido.json`. El número sale de ahí y de `brand/instagram/contenido.json`.
- **RN-05.7 (cuentas):** la configuración dentro de la app la hace Matias desde el celular. La IA prepara los textos y las imágenes.
- **RN-05.8 (publicar):** el push del portfolio con el número nuevo se hace solo con el OK de Matias.

## Casos límite
- **Mensaje fuera de horario:** el mensaje de ausencia dice cuándo se responde, sin prometer un tiempo exacto.
- **Links viejos ya compartidos:** el número viejo puede seguir recibiendo mensajes. Matias decide si deja un mensaje que redirija (fuera del alcance de la IA).
- **Piezas viejas** (`catalogo.html`, `flyer.html`, `catalogo-*.png`, `flyer.png`): tienen los precios y el número anteriores. Se reemplazan por las nuevas de `brand/whatsapp/` y las viejas se borran.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-05.1 | Dado el portfolio, entonces todos los links `wa.me` y el JSON-LD usan `5492604661138`, y el número viejo no aparece | Escenario BDD |
| CA-05.2 | Dado `brand/whatsapp/perfil.md`, entonces tiene nombre, categoría, descripción (512 caracteres o menos), horario (lunes a sábado de 9 a 21), email y sitio web | Chequeo automático |
| CA-05.3 | Dado el catálogo, entonces hay 3 PNG de 800×800 (uno por plan), con nombre y descripción dentro de los límites | Chequeo automático |
| CA-05.4 | Dado `brand/whatsapp/mensajes.md`, entonces hay bienvenida, ausencia y al menos 4 respuestas rápidas dentro de los límites | Chequeo automático |
| CA-05.5 | Dado el flyer, entonces existe un PNG de 1080×1920 con los 3 precios vigentes, el número nuevo y un QR que abre el chat | Chequeo automático |
| CA-05.6 | Dadas las plantillas de WhatsApp, entonces solo usan colores de `brand/tokens.json` | Chequeo automático |
| CA-05.7 | Dados el perfil, el catálogo y los mensajes cargados en la app, cuando Matias los ve en su celular, entonces se ven bien y dicen solo cosas reales | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-05.7: ¿El WhatsApp Business se ve bien en el celular y dice solo cosas reales? — firmado:

## Preguntas abiertas
- ~~¿Horario de atención?~~ Respondido: lunes a sábado de 9 a 21.
- ~~¿QR en el flyer?~~ Respondido: sí (se instala `qrcode` como dependencia de desarrollo).

## Historial
- 2026-11-08: creada, con el número nuevo de Matias.
- 2026-11-08: aprobada por Matias; horario lunes a sábado de 9 a 21; flyer con QR.
- 2026-11-08: implementada; 5 chequeos y 2 escenarios en verde. Piezas viejas borradas. Falta la firma de CA-05.7.
