# language: es
@HU-05
Característica: Número nuevo de WhatsApp Business en el portfolio
  Como dueño del estudio
  quiero que el portfolio use el número de WhatsApp de Efesto Webs
  para que todas las consultas lleguen al número del estudio.

  @CA-05.1 @normal
  Escenario: Todos los links usan el número nuevo
    Dado que abro el portfolio en la compu
    Entonces todos los links de WhatsApp van a "5492604661138"
    Y el teléfono del JSON-LD es "+54 9 260 466-1138"

  @CA-05.1 @error
  Escenario: El número viejo no aparece en ningún lado
    Dado que abro el portfolio en la compu
    Entonces la página no contiene "2995560164" ni "299 556-0164"
