# language: es
@HU-17
Característica: Reels con formatos probados (R3 a R6)
  Como dueño del estudio
  quiero 4 reels armados sobre formatos que ya funcionan en cuentas chicas
  para llegar a gente que no me conoce y que me escriban por WhatsApp.

  Los escenarios revisan los archivos que genera
  node brand/instagram/reels/render.mjs <reel> (el MP4, subtitulos.json y telefono.json)
  y los textos de brand/instagram/textos.md. No necesitan el servidor del sitio.

  @CA-17.1
  Esquema del escenario: El video del reel <reel> cumple el formato
    Dado el reel "<reel>"
    Entonces el video es un MP4 H.264 de 1080×1920
    Y dura entre 10 y 22 segundos
    Y pesa menos de 20 MB

    Ejemplos:
      | reel |
      | R3   |
      | R4   |
      | R5   |
      | R6   |

  @CA-17.2
  Esquema del escenario: El gancho del reel <reel> se lee en los primeros 3 segundos
    Dado el reel "<reel>"
    Entonces el gancho se ve desde el segundo 0
    Y la primera línea del guion termina antes de los 3 segundos

    Ejemplos:
      | reel |
      | R3   |
      | R4   |
      | R5   |
      | R6   |

  @CA-17.3
  Esquema del escenario: Subtítulos, teléfono y cierre del reel <reel>
    Dado el reel "<reel>"
    Entonces cada subtítulo dura al menos 1,5 s y tiene 12 palabras o menos
    Y el teléfono, si aparece, queda dentro de la zona segura sin tapar el subtítulo
    Y el último tramo de 3 s o más es el cierre con el WhatsApp y @hefestowebs

    Ejemplos:
      | reel |
      | R3   |
      | R4   |
      | R5   |
      | R6   |

  @CA-17.4
  Esquema del escenario: El texto del reel <reel> se encuentra en la búsqueda
    Dado el reel "<reel>"
    Entonces su texto en textos.md tiene entre 3 y 5 hashtags
    Y nombra su palabra clave en los primeros 125 caracteres

    Ejemplos:
      | reel |
      | R3   |
      | R4   |
      | R5   |
      | R6   |

  @CA-17.5
  Escenario: El R6 regala la lista para revisar tu web
    Dado el reel "R6"
    Entonces la lista para revisar tu web existe y mide 1080×1350
    Y su texto pide comentar "PÁGINA"

  @CA-17.9
  Esquema del escenario: El reel <reel> arranca con un golpe, sin silencio
    Dado el reel "<reel>"
    Entonces la voz arranca antes de los 0,5 segundos
    Y en el primer cuadro ya hay texto a la vista
    Y el texto entra golpeando y salen chispas en el primer medio segundo

    Ejemplos:
      | reel |
      | R3   |
      | R5   |
      | R6   |
