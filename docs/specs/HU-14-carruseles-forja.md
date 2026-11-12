# HU-14: Carruseles con el estilo Forja

**Historia:** Como dueño del estudio, quiero relanzar Instagram con carruseles llamativos y coherentes con el sitio nuevo, pensados para las personas de la HU-11, para que la cuenta genere consultas por WhatsApp desde el primer mes.
**Estado de la spec:** Aprobada

## Objetivo
Reemplazar los 12 posts de imagen sola (HU-04 y HU-09) por **carruseles** con el estilo del prototipo del sitio (`brand/prototipos/sitio-forja.html`): acero gastado, placas remachadas, barra al rojo, logo 3D, foto del taller y luz de fragua. El trabajo tiene dos etapas:
1. **Muestras:** 3 carruseles completos, uno de cada tipo (caso, consejo y plan), para que Matias apruebe el estilo antes de producir el resto.
2. **Primer mes:** con el estilo aprobado, los carruseles del mes según `brand/instagram/estrategia/matriz-de-contenido.md`, con sus textos, un calendario nuevo y la publicación automática preparada para carruseles.

## Reglas
- **RN-14.1 (estrategia):** cada carrusel tiene pilar, persona y etapa de la matriz de la HU-11, y usa la voz de `voz-y-tono.md`:
  - un gancho en la portada
  - una idea por slide
  - palabras "sí" y nada de las "no"
  - el CTA fijo al final
- **RN-14.2 (formato):** de 5 a 7 slides de 1080×1350. Título de 80 px o más, cuerpo de 36 px o más y 25 palabras como máximo por slide (`implicancias-diseno.md`).
- **RN-14.3 (slide final fija):** todos los carruseles terminan con el mismo slide: logo, "Escribime por WhatsApp", `260 466-1138` y `@hefestowebs`.
- **RN-14.4 (contenido real):** solo proyectos, precios ("desde $150.000 / $350.000 / $900.000"), procesos y datos reales de `PRODUCT.md` e `index.html`. Nada de testimonios, cifras de resultados ni "el más elegido".
- **RN-14.5 (identidad Forja):**
  - Los colores salen de `brand/tokens.json`, y los brillos y sombras se hacen con transparencias de esos mismos colores.
  - Las texturas se generan con código, sin imágenes con derechos de terceros.
  - Se usan las imágenes propias: el logo 3D, la foto del taller y las capturas de `assets/proyectos/`.
  - Se agrega a `DESIGN.md` la excepción "Instagram y hero: texturas y brillo permitidos" (aprobada por Matias para el prototipo).
- **RN-14.6 (fuente única):** los textos de los slides y de los posts salen de `brand/instagram/contenido.json` y `textos.md`. Las imágenes se generan con `node brand/instagram/generar.mjs`.
- **RN-14.7 (publicación automática):** `scripts/publicar-instagram.mjs` publica carruseles con la API oficial: un contenedor por slide, el contenedor del carrusel y la publicación. Se prueba con la API simulada (TDD), igual que en la HU-10.
- **RN-14.8 (calendario):** arranca el **lunes 16 de noviembre de 2026** y sigue lunes, miércoles y viernes a las 19:00. Los reels (HU-15) todavía no existen, así que el miércoles va un carrusel de trabajo o de detrás de escena hasta que estén.
- **RN-14.9 (posts viejos):** los 12 posts de la HU-04 y la HU-09 quedan archivados en `brand/instagram/archivo/`. Los 3 borradores de Meta Business Suite los elimina Matias, o la IA con su OK. `publicados.json` se vacía, porque nada se publicó todavía.
- **RN-14.10 (publicar):** programar o publicar en Instagram se hace solo con el OK de Matias.

## Casos límite
- **Proyecto sin captura de celular** (o sin la de compu): el slide del caso usa la que haya, sin inventar una pantalla.
- **Texto que no entra en 25 palabras:** se divide en dos slides o se recorta. El chequeo falla si se pasa.
- **Carrusel con menos de 5 slides o más de 7:** el chequeo falla.
- **Instagram recorta la vista de la grilla:** la portada mantiene lo importante en el centro (zona de 1080×1080), porque la grilla nueva muestra 3:4 y recorta los bordes.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-14.1 | Dadas las muestras, entonces hay 3 carruseles (caso, consejo y plan), cada uno con 5 a 7 PNG de 1080×1350 | Chequeo automático |
| CA-14.2 | Dado `contenido.json`, entonces cada slide tiene 25 palabras o menos, y cada carrusel indica pilar, persona y etapa de la matriz | Chequeo automático |
| CA-14.3 | Dado cada carrusel, entonces el último slide es el CTA fijo con el número y `@hefestowebs` | Chequeo automático |
| CA-14.4 | Dado `textos.md`, entonces cada carrusel tiene su texto (2.200 caracteres o menos) con 5 a 10 hashtags | Chequeo automático |
| CA-14.5 | Dadas las plantillas, entonces solo usan colores hex de `brand/tokens.json` (las transparencias se arman con esos mismos colores) | Chequeo automático |
| CA-14.6 | Dado `calendario.md`, entonces cubre 4 semanas desde el 2026-11-16, lunes, miércoles y viernes, con pilar y persona en cada carrusel, y la mezcla de la matriz (consejos 40%, trabajos 30%, oferta 20%, detrás de escena 10%, ±10%) | Chequeo automático |
| CA-14.7 | Dado un carrusel en el calendario, cuando corre la publicación con la API simulada, entonces crea un contenedor por slide, el del carrusel con sus hijos y lo publica | Test (TDD) |
| CA-14.8 | Dadas las 3 muestras, cuando Matias las ve, entonces elige el estilo (o pide cambios) antes de producir el mes | Checklist |
| CA-14.9 | Dados los carruseles del mes, cuando Matias los ve en la grilla, entonces se ven llamativos, coherentes con el sitio y dicen solo cosas reales | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-14.8: ¿Las 3 muestras tienen el estilo que querés? — firmado:
- [ ] CA-14.9: ¿Los carruseles del mes se ven bien en la grilla y dicen solo cosas reales? — firmado:

## Preguntas abiertas
- Ninguna. Si en las muestras Matias quiere otro nivel de intensidad, se ajusta ahí, antes de producir el mes.

## Historial
- 2026-11-12: creada, con la estrategia de la HU-11 y el estilo del prototipo del sitio. Los reels quedan para la HU-15.
- 2026-11-12: aprobada por Matias.
- 2026-11-12: etapa 1 lista: 3 muestras (C1 caso Quiropraxia, C2 consejo, C3 plan Tienda WhatsApp) y publicación de carruseles (16/16 tests). Espera la firma de CA-14.8.
