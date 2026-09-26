# Diagnóstico del portfolio: lista unificada

Junta los resultados de `/impeccable critique` (16/32), `/impeccable audit` (8/20) y `/redesign-existing-projects` en modo auditoría. Punto de partida: commit `6117feb`.

## Prioridad ALTA (lo que más pesa en ventas y seriedad)

1. **WhatsApp como acción principal.** Hoy el botón principal del hero es "Ver proyectos", "Consultar" lleva al formulario y WhatsApp aparece recién al final, como segunda opción. Propuesta:
   - botón de WhatsApp como acción principal del hero;
   - los "Consultar" de cada plan abren WhatsApp con un mensaje ya escrito ("Hola Matias, me interesa la Landing Page");
   - botón fijo de WhatsApp en el celular;
   - el formulario queda como alternativa.
2. **Sacar los efectos que dan "proyecto de secundaria":** robot 3D, ondas animadas de fondo (con su librería externa), brillo que sigue al mouse, grilla de "+", resplandores violeta, texto con degradado en el nombre y puntito que titila. Además gastan batería y siguen moviéndose aunque el usuario pida "reducir movimiento".
3. **Proyectos con trabajo real:**
   - capturas reales en marco de compu y celular, en lugar de dibujos;
   - orden: Bacssa → Zenti → Quiropraxia → Sistema de tienda con panel (sin nombre del cliente) → Café "Proyecto de muestra";
   - datos concretos en cada uno (dominio propio, panel para cargar productos, pagos online);
   - aviso "puede tardar unos segundos en cargar" en los que están en Render.
4. **Hero nuevo:** un título que hable del negocio del cliente, tu nombre chico como firma, una línea para empresas, "Ing. en Sistemas" sin el año y capturas de Bacssa y Quiropraxia (compu y celular).
5. **Tarjetas de precios que se salen de la pantalla** en el celular y en compus de 1000 a 1250px. Se corta el botón y el menú queda fuera de la pantalla. Es un error, no una opinión.
6. **Precios honestos y más livianos:**
   - "Desde $255.000 / $500.000 / $800.000", sin el 15% OFF;
   - sacar "Más popular", que no se puede comprobar;
   - resolver el choque entre "Sin costos ocultos" y la nota del mantenimiento;
   - menos información por tarjeta;
   - franja "¿Sos empresa o necesitás algo a medida?" con botón a WhatsApp.
7. **Nueva identidad visual seria:**
   - tipografía con carácter en lugar de Inter (la más usada de todas);
   - paleta oscura centralizada con el violeta solo en detalles;
   - botones con buen contraste (hoy el blanco sobre violeta no llega al mínimo, y el blanco sobre verde WhatsApp tampoco).

## Prioridad MEDIA

8. **Unificar Servicios y Planes.** Hoy son 6 tarjetas de servicios sin botón más 3 planes: dos formas de ordenar lo mismo, y el cliente no sabe cuál es "la suya". Propuesta: achicar Servicios a una línea de rubros ("Trabajo con comercios, salud, gastronomía, inmobiliarias…") o fusionarlo con los planes.
9. **Proceso más corto:** 7 pasos con una fila despareja y frases genéricas ("código limpio"). Proponemos 4 pasos claros.
10. **Sacar la jerga:** "UI/UX", "responsive", "SEO básico", etiquetas "React". Mejor hablar de lo que gana el cliente.
11. **Texto demasiado chico:** 12 lugares con 10 a 11px (etiquetas, "En vivo", "ARS · precio desde"). Mínimo 12-13px.
12. **Formulario:** que avise "enviado" o "hubo un error" dentro de la página, sin mandar al visitante a la página de Formspree. Hay que mantener el action y los nombres de los campos.
13. **Etiquetitas sobre cada título** ("Lo que hago", "Mi trabajo", "Inversión"…) e íconos en cuadradito arriba de cada tarjeta: son el sello genérico.
14. **Estructura:** agregar `<main>`, un link "saltar al contenido" y cambiar `100vh` por `100dvh` en el hero para que no salte en el celular.

## Prioridad BAJA

15. Imagen para compartir el link por WhatsApp (`og:image`) y una descripción para Google que no diga "Creá páginas web". Se hace en la Fase 6 con `/seo`.
16. Pie de página con mail, zona ("Neuquén / Río Negro") y horario. Solo si me pasás esos datos.
17. Estados de toque en los botones: hoy tienen efecto al pasar el mouse, pero no al apretar.
18. Limpieza: estilos que ya no se usan (`.precios-grid`), 14 radios de borde distintos, números decorativos "01…06" invisibles.
19. Títulos parejos (`text-wrap: balance`), para que no quede una palabra sola en la última línea.
