# Reel con personaje: prompts para Gemini (HU-15, borrador)

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
