# HU-11: Investigación de audiencia y estrategia de contenido

**Historia:** Como dueño del estudio, quiero entender a quién le hablo en Instagram (qué le duele, qué le da miedo y qué lo hace escribirme), para diseñar publicaciones y textos que generen consultas y no solo se vean lindos.
**Estado de la spec:** Borrador

## Objetivo
Armar la base de la estrategia de Instagram antes de rediseñar los posts (HU-12) y hacer reels (HU-13). Se entrega en `brand/instagram/estrategia/`:

| Archivo | Qué tiene |
| --- | --- |
| `objetivos.md` | Qué cuenta como "funcionar" y cómo se mide (consultas por WhatsApp, guardados, compartidos, visitas al perfil) |
| `segmentos.md` | Rubros × madurez digital (sin web / solo Instagram / web vieja) × alcance (local / país) × plan al que apuntan |
| `personas.md` | 3 o 4 user personas, con todos los campos de RN-11.2 |
| `recorrido.md` | Recorrido del cliente (descubre → busca → compara → escribe → compra), con qué contenido sirve en cada etapa |
| `competencia.md` | 8 a 10 cuentas analizadas y los huecos que nadie cubre |
| `voz-y-tono.md` | Ejes de tono, palabras sí/no, fórmulas de ganchos, CTA fijos y respuestas a objeciones |
| `implicancias-diseno.md` | Qué piden las personas al diseño: tamaño de texto, cantidad de texto por slide, intensidad visual y qué rubros mostrar |
| `matriz-de-contenido.md` | Pilar × persona × etapa × formato, con la mezcla semanal propuesta |
| `validacion.md` | Guía de entrevista, registro de entrevistas y mensajes revisados, e hipótesis para medir después de 4 semanas |
| `brand/instagram/estrategia.html` | Página visual con las personas y el resumen, para tener a mano y usar en la facultad |

## Reglas
- **RN-11.1 (no inventar):** cada afirmación sobre una persona lleva su **fuente**: entrevista, mensaje real, proyecto real, competencia o hipótesis. Lo que no tiene evidencia se marca **"hipótesis"** y va a la lista para validar. No se inventan cifras, testimonios, nombres reales de clientes ni datos de mercado.
- **RN-11.2 (campos de cada persona):**
  - nombre ficticio y foto ilustrativa sin persona real
  - rubro y tipo de negocio
  - segmento
  - objetivo
  - dolores (al menos 3)
  - miedos y objeciones (al menos 3)
  - qué lo hace decidirse
  - cómo usa Instagram
  - palabras que usa
  - plan que le sirve
  - qué contenido le habla en cada etapa
  - estado (proto-persona o validada)
- **RN-11.3 (estructura):** si la materia de Matias usa una plantilla propia (empathy map, JTBD, etc.), se usa esa estructura y se agregan los campos de RN-11.2 que falten.
- **RN-11.4 (competencia):** solo cuentas públicas. Se registra lo observable (formatos, frecuencia, tono, temas, interacción visible) con la fecha de observación. No se copian textos ni imágenes ajenas.
- **RN-11.5 (privacidad):** los mensajes y entrevistas de clientes se guardan sin nombres, teléfonos ni datos que los identifiquen.
- **RN-11.6 (coherencia):** la voz y el tono parten de `brand/marca.html` › Tono de voz y de `PRODUCT.md`. Si la investigación pide cambiar algo de la marca, se propone y Matias decide.
- **RN-11.7 (alcance):** esta historia no rediseña posts ni publica nada. Solo produce la estrategia.

## Casos límite
- **No se puede entrevistar a nadie todavía:** las personas quedan como **proto-personas**, con fuentes de proyectos reales, mensajes y competencia. La guía de entrevista queda lista para validarlas después.
- **Una persona no tiene evidencia suficiente:** se deja como hipótesis o se fusiona con otra. No se completa inventando.
- **Una cuenta de la competencia es privada o cerró:** se reemplaza por otra y se anota.

## Criterios de aceptación
| CA | Dado / cuando / entonces | Se verifica con |
| --- | --- | --- |
| CA-11.1 | Dada la carpeta `brand/instagram/estrategia/`, entonces existen los 9 archivos `.md` del objetivo y la página `estrategia.html` | Chequeo automático |
| CA-11.2 | Dado `personas.md`, entonces hay 3 o 4 personas y cada una tiene todos los campos de RN-11.2, con al menos 3 dolores y 3 objeciones | Chequeo automático |
| CA-11.3 | Dado `personas.md`, entonces cada dolor, objeción y disparador indica su fuente (entrevista / mensaje / proyecto / competencia / hipótesis) | Chequeo automático |
| CA-11.4 | Dado `competencia.md`, entonces hay entre 8 y 10 cuentas con fecha de observación, formatos, frecuencia, tono y temas, y una sección de huecos | Chequeo automático |
| CA-11.5 | Dado `voz-y-tono.md`, entonces tiene ejes de tono, al menos 10 palabras "sí" y 10 "no", al menos 10 fórmulas de gancho, los CTA fijos y al menos 5 objeciones con su respuesta | Chequeo automático |
| CA-11.6 | Dada `matriz-de-contenido.md`, entonces cada pilar (trabajos, consejos, oferta, detrás de escena) aparece en al menos una etapa del recorrido, con persona y formato | Chequeo automático |
| CA-11.7 | Dado `validacion.md`, entonces tiene la guía de entrevista (al menos 10 preguntas) y al menos 5 hipótesis medibles con su métrica | Chequeo automático |
| CA-11.8 | Dados los archivos con mensajes o entrevistas, entonces no hay teléfonos ni emails de clientes | Chequeo automático |
| CA-11.9 | Dadas las personas, cuando Matias las lee, entonces reconoce a sus clientes reales y las ve útiles para decidir qué publicar | Checklist |

## Checklist (lo firma Matias)
- [ ] CA-11.9: ¿Las personas se parecen a tus clientes reales y te sirven para decidir qué publicar? — firmado:

## Preguntas abiertas
1. ¿Podés hablar con 2 o 3 clientes (Bacssa, Quiropraxia, la tienda)? Si no, ¿te acordás cómo llegaron, qué te pidieron y qué dudas tenían?
2. ¿Tenés conversaciones de consultas que puedas pegar sin nombres?
3. ¿Hay algún rubro o tipo de negocio que quieras atacar primero?
4. ¿La materia usa una plantilla de persona en particular? Si es así, ¿me la pasás?

## Historial
- 2026-11-11: creada, a partir de la propuesta de estrategia de Instagram y de la materia de user personas de Matias.
