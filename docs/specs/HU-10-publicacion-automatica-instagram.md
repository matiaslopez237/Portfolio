# HU-10: Publicación automática en Instagram

**Historia:** Como dueño del estudio, quiero que los posts del calendario se publiquen solos en @efestowebs, para mantener el ritmo sin tener que subir cada imagen a mano.
**Estado de la spec:** Aprobada

## Objetivo
Que cada post del calendario se publique solo en su fecha, a las 19 (hora de Argentina), sin intervención de Matias:
1. **Imágenes públicas:** las imágenes de los posts se publican en GitHub Pages, porque Instagram necesita leerlas desde una dirección pública.
2. **Script de publicación:** `scripts/publicar-instagram.mjs` busca en el calendario qué post toca hoy, toma su imagen y su texto de `textos.md` y lo publica con la API oficial de Instagram (Instagram Graph API, publicación de contenido).
3. **Corrida diaria:** un workflow de GitHub Actions corre el script todos los días a las 19 (22:00 UTC).

## Entradas
- `brand/instagram/calendario.md`: fecha → post (fuente única de qué sale y cuándo).
- `brand/instagram/textos.md`: texto de cada post.
- `brand/instagram/posts/post-N.png`: imagen de cada post.
- **Secrets de GitHub (los carga Matias):** `IG_USER_ID` y `IG_ACCESS_TOKEN`.

## Reglas
- **RN-10.1 (una sola fuente):** qué se publica y cuándo sale solo de `calendario.md`. El texto sale solo de `textos.md`. Nada se escribe dentro del script.
- **RN-10.2 (no duplicar):** un post que ya está publicado o programado no se vuelve a publicar. Se registra en `brand/instagram/publicados.json`, y los posts 1 a 3 se marcan como "programados a mano en Meta Business Suite".
- **RN-10.3 (secretos):** el token nunca se escribe en el código, en el repositorio ni en los logs. Lo carga Matias en GitHub › Settings › Secrets. La IA no lo ve ni lo pega.
- **RN-10.4 (modo prueba):** con `--prueba`, el script muestra qué publicaría (post, imagen, texto, URL) sin llamar a Instagram. Los tests corren siempre así.
- **RN-10.5 (fallas visibles):** si Instagram rechaza la publicación o el token venció, el workflow falla en rojo y GitHub le manda un mail a Matias. No se reintenta en loop.
- **RN-10.6 (días sin post):** si hoy no hay post en el calendario (ni uno atrasado, ver RN-10.8), el script termina sin hacer nada y sin error.
- **RN-10.9 (horario, DEF-08):** solo se publica entre las **18:00 y las 23:00 de Argentina** (Buzzfy recomienda 19:30 a 20:30 y los posts de madrugada casi no llegan a nadie). El workflow corre cada hora de 12:00 a 20:00 de Argentina (15 a 23 UTC): como GitHub atrasa las corridas, alguna cae dentro del horario. Una corrida fuera del horario no hace nada. Lanzado a mano con una fecha, publica a cualquier hora.
- **RN-10.8 (atrasos de GitHub, DEF-01):** GitHub no garantiza la hora de las tareas programadas (el 16/11 la corrida de las 19:00 arrancó a la 01:19 del día siguiente y no publicó el C2). Por eso cada corrida publica lo de hoy **y lo pendiente de hasta 2 días antes**, del más viejo al más nuevo. Lo de más de 2 días atrás no se publica solo (se lanza a mano). El workflow corre dos veces (18:00 y 19:00 de Argentina); la que llega primero publica y la otra no encuentra nada (RN-10.2).
- **RN-10.7 (cuenta):** crear la app de Meta, conectar @efestowebs y sacar el token lo hace Matias, guiado por la IA. La IA no acepta términos ni otorga permisos por él.

## Casos límite
- **Imagen todavía no publicada en Pages** (por ejemplo, un post nuevo sin push): el script verifica que la URL responda antes de publicar. Si no responde, falla con un mensaje claro.
- **Texto de más de 2.200 caracteres o más de 5 hashtags:** falla antes de llamar a Instagram. (El límite era 30; Instagram lo bajó a 5 por publicación desde el 18-19/12/2025, según medios y el anuncio de @creators: DEF-02.)
- **Dos posts el mismo día en el calendario:** se publican en orden de número.
- **Token por vencer:** el script avisa en el log cuando falten menos de 7 días, si la API informa la fecha de vencimiento.
- **Corrida manual:** el workflow también se puede lanzar a mano desde GitHub, por ejemplo para reintentar un día fallido.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-10.1 | Dado un día con post en el calendario, cuando corre el script en modo prueba, entonces elige ese post, con su imagen y su texto | Test (TDD) |
| CA-10.2 | Dado un día sin post, cuando corre el script, entonces no publica nada y termina sin error | Test (TDD) |
| CA-10.3 | Dado un post que ya figura en `publicados.json`, cuando le toca, entonces no se vuelve a publicar | Test (TDD) |
| CA-10.4 | Dado un texto que supera los límites de Instagram, cuando corre el script, entonces falla antes de publicar | Test (TDD) |
| CA-10.5 | Dada la publicación real (con la API simulada en el test), entonces se llama a crear el contenedor y después a publicarlo, con la URL pública de la imagen y el texto | Test (TDD, API simulada) |
| CA-10.6 | Dado el workflow, entonces corre cada hora de 15:00 a 23:00 UTC (DEF-08), se puede lanzar a mano y usa solo los secrets `IG_USER_ID` y `IG_ACCESS_TOKEN` | Chequeo automático |
| CA-10.9 | Dado un post pendiente de 1 o 2 días antes (DEF-01), cuando corre el script, entonces lo publica, del más viejo al más nuevo; si es de más de 2 días atrás, no | Test (TDD) |
| CA-10.10 | Dada una corrida fuera de las 18:00 a 23:00 de Argentina (DEF-08), entonces no publica nada; dentro de ese horario publica lo de hoy y lo atrasado | Test (TDD) |
| CA-10.7 | Dado el repositorio, entonces no hay ningún token ni clave escrito en los archivos | Chequeo automático |
| CA-10.8 | Dado el post 4 (miércoles 18/11), cuando llega la hora, entonces aparece publicado en @efestowebs sin que Matias haga nada | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-10.8: ¿El post 4 salió solo el miércoles 18 a las 19? — firmado: (pendiente; conexión verificada el 2026-11-14: "Conexión OK con Instagram: @hefestowebs". Primer carrusel automático: C2, lunes 2026-11-16 19:00)

## Preguntas abiertas
- Ninguna. Si la cuenta de Meta pide una página de Facebook para usar la API, se frena y se consulta antes de crearla.

## Historial
- 2026-11-10: creada (opción A: posts 1 a 3 programados a mano, del 4 en adelante automático).
- 2026-11-10: aprobada por Matias.
- 2026-11-10: implementada; 11 tests y 2 chequeos en verde, prueba en seco OK. Falta conectar la app de Meta, cargar los secrets y hacer push.
- 2026-11-14: app de Meta conectada al portfolio, token de usuario del sistema (no vence) y secrets cargados por Matias. Verificación OK y prueba del lunes 16 OK (C2, 6 slides).
- 2026-11-17: **DEF-01** — el C2 (16/11) no salió: GitHub atrasó la corrida programada 6 horas y el script buscó el post del día siguiente. Se publicó a mano (id 18174575107462750). Arreglo: RN-10.8 y CA-10.9 (publica lo atrasado hasta 2 días) y un segundo horario en el workflow.
- 2026-11-17: **DEF-02** — el control de textos permitía 30 hashtags, pero Instagram acepta 5 desde diciembre de 2025: los 12 carruseles tenían 6 o 7 (el C2 salió con 6 sin error de la API). Arreglo: límite de 5 en `validarTexto` y carruseles recortados a 5.
- 2026-11-26: **DEF-08** — GitHub atrasa las corridas 5 a 7 horas: el C4 salió a las 02:08 y el R2 a las 00:56 (22 cuentas alcanzadas en 2 días, contra 182 del R4, que salió a las 22:48). Arreglo: RN-10.9 y CA-10.10 (solo se publica de 18 a 23 de Argentina) y el workflow corre cada hora de 12 a 20.
