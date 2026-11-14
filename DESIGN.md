# Design System — Hefesto Webs

> Marca definida en la HU-03 (`docs/specs/HU-03-identidad-visual.md`). Guía visual: `brand/marca.html`. Valores exactos: `brand/tokens.json`.
> **Estado:** aplicado al portfolio en la HU-06 (2026-11-08).

## Product Context
- **What this is:** Hefesto Webs (nombre provisorio, HU-02): estudio de páginas web de Matias Lopez. Páginas, tiendas con WhatsApp y tiendas con pagos, a medida.
- **Who it's for:** dueños de negocios chicos y profesionales de toda Argentina (base en San Rafael, Mendoza); también empresas que necesitan algo a medida.
- **Space/industry:** estudios web y freelancers. La categoría converge en oscuro + neón, sans genéricas y tarjetas de a tres.
- **Project type:** sitio de venta (portfolio) + piezas de Instagram y WhatsApp Business.
- **Memorable thing:** "Hecho a mano, con oficio". Un herrero que forja código, no una plantilla.

## Aesthetic Direction
- **Direction:** "Barra al rojo": industrial-artesanal y moderno. Acero frío con una sola brasa.
- **Decoration level:** minimal. La tipografía y el acento hacen el trabajo; no hay texturas, degradados decorativos ni brillos.
- **Mood:** firme, prolijo y directo. Confiable, moderna y simple; nunca infantil, recargada ni improvisada.
- **Symbol:** un yunque forjando `</>` dentro de un hexágono-tuerca; la barra `/` va al rojo. Evita el yunque solo y relleno (se parece al logo de CurseForge).
- **Reference research:** tendencias 2026 hacia lo táctil y la identidad en movimiento ([Framia](https://framia.converge.ai/page/es-ES/blog/identidad-visual-guia-definitiva), [Hostinger](https://www.hostinger.com/ar/tutoriales/?p=47349)); estudios que mezclan oficio analógico y digital ([Identity Lab](https://www.red-dot.org/siegerprofile/identity-lab/2025)).

## Typography
- **Display/Hero:** Archivo, ancho 70, peso 800, MAYÚSCULAS. Compacta y fuerte, como una pieza de metal.
- **Body:** Public Sans 400/500. Neutra y muy legible en el celular.
- **UI/Labels:** Public Sans 500/700 (botones en 700).
- **Data/Tables (precios):** Archivo 800 condensada, con `font-variant-numeric: tabular-nums`.
- **Code:** no aplica (si hiciera falta, IBM Plex Mono).
- **Loading:** Google Fonts: `family=Archivo:wdth,wght@62..125,500..800&family=Public+Sans:wght@400;500;700&display=swap`.
- **Logo:** las letras del logo son trazos (`brand/trazar-logo.mjs`), no dependen de la tipografía cargada.
- **Scale (px):** display 56–96 (clamp) · h2 36–56 · h3 22–28 · cuerpo 16–18 · chico 14 · mínimo 12.

## Color
- **Approach:** restrained. Neutros fríos + un único acento.
- **Fondo (acero):** `#1B2128` · **Superficie:** `#222A33` · **Línea:** `#323C47`
- **Texto:** `#EEF1F4` (15,5:1) · **Texto secundario:** `#9AA6B2` (6,7:1)
- **Acento (brasa):** `#FF7A1A` (6,4:1 sobre el fondo). Solo para el CTA de WhatsApp, una palabra clave, el detalle del logo. Texto sobre el acento: `#1B2128`.
- **Sobre fondo claro (impresión/documentos):** fondo `#F3F4F6`, texto `#1B2128`, acento `#C2410C`.
- **Semantic:** éxito `#7EE2A8`, error `#FF9D9D` (sobre el fondo oscuro).
- **Dark mode:** el sistema ya es oscuro; no hay modo claro para la web.

## Spacing
- **Base unit:** 8px · **Density:** cómoda (marketing) · **Scale:** 4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · secciones `clamp(88px, 12vw, 152px)`.

## Layout
- **Approach:** grid disciplinado con títulos alineados a la izquierda; nada centrado por defecto.
- **Max content width:** 1200px · gutter `clamp(16px, 4vw, 40px)`.
- **Border radius:** botón 4px · input 6px · tarjeta 16px · nada de esquinas tipo burbuja.
- **Recurso de marca:** la "barra al rojo" (6px de alto, 44px de ancho, `#FF7A1A`) como subrayado de títulos y separador.

## Motion
- **Approach:** intencional, con un solo momento por página.
- **Hierro al rojo:** al cargar, el símbolo o la palabra clave aparecen incandescentes y se "enfrían" a su color (≈1 s, una sola vez).
- **Brasa en el botón:** al pasar el mouse, el CTA gana un brillo naranja suave (200 ms).
- **Easing:** salida `cubic-bezier(0.23, 1, 0.32, 1)` · **Duración UI:** 160–250 ms.
- **Reduced motion:** sin desplazamientos ni brillos; solo fundidos breves.

## Excepción: Instagram y hero (2026-11-12, aprobada por Matias)
En las piezas de Instagram (HU-14) y en el inicio del sitio (HU-12) se permiten texturas de metal generadas con código, brillo de brasa y la foto del taller. El resto del sitio sigue minimalista.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-11-07 | Sistema inicial creado (HU-03) | /design-consultation + 2 rondas de direcciones y 2 de logos. Matias eligió la paleta "Barra al rojo", las letras de la ronda 1 (Archivo + Public Sans) y el logo "Hexágono con </>". |
| 2026-11-07 | Descartado el yunque solo | Se parece al logo de CurseForge. |
| 2026-11-07 | Logo en trazos | Como `<img>`, el SVG no cargaba la tipografía y se cortaba; ahora no depende de fuentes. |
