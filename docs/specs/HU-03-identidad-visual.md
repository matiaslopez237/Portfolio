# HU-03: Identidad visual

**Historia:** Como dueño del estudio, quiero un logo, una paleta y unas tipografías propias, con una guía de uso, para que Instagram, WhatsApp y la web se vean como una misma marca seria.
**Estado de la spec:** Aprobada

## Objetivo
Definir la identidad visual de **Efesto Webs** (nombre provisorio, HU-02) a partir del brief: confiable, moderna y simple, en la línea de la herrería y la mitología griega. Primero se muestran 3 direcciones distintas para elegir viendo; con la elegida se arma el logo, sus versiones en el tamaño de cada plataforma y una guía de marca.

## Reglas
- **RN-03.1 (brief):** transmite confiable, moderna y simple; nada infantil, recargado ni improvisado (`PRODUCT.md` › Marca).
- **RN-03.2 (estilo nuevo):** distinto del portfolio actual. No repite su combinación de fondo casi negro, violeta `#5b52f0` e Instrument Serif con Geist.
- **RN-03.3 (tipografías):** con licencia libre (Google Fonts u OFL), para usarlas en la web y en las piezas sin pagar.
- **RN-03.4 (logo que aguanta todo):** se lee en 32 px (ícono de la pestaña), en un círculo (foto de perfil) y en un solo color (blanco o negro).
- **RN-03.5 (símbolo propio):** el símbolo se dibuja para la marca. Nada de íconos de bancos de imágenes ni símbolos de otras marcas (el casco de Hermès, el martillo de Marvel…).
- **RN-03.6 (contraste):** el texto de lectura tiene contraste 4.5:1 o más sobre su fondo, y los textos grandes y el acento, 3:1 o más (WCAG AA).
- **RN-03.7 (nombre provisorio):** el logo se arma de forma que cambiar el nombre implique regenerarlo, no redibujarlo desde cero.

## Casos límite
- **El nombre cambia después** (HU-02 sigue abierta): se mantienen la paleta, las tipografías y el estilo del símbolo, y se regenera el logotipo.
- **Logo sobre una foto** (posts con capturas de proyectos): se define una versión sobre fondo, o una franja, para que no se pierda.
- **Impresión en blanco y negro o sello:** versión a un color.
- **Muy chico** (16 a 32 px): versión solo símbolo, sin texto.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-03.1 | Dado `brand/direcciones.html`, entonces muestra 3 direcciones distintas con un selector, y cada una incluye logo, un post, una historia y el perfil de Instagram | Chequeo automático |
| CA-03.2 | Dada la paleta elegida en `brand/tokens.json`, entonces el texto principal y el secundario tienen contraste ≥ 4.5:1 sobre el fondo, y el acento ≥ 3:1 | Chequeo automático |
| CA-03.3 | Dados los logos, entonces existen `brand/logo/logo.svg` (horizontal), `simbolo.svg` y `logo-1color.svg`, todos como SVG válido con `viewBox` | Chequeo automático |
| CA-03.4 | Dadas las exportaciones, entonces miden exacto: perfil de Instagram 1080×1080, perfil de WhatsApp 640×640, favicon 32×32, ícono de Apple 180×180 e imagen para compartir 1200×630 | Chequeo automático |
| CA-03.5 | Dada `brand/marca.html`, entonces tiene las secciones Paleta, Tipografías, Logo (usos correctos e incorrectos) y Tono de voz | Chequeo automático |
| CA-03.6 | Dada la dirección elegida, cuando Matias la ve en el selector, entonces siente que transmite confiable, moderna y simple | Checklist |
| CA-03.7 | Dado el logo, entonces se lee bien en 32 px y recortado en círculo | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-03.6: ¿La dirección elegida es confiable, moderna y simple, y no infantil, recargada ni improvisada? — firmado:
- [ ] CA-03.7: ¿El logo se lee bien chiquito y en la foto de perfil redonda? — firmado:

## Preguntas abiertas
- Ninguna por ahora (la dirección se elige viendo las 3 opciones).

## Historial
- 2026-11-07: creada.
- 2026-11-07: aprobada por Matias.
- 2026-11-07: ronda 1 (Taller, Fragua, Bronce) descartada: colores; el yunque de Fragua se parece a CurseForge. Ronda 2 (Barra al rojo, Llama azul, Ceniza) + 2 tandas de logos de herrero.
- 2026-11-07: elegido: paleta **Barra al rojo**, letras **Archivo condensada + Public Sans**, logo **Hexágono con </>** (yunque forjando código). Sistema en `DESIGN.md`.
- 2026-11-07: el logo pasa a trazos (como <img> no cargaba la tipografía y se cortaba).
