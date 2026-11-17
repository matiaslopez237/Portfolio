# Reel con personaje: prompts para Gemini (HU-15, borrador)

> **Decisión 2026-11-16:** se descarta el herrero humano realista (podría confundirse con Matias o con una persona real y resta confianza). El personaje es **el autómata de Hefesto**: ver la sección siguiente. Lo de abajo queda como registro.

## El autómata de Hefesto (personaje elegido)
En el mito, Hefesto construía autómatas de metal que lo ayudaban en la fragua. Este es su ayudante: claramente una máquina, sobrio y cinematográfico, no infantil. **Sin texto ni logos, formato 9:16.**

### Paso 1: referencia → `automata-referencia.png`
```text
Cinematic, photorealistic 3D render of an original character: the "automaton of Hefesto", a mechanical helper built by the blacksmith god. A humanoid robot made of dark forged steel plates (#323C47, #1B2128) with visible hammer marks, rivets and brass-free joints, slightly worn and scratched like an old tool. In the center of its chest, a hexagonal opening shows a glowing red-hot core (#FF7A1A) with tiny sparks; its eyes are two thin horizontal slits glowing the same warm orange. Sleek but sturdy proportions, elegant and serious, not cute, not childish, not a toy, no cartoon style. It stands in a dark blacksmith workshop with an anvil and blurred tools behind, cold blue-grey tones and a single warm forge glow. Waist-up shot, centered, facing the camera, vertical 9:16. High detail, cinematic lighting, shallow depth of field. No text, no letters, no logos, no watermark.
```

### Paso 2: poses o clips (adjuntando `automata-referencia.png`)
Si tu cuenta permite video, pedí clips de ~6–8 s **sin voz** (los subtítulos los pongo yo). Si no, pedí las imágenes y yo las animo.

**Pose / clip 1 (gancho) → `automata-1`**
```text
Use the attached image as the exact reference for the automaton and the workshop. Vertical 9:16. The automaton looks at the camera and raises three steel fingers; its chest core pulses brighter. Slow camera push-in. Cinematic, realistic. No text, no logos, no voice, no music.
```

**Pose / clip 2 (explica) → `automata-2`**
```text
Use the attached image as the exact reference for the automaton and the workshop. Vertical 9:16. The automaton gestures with one open hand as if explaining something to the viewer, slight head tilt, eyes glowing. Subtle camera movement. Cinematic, realistic. No text, no logos, no voice, no music.
```

**Pose / clip 3 (cierre) → `automata-3`**
```text
Use the attached image as the exact reference for the automaton and the workshop. Vertical 9:16. The automaton strikes a glowing red-hot piece of metal on the anvil with a hammer, sparks burst in slow motion, then it looks back at the camera. Cinematic, realistic. No text, no logos, no voice, no music.
```

---

Personaje: **Hefesto**, el herrero de la marca. Sobrio y creíble, no infantil (personalidad de marca: confiable, moderna, simple).
Primer reel: **"3 cosas que tu página tiene que tener"** (mismo tema que el carrusel C2), en 3 clips de unos 8 segundos.

**Reglas para todo lo que generes:**
- Formato vertical **9:16**.
- **Sin texto, letras, logos ni marcas en la imagen.** La IA los dibuja mal; los subtítulos, el logo y el cierre los agrego yo en el montaje.
- Que **no se parezca a ninguna persona real** ni famosa.
- Guardá las imágenes y los clips con el nombre que figura en cada paso y pasámelos.

---

## Paso 1: la imagen de referencia del personaje
Generá varias y quedate con la que más te guste. Es la "ficha" que va a mantener al personaje igual en todos los clips.
Guardala como `hefesto-referencia.png`.

```text
Cinematic, photorealistic portrait of an original fictional character: "Hefesto", a modern blacksmith in his early 40s. Short dark hair with a few grey strands, well-kept short beard, calm confident expression, friendly but serious. He wears a dark charcoal work shirt with rolled sleeves and a worn brown leather apron. He stands in a dark blacksmith workshop: cold blue-grey steel tones (#1B2128, #323C47), blurred tools and an anvil behind him, and a single warm orange glow (#FF7A1A) from a forge off-camera lighting one side of his face. Waist-up shot, centered, looking at the camera, vertical 9:16 format. Shallow depth of field, high detail, natural skin, cinematic film look. No text, no letters, no logos, no watermark. Not based on any real person.
```

## Paso 2: los 3 clips (video)
En Gemini, **adjuntá `hefesto-referencia.png`** y pedí cada clip por separado. Si Gemini no te deja generar video con voz en tu cuenta gratis, avisame y vamos por el plan B (abajo).

### Clip 1 → `clip-1.mp4`
```text
Use the attached image as the exact reference for the character, his clothes and the workshop. Vertical 9:16 video, about 8 seconds. The blacksmith Hefesto stands by his anvil in the dark workshop, the warm forge glow on one side of his face. He looks at the camera and speaks in Spanish with a neutral Argentine accent (voseo), calm and friendly, natural lip sync:
"¿Tenés un negocio? Tu página tiene que tener tres cosas, sí o sí."
On the last words he raises three fingers. Slow, subtle camera push-in. Realistic, cinematic. No text, no subtitles, no logos, no music.
```

### Clip 2 → `clip-2.mp4`
```text
Use the attached image as the exact reference for the character, his clothes and the workshop. Vertical 9:16 video, about 8 seconds. Same blacksmith Hefesto, same workshop and lighting, slightly different camera angle. He speaks to the camera in Spanish with a neutral Argentine accent (voseo), calm and friendly, natural lip sync:
"Uno: un botón de WhatsApp. Dos: que se vea bien en el celular. Tres: dónde estás y cuándo atendés."
He counts on his fingers as he speaks. Realistic, cinematic. No text, no subtitles, no logos, no music.
```

### Clip 3 → `clip-3.mp4`
```text
Use the attached image as the exact reference for the character, his clothes and the workshop. Vertical 9:16 video, about 8 seconds. Same blacksmith Hefesto, same workshop. He picks up a glowing hot piece of metal from the anvil with tongs (sparks fly softly), then looks at the camera and says in Spanish with a neutral Argentine accent (voseo), calm and confident, natural lip sync:
"¿La tuya no las tiene? Escribime y te la forjo a medida."
Realistic, cinematic. No text, no subtitles, no logos, no music.
```

**Si sale algo raro** (manos deformes, la cara cambia, se pierde la voz): volvé a generar ese clip. Conviene sacar 2 o 3 versiones de cada uno y quedarte con la mejor.

## Plan B (si tu cuenta gratis no genera video o voz)
Generá solo **imágenes** del personaje con este prompt, usando la referencia. Yo las animo con código (movimiento de cámara, chispas, brillo) y les pongo subtítulos grandes, sin voz o con tu voz en off si querés.
Guardalas como `pose-1.png`, `pose-2.png` y `pose-3.png`.

```text
Use the attached image as the exact reference for the character, his clothes and the workshop. Vertical 9:16, photorealistic, cinematic. Three separate images of the blacksmith Hefesto in the same dark workshop with the single orange forge glow: (1) looking at the camera raising three fingers, (2) counting on his fingers while explaining, (3) holding a glowing hot piece of metal with tongs, sparks around, confident smile. No text, no letters, no logos.
```

## Qué hago yo con lo que me pases
Monto el reel en 1080×1920 con:
- **Subtítulos grandes**, en el estilo de la marca, con las palabras clave en naranja.
- **Apertura:** el gancho "hierro al rojo" ("3 cosas que tu página tiene que tener").
- **Cierre:** el logo 3D y "Escribime por WhatsApp · 260 466-1138 · @hefestowebs".
- **Sin música** en el video. La música la agregás vos al publicar, desde la biblioteca de Instagram, que es gratis y legal para usar en Instagram.

---

## Hoja de partes v3: brazo con codo (HU-15)

Adjuntá `mascota/hefesto-mascota.jpg` (la referencia que te gustó) y pegá esto en un chat nuevo:

> Using the attached character as the exact reference (same face, red hair and beard, tan skin, dark tank top, brown leather apron, dark pants, brown boots, same 2D cartoon style with thick dark outlines and flat shading), create a **cut-out puppet parts sheet** for 2D animation, on a **solid pure green background (#00FF00)**, every part separated by plenty of green space, nothing overlapping, nothing cropped at the edges. Flat front view, no shadows on the background, no text or labels.
>
> Parts:
> 1. **Body** without head and **without the hammer arm** (the arm on the viewer's RIGHT side). The left arm (hanging relaxed, with leather wristband) stays attached to the body. Put a **flat gray circle (#999999)** on the neck stump and another one on the empty right shoulder socket.
> 2. **Head** with hair and beard, mouth area filled with a **dark gray oval** (where the mouths go), eyes open.
> 3. **Eyes** in 3 states as separate patches of skin: open, half closed, closed.
> 4. **Mouths** in 5 shapes as separate patches: closed smile, open "A", round "O", "E" showing teeth, relaxed neutral.
> 5. **Upper arm** (shoulder to elbow), muscular, pointing straight DOWN, with a **gray circle at the shoulder end (top)** and a **gray circle at the elbow end (bottom)**.
> 6. **Forearm + hand holding the hammer** (elbow to fist, with leather wristband), forearm pointing straight UP from the elbow, hammer held upright, with a **gray circle at the elbow end (bottom)**.
> 7. The same forearm + hand + hammer a second time, but the forearm **pointing horizontally to the right**, hammer head up.
>
> The gray circles must be the same size where two parts connect (shoulder ↔ upper arm, upper arm ↔ forearm) so they overlap cleanly. Keep proportions identical to the reference.

**Si lo hace mal:** no le pidas que lo edite; generalo de nuevo desde cero con el prompt entero y cambiá una sola cosa por vez.

---

## Hoja de partes v4: brazo con codo, corregida (HU-15)

Reemplaza a la v3: sus brazos salieron muy largos, la mano del martillo estaba girada (con la palma hacia atrás), faltaba el brazo superior solo y los puntos grises estaban en el medio de los brazos.
Adjuntá `mascota/hefesto-mascota.jpg`, pegá esto en un chat nuevo y **descargá la imagen en tamaño original** (no una captura).

> Using the attached character as the exact reference (same face, red hair and beard, tan skin, dark tank top, brown leather apron, dark pants, brown boots, same 2D cartoon style with thick dark outlines and flat colors), create a **cut-out puppet parts sheet** for 2D animation. **Landscape, high resolution.** Solid pure green background (#00FF00). Every part separated by wide green gaps, nothing touching, nothing overlapping, nothing cut off at the edges. Front view, no background shadows, no text, no labels.
>
> Draw **exactly these 13 parts and nothing else**:
>
> 1. **Body** without head and **without the arm on the viewer's right side**. The other arm (viewer's left) stays attached, hanging relaxed, with its leather wristband. A flat gray circle (#999999) on the neck stump and a flat gray circle covering the empty shoulder socket on the viewer's right.
> 2. **Head** with hair and beard, eyes open, the mouth area filled with one dark gray oval.
> 3. to 5. **Eyes**, exactly 3 patches of skin: open, half closed, closed.
> 6. to 10. **Mouths**, exactly 5 patches of skin: closed smile, open "A", round "O", "E" showing teeth, relaxed neutral.
> 11. **Upper arm alone**: from the shoulder down to the elbow ONLY (no forearm, no hand), pointing straight down. One gray circle at the very top end (shoulder) and one gray circle at the very bottom end (elbow). The circles sit AT THE ENDS of the piece, not in the middle.
> 12. **Forearm + fist holding the hammer**: from the elbow to the fist, with leather wristband, forearm pointing straight up, hammer upright. **The fist is seen from the front: the fingers wrapped around the handle face the camera** (we see the fingers and knuckles from the front, not the back of the hand). One gray circle at the very bottom end (elbow).
> 13. The same forearm + fist + hammer as part 12, but with the forearm **pointing horizontally to the right** (hammer head up), fingers still facing the camera, gray circle at the elbow end (left end).
>
> **Proportions:** the upper arm plus the forearm together must be exactly as long as the arm that stays attached to the body (shoulder to wrist), same thickness and same muscle size. The arms must NOT be longer or bigger than that arm. All gray circles are the same size, so the joints line up (shoulder socket ↔ top of upper arm, bottom of upper arm ↔ elbow of forearm).

**Si lo hace mal:** no le pidas que lo edite; generalo de nuevo desde cero con el prompt entero. Si una sola parte sale mal (por ejemplo la mano), avisame: a veces la puedo usar igual.

## Hoja de partes v5: dos brazos, manos con gestos y martillo a veces (HU-16)

Para los reels nuevos (R3 en adelante). La cabeza, los ojos y las bocas se siguen tomando de la v4, así que esta hoja no los trae.
Adjuntá `mascota/hefesto-mascota.jpg`, pegá esto en un chat nuevo y **descargá la imagen en tamaño original** (no una captura). Guardala como `mascota/hoja-partes-v5.png` (o `.jpg`).

> Using the attached character as the exact reference (same face, red hair and beard, tan skin, dark tank top, brown leather apron, dark pants, brown boots, same 2D cartoon style with thick dark outlines and flat colors), create a **cut-out puppet parts sheet** for 2D animation. **Landscape, high resolution.** Solid pure green background (#00FF00). Every part separated by wide green gaps, nothing touching, nothing overlapping, nothing cut off at the edges. Front view, no background shadows, no text, no labels. **The hammer appears ONLY in part 15.**
>
> Draw **exactly these 15 parts and nothing else**:
>
> 1. **Body** without head and **without both arms**. A flat gray circle (#999999) on the neck stump and a flat gray circle covering each empty shoulder socket (two shoulder circles).
> 2. and 3. **Upper arms alone** (left and right): from the shoulder down to the elbow ONLY, pointing straight down. One gray circle at the very top end (shoulder) and one at the very bottom end (elbow). The circles sit AT THE ENDS of the piece.
> 4. and 5. **Forearm + relaxed hand** (left and right): from the elbow to the hand, forearm pointing straight down, hand relaxed and slightly open, with the leather wristband. Gray circle at the elbow end (top).
> 6. and 7. **Forearm + open palm facing the camera** (left and right): forearm pointing straight up, fingers together, palm toward the viewer. Gray circle at the elbow end (bottom).
> 8. and 9. **Forearm + pointing hand** (left and right): forearm pointing straight up, index finger extended upward, the other fingers closed. Gray circle at the elbow end (bottom).
> 10. and 11. **Forearm + explaining hand** (left and right): forearm horizontal pointing toward the center of the body, hand open with the palm facing sideways (up), like explaining something. Gray circle at the elbow end (outer end).
> 12. to 14. **Counting hand, character's right arm only**: forearm pointing straight up, palm facing the camera (never the back of the hand). Part 12 shows **exactly one finger up (index)**, part 13 **exactly two fingers up (index and middle)**, part 14 **exactly three fingers up (index, middle and ring)**; the other fingers are folded and the thumb holds them. Gray circle at the elbow end (bottom).
> 15. **Forearm + fist holding the hammer, character's right arm only**: from the elbow to the fist, with leather wristband, forearm pointing straight up, hammer upright (head up). **The fist is seen from the front: the fingers wrapped around the handle face the camera.** Gray circle at the elbow end (bottom).
>
> **Hands:** exactly five fingers each, clearly drawn, same size as the hands in the reference. **Proportions:** upper arm plus forearm together are exactly as long as the arms in the reference (shoulder to wrist), same thickness and muscle size. All gray circles are the same size so the joints line up.

**Si lo hace mal:** no le pidas que lo edite; generalo de nuevo desde cero con el prompt entero. Fijate sobre todo en los dedos de las partes 12 a 14 (1, 2 y 3 dedos exactos) y en que el martillo esté solo en la parte 15.
