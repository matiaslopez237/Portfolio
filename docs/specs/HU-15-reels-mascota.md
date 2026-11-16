# HU-15: Reels con la mascota Hefesto

**Historia:** Como dueño del estudio, quiero reels cortos con una mascota propia que explique cosas de las páginas web, para llegar a gente que todavía no me sigue sin tener que salir yo en cámara ni pagar herramientas.
**Estado de la spec:** Aprobada

## Objetivo
1. **Muñeco animado:** armar a **Hefesto** (la mascota que Matias generó con Gemini el 2026-11-16) como un muñeco 2D que se anima con código, con las partes de `brand/instagram/reels/mascota/hoja-partes.jpg`. Tiene que poder:
   - parpadear
   - "hablar", cambiando la boca al ritmo de los subtítulos
   - respirar con un leve movimiento
   - martillar en el yunque, con chispas
2. **Primer reel:** "3 cosas que tu página tiene que tener", en video 1080×1920 de 15 a 25 segundos, con apertura "hierro al rojo", subtítulos grandes y el cierre de la marca.
3. **Publicación:** que la publicación automática (HU-10) también pueda publicar reels.

## Reglas
- **RN-15.1 (gratis y sin cámara):** sin herramientas pagas ni video de Matias. Gemini (cuenta gratis) solo para las imágenes del personaje; la animación, el montaje y el render los hace el código del proyecto (Playwright + ffmpeg, que es gratis). Si hace falta instalar ffmpeg, se pregunta antes.
- **RN-15.2 (personaje):** Hefesto es una mascota estilizada y no se presenta como una persona real. Los textos hablan en nombre del estudio ("en Hefesto Webs…"), no como si fuera Matias.
- **RN-15.3 (contenido real):** igual que en la HU-14: solo datos reales de `PRODUCT.md` e `index.html`, la voz de `voz-y-tono.md` y el CTA fijo (WhatsApp 260 466-1138 · @hefestowebs).
- **RN-15.4 (voz y música):** la voz de Hefesto se genera con una herramienta de voz por IA **gratuita** (sin cuenta paga), en español rioplatense; la boca y los subtítulos siguen los tiempos de esa voz. Los subtítulos se leen igual sin sonido. Sin música en el video: la agrega Matias al publicar desde la biblioteca de Instagram (o se publica sin música).
- **RN-15.5 (formato):** MP4 H.264, 1080×1920, 30 fps, de 15 a 25 s, menos de 20 MB. Los subtítulos y el contenido importante quedan dentro de la zona segura (fuera de los 250 px de arriba y de abajo).
- **RN-15.6 (identidad):** colores de `brand/tokens.json`, tipografías Archivo y Public Sans, y el estilo Forja.
- **RN-15.7 (publicación):** los reels entran al calendario como filas "Reel" y se publican con la API (`media_type=REELS`). Programar o publicar solo con el OK de Matias.

## Casos límite
- **Las partes no encajan bien** (escalas o bordes distintos): se ajustan en el código. Si no se puede, se pasa al plan simple: 3 imágenes completas del personaje alternadas, con movimiento de cámara.
- **Fondo verde que se filtra en los bordes:** el recorte limpia el borde verde.
- **Instagram tarda en procesar el video:** la publicación espera a que el contenedor esté listo, igual que en la HU-14.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-15.1 | Dadas las partes de la mascota, entonces están recortadas sin fondo verde (PNG con transparencia), una por pieza | Chequeo automático |
| CA-15.2 | Dado el primer reel, entonces es un MP4 de 1080×1920, entre 15 y 25 s y de menos de 20 MB | Chequeo automático |
| CA-15.3 | Dados los subtítulos del reel, entonces cada uno dura al menos 1,5 s, tiene 12 palabras o menos y está dentro de la zona segura | Chequeo automático |
| CA-15.4 | Dado el último tramo del reel, entonces muestra el CTA fijo con el número y @hefestowebs | Chequeo automático |
| CA-15.5 | Dado un reel en el calendario, cuando corre la publicación con la API simulada, entonces crea el contenedor REELS con la URL del video y el texto, espera que esté listo y lo publica | Test (TDD) |
| CA-15.6 | Dado el reel, cuando Matias lo ve en el celular, entonces la mascota se ve bien animada, no da "cosa" y se entiende sin sonido | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-15.6: ¿El reel se ve bien en el celular, la mascota no da "cosa" y se entiende sin sonido? — firmado:

## Preguntas abiertas
- ~~¿Frecuencia?~~ Pendiente de confirmar por Matias: propuesta de 1 reel por semana (miércoles) cuando el primero esté aprobado.

## Historial
- 2026-11-16: creada con la mascota y la hoja de partes generadas por Matias en Gemini.
- 2026-11-16: aprobada por Matias. Cambio pedido: el reel lleva voz generada con IA gratis (RN-15.4). Hoja de partes v2 ().
