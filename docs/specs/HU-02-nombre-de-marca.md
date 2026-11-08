# HU-02: Nombre de la marca

**Historia:** Como dueño del estudio, quiero un nombre corto, fácil de decir y con el @ y el dominio disponibles, para registrar la marca en Instagram, WhatsApp y la web sin variantes raras.
**Estado de la spec:** Aprobada

## Objetivo
Proponer candidatos de nombre que cumplan el brief (`PRODUCT.md` › `## Marca`), verificar su disponibilidad con fuentes reales y que Matias elija uno. El resultado queda en `brand/nombres.md` y el nombre elegido en `PRODUCT.md`.

## Reglas
- **RN-02.1 (formato):** un nombre principal de una palabra, de 4 a 9 letras, sin tildes, sin ñ, sin números ni guiones. Puede llevar un descriptor como "Webs" (ej. "Efesto Webs"): el @ y el dominio van todo junto (`efestowebs`). *(Modificada el 2026-11-07: antes era una sola palabra sin descriptor.)*
- **RN-02.2 (decirlo y escribirlo):** que al dictarlo por teléfono se escriba de una sola forma (evitar dudas tipo b/v, s/c/z, h muda o letras dobles), y que se pronuncie igual de cómo se escribe.
- **RN-02.3 (brief):** que transmita confiable, moderna y simple, y nada infantil, recargado ni improvisado. Sin referencias locales, porque el alcance es todo el país. Que funcione en español.
- **RN-02.4 (disponibilidad, sin inventar):** cada dato de disponibilidad lleva su fuente y fecha. Lo que no se puede comprobar desde acá se marca **"a confirmar"**, nunca "libre".
  - `.com.ar`: RDAP de NIC Argentina.
  - `.com`: RDAP de Verisign.
  - `@` de Instagram: Instagram no deja comprobarlo sin una cuenta, así que va "a confirmar" salvo que el perfil exista a la vista.
  - Choque con marcas: búsqueda web de estudios o agencias con el mismo nombre en Argentina. El INPI no se puede consultar automáticamente, así que queda "a confirmar".
- **RN-02.5:** Registrar el @, reservar el nombre en WhatsApp y comprar el dominio lo hace Matias. La IA no crea cuentas ni paga.

## Casos límite
- **El `.com.ar` está libre pero el `.com` no:** se acepta si el `.com` no es de un estudio web (se anota quién lo usa). Si es del mismo rubro, se descarta.
- **El @ exacto está tomado:** se anota una variante aceptable (`nombre.estudio`, `nombreweb`, `holanombre`) sin descartar el nombre, y se aclara.
- **Ningún candidato pasa los filtros:** se arma una segunda tanda, sin bajar las reglas.
- **El nombre que le gusta a Matias no está en la lista:** se evalúa con las mismas reglas y se suma a la tabla.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-02.1 | Dado `brand/nombres.md`, entonces tiene una tabla de entre 12 y 15 candidatos, cada uno con una línea de por qué | Chequeo automático |
| CA-02.2 | Dado cada candidato, entonces cumple el formato de RN-02.1 | Chequeo automático |
| CA-02.3 | Dada la lista corta (3 a 5 nombres), entonces cada uno tiene el estado de `.com.ar`, `.com`, `@` e INPI (libre, ocupado o a confirmar) | Chequeo automático |
| CA-02.4 | Dado un dato marcado "libre" u "ocupado", entonces tiene fuente y fecha | Chequeo automático |
| CA-02.5 | Dada la lista corta, cuando Matias elige, entonces el nombre elegido queda en `PRODUCT.md` › `## Marca` › Tipo | Chequeo automático |
| CA-02.6 | Dado el nombre elegido, entonces Matias lo siente propio y lo puede decir sin vergüenza al presentarse | Checklist |
| CA-02.7 | Dado el nombre elegido, cuando Matias lo registra, entonces el @ y el dominio quedan a su nombre (o anota la variante que consiguió) | Checklist |

## Checklist (lo firma Matias)
- [x] CA-02.6: ¿El nombre te representa y lo decís cómodo? — firmado: Matias, 2026-11-08 ("el nombre me cierra")
- [ ] CA-02.7: ¿Registraste el @ y el dominio (o anotaste la variante)? — firmado: (parcial: @efestowebs registrado el 2026-11-08; falta el dominio efestowebs.com.ar)

## Preguntas abiertas
- ~~¿Algún nombre en mente?~~ Respondido: no, se empieza de cero.

## Historial
- 2026-11-07: creada.
- 2026-11-07: aprobada por Matias (sin nombre previo en mente).
- 2026-11-07: el `.com` deja de ser requisito (pedido de Matias): se informa en la tabla pero no descarta nombres; alcanza con `.com.ar` libre.
- 2026-11-07: dirección elegida por Matias: mitología (griega) y herrería; no le gustan las palabras comunes en español. RN-02.1 permite un descriptor tipo "Webs" (pedido de Matias: "Efesto Webs").
- 2026-11-08: Matias firma CA-02.6 ("Efesto Webs" deja de ser provisorio). CA-02.7 parcial: @efestowebs creado; dominio pendiente.
