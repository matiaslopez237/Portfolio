# language: es
@HU-12
Característica: Sitio Forja: hero animado, barra de metal y placas
  Como dueño del estudio
  quiero que el portfolio tenga el diseño Forja que aprobé en el prototipo
  para que quien llegue desde Instagram reconozca la marca.

  @CA-12.2 @normal
  Escenario: El inicio muestra el taller y el logo 3D, con el molde vacío en la barra
    Dado que abro el portfolio en la compu
    Entonces se ven la foto del taller y el logo 3D en el inicio
    Y el símbolo de la barra está vacío y se ve el molde

  @CA-12.3 @normal
  Escenario: Nada tapa el título ni el botón de WhatsApp durante la animación
    Dado que abro el portfolio en la compu
    Entonces al 0, 30, 60 y 100% del hero el botón de WhatsApp se puede tocar y el título no está tapado

  @CA-12.4 @normal
  Escenario: El logo encastra en la barra
    Dado que abro el portfolio en la compu
    Cuando bajo hasta pasar el hero
    Entonces el logo 3D terminó sobre el símbolo de la barra
    Y el símbolo plano de la barra se ve

  @CA-12.5 @limite
  Escenario: Con movimiento reducido el logo no vuela
    Dado que abro el portfolio con movimiento reducido
    Cuando bajo hasta pasar el hero
    Entonces el logo 3D no se movió
    Y el símbolo plano de la barra se ve

  @CA-12.6 @limite
  Escenario: Celular de 375 px
    Dado que abro el portfolio en un celular de 375 px
    Entonces no hay scroll horizontal
    Y no hay errores en la consola
    Y el logo 3D no tapa el título
    Y el nombre de la barra está en una sola línea

  @CA-12.7 @normal
  Escenario: La barra se calienta con el mouse y con el teclado
    Dado que abro el portfolio en la compu
    Cuando paso el mouse por el link "Planes"
    Entonces el link "Planes" queda caliente
    Cuando llevo el foco con el teclado al link "Contacto"
    Entonces el link "Contacto" queda caliente

  @CA-12.8 @normal
  Escenario: Secciones como placas remachadas y sin la aclaración de carga
    Dado que abro el portfolio en la compu
    Entonces cada sección es una placa con remaches
    Y la página no dice "Puede tardar unos segundos en cargar"
