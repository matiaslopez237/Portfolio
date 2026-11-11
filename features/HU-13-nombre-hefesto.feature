# language: es
@HU-13
Característica: El sitio se presenta como Hefesto Webs
  Como dueño del estudio
  quiero que la marca se escriba "Hefesto Webs"
  para que el nombre sea correcto y la gente lo encuentre como lo conoce.

  @CA-13.2 @normal
  Escenario: Nombre nuevo en el sitio y sus metadatos
    Dado que abro el portfolio en la compu
    Entonces el título de la pestaña incluye "Hefesto Webs"
    Y "og:site_name" incluye "Hefesto Webs"
    Y el JSON-LD nombra el servicio "Hefesto Webs"
    Y el logo de la navegación se llama "Hefesto Webs"
