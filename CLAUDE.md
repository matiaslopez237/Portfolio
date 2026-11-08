# Portfolio · Matias Lopez

Portfolio y página de venta de páginas web (sitio estático: `index.html` + `style.css`), publicado en GitHub Pages (`matiaslopez237.github.io/Portfolio`). Contexto del producto en `PRODUCT.md`.

**Forma de trabajo:** modo **liviano** (SDD + verificación por criterios; BDD y TDD solo en las historias con código). Guía: `docs/METODOLOGIA.md`.

## Reglas para Claude

1. **Explicá cada cambio:** qué cambiaste, por qué y cómo verificarlo, en lenguaje simple.
2. **No inventes reglas ni datos** (opiniones de clientes, cifras, disponibilidad de nombres). Si la spec no lo define, preguntá.
3. **No arranques una historia sin spec aprobada** (`docs/specs/HU-XX-*.md`, skill `sdd-spec` en modo corto).
4. **En las historias con código: test primero** (skills `bdd` y `tdd`).
5. **No hagas `git push`, ni publiques, ni toques cuentas (Instagram, WhatsApp, dominios), sin confirmación explícita.**
6. Escribí en español.

## Del proyecto (no romper)

- **Formulario de contacto (Formspree):** mantener `action="https://formspree.io/f/xojbrbwd"` y los campos `nombre`, `contacto` y `proyecto`.
- **PostHog:** el snippet del `<head>` se mantiene.
- **Proyectos reales y precios:** los de `PRODUCT.md`. Nada de opiniones inventadas ni descuentos permanentes.

## Flujo por historia

1. **Spec corta** → `docs/specs/HU-XX-*.md` (`sdd-spec`, modo corto). Esperar OK.
2. **Hacer el trabajo.**
3. **Verificar cada criterio:**
   - Lo medible → chequeo en `scripts/check.mjs` con el ID `CA-XX.N` en cada línea (`npm run check`).
   - Lo de gusto → checklist en la spec, que firma Matias con fecha.
   - Historias con código → `.feature` + tests en rojo primero, commits `[RED]` → `[GREEN]` (`bdd`, `tdd`).
4. **Trazabilidad** simple en `docs/trazabilidad.md` (`trazabilidad`, modo liviano).
5. **Mostrar** el resultado (captura) y resumir en 3 a 5 líneas.

## Convenciones

**IDs:** `HU-XX` · `RN-XX.N` · `CA-XX.N` · `DEF-XX`.

**Commits:** `docs(HU-XX): spec ...` · `feat(HU-XX): ...` · `fix(DEF-XX): ...` · `chore: ...`. En historias con código: `test(HU-XX): [RED] ...` → `feat(HU-XX): [GREEN] ...`.

## Estructura

```
index.html, style.css      # el sitio
assets/                    # imágenes (capturas de proyectos, og.jpg)
brand/                     # marca: logo, guía, piezas de Instagram y WhatsApp
scripts/check.mjs          # chequeos automáticos de criterios (modo liviano)
features/                  # escenarios BDD (.feature) de las historias con código
features/steps/            # steps de cucumber + Playwright
docs/specs/                # specs por historia
docs/trazabilidad.md       # matriz
```

## Comandos

```bash
py -m http.server 8080        # servidor local (o el "portfolio-light-preview" de .claude/launch.json)
npm test                      # escenarios BDD (cucumber + Playwright, necesita el servidor en :8080)
npx cucumber-js --tags @HU-06 # una historia sola
npm run check                 # chequeos automáticos de criterios
```

## Definition of Done (por historia)

- Spec aprobada.
- Cada criterio verificado: chequeo en verde, checklist firmado, o escenario/test en verde.
- En historias con código: commits RED → GREEN en el historial.
- Trazabilidad actualizada.
- Resultado revisado por Matias.

## Design System
Leé `DESIGN.md` antes de cualquier decisión visual o de interfaz: tipografías, colores, espaciado y estilo de la marca **Efesto Webs** están definidos ahí (valores exactos en `brand/tokens.json`, guía en `brand/marca.html`).
No te apartes sin aprobación explícita de Matias. El portfolio publicado todavía usa el estilo anterior hasta la HU-06; en QA, marcá lo que no coincida con `DESIGN.md` una vez aplicada.
