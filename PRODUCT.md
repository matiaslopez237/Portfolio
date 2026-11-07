# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Principal:** dueños de negocios chicos, comercios, emprendimientos y profesionales independientes (salud, servicios, gastronomía) de Argentina, que no tienen página web o tienen una mala. No son técnicos: quieren clientes, no tecnología. Llegan por recomendación, WhatsApp Business o redes.
- **Secundario:** empresas que necesitan una landing institucional o un sistema a medida (panel de gestión, tienda con pagos, integraciones). Hoy es menos frecuente, pero ya hay un caso real (Bacssa) y el sitio no debe cerrarles la puerta.

## Product Purpose

Portfolio y página de venta de Matias Lopez, desarrollador web freelance. Tiene que convencer al visitante de que Matias le puede hacer una página seria que le traiga clientes, y llevarlo a **escribirle por WhatsApp**. En esa conversación Matias adapta la explicación y cotiza. El formulario de contacto (Formspree) es la alternativa para quien no quiere chatear.

Éxito = mensajes de WhatsApp de negocios interesados en un plan, y de empresas que piden presupuesto a medida.

## Positioning

Una persona (no una agencia) que diseña **y** programa: desde una landing simple hasta tiendas con carrito, panel de administración, cuentas de usuario y pagos online. Trato directo por WhatsApp, precios de referencia públicos y mantenimiento mensual opcional.

## Operating Context

- El visitante suele entrar desde el celular, con un link de WhatsApp o de un anuncio de WhatsApp Business.
- Decide comparando los proyectos que ve y los precios "desde".
- La venta se cierra en una conversación de WhatsApp (+54 299 556-0164, `https://wa.me/542995560164`).
- Publicado en GitHub Pages (`matiaslopez237.github.io/Portfolio`).

## Capabilities and Constraints

- Sitio estático: `index.html` + `style.css`, sin framework ni build. Tipografías de Google Fonts.
- Analítica con PostHog (snippet en `<head>`); se mantiene.
- Formulario de contacto con Formspree (`action="https://formspree.io/f/xojbrbwd"`, campos `nombre`, `contacto`, `proyecto`). No se puede romper.
- **Planes** (precios de referencia en ARS, se cotiza según el proyecto):
  - Landing Page — desde $150.000
  - Tienda WhatsApp — desde $350.000
  - Tienda con pagos — desde $900.000
  - Los tres planes incluyen "Estadísticas de visitas y comportamiento" (HU-07, 2026-11-07).
  - Se muestran como "Desde $X" con la aclaración de que el precio final depende del proyecto. **Sin descuentos permanentes** (se sacó el 15% OFF).
  - Debajo de los planes: aviso para empresas y proyectos a medida, con presupuesto por WhatsApp.
- Mantenimiento mensual ofrecido aparte (~$25.000 ARS/mes); no es obligatorio mostrarlo en el sitio.

## Brand Commitments

- Nombre: **Matias Lopez**, como firma personal ("por Matias Lopez") de la marca del estudio definida en `## Marca`. Título: **Ing. en Sistemas (UTN San Rafael)**, sin mencionar el año de cursada.
- Voz: español rioplatense con voseo ("contame", "escribime"), cercano pero profesional. Nada de jerga técnica cuando le habla al cliente chico.
- El mensaje principal habla del resultado para el negocio del cliente. El nombre de Matias va como firma y hay una línea secundaria para empresas.
- Sin foto personal (decisión del usuario).
- Personalidad buscada: **moderna y seria**. El usuario siente que el sitio actual parece "proyecto de secundaria" y eso es lo que hay que resolver.

## Marca

Brief de la marca del estudio (HU-01, `docs/specs/HU-01-brief-de-marca.md`). Base para el nombre (HU-02), la identidad visual (HU-03) y las piezas (HU-04 a HU-06).

### Tipo
- Estudio con **nombre propio**: nombre principal corto + descriptor opcional ("Webs").
- Nombre elegido: **Efesto Webs** (provisorio desde el 2026-11-07, hasta que Matias lo confirme). Hefesto, el dios herrero de la mitología griega: el artesano que forja a medida. Dominios libres: `efestowebs.com.ar`, `efesto.com.ar`, `efestowebs.com`. Detalle en `brand/nombres.md` (HU-02).
- Firma personal: **"por Matias Lopez"**. La persona sigue presente (trato directo, Ing. en Sistemas), pero la marca suena a negocio y puede crecer.
- Estilo visual **nuevo**, distinto del portfolio actual. Se define en HU-03.

### Ubicación y alcance
- Base: **San Rafael, Mendoza**.
- Alcance: **toda Argentina**. Se trabaja a distancia por WhatsApp; la zona se menciona como origen ("desde San Rafael, Mendoza") y no como límite.

### Personalidad
- **Sí:** confiable, moderna, simple.
- **No:** infantil, recargada, improvisada.

### Voz
- La de `## Brand Commitments`: español rioplatense con voseo, cercano pero profesional, sin jerga técnica con el cliente chico.
- Confiable: promete solo lo que se cumple (plazos, precios "desde", nada de opiniones inventadas).
- Simple: frases cortas, una idea por mensaje, el resultado para el negocio primero.

### Canales
- **Instagram** de la marca (nuevo): vidriera de trabajos y punto de contacto.
- **WhatsApp Business** con un **número aparte** del personal: donde se cierra la venta. El número se carga en HU-05.
- **Portfolio** (`matiaslopez237.github.io/Portfolio`, o un dominio propio si se compra): pasa a ser la web de la marca en HU-06.

### Pistas para nombre y estilo
- **Nombre (HU-02):** una palabra, fácil de decir por teléfono y de escribir sin errores, sin referencias locales (el alcance es todo el país) y que funcione en español. Que se pueda conseguir el @ de Instagram y el dominio `.com.ar`.
- **Estilo (HU-03):** que transmita confianza y orden (nada infantil), con pocos elementos y bien resueltos (nada recargado) y un acabado prolijo en cada detalle (nada improvisado). Sin referencias visuales previas: se proponen 3 direcciones para elegir viendo.

## Evidence on Hand

Proyectos reales, en el orden en que deben mostrarse:

1. **Bacssa** — landing institucional para una empresa de servicios de Oil & Gas (campamentos, logística, mantenimiento en el sur). En etapa final de correcciones; va a ser su página oficial. Link provisorio: `https://matiaslopez237.github.io/Bacssa/`. Caso destacado.
2. **Zenti** — tienda online de tecnología (Next.js + backend propio con pagos), hecha para un conocido. Prácticamente terminada. Link: `https://app-zenti-front.onrender.com` (Render gratis: puede tardar en despertar o estar caído). Dominio previsto: zenti.com.ar.
3. **Quiropraxia Cipolletti** — sitio para un negocio de salud real, con dominio propio: `https://quiropraxiacipolletti.com`.
4. **Sistema de tienda con panel de administración** — carrito, cuentas de usuario, panel para cargar productos y base de datos. Hecho para Centro Médico Santo Domingo pero no llegó a usarse: se muestra **sin el nombre del cliente**. Link: `https://ecommerce-5bt9.onrender.com` (Render gratis).
5. **Café** — proyecto de muestra (no es un cliente). Se presenta como "Proyecto de muestra". Link: `https://coffea-front.onrender.com` (Render gratis).

Los proyectos en Render gratis deben avisar que pueden tardar unos segundos en cargar.

**Ausencias que no se pueden inventar:** no hay testimonios ni opiniones de clientes. **Nunca inventar opiniones, cifras de resultados ni logos de clientes.** La confianza se construye con datos concretos y verificables de cada proyecto (dominio propio, panel de carga de productos, pagos online, etc.). Si el usuario consigue opiniones reales, se agrega una sección después.

## Product Principles

1. **Llevar a WhatsApp.** Cada sección debería acercar al visitante a escribir; el resto es apoyo.
2. **Mostrar, no decir.** El trabajo real (capturas, links, funcionalidades concretas) pesa más que los adjetivos.
3. **Honestidad antes que brillo.** Solo afirmaciones comprobables: nada de opiniones inventadas, descuentos eternos ni proyectos de muestra presentados como clientes.
4. **Hablarle al negocio chico sin espantar a la empresa.** El mensaje principal es simple y orientado a resultados, y siempre hay una puerta visible para proyectos a medida.
5. **Pensado primero para el celular.** La mayoría llega desde WhatsApp en el teléfono.
