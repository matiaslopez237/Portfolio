# language: es
@HU-06
Característica: Portfolio con la marca Hefesto Webs
  Como dueño del estudio
  quiero que el portfolio se vea y se presente como Hefesto Webs
  para que quien llegue desde Instagram o WhatsApp reconozca la misma marca y confíe.

  Antecedentes:
    Dado que abro el portfolio en la compu

  @CA-06.1 @normal
  Escenario: Colores y tipografías de la marca
    Entonces el fondo de la página es "#1B2128"
    Y el botón principal de WhatsApp usa el acento "#FF7A1A"
    Y los títulos usan la tipografía "Archivo"
    Y el texto usa la tipografía "Public Sans"

  @CA-06.2 @normal
  Escenario: Logo y nombre en el encabezado
    Entonces el encabezado muestra el logo de Hefesto Webs
    Y el título de la pestaña incluye "Hefesto Webs"

  @CA-06.3 @normal
  Escenario: Metadatos para compartir y buscadores
    Entonces "og:site_name" incluye "Hefesto Webs"
    Y la imagen "og:image" de la marca existe y mide 1200x630
    Y el JSON-LD nombra el servicio "Hefesto Webs"
    Y el favicon es el símbolo de la marca

  @CA-06.4 @normal
  Escenario: El formulario de contacto sigue igual
    Entonces el formulario envía a "https://formspree.io/f/xojbrbwd"
    Y tiene los campos "nombre", "contacto" y "proyecto"

  @CA-06.5 @normal
  Escenario: Link a Instagram
    Entonces el pie tiene un link a "https://www.instagram.com/efestowebs/" que abre en otra pestaña
    Y la sección de contacto tiene un link a "https://www.instagram.com/efestowebs/"

  @CA-06.6 @limite
  Escenario: Celular de 375 px
    Dado que abro el portfolio en un celular de 375 px
    Entonces no hay scroll horizontal
    Y no hay errores en la consola

  @CA-06.7 @normal
  Escenario: Un solo número de WhatsApp
    Entonces todos los links de WhatsApp usan el mismo número
