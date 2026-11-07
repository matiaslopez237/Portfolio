# Mi forma de trabajar: SDD + BDD + TDD

Guía para arrancar cualquier proyecto con la misma forma de trabajo. Sale de lo que funcionó en el TP de Ingeniería de Software. La aplica la skill `/iniciar-proyecto`.

## La idea en una línea

**Primero se decide qué tiene que pasar, después cómo se comprueba y recién al final se hace.**

```
Historia → Spec → Criterios de aceptación → Escenarios BDD → Tests → Código
```

Cada paso lleva el mismo ID (`HU-XX`, `CA-XX.N`). Así, de cualquier línea de código se puede volver a la decisión que la originó, y al revés.

## Los tres métodos, en simple

| Método | Qué es | Qué te da |
| --- | --- | --- |
| **SDD** (desarrollo guiado por specs) | Antes de hacer algo se escribe qué tiene que hacer: entradas, reglas, casos raros, errores y criterios para darlo por terminado | Se decide una sola vez y no se rehace. La IA no inventa reglas |
| **BDD** (desarrollo guiado por comportamiento) | Los criterios se escriben como ejemplos "Dado… cuando… entonces…" y se automatizan | Una forma de comprobar que funciona que entiende cualquiera, no solo un programador |
| **TDD** (desarrollo guiado por tests) | Se escribe el test, se ve que falla (RED), se hace el código mínimo para que pase (GREEN) y se ordena (REFACTOR) | El código hace lo que dice la spec, y queda la prueba en el historial de git |

## ¿Qué modo uso?

| | **Completo** | **Liviano** |
| --- | --- | --- |
| Para | Software con reglas de negocio, en equipo o para entregar | Diseño, marca, landing, flyer o un sitio chico, trabajando solo |
| Ejemplos | TP de Ingeniería de Software, Zenti, Ecommerce, el bot de WhatsApp | Una marca, un portfolio, una landing para un cliente, piezas de Instagram |
| Spec | Completa: 8 secciones | Corta: objetivo, reglas, casos límite y criterios |
| Criterios | Todos con un escenario BDD automatizado (o `@manual` justificado) | Lo medible, con un script de chequeo; lo de gusto, con un checklist que firmás vos |
| BDD | Gherkin + godog (Go) o cucumber + Playwright (web) en todas las historias | Solo en las historias que tocan código |
| TDD | Obligatorio en el núcleo, con commits `[RED]` → `[GREEN]` → `[REFACTOR]` | Solo en las partes con código |
| Trazabilidad | Matriz completa con commits | Matriz simple: criterio → cómo se verifica → estado |
| Scrum | Opcional: backlog, planning, review y retro | No |

**Regla práctica:** si un error le cuesta plata o datos a alguien (pagos, cuentas, cálculos), va completo. Si un error es "no me gusta cómo se ve", va liviano.

Un proyecto liviano que crece se pasa a completo con `/iniciar-proyecto subir-a-completo`, sin perder nada.

## IDs (iguales en todos los archivos)

| ID | Qué es | Dónde aparece |
| --- | --- | --- |
| `HU-XX` | Historia de usuario | Nombre de la spec, tag `@HU-XX`, commits |
| `RN-XX.N` | Regla de negocio | Spec; código con `Implementa HU-XX (RN-XX.N)` |
| `CA-XX.N` | Criterio de aceptación | Spec, tag `@CA-XX.N`, nombre del test, chequeo del script |
| `DEF-XX` | Defecto (bug) | Commit `fix(DEF-XX)`, spec afectada |

## Flujo por historia

1. **Refinar:** si hay dudas, usar `/grill-me`.
2. **Spec** en `docs/specs/HU-XX-nombre.md` con la skill `sdd-spec`. **Se espera tu OK.**
3. **Escenarios** en `features/HU-XX-nombre.feature` con la skill `bdd`. Arrancan en rojo.
4. **TDD** con la skill `tdd`: test que falla → código → ordenar, con un commit por etapa.
5. **Interfaz y detalles** sobre lo que ya está probado.
6. **Revisión:** `/review` o el revisor del lenguaje.
7. **Trazabilidad** con la skill `trazabilidad`, antes de cerrar.

En modo liviano, los pasos 3 y 4 se reemplazan por el script de chequeo y el checklist, salvo en las historias con código.

## Commits

```
docs(HU-04): spec de planning poker
test(HU-04): [RED] votos ocultos hasta cerrar la ronda
feat(HU-04): [GREEN] ocultar votos hasta cerrar la ronda
refactor(HU-04): [REFACTOR] extraer cálculo de dispersión
fix(DEF-03): velocidad con sprint sin historias
chore: configuración del proyecto
```

No aplastar (squash) los commits RED/GREEN/REFACTOR: son la evidencia de TDD.

## Reglas para la IA (van en el `CLAUDE.md` de cada proyecto)

1. **Explicar cada cambio:** qué, por qué y cómo verificarlo.
2. **No inventar reglas.** Si la spec no lo dice, preguntar.
3. **No hacer nada sin spec aprobada.**
4. **Test primero** donde el modo lo pide.
5. **No hacer push, ni publicar, ni tocar cuentas o tableros sin confirmación.**
6. **Todo en español.**

## Definición de terminado

- Spec aprobada.
- Cada criterio verificado: escenario o test en verde, o chequeo del script en verde, o checklist firmado.
- En las partes con código, commits RED → GREEN en el historial.
- Trazabilidad actualizada y sin huecos sin justificar.
- Revisado por vos (y, si hay equipo, por otro integrante en el PR).

## Qué cuenta como "test" cuando no hay código

| Tipo de criterio | Cómo se verifica |
| --- | --- |
| Tamaños, formatos, archivos que tienen que existir | Script de chequeo (`npm run check`) con el ID del criterio en cada línea |
| Contraste, textos con largo máximo, links correctos | Script de chequeo |
| "Se lee bien", "me representa", "se ve coherente" | Checklist en la spec que firmás vos, con fecha |
| Algo que se hace en otra app (Instagram, WhatsApp, NIC) | Checklist `@manual`, con lo que hay que hacer paso a paso |
