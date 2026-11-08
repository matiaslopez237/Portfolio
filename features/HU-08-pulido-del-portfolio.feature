# language: es
@HU-08
Característica: Pulido del portfolio
  Como dueño del estudio
  quiero que el portfolio muestre el precio rápido, tenga más personalidad de marca y se vea prolijo
  para que quien entra entienda la oferta enseguida y recuerde a Efesto Webs.

  @CA-08.1 @normal
  Escenario: El precio va debajo del nombre del plan
    Dado que abro el portfolio en la compu
    Entonces en cada plan el precio está justo después del nombre
    Y cada plan muestra su precio una sola vez
    Y el botón de WhatsApp es lo último de cada plan

  @CA-08.2 @limite
  Escenario: Precio cerca del nombre en el celular
    Dado que abro el portfolio en un celular de 375 px
    Entonces en cada plan el precio está a menos de 200 px del nombre

  @CA-08.3 @normal
  Escenario: Símbolo de la marca en el inicio
    Dado que abro el portfolio en la compu
    Entonces el inicio tiene el símbolo de la marca como decoración
    Y el símbolo no tapa el título

  @CA-08.4 @normal
  Escenario: Pasos con números grandes
    Dado que abro el portfolio en la compu
    Entonces los 4 números de "Cómo trabajo" miden al menos 56 px y usan "Archivo"

  @CA-08.5 @normal
  Escenario: Separadores alineados con el contenido
    Dado que abro el portfolio en la compu
    Entonces las líneas entre secciones están alineadas con el contenido

  @CA-08.6 @limite
  Escenario: El botón flotante no tapa el pie
    Dado que abro el portfolio en un celular de 375 px
    Cuando bajo hasta el final
    Entonces el botón flotante no tapa el último link del pie
